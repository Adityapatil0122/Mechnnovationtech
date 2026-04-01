$path = 'c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx'
$content = Get-Content $path -Raw

$oldSec = '<section className="relative overflow-hidden min-h-[100vh] flex items-center">'
$newSec = '<section className="relative overflow-hidden min-h-[100vh] flex items-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${heroSection?.meta_json?.image_url || "/images/indian_cnc_bgworker.png"})` }}>'
$content = $content.Replace($oldSec, $newSec)

$imgBlock = '        <div className="absolute inset-0">
          <img
            src={heroSection?.meta_json?.image_url || "/images/indian_cnc_bgworker.png"}
            alt=""
            className="h-full w-full object-cover scale-[1.02]"
          />
        </div>'

# Normalize newlines for replace
$imgBlockMatch = $imgBlock.Replace("`r`n", "`n")
$content = $content.Replace("`r`n", "`n")
$content = $content.Replace($imgBlockMatch, "")

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "Replaced hero background!"
