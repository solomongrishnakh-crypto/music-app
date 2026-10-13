@echo off
cd /d "%~dp0"
echo === Centaurian: Aenderungen hochladen ===
git add src public
git commit -m "Fix: interne Links als Link statt a (Build-Fehler)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01C6fKcuKEqptpGiBcHgmXt8"
git push
echo.
git status -sb
git log -1 --oneline
echo.
echo === FERTIG - du kannst das Fenster schliessen ===
pause
