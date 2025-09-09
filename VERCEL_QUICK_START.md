# 🚀 Deploy Rápido no Vercel

## Passo a Passo - 5 minutos

### 1. Instalar Vercel CLI (se ainda não tiver)
```powershell
npm install -g vercel
```

### 2. Fazer login no Vercel
```powershell
vercel login
```

### 3. Deploy imediato
```powershell
# Opção 1: Usar o script criado
.\deploy-vercel.ps1

# Opção 2: Comando direto
npm run deploy

# Opção 3: Comando Vercel direto
vercel --prod
```

### 4. Configurar variáveis de ambiente (se necessário)
O CLI vai perguntar durante o deploy. Use:
- **VITE_SUPABASE_URL**: `https://wasyffceigndovssyjis.supabase.co`
- **VITE_SUPABASE_PUBLISHABLE_KEY**: Copie do arquivo `.env`

### 5. Verificar
- Site: `https://seu-projeto.vercel.app`
- Health check: `https://seu-projeto.vercel.app/health`

## Comandos úteis
```powershell
# Deploy preview (staging)
npm run deploy:preview

# Deploy produção
npm run deploy

# Ver logs
vercel logs
```

## Suporte
Se tiver problemas:
1. Verifique o arquivo `DEPLOYMENT_GUIDE.md` para soluções detalhadas
2. Certifique-se que o build local funciona: `npm run build`
3. Confirme as variáveis de ambiente no Vercel Dashboard

**Tempo estimado**: 5 minutos ⏱️