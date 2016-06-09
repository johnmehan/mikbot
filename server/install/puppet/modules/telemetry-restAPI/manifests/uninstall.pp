# ==== Define telemetry-restAPI::uninstall
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
#  class { telemetry-restAPI::uninstall :
#      target_dir => '/opt/telemetry/',
#  }
#
class telemetry-restAPI::uninstall (
    $target_dir  = 'UNDEF' ) 
{
    $install_dir = $target_dir ? {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir" 
    }

    service { 'stop restAPI service':
        name => 'telemetry_restAPI',
        ensure => stopped,
        provider => 'upstart',
        hasstatus => false,
    }
    file { '/etc/init/telemetry_restAPI.conf' : 
        ensure => absent,
        force => true,
        require => Service['stop restAPI service'],
    }

    file { $install_dir : 
        ensure => absent,
        recurse => true,
        force => true,
    }

}
