# MetBrasil — CLAUDE.md
> Janela de contexto para Claude Code · metbrasil.com.br

---

## 🗂️ Estrutura do Projeto

```
metbrasil/
├── CLAUDE.md          ← este arquivo (leia sempre primeiro)
├── index.html         ← app completo (single-file, ~1300 linhas)
└── README.md
```

**Arquivo principal:** `index.html` — toda lógica, CSS e JS em arquivo único.
Não criar arquivos separados de CSS/JS sem instrução explícita.

---

## 🌐 O que é o MetBrasil

Plataforma brasileira de meteorologia focada em esportes aquáticos e ao ar livre.
Inspirada no melhor de 7 concorrentes (ver seção COMPETIDORES).
Stack: HTML5 + CSS3 + Vanilla JS + Leaflet.js + Open-Meteo API.

**URL alvo:** metbrasil.com.br
**Domínio registrado:** a confirmar (candidatos: metbrasil.com.br, tempobrasil.app)

---

## 🏗️ Arquitetura CSS (não alterar sem justificativa)

### Sistema de Temas (3 temas, auto-rotação 8s)
```css
.theme-rain  → bg:#030d1c / acc:#4fc3f7 / partículas: gotas diagonais (110 pts)
.theme-sun   → bg:#a83200 / acc:#ffe566 / partículas: bolas flutuantes (45 pts)
.theme-cloudy→ bg:#141e2c / acc:#a0bcd8 / partículas: nuvens elípticas (8 pts)
```

### Sistema de Modos Esportivos (5 modos, mudam --sport-color)
```css
.mode-surf  → #0097a7   .mode-kite → #7c4dff   .mode-wind → #00897b
.mode-para  → #f57c00   .mode-sail → #1565c0
```

### Layout (CSS Grid 3 colunas)
```
header (52px) | sport-bar (38px) | left(330px) + map(1fr) + right(280px)
Responsive: <1100px → right oculto | <680px → só mapa
```

### Tipografia (NÃO substituir)
- Display: `Bebas Neue` (logos, temperaturas grandes)
- Mono: `DM Mono` (dados, labels, tabelas)
- Body: `Syne` (textos, botões)

### Mapa
- Tiles: CartoDB Dark (`dark_all`)
- Bounds: `[[-34,-74],[5,-28]]` (Brasil completo)
- Marcadores: `divIcon` com temperatura + emoji coloridos por faixa:
  - `< 20°C` → `#4CAF50` (verde)
  - `20–30°C` → `#FF9800` (laranja)
  - `> 30°C` → `#f44336` (vermelho)

---

## 🔌 APIs

| API | Uso | Custo |
|-----|-----|-------|
| `api.open-meteo.com/v1/forecast` | Dados meteorológicos | Gratuito |
| `ipapi.co/json/` | Geolocalização por IP | Gratuito |
| CartoDB tiles | Mapa base | Gratuito |

### Parâmetros Open-Meteo (não remover campos)
```
current: temperature_2m, relative_humidity_2m, apparent_temperature,
         weather_code, wind_speed_10m, wind_direction_10m, wind_gusts_10m,
         surface_pressure, visibility, cloud_cover
daily:   temperature_2m_max/min, weather_code, precipitation_probability_max,
         wind_speed_10m_max, wind_gusts_10m_max
hourly:  temperature_2m, wind_speed_10m, wind_direction_10m, weather_code
timezone: America/Sao_Paulo | forecast_days: 5
```

### Cache (localStorage + memória)
```js
// Cache em memória + persistido no localStorage
const CACHE_KEY = 'metbrasil_weather_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// Chave: `${lat.toFixed(1)},${lon.toFixed(1)}`
// loadCache() restaura do localStorage no load
// saveCache() persiste após cada fetch
```

### Batch API
```js
// fwBatch(locations) - busca múltiplas coordenadas em 1 request
// Usado em placeStateMarkers() para carregar 27 estados de uma vez
```

---

## 📍 Dados Estáticos

### 27 Estados (array `STATES`)
Cada objeto: `{ code, name, lat, lon }` — capitais como coordenadas de referência.
Campos populados após fetch: `_t, _h, _w, _wdir, _c, _daily, _prec, _feel, _gust`

### 26 Spots Surfísticos/Esportivos (array `SPOTS`)
Inclui: Jericoacoara, Cumbuco, Florianópolis, Ilhabela, Búzios, Arraial do Cabo,
Saquarema, Itacaré, Preá, São Miguel do Gostoso, Atins, Torres, Garopaba,
Ubatuba, capitais principais.

---

