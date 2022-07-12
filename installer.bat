@echo off

cd client

npm install

cd server/express

npm install

cd ../socketio 

npm install

cd ../../start-app

npm install

set /p RUNAPP="All modules installed, do you want to start the app [Y/N]: "

cd ../

if "%RUNAPP%"=="Y" (
    cd start-app
    npm start
)
