# Guia de Deploy no Vercel

## 🚀 Como Hospedar seu Portfólio no Vercel

### Método 1: Deploy Automático via CLI (Recomendado)

#### 1. Instalar Vercel CLI
```bash
npm i -g vercel
```

#### 2. Fazer Deploy
```bash
# Na raiz do projeto
vercel --prod
```

#### 3. Configurar Variáveis de Ambiente
Durante o processo, o CLI vai perguntar sobre as variáveis. Configure:
- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Chave pública do Supabase

### Método 2: Deploy via Dashboard Web

#### 1. Preparar o Projeto
```bash
# Build local para verificar
npm run build
```

#### 2. Importar no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: Pegue do arquivo `.env`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Pegue do arquivo `.env`

#### 3. Deploy Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Método 3: Deploy com GitHub Actions (CI/CD)

#### 1. Criar Workflow
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Configuração de Variáveis de Ambiente

#### No Vercel Dashboard:
1. Vá para Settings > Environment Variables
2. Adicione:
   - `VITE_SUPABASE_URL`: `https://wasyffceigndovssyjis.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Via CLI:
```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
```

### Verificar Deploy

#### Health Check
Após o deploy, acesse:
- `https://seu-dominio.vercel.app/health` - Status do servidor
- `https://seu-dominio.vercel.app` - Site principal

#### Testar Funcionalidades
1. Verificar se o banco de dados está conectado
2. Testar formulário de contato
3. Verificar seções de projetos e experiências
4. Testar modo dark/light

### Troubleshooting

#### Erro de Build
Se o build falhar:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Erro de CORS no Supabase
No dashboard do Supabase:
1. Vá para Settings > API
2. Adicione seu domínio Vercel nos "Allowed Origins"

#### Variáveis Não Carregando
Certifique-se de que as variáveis no Vercel começam com `VITE_` para serem acessíveis no frontend.

### Comandos Úteis

```bash
# Deploy para staging
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs

# Atualizar projeto
vercel --prod
```

### URLs Importantes
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação**: https://vercel.com/docs
- **GitHub Integration**: https://vercel.com/docs/concepts/git

### Próximos Passos
1. Configurar domínio personalizado (opcional)
2. Ativar analytics do Vercel
3. Configurar preview deployments
4. Adicionar monitoramento com o dashboard já criado

---
**Data de Atualização**: $(date)
**Versão**: 1.0