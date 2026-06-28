# TaskFlow – One-Time Setup Script
# Run this in PowerShell from the CollEdge_task folder:
#   cd "C:\Users\Swayam\Downloads\CollEdge_task"
#   .\SETUP.ps1

Write-Host "`n=== TaskFlow Setup ===" -ForegroundColor Cyan

# ── 1. Create .env files ───────────────────────────────────────────────────
if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Created backend\.env  →  Edit MONGO_URI before running" -ForegroundColor Yellow
}
if (-not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "Created frontend\.env →  VITE_API_URL=http://localhost:5000/api (default)" -ForegroundColor Green
}

# ── 2. Install dependencies ────────────────────────────────────────────────
Write-Host "`nInstalling backend packages..." -ForegroundColor Cyan
Set-Location backend; npm install; Set-Location ..

Write-Host "`nInstalling frontend packages..." -ForegroundColor Cyan
Set-Location frontend; npm install; Set-Location ..

# ── 3. Git init + first commit ─────────────────────────────────────────────
if (-not (Test-Path ".git\config")) {
    # Remove broken .git if it exists
    if (Test-Path ".git") { Remove-Item ".git" -Recurse -Force }
    git init
    git branch -m main
}

git add .
git commit -m "feat: initial MERN task tracker (TaskFlow)"

Write-Host "`n=== Git commit done ===" -ForegroundColor Green

# ── 4. Push to GitHub ──────────────────────────────────────────────────────
$ghUser = Read-Host "`nEnter your GitHub username"
$repoName = "task-tracker-mern"

Write-Host "`nCreating GitHub repo '$repoName'..." -ForegroundColor Cyan
gh repo create $repoName --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Pushed to https://github.com/$ghUser/$repoName" -ForegroundColor Green
} else {
    Write-Host "`nManual push: git remote add origin https://github.com/$ghUser/$repoName.git && git push -u origin main" -ForegroundColor Yellow
}

Write-Host "`n=== Next: Deploy ===" -ForegroundColor Cyan
Write-Host "Backend  → https://render.com  (root: backend)" -ForegroundColor White
Write-Host "Frontend → https://vercel.com  (root: frontend)" -ForegroundColor White
Write-Host "See README.md for step-by-step deploy instructions`n" -ForegroundColor White
