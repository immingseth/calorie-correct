@echo off
REM =====================================================
REM  ship.bat — one-command deploy
REM
REM  Usage:
REM    ship.bat "What changed in this batch"
REM
REM  What it does:
REM    1. Stages every change in the working directory
REM    2. Commits with the message you passed
REM    3. Pushes to GitHub
REM
REM  After this finishes:
REM    Go to Bluehost cPanel → Git Version Control → Manage
REM    → click "Update from Remote" → click "Deploy HEAD Commit"
REM =====================================================

setlocal

if "%~1"=="" (
  echo.
  echo ERROR: You must provide a commit message.
  echo.
  echo Usage:
  echo   ship.bat "Short description of what changed"
  echo.
  echo Example:
  echo   ship.bat "Add Recent foods strip on Today"
  echo.
  pause
  exit /b 1
)

echo.
echo ====================================================
echo  Shipping changes
echo ====================================================
echo.

REM Show what's about to be committed so you can sanity-check
echo Files being committed:
git status --short
echo.

REM Confirm we're on main (warns if not)
for /f "tokens=*" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b
if not "%CURRENT_BRANCH%"=="main" (
  echo WARNING: You are on branch "%CURRENT_BRANCH%", not main.
  echo The lean workflow expects you to commit directly to main.
  echo.
  echo If this is intentional ^(you're on a feature branch^), press Ctrl+C
  echo to cancel, then run: git checkout main
  echo.
  pause
)

REM Stage everything
git add -A
if errorlevel 1 goto :error

REM Commit
git commit -m "%~1"
if errorlevel 1 (
  echo.
  echo Nothing to commit, or commit failed. If "nothing to commit",
  echo your last commit is already pushed - check git log to confirm.
  echo.
  pause
  exit /b 1
)

REM Push
git push
if errorlevel 1 goto :error

echo.
echo ====================================================
echo  SHIPPED
echo ====================================================
echo.
echo Latest commit:
git log -1 --oneline
echo.
echo NEXT STEPS:
echo   1. Open Bluehost cPanel → Git Version Control → Manage
echo   2. Click "Update from Remote"
echo   3. Click "Deploy HEAD Commit"
echo   4. Hard-refresh https://caloriecorrect.com in incognito
echo.
pause
exit /b 0

:error
echo.
echo Something went wrong. Take a screenshot of the messages above
echo and paste them back to Claude.
echo.
pause
exit /b 1
