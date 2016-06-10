====================================
   MikBot README
====================================

1. Prerequisites:

   1.1. Install Node.js 64-bit.

          brew install node

   1.2. Install MongoDB.

          brew install mongodb

2. Start MongoDB.

   2.1. Create DB data directory.

          sudo mkdir -p /data/db
          sudo chown <username>:staff /data/db
            --> Replace <username> with your personal OS username.

   2.2. Start MongoDB daemon process.

          mongod

3. Start MikBot web-server.

   3.1. Change directory to the server source-code files.

          cd <MikBot_HOME>/server/src

   3.2. Ensure startup script is executable.

         chmod a+rx start.sh

   3.3. Start server.

          ./start.sh

4. Use the MikBot web-GUI.

   4.1. Login via web-browser at URL:

          http://localhost:8888/admin

   4.2. Default credentials:

         Username:  sysadmin
         Password:  admin1Pwd