## ⚙️ Funções-Chave (não renomear)

| Função | Responsabilidade |
|--------|-----------------|
| `fw(lat, lon)` | Fetch Open-Meteo com cache (single location) |
| `fwBatch(locations)` | Fetch Open-Meteo batch (múltiplas locations em 1 request) |
| `loadCache()` | Restaura cache do localStorage |
| `saveCache()` | Persiste cache no localStorage |
| `loadMain(lat, lon, city)` | Popula painel esquerdo + wind rose + badge |
| `placeStateMarkers()` | Carrega 27 estados via batch API |
| `selState(s)` | Atualiza painel direito com estado selecionado |
| `setTheme(t)` | Troca tema + flash + recria partículas (desktop only) |
| `buildWindTable(daily)` | Tabela Windguru-style 5 dias |
| `buildSwell(daily)` | Strip de ondas 5 dias |
| `buildHours(hourly, baseHour)` | Strip horária 12h |
| `surfCondition(wCode, windKmh)` | Retorna `{label, cls, stars}` |
| `kiteRating(kmh)` | Retorna 0–10 para barra de kite |
| `beaufort(kmh)` | Retorna string escala Beaufort |
| `refreshAll()` | Re-renderiza unidades sem novo fetch |

---

## 🏄 Lógica de Condições

### surfCondition(wCode, windKmh)
```
wCode >= 95          → PERIGOSO  (cond-poor,  0★)
wCode >= 80          → RUIM      (cond-poor,  1★)
wind < 5             → SEM VENTO (cond-flat,  2★)
15≤wind≤30, code≤3  → ÉPICO!    (cond-epic,  5★)
10≤wind≤35, code≤10 → BOM       (cond-good,  4★)
wind≥8,  code≤20    → RAZOÁVEL  (cond-fair,  3★)
else                 → FRACO     (cond-poor,  1★)
```

### kiteRating(kmh) → escala 0–10
```
<8→1  <12→3  <16→5  <22→8  <30→10  <40→7  <50→5  ≥50→3
```

---

## 🎨 Componentes Visuais

| Componente | Inspiração | Localização |
|-----------|-----------|------------|
| Card de condição atual + estrelas | SurfGuru | Painel esquerdo |
| Rosa dos ventos 16 pontos | Windfinder | Painel esquerdo |
| Strip horária 12h com pico | Windy | Painel esquerdo |
| Tábua de marés animada SVG | SurfGuru / Wisuki | Painel esquerdo |
| Strip de ondas 5 dias | Waves.com.br | Painel direito |
| Tabela de vento 5 dias | Windguru | Painel direito |
| Grid 27 estados | MetBrasil original | Painel direito |
| Barra de kite 0–10 | Wisuki | Wind card + estado |
| Mapa interativo com marcadores | Ventusky + Windy | Centro |
| Sport Bar (6 esportes) | SurfGuru | Topo |
| Toggle km/h ↔ nós | Windfinder | Header |
| Partículas canvas por tema | MetBrasil original | Background |

---

## 🚫 Restrições

- **NÃO** separar em múltiplos arquivos sem instrução
- **NÃO** substituir CartoDB por outro tile sem teste de tema
- **NÃO** remover o sistema de 3 temas
- **NÃO** trocar `Bebas Neue` / `DM Mono` / `Syne`
- **NÃO** adicionar dependências npm (projeto zero-build)
- **NÃO** remover os 27 estados do array `STATES`
- **NÃO** alterar a assinatura de `fw()` (cache quebra)

---

## ⚡ PERFORMANCE (CRÍTICO - SEMPRE SEGUIR)

> **REGRA DE OURO:** Toda alteração deve manter a performance atual no mobile.
> Testar no celular antes de fazer deploy.

### Otimizações Implementadas (NÃO remover)

| Otimização | Implementação | Impacto |
|------------|---------------|---------|
| **Batch API** | `fwBatch()` - 27 estados em 1 request | -96% requests |
| **localStorage cache** | TTL 10min, restaura no load | Instant reload |
| **Partículas desativadas no mobile** | `if(!isMobile)` no JS | -100% CPU animação |
| **Animações CSS desativadas no mobile** | `@media(max-width:768px)` | -100% CSS animations |
| **Canvas ocultos no mobile** | `#fx,#windCanvas,#lightning{display:none}` | -GPU overhead |
| **backdrop-filter removido no mobile** | CSS media query | -GPU blur |
| **Preconnect hints** | `<link rel="preconnect">` | -latência |

### Regras para Novas Alterações

