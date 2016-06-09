# ==== Define telemetry-admin::uninstall
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
#  class { telemetry-admin::uninstall :
#      target_dir => '/opt/telemetry/',
#  }
#
class telemetry-admin::uninstall (
    $target_dir  = 'UNDEF' ) 
{
    $install_dir = $target_dir ? {
       'UNDEF' => '/opt/telemetry',
       default => "$target_dir" 
    }

    service { 'stop admin service':
        name => 'telemetry_admin',
        ensure => stopped,
        provider => 'upstart',
        hasstatus => false,
    }
    file { '/etc/init/telemetry_admin.conf' : 
        ensure => absent,
        force => true,
        require => Service['stop admin service'],
    }

    file { $install_dir : 
        ensure => absent,
        recurse => true,
        force => true,
    }

}
