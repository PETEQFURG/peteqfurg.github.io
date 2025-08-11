# Site PET/EQ – FURG (Organização **PETEQFURG**)

Este repositório contém o site estático do PET/EQ – FURG, publicado via **GitHub Pages**.

## 💡 Visão geral
- **Hospedagem**: GitHub Pages (deploy from branch: `main` / root).
- **CI obrigatória**: `build-static` (gera `dist/` e faz checagens) + `link-check` (verifica links internos).
- **Revisão**: PRs exigem aprovação de **Code Owners** (1–2 revisores).

---

## 📁 Estrutura recomendada
```
/assets/
  css/
  js/
  img/
/paginas/
index.html
```
> **Padrão de caminhos (HTML):** use `assets/...` e `paginas/...` (sem `/` inicial e sem `../`).  
> **No CSS**, `url(...)` é relativo ao próprio arquivo CSS (ex.: de `assets/css/` para `assets/img/`: `url("../img/figura.png")`).

---

## ▶️ Rodando localmente
Requer apenas Python (ou outro servidor estático).

```bash
cd PETEQFURG
python -m http.server 8080
# acesse http://localhost:8080/
```

> O site já inclui um **`<base>` dinâmico**: em `github.io` (project site) usa `"/PETEQFURG/"`; local ou domínio próprio usa `"/"`.

---

## 🧑‍💻 Como contribuir
1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feature/descricao-curta
   ```
2. Faça as alterações e teste localmente.
3. Abra um **Pull Request** para `main`.
4. Preencha o **template de PR** e aguarde revisão dos **Code Owners**.

### Convenção de commits (sugestão)
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`

---

## 🔁 Fluxo de PR e checks
- **Branch protection** em `main` exige:
  - Pull Request antes do merge;
  - Review de Code Owners (1–2 aprovadores);
  - Branch atualizada com `main`;
  - Status checks obrigatórios:
    - **build-static**: copia o site para `dist/`, cria `.nojekyll` e falha se houver problemas simples (ex.: `\` em caminhos HTML). Publica artefato `site-dist`.
    - **link-check**: valida links/arquivos internos.

---

## 🌐 Publicação (GitHub Pages)
- Repositório → **Settings → Pages** → **Deploy from branch** → Branch `main` / Folder `/ (root)`.
- Marque **Enforce HTTPS**.

> Se futuramente usar **domínio próprio** (ex.: `peteq.furg.br`), basta configurar o **Custom domain** em Pages e pedir o CNAME para a TI. O `<base>` dinâmico já funciona com domínio próprio.

---

## 🖼️ Imagens, ícones e carrosséis
- **Evite** barras invertidas: use `/` (ex.: `assets/img/logo.svg`).
- **Evite** caminhos absolutos (`/assets/...`) – quebram em project sites.
- **Case-sensitive**: `Logo.svg` ≠ `logo.svg` no Pages.
- Verifique no DevTools → **Network** o **Request URL** de imagens que não aparecem; ajuste o caminho conforme a estrutura.

---

## 🛠️ Snippet do `<base>` dinâmico (referência)
> Já está inserido no `<head>` das páginas. Não duplique.
```html
<script>
(function () {
  var repo = "PETEQFURG";
  var isGH = location.hostname.endsWith("github.io");
  var seg1 = location.pathname.split("/")[1];
  var isProject = isGH && (seg1 === repo);
  var base = isProject ? ("/" + repo + "/") : "/";
  var e = document.createElement("base");
  e.href = base;
  document.head.prepend(e);
})();
</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## ❓ Troubleshooting rápido
- **Erro 404 em logos/ícones**: caminho errado, barra invertida, `/` inicial, ou diferença de maiúsculas/minúsculas.
- **Imagem via CSS não aparece**: ajuste `url("../img/...")` relativo ao arquivo CSS.
- **Página interna sem estilos**: verifique `href` do CSS (deve ser `assets/css/...`, sem `/` inicial).

---

## 👥 Governança
- Organization: **PETEQFURG** (2FA obrigatório).
- Times: **Admin** (Owners) e **Web** (Maintain/Write).
- Arquivos úteis no repo: `CODEOWNERS`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/PULL_REQUEST_TEMPLATE.md`.

---

## 📬 Contato
Dúvidas e melhorias: abra um **Issue** ou PR. Para segurança, siga `SECURITY.md`.
<! -- pr test -->
<! -- pr test test  -->
