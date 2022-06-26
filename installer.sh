#!/bin/sh
cd server/express
npm install

cd ../socketio
npm install

cd ../../client
npm install --force

cd ../start-app
npm install

echo "\n EVERYTHING IS INSTALLED, STARTING APP"

cd ..
chmod +x ./start-app.sh
./startMe.sh
