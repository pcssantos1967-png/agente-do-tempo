# MetBrasil · Inteligência Climática em Tempo Real

Sistema de informações meteorológicas em tempo real para todos os estados brasileiros com mapa interativo.

**[Acessar Site](https://agente-do-tempo-vibrante.netlify.app)** | **metbrasil.com.br**

---

## Sobre

O **MetBrasil** é uma aplicação web single-page que oferece dados meteorológicos em tempo real para todo o território brasileiro. Com mapa interativo Leaflet, três temas visuais animados, busca de cidades e marcadores coloridos por temperatura, o sistema detecta a localização do usuário via IP e exibe informações detalhadas de clima para os 27 estados.

## Funcionalidades

### Mapa Interativo Leaflet
- Tiles CartoDB Dark para visual elegante
- Zoom, pan e clique em qualquer ponto
- 27 marcadores de estados com dados ao vivo
- Marcadores coloridos por temperatura:
  - Verde: < 20°C
  - Laranja: 20°C - 30°C
  - Vermelho: > 30°C
- Clique em qualquer lugar do mapa para ver o clima
- Overlay temático que muda com cada tema
- Marcador de localização do usuário com pulso animado

### Busca de Cidades
- Campo de busca com autocomplete
- 27 capitais brasileiras cadastradas
- Clique para ver clima e navegar no mapa
- Atualiza painel principal com a cidade selecionada

### Sistema de Temas Automáticos
- **Tema Chuva**: 120 gotas animadas, paleta azul/cyan
- **Tema Sol**: 50 partículas douradas, paleta âmbar/laranja
- **Tema Nublado**: 9 nuvens flutuantes, paleta cinza/azulado
- Alternância automática a cada 8 segundos
- Barra de progresso visual no topo
- Seleção manual com retorno automático após 24s
- Efeito flash na transição de temas
- Filtro do mapa adapta-se ao tema

### Tela de Loading
- Logo animado com glow
- Barra de progresso suave
- Transição elegante ao carregar dados

### Detecção de Localização
- Identificação automática via IP (ipapi.co)
- Marcador pulsante no mapa
- Popup com dados da sua localização
- Fallback para São Paulo em caso de erro

### Dados em Tempo Real
- Temperatura atual e sensação térmica
- Umidade relativa do ar
- Velocidade e direção do vento
- Pressão atmosférica
- Visibilidade
- Cobertura de nuvens

### Previsão de 5 Dias
- Temperatura máxima e mínima
- Ícone da condição climática
- Probabilidade de precipitação

### Painel de Estados
- Abas: TODOS / DETALHE
- Grid com todos os 27 estados
- Painel de detalhes com:
  - Temperatura e ícone
  - Barra de umidade
  - Escala de índice UV
  - Velocidade do vento
  - Probabilidade de chuva

### Legenda do Mapa
- Explicação visual das cores dos marcadores
- Indicador de localização do usuário

### Recursos Adicionais
- Toggle Celsius/Fahrenheit
- Relógio em tempo real (Horário de Brasília)
- Bússola de vento animada
- Painel de alertas meteorológicos
- Indicador de umidade com descrição

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML/CSS/JS | Stack completa (zero frameworks) |
| Leaflet.js | Mapa interativo |
| CartoDB Tiles | Tiles dark elegantes |
| Canvas 2D API | Partículas animadas |
| CSS Grid | Layout responsivo 3 colunas |
| CSS Custom Properties | Sistema de temas |
| Open-Meteo API | Dados meteorológicos |
| ipapi.co | Geolocalização por IP |
| Google Fonts | Bebas Neue, DM Mono, Syne |

## Paleta de Cores

### Tema Chuva
| Variável | Cor | Hex |
|----------|-----|-----|
| Fundo | Azul noturno | `#04101f` → `#071828` |
| Destaque | Cyan elétrico | `#4fc3f7` |
| Secundário | Azul | `#0288d1` |
| Texto | Branco gelo | `#e0f7fa` |

### Tema Sol
| Variável | Cor | Hex |
|----------|-----|-----|
| Fundo | Laranja vibrante | `#b33800` → `#e86000` |
| Destaque | Amarelo solar | `#ffe566` |
| Secundário | Laranja | `#ff9900` |
| Texto | Marrom escuro | `#1a0400` |

### Tema Nublado
| Variável | Cor | Hex |
|----------|-----|-----|
| Fundo | Cinza-azulado | `#18222f` → `#263545` |
| Destaque | Azul acinzentado | `#a0bcd8` |
| Secundário | Azul cinza | `#6888a4` |
| Texto | Branco azulado | `#dde8f5` |

## Códigos WMO

O sistema interpreta os códigos meteorológicos da World Meteorological Organization:

| Código | Condição | Ícone |
|--------|----------|-------|
| 0 | Céu limpo | ☀️ |
| 1-2 | Parcialmente nublado | ⛅ |
| 3 | Nublado | ☁️ |
| 45-49 | Nevoeiro | 🌫️ |
| 51-59 | Garoa | 🌦️ |
| 61-69 | Neve/Granizo | ❄️ |
| 71-82 | Chuva | 🌧️ |
| 85+ | Tempestade | ⛈️ |

## Estados Brasileiros

Todos os 27 estados com coordenadas e marcadores no mapa:

| Região | Estados |
|--------|---------|
| Norte | AC, AM, AP, PA, RO, RR, TO |
| Nordeste | AL, BA, CE, MA, PB, PE, PI, RN, SE |
| Centro-Oeste | DF, GO, MT, MS |
| Sudeste | ES, MG, RJ, SP |
| Sul | PR, RS, SC |

## APIs Utilizadas

### Open-Meteo (Gratuita)
```
https://api.open-meteo.com/v1/forecast
```
- Sem autenticação necessária
- Parâmetros: temperature, humidity, wind, pressure, visibility, cloud_cover
- Previsão de até 5 dias
- Timezone: America/Sao_Paulo

### ipapi.co (Gratuita)
```
https://ipapi.co/json/
```
- 30.000 requisições/mês
- Retorna: city, region_code, latitude, longitude

### Leaflet + CartoDB
```
https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```
- Tiles gratuitos estilo dark
- Zoom até nível 18

## Estrutura

```
agente-do-tempo/
├── index.html                  # Aplicação completa (~1000 linhas)
├── AGENTE_DO_TEMPO_CONTEXT.txt # Documentação técnica
└── README.md                   # Este arquivo
```

## Layout

### Desktop (3 colunas)
- **Header (56px)**: Logo, botões de tema, toggle °C/°F, relógio
- **Esquerda (340px)**: Busca, localização, relógio, alertas, umidade
- **Centro (flexível)**: Mapa Leaflet interativo
- **Direita (290px)**: Previsão, estados (abas), legenda

### Tablet (< 1100px)
- Header + 2 colunas
- Painel direito oculto

### Mobile (< 700px)
- Header + mapa fullscreen
- Painéis laterais ocultos

## Animações

| Animação | Duração | Elemento |
|----------|---------|----------|
| tprog | 8s | Barra de tema |
| bob | 3.5s | Ícone principal |
| locpulse | 2s | Marcador localização |
| loadprog | 2.2s | Barra de loading |
| sp | 0.7s | Spinner |
| flashing | 0.35s | Flash de transição |
| Partículas | 60fps | Canvas |

## Como Usar

1. Acesse https://agente-do-tempo-vibrante.netlify.app
2. Aguarde o carregamento dos dados
3. Veja seus dados meteorológicos locais (detectados por IP)
4. Use a busca para encontrar outras cidades
5. Clique nos estados no mapa ou no grid
6. Clique em qualquer ponto do mapa para ver o clima
7. Use °C/°F para alternar unidade
8. Clique nos botões de tema para fixar um visual

## Desenvolvimento Local

```bash
# Clonar repositório
git clone https://github.com/pcssantos1967-png/agente-do-tempo.git

# Abrir no navegador
start index.html
```

Não requer servidor local - basta abrir o HTML diretamente.

## Links

- **Site**: https://agente-do-tempo-vibrante.netlify.app
- **GitHub**: https://github.com/pcssantos1967-png/agente-do-tempo
- **Open-Meteo Docs**: https://open-meteo.com/en/docs
- **ipapi.co Docs**: https://ipapi.co/api/
- **Leaflet Docs**: https://leafletjs.com/reference.html

## Licença

MIT License

---

Desenvolvido com Claude Code
