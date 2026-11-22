@echo off
cd /d "%~dp0"
start "" http://localhost:4000/knihy.html
node server.js
