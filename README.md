# grupo3_pfe_2026.1-code

Projeto acadêmico de front-end desenvolvido para a empresa ACBrasil, com foco na construção da interface visual, da navegação e da apresentação institucional da marca. Nesta etapa, o repositório concentra páginas em HTML, estilos em CSS e scripts em JavaScript puro, sem uso de framework.

O objetivo principal é representar a identidade da ACBrasil em uma experiência responsiva, organizada e consistente, com páginas para apresentação institucional, blog, eventos, contato, cadastro, login, área de membros e detalhes de associados fundadores.

## Visão Geral

- `index.html` funciona como a página inicial do site.
- A pasta `views/` concentra as páginas internas do projeto.
- A pasta `assets/` armazena arquivos estáticos reutilizáveis, como estilos globais, imagens e documentos.
- A pasta `src/` organiza os estilos específicos, módulos JavaScript e integrações com APIs.
- A pasta `js/` reúne scripts compartilhados usados diretamente pelas páginas HTML.

## Estrutura do Projeto

```text
grupo3_pfe_2026.1-code/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── global.css
│   ├── docs/
│   │   ├── politica-cookies.pdf
│   │   └── politica-privacidade.pdf
│   └── images/
│       ├── associados-fundadores/
│       ├── backgrounds/
│       ├── associao_dos_conselheiros_do_brasil_cover.jpg
│       ├── equipe.jpg
│       ├── fundo-hero-quem-somos.jpg
│       ├── fundo-hero.jpg
│       ├── fundo-zul.jpg
│       ├── logo-acb.png
│       ├── Logo_acbrasil.png
│       ├── money.jpg
│       ├── page-top-bg.png
│       └── reuniao-quem-somos.jpg
├── js/
│   ├── form-validation.js
│   ├── navbar.js
│   └── script.js
├── src/
│   ├── api/
│   │   ├── client.js
│   │   ├── indicators.js
│   │   ├── indicatorsApi.js
│   │   └── wordpress.js
│   ├── css/
│   │   ├── blog.css
│   │   ├── cadastro.css
│   │   ├── contato.css
│   │   ├── eventos.css
│   │   ├── home.css
│   │   ├── login.css
│   │   ├── membros.css
│   │   └── quemsomos.css
│   └── js/
│       ├── blog.js
│       ├── dados-membros.js
│       ├── dados-youtube.js
│       ├── indicadores.js
│       ├── quemsomos.js
│       ├── videos.js
│       └── webinars.js
├── views/
│   ├── blog-post.html
│   ├── blog.html
│   ├── cadastro.html
│   ├── contato.html
│   ├── eventos.html
│   ├── fundador.html
│   ├── login.html
│   ├── membros.html
│   └── quemsomos.html
└── .vscode/
	└── settings.json
```

### Raiz do projeto

- `index.html`: página inicial da ACBrasil, com hero, indicadores, destaque de webinars, blog/newsletter e bloco de associação.
- `README.md`: documentação geral do repositório, estrutura e objetivo do projeto.

### `views/`

Pasta com as páginas principais do site.

- `blog.html`: listagem principal de artigos e conteúdos do blog.
- `blog-post.html`: página de detalhe de uma postagem individual do blog.
- `cadastro.html`: formulário de associação/cadastro com modalidades e FAQ.
- `contato.html`: página de contato com canais, formulário, FAQ e informações institucionais.
- `eventos.html`: página de webinars/eventos, com lista de conteúdos e formulário para receber avisos.
- `fundador.html`: página de detalhe de um associado fundador.
- `login.html`: página de autenticação para associados.
- `membros.html`: área de membros com login e conteúdo de acesso restrito.
- `quemsomos.html`: página institucional “Quem somos”, com história, missão, pilares, fundadores e redes sociais.

### `assets/`

Arquivos estáticos compartilhados e reutilizáveis.

