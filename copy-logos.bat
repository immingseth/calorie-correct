@echo off
REM =====================================================
REM  copy-logos.bat — one-time copy of logo and favicon
REM
REM  Copies images\cc-logo.png and images\favicon.png to:
REM    - project root (for landing page)
REM    - app/ folder (for the app shell + onboarding)
REM
REM  After this finishes, run ship.bat to commit and deploy.
REM =====================================================

setlocal

cd /d "%~dp0"

if not exist "images\cc-logo.png" (
  echo ERROR: images\cc-logo.png not found.
  echo Make sure the source files are in the images\ folder.
  pause
  exit /b 1
)
if not exist "images\favicon.png" (
  echo ERROR: images\favicon.png not found.
  pause
  exit /b 1
)

echo Copying cc-logo.png to project root...
copy /y "images\cc-logo.png" "cc-logo.png"

echo Copying favicon.png to project root...
copy /y "images\favicon.png" "favicon.png"

echo Copying cc-logo.png to app folder...
copy /y "images\cc-logo.png" "app\cc-logo.png"

echo Copying favicon.png to app folder...
copy /y "images\favicon.png" "app\favicon.png"

echo.
echo ====================================================
echo  Logo + favicon files copied.
echo ====================================================
echo.
echo Next: run ship.bat with a message like:
echo   ship.bat "Add logo image and favicon"
echo.
pause
exit /b 0