1. **API Requests:**
   - NUNCA adicionar requests individuais em loop
   - SEMPRE usar batch quando possível
   - SEMPRE cachear respostas

2. **Animações/Transições:**
   - SEMPRE verificar `isMobile` antes de iniciar animações JS
   - NOVAS animações CSS devem ter override no media query mobile
   - NUNCA usar `backdrop-filter` sem fallback mobile

3. **Canvas/WebGL:**
   - SEMPRE desativar no mobile (`if(!isMobile)`)
   - NUNCA criar novos canvas sem check mobile

4. **DOM:**
   - EVITAR reflows frequentes
   - USAR `requestAnimationFrame` para updates visuais
   - NUNCA manipular DOM em loops síncronos

5. **Eventos:**
   - SEMPRE usar `passive: true` em scroll/touch listeners
   - DEBOUNCE eventos de resize

### Variável de Detecção Mobile
```js
const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
```

### CSS Media Query Performance
```css
@media(max-width:768px),(prefers-reduced-motion:reduce){
  /* Desativa animações */
  *{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
  /* Oculta elementos pesados */
  #fx,#windCanvas,#lightning,.wind-toggle{display:none!important;}
  /* Remove efeitos GPU */
  .card,.left-panel,.right-panel{backdrop-filter:none!important;}
}
```

### Checklist Pré-Deploy
- [ ] Testou no celular?
- [ ] Animações novas têm check `isMobile`?
- [ ] Novas chamadas API usam cache/batch?
- [ ] CSS pesado tem override mobile?

---

## ✅ Comandos de Verificação

```bash
# Abrir localmente
open index.html
# ou
python3 -m http.server 8080

# Validar HTML
npx html-validate index.html

# Checar tamanho do arquivo
wc -l index.html   # esperado: ~1300 linhas

# Buscar função específica
grep -n "function fw\|function loadMain\|function setTheme" index.html
```

---

## 📋 Backlog / Próximas Features

> Implementar em ordem de prioridade:

1. **[x] Previsão de ondas real** — integrar Open-Meteo `wave_height` e `swell_wave_height` ✅
2. **[x] Modo noturno automático** — detectar hora local e ajustar brilho do mapa ✅
3. **[x] Alertas reais** — Open-Meteo `precipitation_probability > 80%` → badge vermelho ✅
4. **[x] Página de spot** — click no marcador abre modal com histórico 7 dias ✅
5. **[x] PWA** — adicionar `manifest.json` + service worker para instalação ✅
6. **[x] Share** — botão compartilhar condições do spot via URL com parâmetros ✅
7. **[x] Animação de vento no mapa** — camada de partículas Windy-style (canvas sobre Leaflet) ✅
8. **[x] Marés aproximadas** — cálculo lunar com fase da lua e 4 eventos diários ✅
9. **[x] Multi-idioma** — PT/EN toggle com 100+ strings traduzidas ✅
10. **[x] GitHub Pages deploy** — GitHub Actions workflow + CNAME configurado ✅

---

## 🏆 Competidores Analisados (referência de UX)

| Plataforma | Público | Diferencial incorporado |
|-----------|---------|------------------------|
| SurfGuru.com.br 🇧🇷 | Surfistas | Rating ★★★★★, tábua de marés, condição geral |
| Windy.com | Global | Camadas de mapa, strip horária, visual de vento |
| Windfinder.com | Kite/Windsurf | Rosa dos ventos, toggle nós, 45k estações |
| Windguru.cz | Avançados | Tabela técnica multi-modelo, Beaufort |
| Ventusky.com | Visual | Mapa meteorológico animado |
| Wisuki.com | Kite/Wind | Barra de rating esportivo, busca por pico |
| Waves.com.br 🇧🇷 | Surf SP/SC/RJ | Swell strip, foco em ondas |

**Vantagem MetBrasil:** único a combinar dados de vento técnico (Windguru) +
rating surf/kite (SurfGuru/Wisuki) + mapa interativo (Ventusky) + identidade 100% brasileira.

---

## 🧠 Sessão Anterior (contexto)

- **v1:** SVG estático com 27 estados + temas + partículas (arquivo: `brasil-clima.html`)
- **v2:** Leaflet interativo + Sport Bar + Wind Rose + Wind Table (arquivo: `metbrasil.html`)
- **Domínio pesquisado:** `tempobrasil.com.br` já registrado → usar `metbrasil.com.br`
- **GitHub:** repositório ainda não criado (pendente)
- **Deploy:** planejado via GitHub Pages + CNAME

---

*Última atualização: 2025-02 · Autor: Paulo Cesar (AGU/FGV) · Claude Code ready*
