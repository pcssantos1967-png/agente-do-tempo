# Push Notifications para Alertas Severos - Contexto Claude Code

> Janela de contexto para implementação de notificações push no MetBrasil

---

## Objetivo

Implementar sistema de notificações push para alertas meteorológicos severos usando:
- **Service Worker** (já existe: `sw.js`)
- **Web Push API**
- **Notification API**

---

## Arquitetura Atual

```
metbrasil/
├── index.html      ← App principal (adicionar UI de permissão)
├── sw.js           ← Service Worker existente (adicionar push handler)
├── manifest.json   ← PWA manifest (já configurado)
└── PUSH_NOTIFICATIONS.md ← Este arquivo
```

---

## Fluxo de Implementação

### 1. Solicitar Permissão (index.html)

```javascript
// Adicionar no init() ou após carregar dados
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
```

### 2. Registrar Push Subscription (index.html)

```javascript
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  // VAPID public key (gerar com web-push library)
  const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });

  // Salvar subscription no servidor (ou localStorage para demo)
  console.log('Push subscription:', JSON.stringify(subscription));
  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### 3. Handler no Service Worker (sw.js)

```javascript
// Adicionar ao sw.js existente

// Receber push notification
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'Alerta meteorológico',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'weather-alert',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'Ver Detalhes' },
      { action: 'dismiss', title: 'Dispensar' }
    ],
    data: {
      url: data.url || '/',
      alertId: data.alertId
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MetBrasil Alerta', options)
  );
});

// Click na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

### 4. Disparar Alertas Locais (sem servidor)

```javascript
// Verificar condições severas e notificar localmente
function checkSevereWeather(weatherData) {
  const code = weatherData.current.weather_code;
  const wind = weatherData.current.wind_speed_10m;

  // Condições severas
  const alerts = [];

  if (code >= 95) {
    alerts.push({
      title: '⛈️ TEMPESTADE SEVERA',
      body: 'Condições perigosas detectadas. Evite áreas abertas.',
      severity: 'extreme'
    });
  }

  if (code >= 65 && code < 95) {
    alerts.push({
      title: '🌧️ CHUVA FORTE',
      body: 'Chuva intensa prevista. Risco de alagamentos.',
      severity: 'severe'
    });
  }

  if (wind >= 60) {
    alerts.push({
      title: '💨 VENDAVAL',
      body: `Ventos de ${Math.round(wind)} km/h. Cuidado com objetos soltos.`,
      severity: 'severe'
    });
  }

  // Disparar notificações
  alerts.forEach(alert => showLocalNotification(alert));
}

async function showLocalNotification(alert) {
  if (Notification.permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;

  registration.showNotification(alert.title, {
    body: alert.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: alert.severity === 'extreme' ? [500, 200, 500, 200, 500] : [200, 100, 200],
    tag: `alert-${alert.severity}`,
    requireInteraction: alert.severity === 'extreme',
    silent: false
  });
}
```

---

## UI de Configuração (Adicionar ao Settings)

```html
<!-- Adicionar na seção de Notificações do settings-panel -->
<div class="settings-option">
  <div>
    <div class="settings-label">Alertas Push</div>
    <div class="settings-desc">Receber notificações de tempo severo</div>
  </div>
  <div class="settings-toggle" id="togglePushAlerts" onclick="togglePushNotifications()"
       role="switch" aria-checked="false" tabindex="0"></div>
</div>

<div class="settings-option" id="alertThresholdOption" style="display:none;">
  <div class="settings-label">Nível de Alerta</div>
  <select class="settings-select" id="selectAlertLevel" onchange="changeAlertLevel(this.value)">
    <option value="all">Todos os alertas</option>
    <option value="severe">Apenas severos</option>
    <option value="extreme">Apenas extremos</option>
  </select>
</div>
```

---

## Códigos de Tempo WMO para Alertas

| Código | Descrição | Severidade |
|--------|-----------|------------|
| 95 | Tempestade leve | severe |
| 96 | Tempestade com granizo leve | severe |
| 99 | Tempestade com granizo forte | extreme |
| 65 | Chuva forte | moderate |
| 75 | Neve forte | moderate |
| 82 | Pancadas fortes | severe |

---

## Checklist de Implementação

- [ ] Adicionar botão/toggle de permissão no Settings
- [ ] Implementar `requestNotificationPermission()`
- [ ] Adicionar push handler no `sw.js`
- [ ] Criar função `checkSevereWeather()`
- [ ] Integrar verificação no `loadLocation()`
- [ ] Adicionar ícones de notificação (icon-192.png, badge-72.png)
- [ ] Testar em dispositivo móvel
- [ ] Adicionar preferências de nível de alerta

---

## Limitações (Sem Backend)

Sem servidor backend, as notificações serão:
1. **Locais** - disparadas quando o app estiver aberto
2. **Polling** - verificar periodicamente via `setInterval`

Para notificações verdadeiras em background, seria necessário:
- Servidor com web-push library
- VAPID keys
- Endpoint para salvar subscriptions
- Cron job para verificar alertas e enviar push

---

## Exemplo de Polling (Sem Backend)

```javascript
// Verificar alertas a cada 30 minutos
setInterval(async () => {
  if (currentLocation.lat && currentLocation.lon) {
    const weather = await fetchWeather(currentLocation.lat, currentLocation.lon);
    if (weather) checkSevereWeather(weather);
  }
}, 30 * 60 * 1000);
```

---

*Última atualização: 2026-02-28*
