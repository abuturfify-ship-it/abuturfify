$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\shame\abu\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

# 1. Capture Home Page
$homeOut = "$outDir\01_turfify_home.png"
& $edgePath --headless --screenshot="$homeOut" --window-size="1440,1080" "http://localhost:3000/index.html"
Start-Sleep -Seconds 2

# 2. Capture About Page
$aboutOut = "$outDir\02_turfify_about.png"
& $edgePath --headless --screenshot="$aboutOut" --window-size="1440,1080" "http://localhost:3000/about.html"
Start-Sleep -Seconds 2

Write-Output "Screenshots taken via Edge headless: $homeOut, $aboutOut"
