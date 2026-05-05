@echo off
title Within - Local Preview Server
cd /d "%~dp0"
echo.
echo  ============================
echo   Within - Local Preview
echo  http://localhost:8000
echo  ============================
echo.
start /b python server.py
ping -n 2 127.0.0.1 >nul
start "" http://localhost:8000
echo  Server running. Close this window to stop.
