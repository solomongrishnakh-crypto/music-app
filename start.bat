@echo off
cd /d "%~dp0"
if not exist ".env.local" (
    echo FEHLER: .env.local fehlt. Bitte einmalig anlegen mit YOUTUBE_API_KEY=dein_key
    pause
    exit /b
)
if not exist "node_modules" (
    echo Installiere Abhaengigkeiten einmalig...
    call npm install
)
start "" http://localhost:3000
call npm run dev
