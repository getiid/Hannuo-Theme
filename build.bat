@echo off
echo Building Vue project...
call npm run build

echo Cleaning up old files...
if exist hannuo-theme.zip del hannuo-theme.zip

echo Copying files to theme directory...
if not exist hannuo-theme mkdir hannuo-theme
xcopy /s /y dist\* hannuo-theme\
copy /y functions.php hannuo-theme\
copy /y style.css hannuo-theme\
copy /y index.php hannuo-theme\
copy /y screenshot.png hannuo-theme\

echo Creating zip file...
powershell Compress-Archive -Path hannuo-theme -DestinationPath hannuo-theme.zip -Force

echo Done! 