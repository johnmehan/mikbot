{
  'targets': [{
    'target_name': 'elgamal',
    'sources': [
      'ec_elgamal.c',
      'node_adaptor.cc'
    ],
    'conditions': [
      ['OS=="win"', {
         'include_dirs': [
           'C:/OpenSSL-Win64/include'
         ],
         'libraries': [
           'C:/OpenSSL-Win64/lib/libeay32.lib',
           'C:/OpenSSL-Win64/lib/ssleay32.lib'
         ]
      }],
    ],
  }]
}

