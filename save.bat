@echo off
REM =====================================================
REM  save.bat — local checkpoint, NOT a deploy
REM
REM  Usage:
REM    save.bat "Short description of what changed"
REM    OR double-click and you'll be prompted for a message.
REM
REM  What it does:
REM    1. Stages every change in the working directory
REM    2. Commits with the message you passed
REM
REM  What it does NOT do:
REM    - Push to GitHub (use ship.bat for that)
REM    - Deploy to caloriecorrect.com (cPanel does that)
REM
REM  Use this liberally during local design iteration. Each
REM  save.bat is a recoverable checkpoint. rollback.bat will
REM  undo the most recent commit (save or ship — both are commits).
REM =====================================================

setlocal

REM If no argument passed (e.g. double-click), prompt for one
set "MSG=%~1"
if "%MSG%"=="" (
  echo.
  echo No commit message was passed in.
  echo.
  set /p "MSG=Enter a short description of what changed: "
)

if "%MSG%"=="" (
  echo.
  echo No message entered. Aborting.
  pause
  exit /b 1
)

echo.
echo ====================================================
echo  Saving checkpoint
echo ====================================================
echo.

echo Files being committed:
git status --short
echo.

REM Stage everything
git add -A
if errorlevel 1 goto :error

REM Commit
git commit -m "%MSG%"
if errorlevel 1 (
  echo.
  echo Nothing to commit, or commit failed. If "nothing to commit",
  echo there are no changes since the last save / ship.
  echo.
  pause
  exit /b 1
)

echo.
echo ====================================================
echo  CHECKPOINT SAVED (local only)
echo ====================================================
echo.
echo Latest commit:
git log -1 --oneline
echo.
echo Local-only checkpoint. To deploy this and any earlier
echo saves to the live site, run ship.bat.
echo.
echo To undo this save, run rollback.bat.
echo.
pause
exit /b 0

:error
echo.
echo Something went wrong. Take a screenshot and paste it back to Claude.
echo.
pause
exit /b 1
