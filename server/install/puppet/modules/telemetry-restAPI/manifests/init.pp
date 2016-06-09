# Class : telemetry-restAPI
# parameters
#
#
class telemetry-restAPI (
   $target_dir = 'UNDEF' ) {
   

   telemetry-restAPI::install { "telemetry-restAPI":
       target_dir => $target_dir,
   }
   telemetry-restAPI::uninstall { "telemetry-restAPI":
       target_dir => $target_dir,
   }
}
