# MetBrasil — Integração INMET AlertAS

> Janela de contexto para implementação de alertas meteorológicos oficiais do INMET
> **IMPORTANTE:** Ler CLAUDE.md primeiro para regras de performance

---

## Objetivo

Integrar a API do INMET (Instituto Nacional de Meteorologia) para exibir **alertas meteorológicos oficiais do Brasil** no MetBrasil, complementando os alertas baseados em probabilidade de chuva já existentes.

---

## API do INMET - Endpoints Disponíveis

### RSS Feed de Alertas (principal)
```
https://apiprevmet3.inmet.gov.br/avisos/rss
```

### Alerta Individual
```
https://apiprevmet3.inmet.gov.br/avisos/rss/{alert_id}
```

### Previsão por Município (IBGE code)
```
https://apiprevmet3.inmet.gov.br/previsao/{codigo_ibge}
```

### Portal Web
```
https://avisos.inmet.gov.br/
```

---

## Estrutura do RSS Feed

```xml
<rss>
  <channel>
    <title>Avisos</title>
    <link>https://avisos.inmet.gov.br</link>
    <description>Avisos atuais na América do Sul</description>
    <language>pt-BR</language>
    <item>
      <title>Aviso de Chuvas Intensas. Severidade Grau: Perigo</title>
      <link>https://avisos.inmet.gov.br/...</link>
      <pubDate>Fri, 27 Feb 2026 13:11:22 +0000</pubDate>
      <guid>unique-id</guid>
      <description><![CDATA[
        <!-- Tabela HTML com dados do alerta -->
      ]]></description>
    </item>
  </channel>
</rss>
```

### Campos do Alerta (dentro do CDATA)

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Status** | Estado do alerta | "Alert" |
| **Evento** | Tipo de evento | Ver tabela abaixo |
| **Severidade** | Grau de perigo | "Perigo", "Perigo Potencial", "Grande Perigo" |
| **Início** | Data/hora início | "28/02/2026 12:00" |
| **Fim** | Data/hora fim | "01/03/2026 23:59" |
| **Descrição** | Detalhes técnicos | "Chuva 20-30 mm/h, ventos 40-60 km/h" |
| **Área** | Regiões afetadas | "Sul de MG, Norte de SP, Vale do Paraíba" |
| **Link Gráfico** | URL do mapa | URL da imagem |

### Tipos de Evento (Evento)

| Código | Evento | Cor Sugerida |
|--------|--------|--------------|
| `chuvas_intensas` | Chuvas Intensas | `#1565c0` (azul) |
| `acumulado_chuva` | Acumulado de Chuva | `#0d47a1` (azul escuro) |
| `tempestade` | Tempestade | `#7b1fa2` (roxo) |
| `vendaval` | Vendaval | `#f57c00` (laranja) |
| `ventos_costeiros` | Ventos Costeiros | `#00838f` (ciano) |
| `baixa_umidade` | Baixa Umidade | `#ff8f00` (âmbar) |
| `onda_de_calor` | Onda de Calor | `#d32f2f` (vermelho) |
| `geada` | Geada | `#90caf9` (azul claro) |
| `granizo` | Granizo | `#78909c` (cinza azulado) |

### Níveis de Severidade

| Severidade | Classe CSS | Cor |
|------------|------------|-----|
| Perigo Potencial | `.alert-yellow` | `#ffc107` |
| Perigo | `.alert-orange` | `#ff9800` |
| Grande Perigo | `.alert-red` | `#f44336` |

---

## Mapeamento Estados → Áreas INMET

O INMET usa nomes de regiões/áreas, não códigos de estado. Será necessário mapear:

```javascript
const AREA_MAPPING = {
  'SP': ['São Paulo', 'Vale do Paraíba', 'Litoral Paulista', 'Grande SP'],
  'RJ': ['Rio de Janeiro', 'Região Serrana', 'Baixada Fluminense', 'Costa Verde'],
  'MG': ['Minas Gerais', 'Sul de MG', 'Triângulo Mineiro', 'Zona da Mata'],
  // ... completar para 27 estados
};

function alertAffectsState(alertArea, stateCode) {
  const areas = AREA_MAPPING[stateCode] || [stateCode];
  return areas.some(a => alertArea.toLowerCase().includes(a.toLowerCase()));
}
```

---

## Implementação Proposta

### 1. Nova Função: `fetchINMETAlerts()`

```javascript
let inmetCache = null;
let inmetCacheTime = 0;
const INMET_CACHE_TTL = 15 * 60 * 1000; // 15 minutos

async function fetchINMETAlerts() {
  // Usar cache se válido
  if (inmetCache && Date.now() - inmetCacheTime < INMET_CACHE_TTL) {
    return inmetCache;
  }

  try {
    // CORS: usar proxy ou fetch direto se permitido
    const r = await fetch('https://apiprevmet3.inmet.gov.br/avisos/rss');
    const text = await r.text();
    const alerts = parseINMETRSS(text);

    inmetCache = alerts;
    inmetCacheTime = Date.now();
    return alerts;
  } catch (e) {
    console.warn('INMET fetch error:', e);
    return inmetCache || []; // Retorna cache antigo se falhar
  }
}
```

### 2. Parser RSS → JSON

