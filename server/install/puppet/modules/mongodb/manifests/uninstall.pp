# A class to uninstall mongodb
# Author : Garney Adams
#
class mongodb::uninstall {
   service { 'mongodb':
        ensure => "stopped",
    }


    exec { 'purge':
             command => "apt-get -y purge mongodb mongodb-clients mongodb-server mongodb-dev; echo $" ,
             path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ],
             returns => ['0','100'],
    }
    exec { 'purge10gen':
             command => "apt-get -y purge mongodb-10gen; echo $" ,
             path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ],
             require => Exec['purge'],
             returns => ['0','100'],
    }
    exec { 'remove' :
             command => "apt-get -y autoremove; echo $" ,
             path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ],
             require => Exec['purge10gen'],
             returns => ['0','1'],
    }

    exec { 'clean':
             command => "rm -R /var/lib/mongodb/; echo $" ,
             path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ],
             require => Exec['remove'],
             returns => ['0','1'],
    }

}