- `assets/css/`: estilos globais compartilhados.
- `assets/css/global.css`: reset, variáveis, tipografia base, cabeçalho, botões, footer e utilitários comuns.
- `assets/docs/`: documentos institucionais em PDF.
- `assets/docs/politica-privacidade.pdf`: política de privacidade do projeto.
- `assets/docs/politica-cookies.pdf`: política de cookies do projeto.
- `assets/images/`: imagens e mídias usadas nas páginas.
- `assets/images/associao_dos_conselheiros_do_brasil_cover.jpg`: capa institucional.
- `assets/images/equipe.jpg`: imagem de equipe usada em seções institucionais.
- `assets/images/fundo-hero.jpg`: fundo de hero usado em páginas com destaque.
- `assets/images/fundo-hero-quem-somos.jpg`: fundo do hero de “Quem somos”.
- `assets/images/fundo-zul.jpg`: variação de fundo azul para banners.
- `assets/images/logo-acb.png`: logotipo principal da ACBrasil.
- `assets/images/Logo_acbrasil.png`: variação do logotipo.
- `assets/images/money.jpg`: imagem usada como placeholder/carregamento de indicadores.
- `assets/images/page-top-bg.png`: arte de apoio para topo de páginas.
- `assets/images/reuniao-quem-somos.jpg`: imagem institucional da seção de missão.
- `assets/images/associados-fundadores/`: fotos individuais dos associados fundadores.
- `assets/images/backgrounds/`: imagens de fundo usadas nos heros e seções de destaque.

### `src/`

Pasta com a implementação modular da interface e das integrações.

- `src/api/`: definições de endpoints e consumo de dados externos.
- `src/api/client.js`: base URL do WordPress/CMS da ACBrasil.
- `src/api/indicators.js`: URLs das séries e indicadores econômicos consumidos pelo projeto.
- `src/api/indicatorsApi.js`: endpoint(s) e abstrações auxiliares para indicadores.
- `src/api/wordpress.js`: funções para consultar posts do WordPress.
- `src/css/`: estilos específicos por página.
- `src/css/blog.css`: layout e componentes do blog e da página de postagem.
- `src/css/cadastro.css`: estilos do formulário de associação e seções relacionadas.
- `src/css/contato.css`: estilos da página de contato, canais, formulário e FAQ.
- `src/css/eventos.css`: estilos dos heros, lista de webinars e formulário de novidades.
- `src/css/home.css`: estilos da página inicial.
- `src/css/login.css`: estilos da tela de login.
- `src/css/membros.css`: estilos da área de membros e formulário de login.
- `src/css/quemsomos.css`: estilos da página institucional “Quem somos”, fundadores e redes sociais.
- `src/js/`: módulos JavaScript de conteúdo e renderização.
- `src/js/blog.js`: carrega e renderiza conteúdo do blog.
- `src/js/dados-membros.js`: dados da área de membros ou cards correlatos.
- `src/js/dados-youtube.js`: dados usados para exibir conteúdos do YouTube.
- `src/js/indicadores.js`: lógica de busca e exibição dos indicadores econômicos na home.
- `src/js/quemsomos.js`: renderização dos fundadores e conteúdo institucional de “Quem somos”.
- `src/js/videos.js`: renderização de vídeos/podcasts.
- `src/js/webinars.js`: renderização dos webinars e destaque de eventos.

### `js/`

Scripts compartilhados e carregados diretamente pelas páginas HTML.

- `js/navbar.js`: controla a abertura/fechamento do menu mobile e mantém a navegação responsiva.
- `js/script.js`: inicializador da página inicial, carregando os módulos de blog, vídeos, indicadores e webinars.
- `js/form-validation.js`: biblioteca compartilhada de validações com regex para nome, e-mail, telefone, senha, LinkedIn e seleção de campos.

### `.vscode/`

- `settings.json`: configuração local do editor, incluindo preferência de tema de ícones.

### `.git/`

- Diretório interno do Git, responsável pelo versionamento do projeto. Não faz parte da interface da aplicação.

## Papel de cada parte no fluxo do site

- `global.css` define a base visual comum usada em todas as páginas.
- Os arquivos em `src/css/` refinam o layout de cada página.
- Os arquivos em `src/js/` produzem conteúdo dinâmico e integram APIs externas.
- Os arquivos em `js/` cuidam de comportamento compartilhado, como menu mobile e validação de formulários.
- As páginas em `views/` representam as telas funcionais do site.
- Os ativos em `assets/` suportam o visual e a identidade institucional da ACBrasil.

## Contexto acadêmico

Este repositório faz parte de um trabalho acadêmico de desenvolvimento front-end para a empresa ACBrasil. A proposta é documentar e implementar uma interface institucional clara, responsiva e consistente com a identidade da organização, servindo como base para as próximas etapas do projeto.

## Observações

- O projeto está organizado por responsabilidade: estrutura em HTML, apresentação em CSS, comportamento em JavaScript e integração de dados externos em módulos separados.
- A padronização dos arquivos facilita manutenção, evolução e testes das páginas.
