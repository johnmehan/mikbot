# ==== Define telemetry-restservice::uninstall
#
# Un-installs the service.
#
# ==== Parameters:
#
# [*version*]
# THe application version to uninstall
#
# [*target_dir*]
# installation directory
#
# ==== Example:
#
#  class { telemetry-restservice::uninstall :
#      target_dir => '/opt/telemetry/',
#  }
#
class telemetry-restservice::uninstall (
    $target_dir  = 'UNDEF' ) 
{
    $install_dir = $target_dir ? {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir" 
    }

    service { 'stop restservice service':
        name => 'telemetry_restservice',
        ensure => stopped,
        provider => 'upstart',
        hasstatus => false,
    }
    file { '/etc/init/telemetry_restservice.conf' : 
        ensure => absent,
        force => true,
        require => Service['stop restservice service'],
    }

    file { $install_dir : 
        ensure => absent,
        recurse => true,
        force => true,
    }

}
