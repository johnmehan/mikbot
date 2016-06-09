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
          sudo chown <userName>:<userPassword> /data/db

   2.2. Start MongoDB daemon process.

          mongod

3. Start MikBot server.

   3.1. Change directory to the server files.

          cd <MikBot_HOME>/server/src

   3.2. Ensure startup script is executable.

         chmod a+rx start.sh

   3.3. Start server.

          start.sh

