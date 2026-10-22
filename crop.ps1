Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\shame\.gemini\antigravity-ide\brain\362c1211-6595-4650-abc9-8a518365bc15\.user_uploaded\media_1788438649244.jpg"
$destDir = "c:\Users\shame\abu\images"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source Dimensions: $($src.Width) x $($src.Height)"

# Crop Owner Man & Phone Illustration
# In the 800 x 1238 or whatever resolution:
# Let's find coordinates relative to image width and height
# Owner card is roughly at:
# X: ~68% to 96%
# Y: ~81% to 95%
$w = $src.Width
$h = $src.Height

# Let's crop the owner illustration (the man with beard + phone)
$cropX = [int]($w * 0.74)
$cropY = [int]($h * 0.825)
$cropW = [int]($w * 0.22)
$cropH = [int]($h * 0.125)

$rect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH
$ownerBmp = $src.Clone($rect, $src.PixelFormat)
$ownerBmp.Save("$destDir\owner-man.png", [System.Drawing.Imaging.ImageFormat]::Png)
$ownerBmp.Dispose()
Write-Host "Saved owner-man.png"

# Crop Step 1 (Find Turf)
$s1X = [int]($w * 0.055)
$s1Y = [int]($h * 0.865)
$s1W = [int]($w * 0.08)
$s1H = [int]($h * 0.055)
$rect1 = New-Object System.Drawing.Rectangle $s1X, $s1Y, $s1W, $s1H
$b1 = $src.Clone($rect1, $src.PixelFormat)
$b1.Save("$destDir\step-find-turf.png", [System.Drawing.Imaging.ImageFormat]::Png)
$b1.Dispose()

# Crop Step 2 (Choose Slot)
$s2X = [int]($w * 0.19)
$s2Y = [int]($h * 0.865)
$s2W = [int]($w * 0.08)
$s2H = [int]($h * 0.055)
$rect2 = New-Object System.Drawing.Rectangle $s2X, $s2Y, $s2W, $s2H
$b2 = $src.Clone($rect2, $src.PixelFormat)
$b2.Save("$destDir\step-choose-slot.png", [System.Drawing.Imaging.ImageFormat]::Png)
$b2.Dispose()

# Crop Step 3 (Book & Pay)
$s3X = [int]($w * 0.32)
$s3Y = [int]($h * 0.865)
$s3W = [int]($w * 0.08)
$s3H = [int]($h * 0.055)
$rect3 = New-Object System.Drawing.Rectangle $s3X, $s3Y, $s3W, $s3H
$b3 = $src.Clone($rect3, $src.PixelFormat)
$b3.Save("$destDir\step-book-pay.png", [System.Drawing.Imaging.ImageFormat]::Png)
$b3.Dispose()

# Crop Step 4 (Play & Enjoy)
$s4X = [int]($w * 0.44)
$s4Y = [int]($h * 0.865)
$s4W = [int]($w * 0.09)
$s4H = [int]($h * 0.055)
$rect4 = New-Object System.Drawing.Rectangle $s4X, $s4Y, $s4W, $s4H
$b4 = $src.Clone($rect4, $src.PixelFormat)
$b4.Save("$destDir\step-play-enjoy.png", [System.Drawing.Imaging.ImageFormat]::Png)
$b4.Dispose()

$src.Dispose()
Write-Host "All assets cropped successfully!"
