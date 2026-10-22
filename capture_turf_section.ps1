$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\shame\abu\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

# Scroll to turf listing section on index.html
$searchOut = "$outDir\03_find_turfs_listing.png"
& $edgePath --headless --screenshot="$searchOut" --window-size="1440,1080" "http://localhost:3000/index.html#popular-turfs"
Start-Sleep -Seconds 2

Write-Output "Turfs listing screenshot taken: $searchOut"
