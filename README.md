# Hadassa — minha princesinha ♡

Site romântico mobile-first feito para Vercel.

## Arquivos
- `index.html`
- `style.css`
- `script.js`

Não precisa de framework, npm ou build.

## Como publicar na Vercel
### Opção 1 — GitHub
1. Crie um repositório.
2. Envie estes três arquivos para a raiz.
3. Na Vercel, clique em **Add New → Project**.
4. Importe o repositório.
5. Framework Preset: **Other**.
6. Build Command: deixe vazio.
7. Output Directory: deixe vazio.
8. Deploy.

### Opção 2 — Vercel CLI
Na pasta do projeto:
```bash
npx vercel
```

## Onde personalizar
No `index.html`, você pode alterar:
- textos da história;
- assinatura `Vi`;
- versículo;
- frase final.

No `script.js`, os três cards de qualidades já puxam os textos diretamente do HTML.

## Funciona melhor no celular porque inclui
- layout `100svh`;
- toque/haptic feedback quando suportado;
- animações por toque;
- pétalas em Canvas;
- efeito sonoro delicado gerado pelo próprio navegador (sem arquivo de áudio);
- envelope interativo;
- animações ao rolar;
- suporte a `prefers-reduced-motion`.

Feito com carinho para Hadassa ♡
