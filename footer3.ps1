$content = [System.IO.File]::ReadAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', [System.Text.Encoding]::UTF8)

$content = $content -replace ".*&copy; \{new Date", '            &copy; {new Date'

[System.IO.File]::WriteAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "Replaced wildcards part 3!"
