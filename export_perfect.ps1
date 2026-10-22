$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open("C:\Users\shame\abu\Cloud_Database_Executive_Perfect_16x9.pptx")
New-Item -ItemType Directory -Force -Path "C:\Users\shame\abu\slide_previews_perfect"
$slideIdx = 1
foreach ($slide in $pres.Slides) {
    if ($slideIdx -le 6) {
        $slide.Export("C:\Users\shame\abu\slide_previews_perfect\slide_$slideIdx.png", "PNG", 1920, 1080)
    }
    $slideIdx++
}
$pres.Close()
$ppt.Quit()
Write-Output "Exported verified slide PNGs successfully."
