# Class : telemetry-admin
# parameters
#
#
class telemetry-admin (
   $target_dir = 'UNDEF' ) {
   

   telemetry-admin::install { "telemetry-admin":
       target_dir => $target_dir,
   }
   telemetry-admin::uninstall { "telemetry-admin":
       target_dir => $target_dir,
   }
}
