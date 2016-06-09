# ==== Define telemetry-server::install
#
# This module installs the telemety server service. It creates a service
# definition 'telemetry_server'. This is the client facing web service.
#
# ==== Parameters:
#
# [*target_dir_param*]
# The installation directory
# [*logPath_param*]
# The service log file. This is written to the service configuration file.
# [*dbUrl_param*]
# The database connect string. This is written to the service configuration file.
# [*port_param*]
# The service port. This is written to the service configuration file.
# [*parent_dir_param*]
# The parent install directory
#
# ==== Example:
#
#  class { telemetry-server::install :
#      target_dir => '/opt/telemetry/v-1-0-0',
#  }
#
class telemetry-server::install (
      $target_dir_param  = 'UNDEF'
    , $logPath_param = 'UNDEF'
    , $dbUrl_param = 'UNDEF'
    , $port_param = 'UNDEF'
    , $parent_dir_param = 'UNDEF'  )
{
    $install_dir = $target_dir_param ?  {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir_param",
    }

    notify{"install dir : ${install_dir}":}
#    $dbUrl_config =   hiera('dbUrl')
#    $logPath_config =   hiera('logPath')
#   $port_config =   hiera('port')
#   $parent_install_dir =   hiera('parent_install_dir')


    #make sure the parent directory exists
    file { "parent_dir":
        path => $parent_dir_param,
        ensure => directory,
        owner => root,
        group => root,
        mode => '0644',
    }

    
    file { "install_dir" :
        path => $install_dir,
        source => "puppet:///modules/telemetry-server",
        owner => root,
        group => root,
        mode => '0644',
        recurse => true,
        require   => File["parent_dir"],
    }
    file { "${install_dir}/config/serverConf.js":
           content => template('telemetry-server/serverConf.erb'),
    }
    file { "log_dir":
        path => "${install_dir}/log/",
        ensure => directory,
        owner => root,
        group => root,
        mode => '0644',
    }
    exec { "npm forever":
        command => "npm -g install forever",
        path    => '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin',
        cwd     => $install_dir,
        user    => 'root',
        require   => File["install_dir"],
    }

    exec { "npm update":
        command => "npm update",
        path    => '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin',
        cwd     => $install_dir,
        user    => 'root',
        require   => Exec['npm forever'],
    }

    file { "/etc/init/telemetry_service.conf":
        content => template('telemetry-server/telemetry_service.erb'),
        require => Exec["npm update"],
    }
    service { 'telemetry_service':
        ensure => running,
        provider => 'upstart',
        require => File['/etc/init/telemetry_service.conf'],
    }



}
