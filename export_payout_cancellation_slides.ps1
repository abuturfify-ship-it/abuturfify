$pptPath = "c:\Users\shame\abu\Turfify_Payout_Settlement_And_Cancellation_Masterclass.pptx"
$outDir = "c:\Users\shame\abu\slide_previews_payout_cancellation"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$pptApp = New-Object -ComObject PowerPoint.Application
$pres = $pptApp.Presentations.Open($pptPath, $true, $false, $false)

$slideIndex = 1
foreach ($slide in $pres.Slides) {
    $outFile = Join-Path $outDir "slide_$slideIndex.png"
    $slide.Export($outFile, "PNG", 1920, 1080)
    Write-Host "Exported Slide $slideIndex to $outFile"
    $slideIndex++
}

$pres.Close()
$pptApp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
Write-Host "All slides exported successfully!"
