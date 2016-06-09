# ==== Define telemetry-restAPI::install
#
# This module installs the telemetry REST API service. It creates a service
# definition 'telemetry_restAPI'. This is an unsecured REST web service.
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
#  class { telemetry-restAPI::install :
#      target_dir => '/opt/telemetry/',
#  }
#
class telemetry-restAPI::install (
      $target_dir_param  = 'UNDEF'
    , $logPath_param = 'UNDEF'
    , $dbUrl_param = 'UNDEF'
    , $port_param = 'UNDEF'
    , $parent_dir_param = 'UNDEF' ) 
{
    $install_dir = $target_dir_param ? {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir_param" 
    }
    
#    $dbUrl_config =   hiera('dbUrl')
#    $logPath_config =   hiera('logPath')
#    $port_config =   hiera('restAPI_port')
#    $parent_install_dir =   hiera('parent_install_dir')
    
    #make sure the parent directory exists
    file { "${parent_dir_param}":
        ensure => directory,
        owner => root,
        group => root,
        mode => '0644',
    }
    
    file { $install_dir : 
	source => "puppet:///modules/telemetry-restAPI",
	owner => root,
	group => root,
	mode => '0644',
        recurse => true,
    }
    file { "${install_dir}/config/restAPIConf.js":
	content => template('telemetry-restAPI/restAPIConf.erb'),
    }
    file { "${install_dir}/log/":
	ensure => directory,
	owner => root,
	group => root,
	mode => '0644',
    }
    exec { "npm forever restAPI":
	command => "npm -g install forever",
        path    => '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin',
        cwd     => $install_dir,
        user    => 'root',
        require   => File[$install_dir],
    }

    exec { "npm update restAPI":
	command => "npm update",
        path    => '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin',
        cwd     => $install_dir,
        user    => 'root',
        require   => Exec['npm forever restAPI'],
    }

    file { "/etc/init/telemetry_restAPI.conf":
	    content => template('telemetry-restAPI/telemetry_restAPI.erb'),
        require => Exec["npm update restAPI"],
    }
    service { 'telemetry_restAPI':
	    ensure => running,
        provider => 'upstart',
        require => File['/etc/init/telemetry_restAPI.conf'],
    }


}
