#
# This file contains the puppet commands to install the telemetry system
# To install, you need to rename this file to site.pp on the puppet master node
# and the node host names to assign components to the specified server nodes for installation
# 
# Dependency Notes: 
#   - Telemetry requires a nodejs installation. In separate puppet runs, install node 1st, 
#     then install telemetry.
#   - Parameters are configured in /etc/puppet/hierdata/common.json
#

node 'u12kas-srv2.ott.dev.intra' {
    notify {"Installing web service node":}
    #----------- Read properties -----------
    $install_version =   hiera('nodejs.version')
    $install_npm =   hiera('nodejs.install_npm')
    
    #----------- Install nodejs and npm ----------

#    nodejs::install { $install_version :
#        version    => $install_version,
#        with_npm   => $install_npm,
#    }

    
    #----------- Read properties -----------
    $server_install_dir_conf = hiera('telemetry_service.install_dir')
    $dbUrl_config =   hiera('database.dbUrl')
    $logPath_config =   hiera('telemetry_service.logPath')
    $port_config =   hiera('telemetry_service.port')
    $parent_install_dir =   hiera('telemetry_service.parent_install_dir')

    #----------- Install telemetry server -----------
#     class { telemetry-server::install :
#            target_dir_param => $server_install_dir_conf ,
#            logPath_param => $logPath_config,
#            dbUrl_param => $dbUrl_config,
#            port_param => $port_config,
#            parent_dir_param => $parent_install_dir,
#           }



    #----------- Read properties -----------
    $admin_install_dir_conf = hiera('admin_service.install_dir')
    $admin_logPath_config =   hiera('admin_service.logPath')
    $admin_port_config =   hiera('admin_service.port')
    $admin_parent_install_dir =   hiera('admin_service.parent_install_dir')

    #----------- Install telemetry admin -----------
#     class { telemetry-admin::install :
#            target_dir_param => $admin_install_dir_conf ,
#            dbUrl_param => $dbUrl_config,
#            logPath_param => $admin_logPath_config,
#            port_param => $admin_port_config,
#            parent_dir_param => $admin_parent_install_dir,
#                     }

}


node 'u12kas-srv3.ott.dev.intra' {
    notify {"Installing database":}

    
    #----------- Read properties -----------
    $enable10gen =   hiera('database.enable10gen')
    $package_name =   hiera('database.package_name')
    
    #----------- Install the database-------------
#    class { 'mongodb':
#        enable_10gen => $enable10gen,
#        packagename => $package_name,
#    }

}
