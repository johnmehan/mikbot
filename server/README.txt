====================================
  Telemetry Build-Server README
====================================

1. Prerequisites:
   1.1. Supported 64-bit OS platforms:
        * Ubuntu Linux 12.04.2+.
        * MS-Windows 7 (only for internal development and testing).

   1.2. Install Oracle JDK 7 64-bit.

   1.3. Install Apache   .

   1.4. Install OpenSSL 1.0.1h 64-bit.
        * On Linux:
            sudo apt-get install libssl-dev
        * On MS-Windows:
            http://slproweb.com/download/Win64OpenSSL-1_0_1h.exe

   1.5. On MS-Windows:
        1.5.1. Install Cygwin.

        1.5.2. Install MSVC 2010 + MS-Windows 7 SDK.

        1.5.3. Install Python 2.7.3.

   1.6. Install Node.js 64-bit.

   1.7. Install node-gyp.
        * Execute the shell script:
            thirdparty/ec_elgamal/setup_env.sh
        * NOTE: On Linux, this must be executed as root.

2. Type 'ant' to launch the build.
   * NOTE: On MS-Windows, this must be done within Cygwin.
