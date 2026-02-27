# MetBrasil · Inteligencia Climatica para Esportes

Plataforma brasileira de meteorologia focada em esportes aquaticos e ao ar livre.

**[Acessar Site](https://agente-do-tempo-vibrante.netlify.app)** | **metbrasil.com.br**

---

## Sobre

O **MetBrasil** e uma aplicacao web single-page que oferece dados meteorologicos em tempo real para todo o territorio brasileiro, com foco em esportes aquaticos e ao ar livre. Inspirado nos melhores recursos de SurfGuru, Windy, Windfinder, Windguru, Ventusky, Wisuki e Waves.com.br.

**Stack:** HTML5 + CSS3 + Vanilla JS + Leaflet.js + Open-Meteo API (zero frameworks, zero build)

---

## Sistema de Temas Imersivo

O MetBrasil possui um sistema de temas radicalmente diferente para cada condicao climatica, com transformacoes visuais completas.

### Tema CHUVA
| Elemento | Transformacao |
|----------|---------------|
| Particulas | 200 gotas diagonais com gradiente |
| Efeito Especial | Relampagos aleatorios (flash branco) |
| Cards | Clip-path canto cortado + borda azul esquerda |
| Layout 3D | Shell rotacionado 1deg no eixo X |
| Logo | Animacao glitch |
| Map Tiles | CartoDB Dark Matter |
| Background | `#020810` → `#0a1628` |
| Accent | `#4fc3f7` (cyan) |

### Tema SOL
| Elemento | Transformacao |
|----------|---------------|
| Particulas | 80 orbs dourados pulsantes com glow |
| Efeito Especial | Raios de sol radiais animados |
| Cards | Clip-path angular + borda dourada topo + mega sombra |
| Layout 3D | Shell com scale 1.01 |
| Temperatura | 5.5rem com text-shadow duplo |
| Map Tiles | CartoDB Voyager (claro) |
| Background | `#1a0800` → `#3d1500` |
| Accent | `#ffd54f` (dourado) |

### Tema NUBLADO
| Elemento | Transformacao |
|----------|---------------|
| Particulas | 12 nuvens gigantes em parallax lento |
| Efeito Especial | Nevoa overlay gradient |
| Cards | Clip-path octagonal + glassmorphism blur 30px |
| Layout 3D | Shell com rotacao 0.3deg no eixo Y |
| Estetica | Minimalista, opacity reduzida |
| Map Tiles | CartoDB Positron (cinza) |
| Background | `#0d1117` → `#161b22` |
| Accent | `#8b9dc3` (azul acinzentado) |

### Transicao Cinematografica
- **Wipe Effect**: Cortina vertical cobre a tela durante a troca
- **Duracao**: 800ms com cubic-bezier
- **Map Tiles**: Trocam dinamicamente por tema
- **Particulas**: Reinicializam com fade

### Auto-Selecao por Clima
| Codigo WMO | Condicao | Tema |
|------------|----------|------|
| 0-2 | Ceu limpo / Parcialmente nublado | Sol |
| 3-49 | Nublado / Nevoeiro | Nublado |
| 50+ | Chuva / Neve / Tempestade | Chuva |

---

## Funcionalidades

### Sport Bar (6 Esportes)
- **SURF** - Cor: `#0097a7` (cyan)
- **KITE** - Cor: `#7c4dff` (roxo)
- **WINDSURF** - Cor: `#00897b` (teal)
- **PARAPENTE** - Cor: `#f57c00` (laranja)
- **VELA** - Cor: `#1565c0` (azul)
- **PESCA** - Cor: `#558b2f` (verde)

### Rosa dos Ventos (16 Pontos)
- Direcoes: N, NNE, NE, ENE, L, ESE, SE, SSE, S, SSO, SO, OSO, O, ONO, NO, NNO
- Agulha animada com glow dinamico
- Velocidade do vento em km/h ou nos
- Escala Beaufort textual

### Barra de Rating Kite/Wind (0-10)
- Track com inner shadow
- Fill com gradiente 5 cores + glow
- Animacao cubic-bezier

### Badge de Condicao com Estrelas
| Condicao | Estrelas | Criterio |
|----------|----------|----------|
| EPICO! | 5 | 15-30 km/h, codigo <=3 |
| BOM | 4 | 10-35 km/h, codigo <=10 |
| RAZOAVEL | 3 | >=8 km/h, codigo <=20 |
| SEM VENTO | 2 | <5 km/h |
| FRACO | 1 | Outros casos |
| PERIGOSO | 0 | Tempestade (codigo >=95) |

### Strip Horaria (12h)
- Previsao hora a hora
- Destaque visual no pico de vento
- Hover com translateY

### Tabela de Vento (5 Dias)
Estilo Windguru com fonte Orbitron

### 26 Spots Surfisticos/Esportivos
Jericoacoara, Cumbuco, Prea, Sao Miguel do Gostoso, Atins, Florianopolis, Ilhabela, Buzios, Arraial do Cabo, Saquarema, Itacare, Torres, Garopaba, Ubatuba, Maresias, Guaruja, Itamambuca, Pipa, Fernando de Noronha, Morro de Sao Paulo, Porto de Galinhas, Praia do Forte, Balneario Camboriu, Imbituba, Cabo Frio, Barra Grande PI

### Mapa Interativo
- Tiles dinamicos por tema
- Vinheta cinematografica
- 27 marcadores de estados
- 26 marcadores de spots
- Popup estilizado por tema

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML/CSS/JS | Stack completa (zero frameworks) |
| Leaflet.js | Mapa interativo |
| CartoDB Tiles | 3 estilos por tema |
| Canvas 2D API | Particulas imersivas |
| CSS 3D Transforms | Layout com perspectiva |
| CSS Clip-path | Cards com formas dinamicas |
| CSS Custom Properties | 50+ variaveis por tema |
| Open-Meteo API | Dados meteorologicos |
| ipapi.co | Geolocalizacao por IP |
| Google Fonts | Bebas Neue, Orbitron, Syne |

---

## Layout 3D

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (60px): Logo 3D | Temas | C/F | KM/H/NOS | Relogio   │
├─────────────────────────────────────────────────────────────┤
│ SPORT BAR (44px): SURF | KITE | WINDSURF | PARA | VELA | PESCA │
├────────────┬─────────────────────────┬──────────────────────┤
│ LEFT 340px │      MAP (flex)         │  RIGHT 290px         │
│ translateZ │   + Vinheta             │  Glassmorphism       │
│            │   + Overlay por tema    │                      │
│ • Busca    │   Leaflet + Marcadores  │ • Tabela Vento       │
│ • Condicao │   27 Estados            │ • Estados Grid       │
│ • Rosa     │   26 Spots              │ • Spots Grid         │
│ • Horaria  │                         │ • Legenda            │
│ • Dados    │                         │                      │
└────────────┴─────────────────────────┴──────────────────────┘
         ↑ CSS perspective: 1200px + transform-style: preserve-3d
```

### Responsive
- **< 1100px**: Painel direito oculto
- **< 680px**: So mapa + sport bar, transforms desativados

---

## Efeitos Especiais

### Camadas de FX (z-index)
1. `#fx` - Canvas de particulas
2. `#fx-overlay` - Gradiente overlay
3. `#lightning` - Flash de relampago (rain)
4. `#sunrays` - Raios de sol radiais (sun)
5. `#fog` - Nevoa gradient (cloudy)
6. `#wipe` - Transicao cinematografica

### Animacoes
- `float` - Icone principal flutuando
- `pulse` - Logo no loading
- `glitch` - Logo no tema chuva
- `sunpulse` - Raios de sol
- `locpulse` - Marcador do usuario

---

## Funcoes Principais

| Funcao | Responsabilidade |
|--------|------------------|
| `fw(lat, lon)` | Fetch Open-Meteo com cache |
| `loadMain(lat, lon, city)` | Popula painel + auto-tema |
| `setTheme(t, manual)` | Transicao cinematografica completa |
| `wmoToTheme(wCode)` | Mapeia WMO → tema |
| `initParticles()` | Cria particulas por tema |
| `renderParticles()` | Loop de animacao canvas |
| `triggerLightning()` | Flash de relampago |
| `startLightning()` | Intervalo aleatorio de raios |
| `surfCondition()` | Calcula condicao + estrelas |
| `kiteRating(kmh)` | Rating 0-10 |
| `beaufort(kmh)` | Escala Beaufort |

---

## Estrutura

```
agente-do-tempo/
├── index.html    # App completo (~950 linhas)
├── CLAUDE.md     # Contexto para Claude Code
└── README.md     # Este arquivo
```

---

## Como Usar

1. Acesse https://agente-do-tempo-vibrante.netlify.app
2. O tema carrega automaticamente baseado no clima da sua localizacao
3. Selecione seu esporte na Sport Bar
4. Veja a condicao atual com estrelas
5. Consulte a Rosa dos Ventos
6. Veja a previsao horaria (12h)
7. Clique nos spots ou estados no mapa
8. Use os botoes de tema para override manual (retorna ao auto em 30s)

---

## Desenvolvimento Local

```bash
git clone https://github.com/pcssantos1967-png/agente-do-tempo.git
start index.html
```

Nao requer servidor - basta abrir o HTML.

---

## Links

- **Site**: https://agente-do-tempo-vibrante.netlify.app
- **GitHub**: https://github.com/pcssantos1967-png/agente-do-tempo
- **Open-Meteo**: https://open-meteo.com/en/docs
- **Leaflet**: https://leafletjs.com/reference.html

---

## Licenca

MIT License

---

Desenvolvido com Claude Code
