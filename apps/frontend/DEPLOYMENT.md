# Deployment Guide - Financial Center Frontend

Instruções para deployar o frontend em produção.

## Pré-requisitos Verificados

- ✅ TypeScript sem erros (`npm run typecheck`)
- ✅ ESLint passando (`npm run lint`)
- ✅ Todos os componentes funcionando
- ✅ Responsividade testada (mobile/tablet/desktop)
- ✅ Acessibilidade básica (WCAG AA)

## Build para Produção

### 1. Preparar o Build

```bash
cd apps/frontend

# Instalar dependências
npm install

# Gerar CSS dos tokens
npm run tokens:build

# Verificar tipos
npm run typecheck

# Linting
npm run lint

# Build de produção
npm run build
```

### 2. Estrutura do Build

```
dist/
├── index.html
├── assets/
│   ├── index-XXXXX.js (bundle principal)
│   ├── style-XXXXX.css (CSS bundle)
│   └── favicon.ico
```

### 3. Verificar Build

```bash
# Preview local
npm run preview

# Verificar tamanho
ls -lh dist/
```

**Tamanhos esperados:**
- HTML: ~5KB
- JS: ~50-100KB (gzipped)
- CSS: ~30-50KB (gzipped)

## Deployment Options

### Option 1: Vercel (Recomendado)

Vercel é otimizado para Next.js/Vite e oferece:
- Deploy automático via Git
- Preview deployments
- Analytics
- Edge functions
- CDN global

**Passos:**

1. **Conectar repositório**
   ```bash
   vercel link
   ```

2. **Configurar projeto** (se necessário)
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

4. **Variáveis de ambiente** (em Vercel Dashboard)
   - `VITE_API_URL`: URL do backend
   - Outras conforme necessário

### Option 2: Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos
COPY package*.json ./
COPY apps/frontend ./

# Build
RUN npm install
RUN npm run tokens:build
RUN npm run build

# Runtime
FROM node:18-alpine

WORKDIR /app

# Usar nginx para servir arquivos estáticos
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

**Build e deploy:**

```bash
docker build -t financial-center-frontend .
docker run -p 80:80 financial-center-frontend
```

### Option 3: Netlify

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deploy:**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 4: GitHub Pages

Para deploy simples em `/repo`:

**vite.config.ts:**

```typescript
export default defineConfig({
  base: '/financial-center/',
  // ...
})
```

**Deploy:**

```bash
npm run build
# Copiar dist/ para docs/ ou gh-pages branch
```

## Variáveis de Ambiente

### Development

Criar `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
```

### Production

Definir em plataforma de hosting:

```env
VITE_API_URL=https://api.financialcenter.com
VITE_DEBUG=false
```

## Checklist de Deployment

- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Build completa sem erros
- [ ] Bundle size dentro do esperado
- [ ] Tokens CSS gerados
- [ ] Variáveis de ambiente configuradas
- [ ] API URL apontando para produção
- [ ] Assets otimizados
- [ ] Service Worker (se PWA)
- [ ] robots.txt configurado
- [ ] sitemap.xml criado
- [ ] Redirects/rewrites configurados

## Verificações Pós-Deploy

### 1. Health Check

```bash
curl https://seu-domain.com

# Deve retornar HTML válido
```

### 2. Performance

- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### 3. Funcionalidade

- [ ] Todas as 4 páginas carregando
- [ ] Responsividade em mobile
- [ ] Navegação funcionando
- [ ] Assets carregando

### 4. Segurança

- [ ] HTTPS habilitado
- [ ] Headers de segurança
- [ ] CORS configurado
- [ ] CSP policy ativa

## Monitoramento

### Recomendado

1. **Error Tracking**: Sentry
   ```
   npm install @sentry/react
   ```

2. **Analytics**: Vercel Analytics ou Google Analytics

3. **Performance**: Web Vitals
   ```
   npm install web-vitals
   ```

4. **Logs**: Datadog ou similar

## Troubleshooting

### Build falha

```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run tokens:build
npm run build
```

### CSS não carrega

Verificar:
- [ ] `tokens.css` foi gerado
- [ ] Import de `index.css` em `main.tsx`
- [ ] Base path correto em `vite.config.ts`

### API não conecta

Verificar:
- [ ] `VITE_API_URL` configurada
- [ ] CORS habilitado no backend
- [ ] URLs de ambiente corretas

### 404 em refresh

Configurar rewrites:
- **Vercel**: Automático
- **Netlify**: Adicionar em `netlify.toml`
- **Nginx**: Adicionar `try_files`

## Rollback

### Vercel

```bash
vercel rollback
```

### Docker

```bash
# Voltar para versão anterior
docker pull financial-center-frontend:latest
docker run -p 80:80 financial-center-frontend:latest
```

### Git

```bash
git revert HEAD
git push
```

## Performance Optimization

### Já implementado

- ✅ CSS otimizado (variáveis reutilizadas)
- ✅ Componentes pequenos
- ✅ Sem dependências desnecessárias
- ✅ Responsive design (mobile-first)

### Próximos passos

1. **Code splitting**
   ```typescript
   const Dashboard = lazy(() => import('./features/dashboard/DashboardPage'));
   ```

2. **Image optimization**
   ```tsx
   <img src="..." alt="..." loading="lazy" />
   ```

3. **Route prefetching**
   ```tsx
   <link rel="prefetch" href="/personal" />
   ```

4. **Bundle analysis**
   ```bash
   npm install -D rollup-plugin-visualizer
   ```

## Maintenance

### Atualizações

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar pacotes
npm update

# Atualizar major versions
npm install package@latest
```

### Limpeza Regular

```bash
# Remover arquivos antigos
find dist -type f -mtime +30 -delete

# Limpar cache
npm cache clean --force
```

## Contatos e Suporte

- **Frontend Issues**: [Repositório GitHub](https://github.com/seu-org/financial-center)
- **Deployment Issues**: Vercel/Netlify/seu provider
- **Backend API**: [URL da documentação API](https://docs.sua-api.com)

---

**Status**: Production Ready
**Última atualização**: 2024
**Maintainer**: v0

Para dúvidas ou sugestões, abra uma issue no repositório.
