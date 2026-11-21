# Helper for the licensed owner: copies each base64 chunk to the local
# clipboard one at a time. Never prints the font bytes or writes them to Git.
param(
  [Parameter(Mandatory=$true)]
  [string] $FontPath
)
$resolved = (Resolve-Path -LiteralPath $FontPath -ErrorAction Stop).Path
$bytes = [System.IO.File]::ReadAllBytes($resolved)
if ($bytes.Length -lt 4096 -or $bytes.Length -gt 2097152) {
  throw "Expected a WOFF2 file between 4 KiB and 2 MiB."
}
$base64 = [Convert]::ToBase64String($bytes)
$limit = 4096
$count = [int][Math]::Ceiling($base64.Length / $limit)
if ($count -gt 16) {
  throw "More than 16 secrets would be needed. Contact the app maintainer."
}
Write-Host "Create $count encrypted production build variables in Cloudflare Pages."
Write-Host "Paste each clipboard value into its named variable. Values are never printed."
for ($i = 0; $i -lt $count; $i++) {
  $name = "AIWA_ROC_GROTESK_B64_{0:D2}" -f ($i + 1)
  $length = [Math]::Min($limit, $base64.Length - $i * $limit)
  $part = $base64.Substring($i * $limit, $length)
  Set-Clipboard -Value $part
  Write-Host ("Clipboard ready: {0} ({1} chars)" -f $name, $length)
  [void](Read-Host "After pasting the value into Cloudflare, press Enter")
}
Set-Clipboard -Value ""
Write-Host "Clipboard cleared. Add no additional numbered chunks beyond $count."
