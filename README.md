# AVAJET Aviation ERP

A small full-stack operations workspace based on the AVAJET wireframe. The React interface calls a Node.js web server, which serves the built frontend and proxies API traffic to a Java REST service.

## Run on Windows

Requirements: Node.js 18+ and a JDK 17+ with `java` and `javac` available in PATH.

### Option 1: Quick Start (Batch script)
Double-click [`run.bat`](file:///d:/Dhairyash/College/Mukesh%20Patel/sem%203/TII/avajet-erp-app/run.bat). It automatically:
- Installs npm packages if needed
- Builds the React frontend
- Compiles the Java backend on first launch
- Starts both the Java backend and Node.js server
- Serves the application at [http://localhost:4173](http://localhost:4173)

### Option 2: PowerShell / Command Line
1. Open PowerShell or Command Prompt in this folder.
2. If PowerShell blocks npm scripts, use `npm.cmd` instead of `npm`:
   ```powershell
   npm.cmd install
   npm.cmd run build
   node server.js
   ```
3. Open [http://localhost:4173](http://localhost:4173) in your browser.

## Features

- Overview cards, current work, and recent handoffs
- Search and status filters for work orders
- Work-order detail with ownership and handoff history
- Create work orders
- Send review requests and see the updated owner/status
- Responsive layout for desktop and mobile

The Java API seeds illustrative sample records in memory at startup. Changes made while the server is running remain available until the Java service restarts.

## Services

- React + Vite frontend: `frontend/src`
- Node.js static server and API gateway: `server.js`
- Java API: `backend-java/src/main/java/avajet/erp/Main.java`
- Java API port: `8081`
- Web app port: `4173`
