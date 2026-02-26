# MeteoGov Brasil · Inteligência Climática

Sistema de informações meteorológicas em tempo real para todos os estados brasileiros.

**[Acessar Site](https://agente-do-tempo-vibrante.netlify.app)** | **metbrasil.com.br**

---

## Sobre

O **MeteoGov Brasil** é uma aplicação web single-page que oferece dados meteorológicos em tempo real para todo o território brasileiro. Com três temas visuais animados que alternam automaticamente, o sistema detecta a localização do usuário via IP e exibe informações detalhadas de clima para os 27 estados.

## Funcionalidades

### Sistema de Temas Automáticos
- **Tema Chuva**: 130 gotas animadas, paleta azul/cyan
- **Tema Sol**: 55 partículas douradas, paleta âmbar/laranja
- **Tema Nublado**: 10 nuvens flutuantes, paleta cinza/azulado
- Alternância automática a cada 8 segundos
- Barra de progresso visual no topo
- Seleção manual com retorno automático após 24s

### Detecção de Localização
- Identificação automática via IP (ipapi.co)
- Exibe cidade e estado do usuário
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

### Mapa Interativo
- 27 pontos representando cada estado
- Animação de pulso nos marcadores
- Tooltip com sigla e temperatura
- Clique para ver detalhes completos

### Grid de Estados
- Todos os 27 estados com dados ao vivo
- Ícone do clima, sigla e temperatura
- Seleção com destaque visual

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
| Fundo | Azul noturno | `#060d1a` |
| Destaque | Cyan elétrico | `#4fc3f7` |
| Texto | Branco gelo | `#e0f7fa` |

### Tema Sol
| Variável | Cor | Hex |
|----------|-----|-----|
| Fundo | Laranja queimado | `#1a0800` |
| Destaque | Amarelo solar | `#ffe566` |
| Texto | Creme | `#fff8e1` |

### Tema Nublado
| Variável | Cor | Hex |
|----------|-----|-----|
| Fundo | Cinza-azulado | `#1c2535` |
| Destaque | Azul acinzentado | `#9fb8d8` |
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
| 61-69 | Neve | ❄️ |
| 71-82 | Chuva | 🌧️ |
| 85+ | Tempestade | ⛈️ |

## Estados Brasileiros

Todos os 27 estados com coordenadas e posicionamento no mapa:

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

## Estrutura

```
agente-do-tempo/
├── index.html                  # Aplicação completa (~1300 linhas)
├── AGENTE_DO_TEMPO_CONTEXT.txt # Documentação técnica
└── README.md                   # Este arquivo
```

## Layout

### Desktop (3 colunas)
- **Esquerda (360px)**: Localização, relógio, alertas
- **Centro (flexível)**: Mapa do Brasil
- **Direita (320px)**: Previsão, estados, umidade

### Tablet (2 colunas)
- Mapa ocupa linha completa
- Colunas laterais lado a lado

### Mobile (1 coluna)
- Layout empilhado
- Botões de tema ocultos
- Grid de estados 2 colunas

## Animações

| Animação | Duração | Elemento |
|----------|---------|----------|
| progress | 8s | Barra de tema |
| bob | 3.5s | Ícone principal |
| ping | 2s | Pontos do mapa |
| Partículas | 60fps | Canvas |
| Transições | 0.4s | Todos elementos |

## Como Usar

1. Acesse https://agente-do-tempo-vibrante.netlify.app
2. Permita a detecção de localização (opcional)
3. Veja seus dados meteorológicos locais
4. Clique em estados no mapa ou grid para detalhes
5. Use °C/°F para alternar unidade
6. Clique nos botões de tema para fixar um visual

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

## Licença

MIT License

---

Desenvolvido com Claude Code
