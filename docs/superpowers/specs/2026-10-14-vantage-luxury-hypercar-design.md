# VANTAGE — direção da landing page

## Intenção

Apresentar a VANTAGE como uma fabricante fictícia de hypercars de produção limitada. A página deve fazer o visitante sentir que está diante de um objeto de engenharia raro e então convidá-lo a solicitar uma apresentação privada. O idioma escolhido pelo usuário é português; o idioma inicial do site deve ser português.

## Metas

- Criar uma landing page original, cinematográfica, responsiva e acessível.
- Apresentar uma coleção curta e coerente, com design, engenharia, materiais, desempenho e processo de aquisição privado.
- Produzir imagens originais da VANTAGE para hero e seções de produto.
- Deixar a área hero pronta para receber um vídeo que o usuário gerará separadamente.
- Aplicar parallax sutil às imagens principais, sem comprometer leitura, estabilidade ou acessibilidade.

## Fora de escopo

- Checkout, cotação, CRM, cadastro ou formulário conectado a um serviço real.
- Interação 3D e dependências de animação. O movimento deve vir de CSS e JavaScript nativos apenas onde servir à narrativa.
- Inventar métricas de desempenho como especificações reais. Números apresentados serão identificados como ficcionais ou a página usará descrições qualitativas.

## Referências observadas

- **Apple iPhone 18 Pro, cópia local:** produto isolado em campo escuro, silhueta tratada como protagonista e transições que alternam visão geral e detalhe. A VANTAGE pode aplicar a mesma clareza de foco, com fotografia automotiva e edição editorial próprias.
- **Rolls-Royce, cópia local:** enquadramentos largos, exploração de superfícies e acabamentos, luz controlada sobre pintura escura e detalhes de fabricação. A VANTAGE pode aproveitar o ritmo lento e tátil, sem adotar símbolos, paleta, lettering ou linguagem de carroceria da Rolls-Royce.
- As cópias arquivadas contêm código de reprodução e arquivos de terceiros. O exame foi visual/read-only; nenhum script dessas referências será incorporado ou executado no projeto.

## Sistema visual proposto

### Paleta

- Obsidiana — `#0B0D0F`, fundo principal.
- Grafite — `#202427`, blocos secundários e recortes.
- Titânio — `#B8BEC0`, cor do veículo e elementos metálicos.
- Névoa — `#E8E9E6`, texto principal em superfícies escuras.
- Ardósia — `#777F82`, texto auxiliar e contornos.
- Verde mineral — `#82918A`, único acento, usado com parcimônia em estados de interação e pequenos detalhes.

### Tipografia

- **Instrument Serif** para títulos editoriais grandes, com caixa normal e contraste de escala.
- **Manrope** para navegação, corpo e informação funcional.
- Alinhamento à esquerda na narrativa; centralização reservada a um único momento de produto. Evitar pequenas etiquetas em caixa alta repetidas.

### Layout e ritmo

- Canvas escuro de largura total; conteúdo em coluna editorial de até 1.300 px, com margens fluidas.
- Fotografias 16:9 ou 2:1 com o veículo deslocado do centro para liberar área de texto.
- Alternar panoramas e enquadramentos de detalhe; evitar coleções de cards repetidos.
- Hero ocupa a altura da primeira dobra, com navegação discreta, texto em baixo à esquerda e indicação sutil de rolagem.
- Espaçamento amplo em desktop; recortes de imagem verticais e texto alinhado à esquerda em telas estreitas.

Wireframe conceitual:

```text
┌──────────────────────────────────────────────────────────┐
│ VANTAGE                         Modelos  Manifesto  [↗]  │
│                                                          │
│               imagem panorâmica do hypercar              │
│                                                          │
│ Um novo ponto de vista.                    [scroll ↓]    │
│ VANTAGE AURELION                                        │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Design                                                    │
│ imagem de carroceria         Forma em tensão.             │
│                              Aerodinâmica sem excesso.    │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Engenharia / imagem macro de fibra de carbono e metal    │
│ massa visual                             texto curto      │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ A coleção — Aurelion / Serein / Éclipse                   │
│ composição tipográfica e imagens assimétricas             │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Produção limitada · atendimento privado · convite CTA    │
└──────────────────────────────────────────────────────────┘
```

Os nomes dos modelos são propostas criativas. A especificação recomenda três variantes da mesma linguagem visual: **Aurelion** (grand tourer de velocidade), **Serein** (configuração de pista) e **Éclipse** (série artesanal de produção mínima). Não haverá alegações numéricas de performance.

## Experiência e movimento

- Uma única entrada coreografada no hero: texto e marca surgem em sequência curta sobre imagem estática, sem bloquear leitura.
- Revelações de seção suaves e discretas, somente quando entram na área visível; `prefers-reduced-motion` desativa movimento não essencial.
- Navegação por âncoras, foco visível, alvos confortáveis ao toque, texto alternativo e sem overflow horizontal.
- CTA “Solicitar uma apresentação privada” percorre até o convite final na própria página. Sem redirecionamento externo, coleta ou envio de dados: é um projeto pessoal.
- Parallax com deslocamento pequeno numa camada de imagem (`transform`), sem prender a rolagem nem animar layout. Em mobile, amplitude reduzida; com `prefers-reduced-motion`, imagens estáticas.

## Imagens e vídeo

Imagens originais foram geradas e refinadas durante a implementação. A página alterna fotografia panorâmica, detalhes de carroceria, motor V12, cockpit de condução à esquerda e cenas em ambientes distintos. O emblema VANTAGE aparece em pontos físicos do carro, como volante e para-choque; as imagens não usam marcas de fabricantes reais. A imagem de encerramento mostra o hypercar diante de um arco de pedra ao amanhecer, com o slogan **“O horizonte não é um limite.”**

O vídeo `public/comercial.mp4` aparece depois das especificações e antes da seção Atelier, com zoom guiado pela rolagem. Essa posição transforma a passagem da engenharia para a personalização em um momento de experiência, deixando a imagem e o slogan do horizonte como fechamento visual da página.

## Implementação e validação

- Usar Astro.js e manter as dependências atuais, sem framework ou biblioteca adicional.
- Implementar a página numa rota existente em Astro e manter interações básicas em HTML/CSS/JavaScript nativos.
- Depois da aprovação: gerar e comprimir imagens, implementar a página, iniciar Astro conforme `AGENTS.md`, revisar em navegador nos tamanhos desktop e mobile, corrigir problemas visuais e executar o build de produção.

## Aprovações do usuário já recebidas

- Idioma escolhido no conjunto de respostas mais recente: português.
- Direção: prata e grafite com hypercar escultural.
- Hero em imagem cinematográfica de tela cheia.
- Conversão: solicitar apresentação privada.
- O CTA permanece dentro da página, sem redirecionamento externo ou envio de dados.
- Projeto pessoal com aparência e acabamento profissionais.
- Astro.js é o framework requerido; parallax faz parte da experiência.

Os nomes, conceitos de coleção, fontes, chamadas e estrutura visual desta especificação foram aceitos pelo usuário junto com a solicitação para implementar em Astro.
