@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% equ 0 (
  if not exist "node_modules" (
    echo Installing dependencies...
    call npm.cmd install
    if errorlevel 1 (
      pause
      exit /b 1
    )
  )
  echo Building frontend...
  call npm.cmd run build
  if errorlevel 1 (
    pause
    exit /b 1
  )
  echo Starting AVAJET ERP...
  node server.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
  exit /b 0
)

set "NODE_EXE=%~dp0..\..\..\..\tools\node\node.exe"
set "NPM_CLI=%~dp0..\..\..\..\tools\node\node_modules\npm\bin\npm-cli.js"
if not exist "%NODE_EXE%" (
  echo Node.js was not found in PATH or at %NODE_EXE%
  echo Please install Node.js and npm, or ensure they are added to PATH.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  "%NODE_EXE%" "%NPM_CLI%" install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
"%NODE_EXE%" "%NPM_CLI%" run build
if errorlevel 1 (
  pause
  exit /b 1
)
"%NODE_EXE%" server.js

