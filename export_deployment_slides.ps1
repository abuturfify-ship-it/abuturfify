$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open("C:\Users\shame\abu\Web_Deployment_Platforms_Masterclass.pptx")
$targetDir = "C:\Users\shame\abu\slide_previews_deployment"
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

$slideIdx = 1
foreach ($slide in $pres.Slides) {
    $outPath = "$targetDir\slide_$slideIdx.png"
    $slide.Export($outPath, "PNG", 1920, 1080)
    $slideIdx++
}
$pres.Close()
$ppt.Quit()
Write-Output "Exported all $($slideIdx - 1) slide preview PNGs successfully to $targetDir."
