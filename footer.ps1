$content = [System.IO.File]::ReadAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', [System.Text.Encoding]::UTF8)

# Instead of relying on the weird symbol, let's just regex replace the specific tags
# Line 248 is: <p className="text-xs text-gray-600">\n             {new Date().getFullYear()} Mechnno Vation Technologies. All rights reserved.\n          </p>
$content = $content -replace " \{new Date\(\)", "&copy; {new Date()"

# For the bulls, it's: <span className="mx-2 text-gray-700"></span>
$content = $content -replace '<span className="mx-2 text-gray-700"></span>', '<span className="mx-2 text-gray-700">&bull;</span>'

[System.IO.File]::WriteAllText('c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "Replaced footer chars."
