$ErrorActionPreference = "Stop"

$filePath = "c:\Mechnnovationtech\apps\web\src\pages\public-pages.jsx"
Write-Host "Reading $filePath"

# Read using UTF8. The file might contain the copyright symbol.
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

Write-Host "Replacing Brand Name"
$content = $content -replace "Mechnnovation(?! Vation)", "Mechnno Vation"

Write-Host "Replacing Header..."
$oldHeader1 = '<header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">'
$newHeader1 = '<header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-white/10 bg-black/80 backdrop-blur-xl" : "bg-transparent pt-4"}`}>'

$content = $content -replace [regex]::Escape($oldHeader1), $newHeader1

# We need to add scrolled state to PublicLayout.
$layoutSig = "export function PublicLayout() {"
if ($content.Contains($layoutSig) -and (-not $content.Contains("const [scrolled, setScrolled]"))) {
    Write-Host "Adding scroll state..."
    $stateCode = "
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener(`"scroll`", handleScroll);
    return () => window.removeEventListener(`"scroll`", handleScroll);
  }, []);
"
    $content = $content.Replace($layoutSig, "$layoutSig$stateCode")
}

# The header also has logo text which might be dark. "Mechnno Vation" text in public layout.
# Let's find: <p className="font-display text-lg font-bold leading-none text-gray-900 sm:text-xl">Mechnno Vation</p>
# Wait, let's just make the text white if transparent, or keep current depending.
# But black text on black hero is invisible. So let's make it white initially, and white when scrolled if we use bg-black!
# Since we change to bg-black/80, all header text needs to be white.
# So we can just change text-gray-900 to text-white inside the header. 
# Or text-gray-700 to text-gray-200.
# Wait, it's easier to change 'text-gray-900' to 'text-white' in the header.
# Let's just do a specific replace for the brand name:
$brandOld = '<p className="font-display text-lg font-bold leading-none text-gray-900 sm:text-xl">Mechnno Vation</p>'
$brandNew = '<p className="font-display text-lg font-bold leading-none text-white sm:text-xl">Mechnno Vation</p>'
$content = $content.Replace($brandOld, $brandNew)

# And footer - "make sure all things are working in footer". What's not working? Wait, maybe footer links or form?
# Let's do nothing to footer until I know exactly what needs fixing.

Write-Host "Saving file..."
[System.IO.File]::WriteAllText($filePath, $content, (New-Object System.Text.UTF8Encoding $False))
Write-Host "Done"
