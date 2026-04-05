@echo off
echo ================================
echo   Deploy ke Firebase Hosting
echo   DaPenDig - Karang Sengon
echo ================================
echo.
call firebase --version
echo.
call firebase deploy --only hosting
echo.
echo ================================
echo   Deploy selesai!
echo ================================
pause
