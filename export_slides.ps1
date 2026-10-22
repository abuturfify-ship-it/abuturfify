$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open("C:\Users\shame\abu\Cloud_Database_Executive_Spacious.pptx")
# Export Slide 2, 4, 6 to PNG
New-Item -ItemType Directory -Force -Path "C:\Users\shame\abu\slide_previews"
$slideIdx = 1
foreach ($slide in $pres.Slides) {
    if ($slideIdx -le 6) {
        $slide.Export("C:\Users\shame\abu\slide_previews\slide_$slideIdx.png", "PNG", 1920, 1080)
    }
    $slideIdx++
}
$pres.Close()
$ppt.Quit()
Write-Output "Exported slide preview PNGs successfully."
