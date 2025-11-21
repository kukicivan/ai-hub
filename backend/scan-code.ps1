# ============================================
# Laravel Code Scanner for Windows
# ============================================
# Usage: .\scan-code.ps1
# Output: output.txt (u istom folderu gde je skripta)

# ============================================
# KONFIGURACIJA
# ============================================

# Root folder koji skeniramo (relativan ili apsolutan path)
$ROOT_FOLDER = ".\src\app"

# Fajlovi koje UKLJUČUJEMO (po defaultu sve)
# Ako ostaviš prazno, svi fajlovi se uključuju
$FILES_TO_INCLUDE = @(
# "*.php",
# "*.js",
# "*.vue"
)

# Fajlovi koje ISKLJUČUJEMO (po filename, nevezano za folder)
$FILES_TO_EXCLUDE = @(
# Primeri:
# "composer.json",
# "package.json",
# "web.php"
    "Controller.php",
    "AICommunicationController.php",
    "DataAnonymizer.php",
    "TokenEstimator.php"
    "AIModelAdapterInterface.php"
)

# Folderi koje ISKLJUČUJEMO (puni putevi ili nazivi)
$FOLDERS_TO_EXCLUDE = @(
    "node_modules",
    "vendor",
    ".git",
    "storage",
    "bootstrap\cache",
    "Console",
    "Interfaces",
    "Jobs",
    "Models",
    "Providers",
    "Utils",
    "Http\Resources",
    "Http\Controllers\Api",
    "Services\DTOs"
    "Services\Messaging"
    "Services\AI\Adapters\Groq"
)

# Output fajl
$OUTPUT_FILE = ".\output.txt"

# ============================================
# POČETAK SKRIPTE
# ============================================

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Laravel Code Scanner - Windows PowerShell" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Proveri da li ROOT_FOLDER postoji
if (-not (Test-Path $ROOT_FOLDER)) {
    Write-Host "ERROR: Folder '$ROOT_FOLDER' ne postoji!" -ForegroundColor Red
    exit 1
}

# Obrisi stari output file ako postoji
if (Test-Path $OUTPUT_FILE) {
    Remove-Item $OUTPUT_FILE
    Write-Host "[OK] Stari output.txt obrisan" -ForegroundColor Green
}

# Kreiraj novi output file
New-Item -Path $OUTPUT_FILE -ItemType File | Out-Null

# ============================================
# FUNKCIJA: Proveri da li je fajl isključen
# ============================================
function Is-FileExcluded {
    param (
        [string]$FileName
    )

    foreach ($excluded in $FILES_TO_EXCLUDE) {
        if ($FileName -eq $excluded) {
            return $true
        }
    }

    return $false
}

# ============================================
# FUNKCIJA: Proveri da li je folder isključen
# ============================================
function Is-FolderExcluded {
    param (
        [string]$FolderPath
    )

    foreach ($excluded in $FOLDERS_TO_EXCLUDE) {
        if ($FolderPath -like "*$excluded*") {
            return $true
        }
    }

    return $false
}

# ============================================
# GENERISANJE TREE STRUKTURE
# ============================================
Write-Host "[*] Generisujem tree strukturu..." -ForegroundColor Yellow

$tree = Get-ChildItem -Path $ROOT_FOLDER -Recurse -Directory |
        Where-Object { -not (Is-FolderExcluded $_.FullName) } |
        ForEach-Object {
            $relativePath = $_.FullName.Replace((Resolve-Path $ROOT_FOLDER).Path, "").TrimStart('\')
            $depth = ($relativePath.Split('\').Count - 1)
            $indent = "|   " * $depth + "+-- "

            [PSCustomObject]@{
                Path = $relativePath
                Depth = $depth
                Display = "$indent$($_.Name)"
            }
        } |
        Sort-Object -Property @{Expression = "Path"; Ascending = $true} |
        Select-Object -ExpandProperty Display

# Upisi tree u output
Add-Content -Path $OUTPUT_FILE -Value "==============================================="
Add-Content -Path $OUTPUT_FILE -Value "FOLDER TREE STRUCTURE"
Add-Content -Path $OUTPUT_FILE -Value "==============================================="
Add-Content -Path $OUTPUT_FILE -Value ""
$tree | ForEach-Object { Add-Content -Path $OUTPUT_FILE -Value $_ }
Add-Content -Path $OUTPUT_FILE -Value ""
Add-Content -Path $OUTPUT_FILE -Value "==============================================="
Add-Content -Path $OUTPUT_FILE -Value ""

Write-Host "[OK] Tree struktura generisana" -ForegroundColor Green
Write-Host ""

# ============================================
# SKENIRANJE FAJLOVA
# ============================================
Write-Host "[*] Skeniranje fajlova..." -ForegroundColor Yellow

$files = Get-ChildItem -Path $ROOT_FOLDER -Recurse -File |
        Where-Object {
            # Isključi foldere
            -not (Is-FolderExcluded $_.DirectoryName) -and
            # Isključi fajlove po imenu
            -not (Is-FileExcluded $_.Name)
        }

# Ako ima FILES_TO_INCLUDE filtera, primeni ga
if ($FILES_TO_INCLUDE.Count -gt 0) {
    $files = $files | Where-Object {
        $match = $false
        foreach ($pattern in $FILES_TO_INCLUDE) {
            if ($_.Name -like $pattern) {
                $match = $true
                break
            }
        }
        $match
    }
}

$totalFiles = $files.Count
$currentFile = 0

Write-Host "Pronadjeno fajlova: $totalFiles" -ForegroundColor Cyan
Write-Host ""

# ============================================
# OBRADA SVAKOG FAJLA
# ============================================
foreach ($file in $files) {
    $currentFile++
    $relativePath = $file.FullName.Replace((Resolve-Path $ROOT_FOLDER).Path, "").TrimStart('\')

    Write-Host "[$currentFile/$totalFiles] $relativePath" -ForegroundColor White

    # Separator u outputu
    Add-Content -Path $OUTPUT_FILE -Value "==============================================="
    Add-Content -Path $OUTPUT_FILE -Value "FILE: $relativePath"
    Add-Content -Path $OUTPUT_FILE -Value "FULL PATH: $($file.FullName)"
    Add-Content -Path $OUTPUT_FILE -Value "==============================================="
    Add-Content -Path $OUTPUT_FILE -Value ""

    # Ucitaj sadrzaj fajla
    try {
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
        Add-Content -Path $OUTPUT_FILE -Value $content
    } catch {
        Add-Content -Path $OUTPUT_FILE -Value "[ERROR: Nije moguce procitati fajl]"
        Write-Host "   [!] Greska pri citanju fajla" -ForegroundColor Red
    }

    # Prazan red nakon sadržaja
    Add-Content -Path $OUTPUT_FILE -Value ""
    Add-Content -Path $OUTPUT_FILE -Value ""
}

# ============================================
# ZAVRSETAK
# ============================================
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "[OK] ZAVRSENO!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Ukupno fajlova: $totalFiles" -ForegroundColor White
Write-Host "Output fajl: $OUTPUT_FILE" -ForegroundColor Yellow
Write-Host ""

# Otvori output fajl u default editoru (opciono)
# Start-Process $OUTPUT_FILE