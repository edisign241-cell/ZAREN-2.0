@echo off
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:3005"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:3005"
) else (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "http://127.0.0.1:3005"
)
