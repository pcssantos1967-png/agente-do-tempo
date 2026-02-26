# Agente do Tempo

Sistema de Meteorologia Interativa com visual vibrante e dados em tempo real.

**[Acesse a Demo](https://agente-do-tempo-vibrante.netlify.app/?acesso=liberado)** | **[Site](https://agente-do-tempo-vibrante.netlify.app)**

---

## Sobre

O **Agente do Tempo** é uma aplicação web single-page que permite consultar a previsão de chuva para qualquer ponto do Brasil. Com um design moderno e vibrante, o sistema oferece temas animados e dados meteorológicos em tempo real.

## Funcionalidades

- **Temas Animados**: Alterne entre Chuva (aurora boreal + gotas coloridas) e Sol (raios giratórios + sparkles)
- **Dados em Tempo Real**: Integração com API Open-Meteo (gratuita)
- **15 Locais Curados**: Praias, rios, cachoeiras e lagos populares do Brasil
- **Classificação de Risco**: Sistema de cores indica o nível de chuva (nulo a crítico)
- **Previsão de 3 Dias**: Visualize a tendência de precipitação
- **Modo Demo**: Funciona sem chave do Google Maps

## Temas Visuais

### Tema Chuva
- Aurora boreal animada (roxo/azul/cyan)
- 60 gotas coloridas com glow
- 25 partículas flutuantes

### Tema Sol de Verão
- Sol pulsante com gradiente dourado
- 12 raios giratórios (30s/volta)
- 20 sparkles flutuantes
- Ondas de calor na base

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML/CSS/JS | Stack completa (zero frameworks) |
| Open-Meteo API | Dados meteorológicos (grátis) |
| Google Maps API | Mapa interativo (opcional) |
| Stripe | Pagamentos (opcional) |
| Netlify | Hospedagem |

## Classificação de Chuva

| Nível | mm/24h | Cor | Recomendação |
|-------|--------|-----|--------------|
| Nulo | < 0.1mm | Verde | Ótimo para atividades! |
| Baixo | < 5mm | Azul | Leve uma sombrinha |
| Médio | < 25mm | Amarelo | Adie atividades ao ar livre |
| Alto | < 50mm | Vermelho | Evite sair de casa |
| Crítico | >= 50mm | Vermelho escuro | Risco de alagamentos! |

## Locais Curados

- Alter do Chão (PA)
- Jericoacoara (CE)
- Fernando de Noronha (PE)
- Porto Seguro (BA)
- Bonito (MS)
- Chapada Diamantina (BA)
- Foz do Iguaçu (PR)
- Lençóis Maranhenses (MA)
- Gramado (RS)
- Florianópolis (SC)
- Búzios (RJ)
- Paraty (RJ)
- Ilhabela (SP)
- Brotas (SP)
- Capitólio (MG)

## Como Usar

### Demo (sem configuração)
1. Acesse [agente-do-tempo-vibrante.netlify.app](https://agente-do-tempo-vibrante.netlify.app)
2. Clique em "Testar Demonstração Grátis"
3. Clique nos marcadores ou selecione um local na lista

### Produção Completa
1. Clone o repositório
2. Edite `CONFIG` no `index.html`:
   - `GOOGLE_MAPS_KEY`: Chave do Google Cloud
   - `STRIPE_BUY_BUTTON_ID`: ID do Buy Button
   - `STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe
3. Faça deploy no Netlify (arraste a pasta)

## Estrutura

```
agente-do-tempo/
├── index.html                  # Aplicação completa (~1900 linhas)
├── AGENTE_DO_TEMPO_CONTEXT.txt # Documentação técnica detalhada
└── README.md                   # Este arquivo
```

## Controles de Tema

No canto inferior direito da página:

| Botão | Função |
|-------|--------|
| 🌧️ | Ativar tema Chuva |
| ☀️ | Ativar tema Sol |
| 🔄 | Alternar automaticamente (8s) |

## API Open-Meteo

Dados utilizados:
- `precipitation`: Precipitação atual (mm)
- `precipitation_sum`: Precipitação acumulada 24h
- `precipitation_probability_max`: Probabilidade máxima
- `windspeed_10m`: Velocidade do vento
- `temperature_2m`: Temperatura

## Links

- **Site**: https://agente-do-tempo-vibrante.netlify.app
- **Demo**: https://agente-do-tempo-vibrante.netlify.app/?acesso=liberado
- **API Open-Meteo**: https://open-meteo.com/en/docs

## Licença

MIT License

---

Desenvolvido com Claude Code
