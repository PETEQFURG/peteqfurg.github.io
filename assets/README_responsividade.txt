
PASSO-A-PASSO — Deixar TODAS as páginas responsivas (internas e dimensões)

Arquivos novos (adicione ao seu projeto):
1) assets/css/pet-responsive.css
2) assets/js/pet-nav.js

COMO APLICAR EM CADA PÁGINA:

A) Páginas na raiz (ex.: index.html)
   - No <head>, antes de </head>:
       <link rel="stylesheet" href="assets/css/pet-responsive.css">
   - Antes de </body>:
       <script defer src="assets/js/pet-nav.js"></script>

B) Páginas em /paginas/
   - <head>:
       <link rel="stylesheet" href="../assets/css/pet-responsive.css">
   - </body>:
       <script defer src="../assets/js/pet-nav.js"></script>

C) Páginas em /paginas/dimensoes/
   - <head>:
       <link rel="stylesheet" href="../../assets/css/pet-responsive.css">
   - </body>:
       <script defer src="../../assets/js/pet-nav.js"></script>

IMPORTANTE
- Não é necessário alterar menus/HTML se já estiverem como no index atual.
- O CSS garante:
  • rolagem até o final (inclusive iOS);
  • sidebar sticky no desktop e gaveta no mobile (sem bloquear toques quando fechada);
  • navbar horizontal branca;
  • cabeçalho com UMA linha sob "ENGENHARIA QUÍMICA" e FURG alinhado ao fim;
  • logos do rodapé sem distorção.
- Se alguma página interna não tiver rodapé, a responsividade continua funcionando; o padding-bottom
  em <main> evita cortes no final do conteúdo.

TESTE RÁPIDO (matriz):
- iPhone/Android (<768px): abrir/fechar menu superior e lateral; rolar até o fim.
- iPad (768–1180px): checar centralização visual do cabeçalho e funcionamento dos menus.
- Desktop (≥1280px): sidebar sticky, navbar visível, rolagem normal.

Qualquer página que ainda "corte" o final normalmente tem CSS local com height/overflow.
Nesse caso, remova ou sobrescreva essas duas propriedades nesse container específico.
