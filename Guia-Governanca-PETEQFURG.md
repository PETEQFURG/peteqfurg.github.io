# Guia de Governança e Publicação — PET/EQ - FURG (GitHub)

> **Objetivo**: documentar como manter o repositório do site do PET/EQ – FURG com segurança, rastreabilidade e publicação via GitHub Pages.  
> **Escopo**: organização no GitHub, times, permissões, proteção de branch, revisões, Pages e (opcional) domínio próprio.

---

## 1) Organização no GitHub
- **Criar a organização**: GitHub → Your organizations → New organization → _A business or institution_.  
  Nome de exibição pode ser “PET/EQ - FURG”. O **handle** (slug) sem espaços/acentos será usado na URL; ex.: **PETEQFURG** → `https://github.com/PETEQFURG`.
- **Transferir o repositório do site**: no repositório atual → Settings → *Danger Zone* → **Transfer ownership** → selecione a organização.

> **Importante**: confirme o *handle* real da organização (o que aparece na URL) — usaremos esse valor nos arquivos e menções de times (`@ORG/TEAM`).

---

## 2) Segurança da organização
1. **2FA obrigatório**: Organization → Settings → Security → _Require two‑factor authentication_.  
2. **Privilégios de membros** (Organization → Settings → Member privileges/Policies):  
   - Base permission: **Read** (ou **None**, se tudo for via times).  
   - **Desmarcar** “Allow members to change repository visibilities”.  
   - **Desmarcar** “Allow members to delete or transfer repositories”.  
3. **Actions** (Organization → Settings → Actions):  
   - **Allow only GitHub and verified actions**.  
   - “Require approval for first‑time contributors”: **On**.

---

## 3) Times e permissões
- **Times sugeridos**  
  - **Admin** (Owners): 1–2 responsáveis (você + backup).  
  - **Web**: manutenção do site; permissão **Maintain** (ou **Write**) no repositório.
- **Parent team**: **não necessário** (deixe vazio) — evita heranças indesejadas.
- **Acesso ao repositório**: Repository → Settings → Collaborators & teams → adicione `Web` com **Maintain**.

---

## 4) GitHub Pages (publicação do site)
1. Repositório do site → **Settings → Pages**  
   - *Build and deployment*: **Deploy from branch**  
   - **Branch**: `main` | **Folder**: `/ (root)`  
   - Ativar **Enforce HTTPS** quando disponível.
2. **URL** final (project site): `https://ORG.github.io/NOME_REPO/`  
   - Ex.: `https://peteqfurg.github.io/PETEQFURG/`
3. **Domínio próprio** (opcional): solicitar CNAME `peteq.furg.br → ORG.github.io`. Instruções no § 8.

> O site já está preparado com **`<base>` dinâmico**: em `*.github.io` + project site, base = `/{repo}/`; fora disso (domínio próprio/servidor), base = `/`.

---

## 5) Proteção de branch (main)
Repositório → Settings → **Branches** → Add rule para `main`:
- ✅ **Require a pull request before merging**  
- ✅ **Require review from Code Owners**  
- ✅ **Dismiss stale reviews**  
- ✅ **Require branches to be up to date**  
- ✅ **Require status checks to pass** (ex.: `build`, `link-check`)  
- ✅ **Include administrators** (evita bypass)  
- ⛔ Proibir *force‑push* (padrão ao ativar o rule)

**Número de reviewers**: é a **quantidade mínima de aprovações** exigida no Pull Request.  
- Para equipe pequena: **1** reviewer.  
- Para conteúdo sensível/produção: **2** reviewers.

---

## 6) Fluxo de trabalho (PR)
1. Crie uma **branch**: `feature/descricao-curta`  
2. Abra um **Pull Request** (PR) para `main`  
3. **Checklist** do PR (veja template no § 7): links testados, carrossel ok, sem arquivos órfãos, etc.  
4. **Revisão** por `Code Owners` (mínimo 1–2 aprovadores).  
5. **Merge** após checks passarem.

---

## 7) Arquivos padrão (modelos)
### a) `CODEOWNERS`
- Controla quem **precisa revisar** mudanças em determinadas pastas/arquivos.
- Exemplo pronto ao final deste documento (ou arquivo separado `CODEOWNERS_example`).

### b) `CONTRIBUTING.md`
- Guia rápido: padrão de branch, como rodar servidor local, como abrir PR.

