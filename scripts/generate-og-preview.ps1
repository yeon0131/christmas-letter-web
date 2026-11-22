Add-Type -AssemblyName System.Drawing

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$assetRoot = Join-Path $projectRoot 'src\assets'
$outputPath = Join-Path $projectRoot 'public\og-preview.png'

$canvas = [System.Drawing.Bitmap]::new(1200, 630, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#FFF8EB'))

function New-Color([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Draw-RoundedRectangle($target, $pen, $brush, [float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $radius * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  if ($null -ne $brush) { $target.FillPath($brush, $path) }
  if ($null -ne $pen) { $target.DrawPath($pen, $path) }
  $path.Dispose()
}

$paperDotBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(22, 113, 132, 71))
$random = [System.Random]::new(2512)
for ($index = 0; $index -lt 560; $index++) {
  $x = $random.Next(18, 1182)
  $y = $random.Next(16, 614)
  $size = if ($index % 5 -eq 0) { 2 } else { 1 }
  $graphics.FillEllipse($paperDotBrush, $x, $y, $size, $size)
}

$greenPen = [System.Drawing.Pen]::new((New-Color '#718447'), 5)
$greenPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$greenPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($greenPen, 38, 24, 1165, 27)
$graphics.DrawLine($greenPen, 45, 606, 1158, 603)

$logo = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'brand-cat-logo.png'))
$hero = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'hero-cat.png'))
$fishHeart = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'hero-fish-heart.png'))
$fishStripe = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'hero-fish-stripe.png'))
$fishStar = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'hero-fish-star.png'))

$graphics.DrawImage($logo, 62, 48, 82, 82)

$brandFont = [System.Drawing.Font]::new('휴먼편지체', 35, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$kickerFont = [System.Drawing.Font]::new('휴먼편지체', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$titleFont = [System.Drawing.Font]::new('휴먼편지체', 68, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subtitleFont = [System.Drawing.Font]::new('휴먼편지체', 31, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$buttonFont = [System.Drawing.Font]::new('휴먼편지체', 30, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$inkBrush = [System.Drawing.SolidBrush]::new((New-Color '#2B251F'))
$redBrush = [System.Drawing.SolidBrush]::new((New-Color '#D95139'))
$greenBrush = [System.Drawing.SolidBrush]::new((New-Color '#718447'))
$yellowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 255, 222, 125))
$creamBrush = [System.Drawing.SolidBrush]::new((New-Color '#FFFAF0'))

$graphics.DrawString('야옹아멍멍해바', $brandFont, $inkBrush, 154, 67)
$graphics.DrawString('크리스마스 선물 편지', $kickerFont, $redBrush, 68, 172)

$highlightPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
$highlightPath.AddClosedCurve([System.Drawing.PointF[]]@(
  [System.Drawing.PointF]::new(62, 314),
  [System.Drawing.PointF]::new(590, 307),
  [System.Drawing.PointF]::new(600, 377),
  [System.Drawing.PointF]::new(72, 385)
), 0.15)
$graphics.FillPath($yellowBrush, $highlightPath)
$highlightPath.Dispose()

$graphics.DrawString("냥트리에`n편지를 달아줘!", $titleFont, $inkBrush, 62, 220)
$graphics.DrawString('12월 25일에 함께 열어봐요', $subtitleFont, $greenBrush, 68, 408)

$buttonBrush = [System.Drawing.SolidBrush]::new((New-Color '#E65A3D'))
Draw-RoundedRectangle $graphics $null $buttonBrush 67 476 430 72 30
$buttonText = '친구의 냥트리 보러 가기'
$buttonSize = $graphics.MeasureString($buttonText, $buttonFont)
$graphics.DrawString($buttonText, $buttonFont, $creamBrush, 67 + ((430 - $buttonSize.Width) / 2), 493)

$graphics.DrawImage($hero, 642, 67, 510, 510)
$graphics.DrawImage($fishStripe, 698, 270, 82, 57)
$graphics.DrawImage($fishStar, 1007, 209, 79, 55)
$graphics.DrawImage($fishHeart, 773, 471, 86, 59)

$sparkPen = [System.Drawing.Pen]::new((New-Color '#F4B82D'), 5)
$sparkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$sparkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($sparkPen, 590, 128, 607, 128)
$graphics.DrawLine($sparkPen, 598, 119, 598, 137)
$graphics.DrawLine($sparkPen, 1111, 523, 1132, 523)
$graphics.DrawLine($sparkPen, 1122, 512, 1122, 534)

$canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$sparkPen.Dispose()
$buttonBrush.Dispose()
$creamBrush.Dispose()
$yellowBrush.Dispose()
$greenBrush.Dispose()
$redBrush.Dispose()
$inkBrush.Dispose()
$buttonFont.Dispose()
$subtitleFont.Dispose()
$titleFont.Dispose()
$kickerFont.Dispose()
$brandFont.Dispose()
$fishStar.Dispose()
$fishStripe.Dispose()
$fishHeart.Dispose()
$hero.Dispose()
$logo.Dispose()
$greenPen.Dispose()
$paperDotBrush.Dispose()
$graphics.Dispose()
$canvas.Dispose()

Write-Output $outputPath
