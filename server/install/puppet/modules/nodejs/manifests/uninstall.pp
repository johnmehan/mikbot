# A class to uninstall nodejs (and npm)
# Author: Garney Adams
#
class nodejs::uninstall (
  $version    = 'UNDEF',
  $target_dir = 'UNDEF',
  $with_npm   = true
) {

  include nodejs::params

  $node_version = $version ? {
    'UNDEF' => 'latest',
    default => $version
  }

  $node_target_dir = $target_dir ? {
    'UNDEF' => $::nodejs::params::target_dir,
    default => $target_dir
  }
notify { "Target directory: ${::nodejs::params::target_dir}":}
notify {"Uninstalling node params: ${node_version} ":}


  if ($with_npm) {

    exec { 'npm-uinstall':
      command     => 'npm uninstall npm -g',
      path        => '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
      cwd         => $::nodejs::params::install_dir,
      user        => 'root',
      environment => 'clean=yes',
      onlyif      => 'which npm',
    }
  }

  exec { "node-uninstall-${node_version}":
    command => 'python configure && make uninstall',
    path    => '/usr/bin:/bin:/usr/sbin:/sbin',
    cwd     => "${::nodejs::params::install_dir}/node-${node_version}",
    user    => 'root',
    onlyif  => "test -f ${::nodejs::params::install_dir}/node-${node_version}/node",
    timeout => 0,
  }

}
