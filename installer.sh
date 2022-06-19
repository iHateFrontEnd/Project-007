#!/bin/sh
cd server/express
npm install
cd ../socketio
npm install
cd ../../client
npm install
cd ../start-app
npm install

echo "\n EVERYTHING IS INSTALLED, STARTING APP"

cd ..
chmod +x ./start-app.sh
./start-app.sh
