@echo off
REM =====================================================
REM  Calorie Correct — one-time Git setup script
REM
REM  Run this ONCE from this folder by double-clicking it,
REM  or from a terminal opened here:
REM    cd "C:\Users\immin\Documents\Claude\Projects\Calorie Correct"
REM    setup-git.bat
REM =====================================================

setlocal

echo.
echo ====================================================
echo  Calorie Correct - Git setup
echo ====================================================
echo.

REM --- Verify git is installed ---
where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is not installed or not on PATH.
  echo.
  echo Install Git for Windows from:
  echo   https://git-scm.com/download/win
  echo.
  echo Use the default options during install. After it finishes,
  echo close and reopen any terminal windows, then run this script again.
  echo.
  pause
  exit /b 1
)

echo Git is installed. Version:
git --version
echo.

REM --- Remove any partially-created .git folder ---
if exist .git (
  echo Removing partially-created .git folder...
  rmdir /s /q .git
)

REM --- Initialize fresh repo ---
echo Initializing fresh repo on branch 'main'...
git init -b main
if errorlevel 1 goto :error

REM --- Configure local user (only this repo, doesn't change global) ---
git config user.name "Seth Imming"
git config user.email "immingseth@gmail.com"
echo.
echo Configured commit author as: Seth Imming ^<immingseth@gmail.com^>
echo.

REM --- Stage everything (respects .gitignore) ---
echo Staging files...
git add -A

REM --- Show what will be committed ---
echo.
echo About to commit these files:
git status --short
echo.

REM --- Make the initial commit ---
git commit -m "Initial commit: Calorie Correct end-of-Cycle-Personal" -m "Production state as of May 4, 2026 - all Cycle 1-7 + Cycle Personal features deployed and verified on https://caloriecorrect.com (byte-identical to local)."
if errorlevel 1 goto :error

echo.
echo ====================================================
echo  SUCCESS - local repo is ready.
echo ====================================================
echo.
git log --oneline
echo.
echo Next steps:
echo   1. Tell Claude when this finished successfully.
echo   2. He'll walk you through creating the GitHub repo
echo      and pushing to it.
echo.
pause
exit /b 0

:error
echo.
echo Something went wrong. Take a screenshot of the messages
echo above and paste it back to Claude.
echo.
pause
exit /b 1
