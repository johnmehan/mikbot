#
# This file contains the puppet commands to uninstall the telemetry system
# To uninstall, you need to rename this file to site.pp on the puppet master node
# and edit the node host names to remove components from specified server nodes.
# 
# Dependency Notes: 
#   - Telemetry requires a nodejs installation. In separate puppet runs, uninstall telemetry 1st, 
#     then uninstall node.
#   - Parameters are configured in /etc/puppet/hierdata/common.json
#

node 'u12kas-srv2.ott.dev.intra' {
    notify {"Verifying install/uninstall web service node":}

    #----------- Read properties -----------
    $server_install_dir_conf = hiera('telemetry_service.install_dir')


    #----------- Uninstall telemetry server -----------
#    class { telemetry-server::uninstall :
#        target_dir => $server_install_dir_conf , }
        
    #----------- Read properties -----------
    $admin_install_dir_conf = hiera('admin_service.install_dir')
    #----------- Uninstall telemetry admin -----------
#    class { telemetry-admin::uninstall :
#        target_dir => $admin_install_dir_conf , }
    #----------- Read properties -----------
    $install_version =   hiera('nodejs.version')
    #----------- Uninstall nodejs and npm --------
#    class  { 'nodejs::uninstall' : 
#       version => $install_version, }

}
node 'u12kas-srv3.ott.dev.intra' {
    notify {"Verifying install/uninstall of  database":}

    #---------- Uninstall the database -----------
#        class  { mongodb::uninstall : }

}