```javascript
function parseINMETRSS(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');

  return Array.from(items).map(item => {
    const title = item.querySelector('title')?.textContent || '';
    const desc = item.querySelector('description')?.textContent || '';

    // Extrair dados do HTML dentro do CDATA
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = desc;

    return {
      id: item.querySelector('guid')?.textContent,
      title: title,
      evento: extractField(tempDiv, 'Evento'),
      severidade: extractField(tempDiv, 'Severidade'),
      inicio: extractField(tempDiv, 'Início'),
      fim: extractField(tempDiv, 'Fim'),
      descricao: extractField(tempDiv, 'Descrição'),
      area: extractField(tempDiv, 'Área'),
      link: item.querySelector('link')?.textContent,
      pubDate: item.querySelector('pubDate')?.textContent,
    };
  });
}

function extractField(container, fieldName) {
  // Implementar extração do campo da tabela HTML
  const cells = container.querySelectorAll('td');
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent.includes(fieldName) && cells[i+1]) {
      return cells[i+1].textContent.trim();
    }
  }
  return '';
}
```

### 3. Integração com UI Existente

```javascript
// No loadMain() ou após placeStateMarkers()
async function checkINMETAlerts() {
  if (isMobile) return; // Performance: skip no mobile

  const alerts = await fetchINMETAlerts();
  const activeAlerts = alerts.filter(a => isAlertActive(a));

  if (activeAlerts.length > 0) {
    showINMETBanner(activeAlerts[0]); // Mostrar alerta mais recente
    markAffectedStates(activeAlerts); // Destacar estados afetados no mapa
  }
}
```

### 4. Badge nos Marcadores de Estado

```javascript
function markAffectedStates(alerts) {
  stateMarkers.forEach(({s, marker}) => {
    const stateAlerts = alerts.filter(a => alertAffectsState(a.area, s.code));
    if (stateAlerts.length > 0) {
      const severity = getHighestSeverity(stateAlerts);
      // Adicionar indicador visual no marcador
      addAlertIndicator(marker, severity);
    }
  });
}
```

---

## Regras de Performance (CRÍTICO)

> **Referência:** Seção ⚡ PERFORMANCE do CLAUDE.md

### Obrigatório

1. **Cache de 15 minutos** - Alertas não mudam frequentemente
2. **Fetch único** - Não fazer múltiplas requests
3. **Skip no mobile** - `if(isMobile) return;`
4. **Lazy load** - Carregar após dados principais
5. **Fallback gracioso** - Se INMET falhar, continuar sem alertas

### Proibido

- ❌ Polling frequente (setInterval < 5min)
- ❌ Fetch síncrono bloqueante
- ❌ Animações CSS novas sem check mobile
- ❌ DOM manipulation em loop

---

## Tratamento de CORS

O endpoint INMET pode ter restrições CORS. Soluções:

### Opção 1: Proxy CORS (recomendado para dev)
```javascript
const CORS_PROXY = 'https://corsproxy.io/?';
const url = CORS_PROXY + encodeURIComponent('https://apiprevmet3.inmet.gov.br/avisos/rss');
```

### Opção 2: Serverless Function (produção)
Criar função no Netlify/Vercel que faz fetch server-side.

### Opção 3: Service Worker
Interceptar request e fazer fetch com mode: 'no-cors' (limitado).

---

## UI/UX Proposta

### Banner de Alerta INMET (topo)

```html
<div class="inmet-banner alert-orange">
  <span class="inmet-icon">⚠️</span>
  <span class="inmet-badge">INMET OFICIAL</span>
  <span class="inmet-text">Chuvas Intensas - Sul de MG, Norte de SP</span>
  <span class="inmet-severity">PERIGO</span>
  <button class="inmet-details">Detalhes</button>
  <button class="inmet-close">×</button>
</div>
```

### Indicador no Marcador do Estado

```css
.state-alert-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite; /* Desativar no mobile! */
}
.alert-indicator-yellow { background: #ffc107; }
.alert-indicator-orange { background: #ff9800; }
.alert-indicator-red { background: #f44336; }
```

### Modal de Detalhes

Reusar estrutura do `spot-modal` existente para mostrar:
- Tipo de evento + ícone
- Severidade com cor
- Período (início → fim)
- Descrição completa
- Áreas afetadas
- Link para INMET oficial

---

## Checklist de Implementação

### Fase 1: Fetch e Parse
- [ ] Criar `fetchINMETAlerts()` com cache
- [ ] Criar `parseINMETRSS()` para converter XML → JSON
- [ ] Testar endpoint (verificar CORS)
- [ ] Implementar fallback se CORS bloquear

### Fase 2: Integração
- [ ] Chamar após `placeStateMarkers()`
- [ ] Verificar `isMobile` antes de processar
- [ ] Mapear áreas → estados brasileiros

### Fase 3: UI
- [ ] Criar banner INMET (similar ao alert-banner existente)
- [ ] Adicionar indicadores nos marcadores
- [ ] Criar modal de detalhes
- [ ] CSS com override mobile (sem animações)

### Fase 4: Testes
- [ ] Testar no desktop com alertas ativos
- [ ] Testar no mobile (deve pular processamento)
- [ ] Testar fallback quando INMET offline
- [ ] Verificar performance (Lighthouse)

---

## Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `index.html` | Adicionar funções JS, CSS, HTML do banner |
| `CLAUDE.md` | Documentar nova função `fetchINMETAlerts()` |

---

## Referências

- [Portal INMET](https://portal.inmet.gov.br/)
- [RSS Alertas](https://apiprevmet3.inmet.gov.br/avisos/rss)
- [Avisos INMET](https://avisos.inmet.gov.br/)
- [Alert-Hub Brasil](https://www.alert-hub.org/feedFacade/sourcefeed/feed/br-inmet-pt)

---

## Contato INMET

- **Email técnico:** sepre.df@inmet.gov.br
- **Telefone:** (61) 2102-4700
- **Token API:** Solicitar em cadastro.act@inmet.gov.br

---

*Documento criado: 2026-02-27 · Para uso com Claude Code*