### c) `SECURITY.md`
- Canal para reporte de vulnerabilidade e boas práticas (sem dados sensíveis).

### d) Template de Pull Request
- Checklist de revisão para garantir qualidade antes do merge.

### e) (Opcional) Workflow de **link‑check**
- CI para verificar links/arquivos internos a cada PR. Exemplo .yml ao final (arquivo `workflow-link-check.yml`).

---

## 8) Domínio próprio (opcional)
**Caminho simples:** subdomínio institucional → GitHub Pages  
1. Mover repo para **Organization**.  
2. Organization → Settings → **Verified domains** (TXT) — opcional.  
3. Repositório → Settings → Pages → **Custom domain**: `peteq.furg.br`.  
4. TI cria **CNAME** `peteq.furg.br → ORG.github.io` e (se solicitado) TXT de verificação.  
5. Marcar **Enforce HTTPS**.

**Caminho rígido:** Proxy institucional na frente do GitHub Pages para aplicar CSP/HSTS (TI gerencia).

---

## 9) Checklist rápido
- [ ] Organização criada (**A business or institution**)  
- [ ] **2FA obrigatório** e Owners com 2FA ativo  
- [ ] **Member privileges** restritos (sem delete/transfer/visibility por Admins)  
- [ ] Times **Admin** e **Web** criados; acessos definidos  
- [ ] Repositório transferido para a org  
- [ ] **Branch protection** ativo em `main` com `Code Owners` e reviewers (= **1** ou **2**)  
- [ ] **GitHub Pages** publicado (`main` / root, HTTPS)  
- [ ] Arquivos padrão (`CODEOWNERS`, `CONTRIBUTING.md`, `SECURITY.md`, template de PR)  
- [ ] (Opcional) **Workflow de link‑check** ativo  
- [ ] (Opcional) **Domínio próprio** solicitado à TI

---

## 10) Anexos — Exemplos

### A) Exemplo de `CODEOWNERS`
```
# Substitua ORG pelo handle real da organização (sem espaços/acentos).
# Donos por padrão (qualquer arquivo)
* @PETEQFURG/web @PETEQFURG/admin

# Áreas do site
assets/** @PETEQFURG/web
paginas/** @PETEQFURG/web
```

### B) Template de Pull Request (`.github/PULL_REQUEST_TEMPLATE.md`)
```
## Descrição
- [ ] Mudança de conteúdo
- [ ] Ajuste visual/CSS
- [ ] Infra (build, CI, links)

## Checklist
- [ ] Testei localmente (servidor HTTP)
- [ ] Imagens/ícones carregam em subpáginas
- [ ] Carrossel abre e fecha sem erros no console
- [ ] Sem caminhos absolutos "/" ou "\" (usar relativos)
- [ ] Sem arquivos órfãos
- [ ] PR sem arquivos binários desnecessários

## Screenshots (se aplicável)

## Issue relacionada (se houver)
```

### C) `CONTRIBUTING.md` (trecho)
```
## Como contribuir
1. Crie uma branch a partir de `main`:
   git checkout -b feature/descricao-curta
2. Rode localmente:
   cd PETEQFURG && python -m http.server 8080
   Abra http://localhost:8080/
3. Abra um PR e solicite revisão dos Code Owners.

Padrão de commits:
- feat:, fix:, docs:, style:, refactor:, chore:
```

### D) `SECURITY.md` (trecho)
```
## Reporte de segurança
Se você identificar uma vulnerabilidade, NÃO abra issue pública.
Envie e-mail para: pet.eq@furg.br (ou canal interno).
Não coletamos dados sensíveis; o site é estático (GitHub Pages).
```

### E) Workflow de link‑check (exemplo simples)
```yaml
name: link-check
on:
  pull_request:
  push:
    branches: [ "main" ]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verificar links internos
        uses: lycheeverse/lychee-action@v1
        with:
          args: --no-progress --base . ./
        env:
          GITHUB_TOKEN: ${{{{ secrets.GITHUB_TOKEN }}}}
```

---

## 11) Snippet do `<base>` dinâmico (já aplicado nas páginas)
```html
<script>
(function () {{
  var repo = "PETEQFURG";
  var isGH = location.hostname.endsWith("github.io");
  var seg1 = location.pathname.split("/")[1];
  var isProject = isGH && (seg1 === repo);
  var base = isProject ? ("/" + repo + "/") : "/";
  var e = document.createElement("base");
  e.href = base;
  document.head.prepend(e);
}})();
</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
```
