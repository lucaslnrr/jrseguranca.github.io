# JR Segurança - Landing Page

Landing page estática para a JR Segurança, com foco em apresentação institucional, serviços de SST e captação de leads.

## Páginas incluídas (dentro de `docs/`)
- `docs/index.html` — Landing page principal com hero, serviços e formulário de proposta
- `docs/servicos.html` — Painel com principais soluções entregues
- `docs/treinamentos.html` — Catálogo dos treinamentos e NRs atendidos
- `docs/sobre.html` — Propósito, equipe e diferenciais
- `docs/contato.html` — Formulário dedicado e canais diretos

## Estrutura
- Cabeçalho fixo com navegação responsiva e menu mobile
- Componentes reutilizáveis em `docs/assets/css/styles.css` e `docs/assets/js/main.js`
- Branding separado em `docs/assets/css/brand.css` para ajustes rápidos de cores e fontes
- Recursos estáticos (imagens, PDFs e scripts auxiliares) organizados sob `docs/`

## Como personalizar
1. Atualize textos diretamente nos arquivos `.html` dentro de `docs/`.
2. Ajuste cores, espaçamentos e tipografia nas variáveis de `docs/assets/css/styles.css`.
3. Use `docs/assets/css/brand.css` para sobrescrever a paleta da JR Segurança sem afetar o restante do tema.
4. Substitua as imagens em `docs/assets/img/`, mantendo os mesmos nomes ou atualize os caminhos nos HTMLs.

## Hospedagem
- O repositório `jrseguranca.github.io` publica via GitHub Pages usando o diretório `docs/` como fonte.
- O arquivo `docs/CNAME` mantém o domínio personalizado `www.jrseguranca.com` e `docs/.nojekyll` garante que o Jekyll não processe os arquivos estáticos.

## Direitos autorais
Todo o layout, cópia e código foram produzidos exclusivamente para a JR Segurança e podem ser adaptados conforme necessário.
