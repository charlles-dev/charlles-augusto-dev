# Script de Deploy para Vercel - Windows PowerShell
# Execute este script na raiz do projeto

Write-Host "🚀 Iniciando deploy para Vercel..." -ForegroundColor Green

# Verificar se o Vercel CLI está instalado
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build do projeto
Write-Host "🔨 Executando build..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falhou. Corrija os erros antes de continuar." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green

# Deploy
Write-Host "🚀 Fazendo deploy..." -ForegroundColor Blue
$deployUrl = vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🔗 URL do deploy: $deployUrl" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deploy falhou. Verifique os logs acima." -ForegroundColor Red
    exit 1
}

# Abrir no navegador
$openBrowser = Read-Host "Deseja abrir o site no navegador? (s/n)"
if ($openBrowser -eq 's' -or $openBrowser -eq 'S') {
    Start-Process $deployUrl
}

Write-Host "🎉 Processo de deploy finalizado!" -ForegroundColor Green