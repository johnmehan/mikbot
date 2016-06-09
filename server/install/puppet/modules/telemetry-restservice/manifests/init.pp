# Class : telemetry-restservice
# parameters
#
#
class telemetry-restservice(
   $target_dir = 'UNDEF' ) {
   

   telemetry-restservice::install { "telemetry-restservice":
       target_dir => $target_dir,
   }
   telemetry-restservice::uninstall { "telemetry-restservice":
       target_dir => $target_dir,
   }
}
