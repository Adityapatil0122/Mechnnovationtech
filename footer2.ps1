$content = [System.IO.File]::ReadAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', [System.Text.Encoding]::UTF8)

$content = $content -replace '<span className="mx-2 text-gray-700">.</span>', '<span className="mx-2 text-gray-700">&bull;</span>'

$pattern = "\s+.( \{new Date\(\)\.getFullYear\(\)\} Mechnno Vation Technologies\. All rights reserved\.)"
$content = $content -replace $pattern, "`n            &copy;`$1"

[System.IO.File]::WriteAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "Replaced wildcards!"
