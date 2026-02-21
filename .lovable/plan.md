
# Correcao da Tela Branca no /admin

## Diagnostico

Analisando o codigo, identifiquei as seguintes causas provaveis da tela branca no primeiro acesso:

1. **Race condition no AuthContext**: O `onAuthStateChange` pode disparar com `INITIAL_SESSION` antes do `getSession` resolver, causando um estado intermediario onde `loading` ja e `false` mas o perfil/roles ainda nao carregaram.
2. **Ausencia de Error Boundary**: Qualquer erro silencioso na renderizacao (ex: Recharts com container de tamanho zero) causa tela branca sem feedback.
3. **Sem verificacao de autenticacao**: A pagina /admin renderiza sem confirmar se o usuario esta logado, podendo acessar dados nulos.
4. **Layout `overflow-hidden`**: O container `flex overflow-hidden` pode causar altura zero no primeiro render se o layout nao estiver calculado.

## Plano de Implementacao

### 1. Criar componente ErrorBoundary reutilizavel
**Arquivo**: `src/components/ErrorBoundary.tsx`

- Class component React com `componentDidCatch`
- Estado `hasError` que exibe mensagem "Algo deu errado. Recarregue a pagina." com botao "Recarregar" (`window.location.reload()`)
- Estilo: card centralizado no meio da tela, fundo `#F8FAFC`

### 2. Corrigir race condition no AuthContext
**Arquivo**: `src/contexts/AuthContext.tsx`

- Mover `setLoading(false)` para ser chamado apenas apos `fetchProfile` completar (ou apos confirmar que nao ha sessao)
- No `onAuthStateChange`: so setar loading false se o evento nao for `INITIAL_SESSION` (pois `getSession` ja cuida disso)
- Garantir que `loading` so vira `false` quando todos os dados estiverem prontos

### 3. Adicionar protecao de rota e skeleton loader no Admin
**Arquivo**: `src/pages/Admin.tsx`

- Verificar `user` alem de `loading`: se `!loading && !user`, redirecionar para `/login`
- Substituir o spinner simples por skeleton loaders (usando o componente `Skeleton` ja existente):
  - 4 skeleton cards na linha 1
  - 1 skeleton retangulo para o grafico + 1 para lista de clientes
  - 3 skeleton cards na linha 3
- Envolver o conteudo inteiro com o `ErrorBoundary`

### 4. Aplicar mesma protecao no Financeiro
**Arquivo**: `src/pages/admin/Financeiro.tsx`

- Adicionar verificacao de auth + skeleton loader + ErrorBoundary

### 5. Garantir defaults seguros nos dados mockados
- Todos os arrays (`revenueData`, `clients`) ja estao definidos como constantes fora do componente, entao nao ha risco de `undefined`
- Adicionar fallback `|| []` e `|| 0` onde valores dinamicos forem usados futuramente

---

### Detalhes Tecnicos

**ErrorBoundary** (class component obrigatorio para `componentDidCatch`):
```text
componentDidCatch(error, info) -> setState({ hasError: true })
render() -> hasError ? fallback UI : children
```

**Skeleton Layout do Admin** (exibido enquanto `loading === true`):
```text
+----------------------------------+
| Navbar                           |
+--------+-------------------------+
| Sidebar| [====] [====] [====] [====]  <- 4 skeleton cards
|        | [===========] [=======]      <- chart + clients
|        | [====] [====] [====]         <- growth cards
+--------+-------------------------+
```

**Fluxo de auth corrigido**:
```text
1. loading = true (tela mostra skeletons)
2. getSession() resolve
3. Se tem sessao -> fetchProfile() -> setLoading(false)
4. Se nao tem sessao -> setLoading(false) -> redirect /login
```
