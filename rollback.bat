@echo off
REM =====================================================
REM  rollback.bat — undo the last shipped change
REM
REM  Usage:
REM    rollback.bat
REM
REM  What it does:
REM    1. Shows you what the last commit was
REM    2. Asks for confirmation
REM    3. Creates a new commit that undoes the last one
REM    4. Pushes to GitHub
REM
REM  After this finishes:
REM    Go to Bluehost cPanel → Git Version Control → Manage
REM    → click "Update from Remote" → click "Deploy HEAD Commit"
REM    The site goes back to the version before the broken deploy.
REM =====================================================

setlocal

echo.
echo ====================================================
echo  Rolling back the last shipped change
echo ====================================================
echo.

echo The commit that will be UNDONE:
echo.
git log -1 --pretty=format:"  %%h - %%s%n  Author: %%an%n  Date:   %%ad" --date=local
echo.
echo.

set /p CONFIRM="Are you sure you want to undo this commit? (y/N): "
if /i not "%CONFIRM%"=="y" (
  echo.
  echo Rollback cancelled. Nothing changed.
  echo.
  pause
  exit /b 0
)

echo.
echo Reverting...
git revert HEAD --no-edit
if errorlevel 1 goto :error

echo.
echo Pushing revert to GitHub...
git push
if errorlevel 1 goto :error

echo.
echo ====================================================
echo  ROLLBACK COMMITTED
echo ====================================================
echo.
echo The revert commit is now on GitHub. The live site is still
echo running the broken version until you deploy this revert.
echo.
echo NEXT STEPS:
echo   1. Open Bluehost cPanel → Git Version Control → Manage
echo   2. Click "Update from Remote"
echo   3. Click "Deploy HEAD Commit"
echo   4. Hard-refresh https://caloriecorrect.com in incognito
echo.
echo The site will be back to the version BEFORE the broken deploy.
echo.
pause
exit /b 0

:error
echo.
echo Rollback failed. Take a screenshot of the messages above
echo and paste them back to Claude.
echo.
pause
exit /b 1
