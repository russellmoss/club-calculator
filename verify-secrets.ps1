# Verify Secrets Removal Script
# This script checks for patterns of API keys and secrets that should have been removed

# Configuration
$patterns = @(
    # Commerce7 API Keys - look for actual key patterns
    "C7_SECRET_KEY=[A-Za-z0-9+/=]+",
    "C7_APP_ID=[A-Za-z0-9+/=]+",
    "C7_TENANT_ID=[A-Za-z0-9+/=]+",
    "REACT_APP_C7_[A-Z_]+=[A-Za-z0-9+/=]+",
    
    # Club IDs - look for actual ID patterns
    "CLUB_[A-Z_]+_ID=[A-Za-z0-9-]+",
    
    # Other sensitive data - look for actual values
    "PICKUP_LOCATION_ID=[A-Za-z0-9-]+",
    "API_KEY=[A-Za-z0-9+/=]+",
    "SECRET_KEY=[A-Za-z0-9+/=]+",
    "ACCESS_TOKEN=[A-Za-z0-9+/=]+",
    "AUTH_TOKEN=[A-Za-z0-9+/=]+",
    "PASSWORD=[A-Za-z0-9+/=]+"
)

# Directories to exclude
$excludeDirs = @(
    "node_modules",
    "node_modules\*",
    ".git",
    ".git\*",
    "build",
    "dist",
    "coverage",
    ".next",
    ".cache",
    "tmp",
    "temp",
    "logs",
    "netlify\functions",
    "docs"
)

# Files to exclude
$excludeFiles = @(
    "verify-secrets.ps1",
    "gitleaks-clubcalc-report.json",
    "gitleaks-report.sarif",
    "club-signup-implementation.md",
    ".env",
    "server\.env"
)

# File extensions to always treat as text
$textExtensions = @(
    ".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".txt", ".css", ".scss", ".html", ".xml", ".yaml", ".yml", ".env"
)

# Function to check if a file is binary
function Test-BinaryFile {
    param([string]$filePath)
    
    # Check file extension first
    $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
    if ($textExtensions -contains $extension) {
        return $false
    }
    
    try {
        # Read first 1024 bytes of the file
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        if ($bytes.Count -gt 1024) {
            $bytes = $bytes[0..1023]
        }
        
        # Count null bytes and non-printable characters
        $nullBytes = 0
        $nonPrintable = 0
        foreach ($byte in $bytes) {
            if ($byte -eq 0) { $nullBytes++ }
            if ($byte -gt 127) { $nonPrintable++ }
        }
        
        # If more than 10% of bytes are null or non-printable, consider it binary
        $threshold = $bytes.Count * 0.1
        return ($nullBytes -gt $threshold) -or ($nonPrintable -gt $threshold)
    }
    catch {
        Write-Host "Warning: Could not read file for binary check: $filePath" -ForegroundColor Yellow
        return $true
    }
}

# Function to search for patterns in a file
function Search-FileForPatterns {
    param(
        [string]$filePath,
        [string[]]$patterns
    )
    
    try {
        $content = Get-Content $filePath -Raw -ErrorAction Stop
        $matches = @()
        
        foreach ($pattern in $patterns) {
            if ($content -match $pattern) {
                $matches += @{
                    Pattern = $pattern
                    File = $filePath
                    Line = ($content -split "`n" | Select-String $pattern).LineNumber
                }
            }
        }
        
        return $matches
    }
    catch {
        Write-Host "Warning: Could not read file: $filePath" -ForegroundColor Yellow
        return @()
    }
}

# Function to check if file should be excluded
function Test-ExcludedFile {
    param([string]$filePath)
    
    # Check if file is in excluded directories
    foreach ($dir in $excludeDirs) {
        if ($filePath -like "*\$dir*") {
            return $true
        }
    }
    
    # Check if file is in excluded files list
    $fileName = [System.IO.Path]::GetFileName($filePath)
    if ($excludeFiles -contains $fileName) {
        return $true
    }
    
    return $false
}

# Main script
Write-Host "Starting secrets verification..." -ForegroundColor Cyan
Write-Host "----------------------------------------"

$allMatches = @()
$filesChecked = 0
$binaryFilesSkipped = 0
$excludedFiles = 0
$totalFiles = 0

# Get all files recursively, starting from current directory
Write-Host "Scanning for files..." -ForegroundColor Cyan
$files = Get-ChildItem -Path . -Recurse -File -Force

Write-Host "Found $($files.Count) total files" -ForegroundColor Cyan

foreach ($file in $files) {
    $totalFiles++
    $filePath = $file.FullName
    
    # Skip excluded directories and files
    if (Test-ExcludedFile $filePath) {
        $excludedFiles++
        Write-Host "Skipping excluded file: $filePath" -ForegroundColor Gray
        continue
    }
    
    # Skip binary files
    if (Test-BinaryFile $filePath) {
        $binaryFilesSkipped++
        Write-Host "Skipping binary file: $filePath" -ForegroundColor Gray
        continue
    }
    
    $filesChecked++
    Write-Host "Checking file: $filePath" -ForegroundColor Gray
    $matches = Search-FileForPatterns $filePath $patterns
    if ($matches.Count -gt 0) {
        $allMatches += $matches
    }
}

# Output results
Write-Host "`nVerification Results:" -ForegroundColor Cyan
Write-Host "----------------------------------------"
Write-Host "Total files found: $totalFiles"
Write-Host "Files checked: $filesChecked"
Write-Host "Files excluded: $excludedFiles"
Write-Host "Binary files skipped: $binaryFilesSkipped"
Write-Host "Potential secrets found: $($allMatches.Count)"
Write-Host "----------------------------------------"

if ($allMatches.Count -gt 0) {
    Write-Host "`nWARNING: Potential secrets found in the following files:" -ForegroundColor Yellow
    foreach ($match in $allMatches) {
        Write-Host "`nFile: $($match.File)"
        Write-Host "Pattern: $($match.Pattern)"
        Write-Host "Line: $($match.Line)"
    }
    Write-Host "`nERROR: Please review and remove these potential secrets before committing." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`nSUCCESS: No potential secrets found in the codebase!" -ForegroundColor Green
    exit 0
} 