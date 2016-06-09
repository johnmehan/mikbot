# Class : telemetry-server
# parameters
#
#
class telemetry-server (
   $target_dir = 'UNDEF' ) {
   

   telemetry-server::install { "telemetry-server":
       target_dir => $target_dir,
   }
   telemetry-server::uninstall { "telemetry-server":
       target_dir => $target_dir,
   }
}
