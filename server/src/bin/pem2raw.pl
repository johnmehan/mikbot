#!/usr/bin/perl

use strict;
use warnings;

if (@ARGV ne 1) {
  print <<EOS

Usage:  perl pem2raw.pl <key_file>.pem
        pem2raw.pl <key_file>.pem

Produces two "raw EC" key files from an input PEM key file:
* <key_file>_pri.dat -- Raw private EC key.
* <key_file>_pub.dat -- Raw public EC key.

This script utilizes openssl.

EOS
} else {
  system("openssl version") == 0 or
    die "ERROR: cannot find openssl";
  -e $ARGV[0] or
    die "ERROR: file $ARGV[0] does not exist";

  my $hexdump = `openssl ec -inform PEM -text -in $ARGV[0]`;

  # Extract public key from openssl hexdump
  $_ = $hexdump;
  s/.*pub://s;
  s/ASN1.*//s;
  s/Field Type.*//s;
  s/://sg;
  s/\s//sg;
  # Check that the encoding of EC point starts with 04
  my $tag = substr $_, 0, 2;
  $tag eq "04" or
    die "ERROR: encoding of public key must be uncompressed";
  s/04//;
  # Convert hex to binary
  s/(..)/chr(hex($1))/ge;
  my $rpub = $_;

  my $sizeofmod = (length $rpub)/2;
  print "Detected ${sizeofmod}-octet prime modulus\n";

  # Extract private key from openssl hexdump
  $_ = $hexdump;
  s/.*priv://s;
  s/pub:.*//s;
  s/://sg;
  s/\s//sg;
  # Get rid of leading 00 if it is present
  s/^00//;
  # Convert hex to binary
  s/(..)/chr(hex($1))/ge;
  my $rpri = $_;

  my $sizeofpri = length $rpri;
  $sizeofpri le $sizeofmod or
    die "ERROR: length of private key must be <= length of prime modulus";

  # NOTE: Our insistence that length of private key <= length of prime modulus
  # is not completely valid.  It is possible for the group size n to be greater
  # than the modulus p.  This happens for some SEC2 curves.  However, when the
  # private key d is chosen uniformly at random, it very likely will have the
  # same length as the modulus (due to the particular values of n for these
  # SEC2 curves).  So, this restriction is probably OK.

  my $padding = "";
  while ($sizeofpri < $sizeofmod) {
    $padding = "\0" . $padding;
    $sizeofpri++;
  }

  # Write binary data for private key and public key to respective files
  $_ = $ARGV[0];
  s/\.pem//i;
  my $prifile = $_ . "_pri.dat";
  my $pubfile = $_ . "_pub.dat";

  open(my $pri_fh, '>', $prifile) or die $!;
  open(my $pub_fh, '>', $pubfile) or die $!;

  binmode $pri_fh;
  binmode $pub_fh;

  print "Creating ${prifile}\n";
  print $pri_fh $padding . $rpri;

  print "Creating ${pubfile}\n";
  print $pub_fh $rpub;

  close($pri_fh);
  close($pub_fh);
}

