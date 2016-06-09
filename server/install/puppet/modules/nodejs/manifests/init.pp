# = Class: nodejs
#
# == Parameters:
#
# [*version*]
#   The NodeJS version ('vX.Y.Z' or 'latest').
#
# [*target_dir*]
#   Where to install the executables.
#
# [*with_npm*]
#   Whether to install NPM.
#
# == Example:
#
#  include nodejs
#
#  class { 'nodejs':
#    version => 'v0.8.0',
#  }
# default value for version below, if specified, latest will be installed
#  $version    = 'UNDEF',
#
class nodejs (
  $version    = 'v0.10.10',
  $target_dir = 'UNDEF',
  $with_npm   = true
) {

  nodejs::install { "nodejs-${version}":
    version    => $version,
    target_dir => $target_dir,
    with_npm   => $with_npm,
  }
#  nodejs::uninstall { "nodejs-${version}":
#    version    => $version,
#    target_dir => $target_dir,
#    with_npm   => $with_npm,
#  }
}
