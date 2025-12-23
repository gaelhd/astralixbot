# 📦 Estructura del Proyecto - Bot de Discord con Tebex

## ✅ Archivos Creados

```
discord-tebex-bot/
├── commands/
│   ├── webhook.js       # Comandos para configurar webhooks de Tebex
│   ├── welcome.js       # Comandos para configurar bienvenida
│   └── help.js          # Sistema de ayuda integrado
├── index.js             # Bot principal con eventos y servidor web
├── config.json          # Configuración del bot (EDITABLE)
├── config.example.json  # Ejemplo de configuración
├── package.json         # Dependencias del proyecto
├── .env.example         # Variables de entorno para Railway
├── .gitignore          # Archivos a ignorar en Git
├── README.md           # Documentación completa
└── QUICKSTART.md       # Guía de inicio rápido
```

## 🎯 Características Implementadas

### ✅ Sistema de Webhooks de Tebex
- [x] Endpoint `/webhook/tebex` para recibir notificaciones
- [x] Validación de IPs de Tebex
- [x] Embeds completamente personalizables
- [x] Soporte para skins de Minecraft automáticas
- [x] Campos configurables (username, price, packages, date, transactionId)
- [x] Emojis personalizables
- [x] Reacciones automáticas
- [x] Comando de prueba incluido

### ✅ Sistema de Bienvenida
- [x] Mensajes personalizados con placeholders
- [x] Embeds configurables
- [x] Campos dinámicos personalizables
- [x] Asignación automática de roles
- [x] Placeholders: {user}, {username}, {server}, {members}, {avatar}, {serverIcon}
- [x] Comando de prueba incluido

### ✅ Comandos Slash

#### `/webhook`
- `enable` - Habilitar webhook con canal
- `disable` - Deshabilitar webhook
- `config` - Configurar apariencia (color, título, imágenes, footer, etc.)
- `fields` - Activar/desactivar campos visibles
- `emojis` - Configurar emojis personalizados
- `info` - Ver configuración actual
- `test` - Enviar mensaje de prueba

#### `/welcome`
- `enable` - Habilitar con canal y rol opcional
- `disable` - Deshabilitar
- `mensaje` - Configurar texto del mensaje
- `embed` - Habilitar/deshabilitar embed
- `embed-config` - Configurar apariencia del embed
- `embed-field` - Añadir campos al embed
- `embed-clear-fields` - Limpiar todos los campos
- `info` - Ver configuración actual
- `test` - Enviar mensaje de prueba

#### `/help`
- Vista general del bot
- Ayuda detallada por categoría
- Guía de placeholders

## 🚀 Pasos para Usar

### 1. Instalación Local
```bash
# Instalar dependencias
npm install

# Editar config.json con tu token y client ID

# Iniciar bot
npm start
```

### 2. Despliegue en Railway
```bash
# Opción 1: Desde GitHub
1. Subir código a GitHub
2. Conectar con Railway
3. Añadir variables: BOT_TOKEN, CLIENT_ID
4. Desplegar

# Opción 2: Railway CLI
railway login
railway init
railway variables set BOT_TOKEN=tu_token
railway variables set CLIENT_ID=tu_client_id
railway up
```

### 3. Configurar en Discord
```
# Webhooks de Tebex
/webhook enable canal:#compras
/webhook config opcion:useMCSkin valor:true
/webhook test

# Sistema de Bienvenida
/welcome enable canal:#bienvenida rol:@Miembro
/welcome embed estado:true
/welcome embed-config opcion:title valor:¡Bienvenido a {server}! 🌟
/welcome embed-config opcion:thumbnailUrl valor:{avatar}
/welcome test
```

### 4. Conectar Tebex
```
URL: https://tu-proyecto.railway.app/webhook/tebex
Evento: Payment: Complete
```

## 📊 Placeholders de Tebex Disponibles

El bot recibe automáticamente de Tebex:
- Username del comprador (se puede mostrar skin de MC)
- Precio total y moneda
- Lista de paquetes adquiridos con cantidades
- Servidores asociados a cada paquete
- ID de transacción
- Fecha y hora de la compra
- Información del pago (GiftCard o pago directo)

## 🎨 Ejemplos de Uso

### Ejemplo 1: Webhook Minimalista
```
/webhook config opcion:color valor:#2ecc71
/webhook config opcion:title valor:Nueva Compra
/webhook config opcion:useMCSkin valor:true
/webhook fields username:true price:true packages:true
```

### Ejemplo 2: Webhook Completo
```
/webhook config opcion:color valor:#9b59b6
/webhook config opcion:title valor:💎 Nueva Donación
/webhook config opcion:imageUrl valor:https://i.imgur.com/banner.png
/webhook fields username:true price:true packages:true date:true
/webhook emojis tipo:title emoji:💎
/webhook emojis tipo:currency emoji:💵
```

### Ejemplo 3: Bienvenida Personalizada
```
/welcome mensaje contenido:¡Hola {user}! Bienvenido a nuestra comunidad 🎉
/welcome embed-config opcion:title valor:¡Bienvenido a {server}! 🌟
/welcome embed-config opcion:description valor:Nos alegra tenerte aquí, {username}
/welcome embed-config opcion:color valor:#7289da
/welcome embed-config opcion:thumbnailUrl valor:{avatar}
/welcome embed-config opcion:footerText valor:Ahora somos {members} contigo!
/welcome embed-field nombre:📜 Reglas valor:Lee #reglas para empezar
/welcome embed-field nombre:❓ Ayuda valor:Abre un ticket si necesitas soporte
```

## 🔧 Tecnologías Utilizadas

- **discord.js v14** - Librería principal de Discord
- **express** - Servidor web para webhooks
- **colors** - Logs coloridos en consola
- **Node.js 16+** - Runtime

## 📝 Notas Importantes

### Intents Requeridos en Discord
```
✅ Server Members Intent (para detectar nuevos miembros)
✅ Message Content Intent (para funcionalidad completa)
```

### Permisos del Bot
```
✅ Administrator (recomendado para facilitar configuración)
O configurar manualmente:
- Manage Roles
- Send Messages
- Embed Links
- Add Reactions
- Manage Messages
```

### Variables de Entorno (Railway)
```
BOT_TOKEN=tu_token_de_discord
CLIENT_ID=tu_client_id
DEBUG=false (opcional)
```

## 🐛 Troubleshooting

**Bot no se conecta:**
→ Verifica el token en config.json o variable de entorno

**Comandos no aparecen:**
→ Espera 5 minutos (Discord cache)
→ Verifica Client ID correcto

**Webhook falla:**
→ URL debe terminar en /webhook/tebex
→ Verifica que el bot esté online

**Bienvenida no funciona:**
→ Activa Server Members Intent
→ Verifica permisos en el canal

## 📚 Documentación Adicional

- `README.md` - Documentación completa del proyecto
- `QUICKSTART.md` - Guía de inicio rápido
- `/help` - Ayuda integrada en Discord

## 🎯 Próximas Mejoras Sugeridas

- [ ] Sistema de logs de transacciones
- [ ] Estadísticas de ventas
- [ ] Múltiples idiomas
- [ ] Panel web de administración
- [ ] Integración con más plataformas de pago
- [ ] Sistema de roles automáticos por compra

## ✨ Listo para Usar

El bot está completamente funcional y listo para:
1. Recibir webhooks de Tebex
2. Enviar notificaciones personalizadas
3. Dar bienvenida a nuevos miembros
4. Ser configurado completamente desde Discord

**¡Todo funciona desde comandos de Discord, sin necesidad de editar código!**
