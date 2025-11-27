# JR Segurança - Landing Page

Layout responsivo e moderno inspirado na estrutura do site solicitado, com código e conteúdo originais. Use este projeto como base para personalizar cores, textos e imagens da sua empresa. **Todos os arquivos públicos que vão para o GitHub Pages estão dentro da pasta `docs/`.**

## Páginas incluídas
- `docs/index.html` — Landing page com hero, serviços, sobre, logos e CTA
- `docs/servicos.html` — Visão geral de serviços e ofertas
- `docs/treinamentos.html` — Lista de treinamentos (NRs)
- `docs/sobre.html` — Sobre a empresa
- `docs/contato.html` — Formulário de contato

## Seções incluídas na landing (index)
- Topbar com contato e redes sociais
- Cabeçalho fixo com navegação (menu mobile + link ativo)
- Hero com título, subtítulo e CTAs
- Grade de serviços (cards)
- Seção "Sobre" com checklist
- Logotipos de clientes/parceiros
- CTA de newsletter
- Rodapé com contato e links

## Como usar
Abra o arquivo `docs/index.html` no navegador. Não há dependências externas.

## Personalização rápida
- Cores: edite variáveis em `docs/assets/css/styles.css` (ex: `--brand`)
- Tipografia e espaçamentos: também em `styles.css`
- Textos e links: edite diretamente `docs/index.html`
- Logo e imagens: substitua marcadores por imagens reais em `docs/assets/img/`
 - Navegação: os links já apontam para as páginas internas; ajuste nomes conforme necessário

## Branding com seu PDF
- Ajuste a paleta e cantos em `docs/assets/css/brand.css` (este arquivo sobrescreve as variáveis padrões de `styles.css`).
- Use `brand-preview.html` para testar cores e copiar o snippet gerado para dentro do `brand.css`.
- Para fontes, substitua `--font-sans` pelo nome da fonte do seu PDF e adicione um `@font-face` se tiver arquivos `.woff2`.

## Observações de direitos autorais
Este projeto não copia código, textos ou imagens do site de referência. É um layout original inspirado apenas em sua estrutura público-visível.
