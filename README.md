# MetBrasil · Inteligência Climática para Esportes

Plataforma brasileira de meteorologia focada em esportes aquáticos e ao ar livre.

**[Acessar Site](https://agente-do-tempo-vibrante.netlify.app)** | **metbrasil.com.br**

---

## Sobre

O **MetBrasil** é uma aplicação web single-page que oferece dados meteorológicos em tempo real para todo o território brasileiro, com foco em esportes aquáticos e ao ar livre. Inspirado nos melhores recursos de SurfGuru, Windy, Windfinder, Windguru, Ventusky, Wisuki e Waves.com.br.

**Stack:** HTML5 + CSS3 + Vanilla JS + Leaflet.js + Open-Meteo API (zero frameworks, zero build)

## Funcionalidades

### Sport Bar (6 Esportes)
- **Surf** - Cor: `#0097a7` (cyan)
- **Kite** - Cor: `#7c4dff` (roxo)
- **Windsurf** - Cor: `#00897b` (teal)
- **Parapente** - Cor: `#f57c00` (laranja)
- **Vela** - Cor: `#1565c0` (azul)
- **Pesca** - Cor: `#558b2f` (verde)
- Troca dinâmica de `--sport-color` em todo o sistema

### Rosa dos Ventos (16 Pontos)
- Direções: N, NNE, NE, ENE, L, ESE, SE, SSE, S, SSO, SO, OSO, O, ONO, NO, NNO
- Agulha animada que aponta para direção atual
- Velocidade do vento em km/h ou nós
- Escala Beaufort textual (Calmo → Furacão)

### Barra de Rating Kite/Wind (0-10)
- Escala visual colorida (verde → amarelo → vermelho)
- Lógica: `<8→1, <12→3, <16→5, <22→8, <30→10, <40→7, <50→5, ≥50→3`

### Badge de Condição com Estrelas
| Condição | Classe | Estrelas | Critério |
|----------|--------|----------|----------|
| ÉPICO! | cond-epic | ★★★★★ | 15-30 km/h, código ≤3 |
| BOM | cond-good | ★★★★☆ | 10-35 km/h, código ≤10 |
| RAZOÁVEL | cond-fair | ★★★☆☆ | ≥8 km/h, código ≤20 |
| SEM VENTO | cond-flat | ★★☆☆☆ | <5 km/h |
| FRACO | cond-poor | ★☆☆☆☆ | Outros casos |
| PERIGOSO | cond-poor | ☆☆☆☆☆ | Tempestade (código ≥95) |

### Strip Horária (12h)
- Previsão hora a hora para próximas 12 horas
- Destaque visual no pico de vento
- Ícone do tempo, temperatura e velocidade do vento

### Tabela de Vento (5 Dias - Estilo Windguru)
| Coluna | Dado |
|--------|------|
| Dia | Hoje, Seg, Ter... |
| Ícone | Condição climática |
| Temp | Temperatura máxima |
| Vento | Velocidade máxima |
| Rajadas | Entre parênteses |
| Chuva | Probabilidade % |

### 26 Spots Surfísticos/Esportivos
Jericoacoara, Cumbuco, Preá, São Miguel do Gostoso, Atins, Florianópolis, Ilhabela, Búzios, Arraial do Cabo, Saquarema, Itacaré, Torres, Garopaba, Ubatuba, Maresias, Guarujá, Itamambuca, Pipa, Fernando de Noronha, Morro de São Paulo, Porto de Galinhas, Praia do Forte, Balneário Camboriú, Imbituba, Cabo Frio, Barra Grande PI

### Toggle de Unidades
- **Temperatura:** °C ↔ °F
- **Vento:** km/h ↔ nós

### Mapa Interativo Leaflet
- Tiles CartoDB Dark
- 27 marcadores de estados (coloridos por temperatura)
- 26 marcadores de spots (coloridos por tipo de esporte)
- Clique em qualquer ponto para ver clima
- Marcador de localização do usuário com pulso

### Sistema de Temas (Auto-rotação 8s)
- **Chuva**: 110 gotas, bg `#030d1c`, acc `#4fc3f7`
- **Sol**: 45 partículas, bg `#a83200`, acc `#ffe566`
- **Nublado**: 8 nuvens, bg `#141e2c`, acc `#a0bcd8`

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML/CSS/JS | Stack completa (zero frameworks) |
| Leaflet.js | Mapa interativo |
| CartoDB Tiles | Tiles dark elegantes |
| Canvas 2D API | Partículas animadas |
| CSS Grid | Layout responsivo 3 colunas |
| CSS Custom Properties | Temas + Modos esportivos |
| Open-Meteo API | Dados meteorológicos |
| ipapi.co | Geolocalização por IP |
| Google Fonts | Bebas Neue, DM Mono, Syne |

## Layout

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (52px): Logo | Temas | °C/°F | km/h/nós | Relógio │
├─────────────────────────────────────────────────────────┤
│ SPORT BAR (38px): Surf | Kite | Wind | Para | Vela | Pesca │
├────────────┬─────────────────────────┬──────────────────┤
│ LEFT 330px │      MAP (flex)         │  RIGHT 280px     │
│            │                         │                  │
│ • Busca    │   Leaflet + Marcadores  │ • Tabela Vento   │
│ • Condição │   27 Estados            │ • Estados Grid   │
│ • Rosa     │   26 Spots              │ • Spots Grid     │
│ • Horária  │                         │ • Legenda        │
│ • Dados    │                         │                  │
└────────────┴─────────────────────────┴──────────────────┘
```

### Responsive
- **< 1100px**: Painel direito oculto
- **< 680px**: Só mapa + sport bar

## APIs

### Open-Meteo
```
https://api.open-meteo.com/v1/forecast
```
**Parâmetros:**
- `current`: temperature_2m, humidity, apparent_temperature, weather_code, wind_speed_10m, wind_direction_10m, wind_gusts_10m, surface_pressure, visibility, cloud_cover
- `daily`: temp_max/min, weather_code, precipitation_probability_max, wind_speed_10m_max, wind_gusts_10m_max
- `hourly`: temperature_2m, wind_speed_10m, wind_direction_10m, weather_code
- `timezone`: America/Sao_Paulo
- `forecast_days`: 5

### ipapi.co
```
https://ipapi.co/json/
```
- Geolocalização por IP (30k req/mês)

### CartoDB
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

## Funções Principais

| Função | Responsabilidade |
|--------|------------------|
| `fw(lat, lon)` | Fetch Open-Meteo com cache |
| `loadMain(lat, lon, city)` | Popula painel esquerdo |
| `placeStateMarkers()` | Carrega 27 estados em paralelo |
| `placeSpotMarkers()` | Carrega 26 spots |
| `setTheme(t)` | Troca tema + flash + partículas |
| `buildWindTable(daily)` | Tabela Windguru-style |
| `buildHours(hourly)` | Strip horária 12h |
| `surfCondition(wCode, windKmh)` | Retorna {label, cls, stars} |
| `kiteRating(kmh)` | Retorna 0-10 |
| `beaufort(kmh)` | Retorna string Beaufort |
| `windDir16(deg)` | Retorna direção 16 pontos |
| `refreshAll()` | Re-renderiza unidades |

## Escala Beaufort

| km/h | Descrição |
|------|-----------|
| <1 | Calmo (0) |
| 1-5 | Aragem (1) |
| 6-11 | Brisa leve (2) |
| 12-19 | Brisa fraca (3) |
| 20-28 | Brisa moderada (4) |
| 29-38 | Brisa forte (5) |
| 39-49 | Vento fresco (6) |
| 50-61 | Vento forte (7) |
| 62-74 | Ventania (8) |
| 75-88 | Ventania forte (9) |
| 89-102 | Tempestade (10) |
| 103-117 | Tempestade violenta (11) |
| ≥118 | Furacão (12) |

## Estrutura

```
agente-do-tempo/
├── index.html    # App completo (~700 linhas)
├── CLAUDE.md     # Contexto para Claude Code
└── README.md     # Este arquivo
```

## Como Usar

1. Acesse https://agente-do-tempo-vibrante.netlify.app
2. Selecione seu esporte na Sport Bar
3. Veja a condição atual com estrelas
4. Consulte a Rosa dos Ventos e escala Beaufort
5. Veja a previsão horária (12h)
6. Consulte a tabela de vento (5 dias)
7. Clique nos spots ou estados no mapa
8. Use a busca para encontrar locais
9. Alterne entre °C/°F e km/h/nós

## Desenvolvimento Local

```bash
git clone https://github.com/pcssantos1967-png/agente-do-tempo.git
start index.html
```

Não requer servidor - basta abrir o HTML.

## Links

- **Site**: https://agente-do-tempo-vibrante.netlify.app
- **GitHub**: https://github.com/pcssantos1967-png/agente-do-tempo
- **Open-Meteo**: https://open-meteo.com/en/docs
- **Leaflet**: https://leafletjs.com/reference.html

## Competidores (Referência)

| Plataforma | Diferencial Incorporado |
|------------|------------------------|
| SurfGuru.com.br | Rating ★★★★★, condição geral |
| Windy.com | Strip horária, visual |
| Windfinder.com | Rosa dos ventos, toggle nós |
| Windguru.cz | Tabela técnica, Beaufort |
| Ventusky.com | Mapa interativo |
| Wisuki.com | Barra de rating esportivo |
| Waves.com.br | Foco em spots brasileiros |

## Licença

MIT License

---

Desenvolvido com Claude Code
