# ==== Define telemetry-server::uninstall
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
#  class { telemetry-server::uinstall :
#      target_dir => '/opt/telemetry/',
#  }
#
class telemetry-server::uninstall (
    $target_dir  = 'UNDEF' ) 
{
    $install_dir = $target_dir ? {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir" 
    }

    service { 'stop service':
        name => 'telemetry_service',
        ensure => stopped,
        provider => 'upstart',
        hasstatus => false,
    }
    file { '/etc/init/telemetry_service.conf' : 
        ensure => absent,
        force => true,
        require => Service['stop service'],
    }

    file { $install_dir : 
        ensure => absent,
        recurse => true,
        force => true,
    }

}
