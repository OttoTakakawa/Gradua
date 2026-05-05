@echo off
cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000.*LISTENING"') do (
  taskkill /f /pid %%a >nul 2>&1
)
ping -n 2 127.0.0.1 >nul

title Within - Local Preview Server
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
