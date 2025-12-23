# 🤖 Bot de Discord con Webhooks de Tebex

Bot de Discord completamente configurable mediante comandos slash para recibir notificaciones de compras de Tebex y dar la bienvenida a nuevos miembros.

## ✨ Características

### 🛒 Sistema de Webhooks de Tebex
- ✅ Notificaciones automáticas de compras
- 🎨 Embeds completamente personalizables
- 🖼️ Soporte para skins de Minecraft
- ⚙️ Configuración completa desde Discord
- 🔒 Validación de IPs de Tebex

### 👋 Sistema de Bienvenida
- 💬 Mensajes personalizados con placeholders
- 📝 Embeds configurables con campos dinámicos
- 🎭 Asignación automática de roles
- 🎨 Totalmente personalizable

## 📦 Instalación

### Requisitos Previos
- Node.js 16.9.0 o superior
- Una cuenta de Discord Developer
- Un servidor de Discord con permisos de administrador

### Paso 1: Configurar el Bot de Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot
5. En la sección "OAuth2" > "General", copia el Client ID
6. Habilita los siguientes **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### Paso 2: Invitar el Bot

Usa esta URL reemplazando `CLIENT_ID` con tu Client ID:
```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### Paso 3: Configurar el Proyecto

1. Clona o descarga este repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de configuración:
```bash
cp config.example.json config.json
```

4. Edita `config.json` y añade:
   - Tu token de Discord en `bot.token`
   - Tu Client ID en `bot.clientId`

### Paso 4: Iniciar el Bot

```bash
npm start
```

El bot se conectará y registrará los comandos slash automáticamente.

## 🚀 Despliegue en Railway

### Paso 1: Preparar el Proyecto

1. Sube tu proyecto a GitHub (asegúrate de NO subir `config.json` con tus tokens)
2. Ve a [Railway.app](https://railway.app)
3. Crea un nuevo proyecto desde tu repositorio de GitHub

### Paso 2: Configurar Variables de Entorno

En el dashboard de Railway, añade estas variables:
- `BOT_TOKEN`: Tu token de Discord
- `CLIENT_ID`: Tu Client ID de Discord

### Paso 3: Desplegar

Railway desplegará automáticamente tu bot. Una vez desplegado:

1. Anota la URL que te proporciona Railway (ejemplo: `https://tu-proyecto.up.railway.app`)
2. Esta URL la usarás para configurar el webhook de Tebex

## 📝 Comandos del Bot

### 🛒 Comandos de Webhook

#### `/webhook enable`
Habilita el sistema de webhooks de Tebex.
```
/webhook enable canal:#compras
```

#### `/webhook disable`
Deshabilita las notificaciones de compras.

#### `/webhook config`
Configura la apariencia del embed.
```
/webhook config opcion:color valor:#00ff9d
/webhook config opcion:title valor:💰 Nueva Donación
/webhook config opcion:useMCSkin valor:true
```

**Opciones disponibles:**
- `color`: Color del embed (formato hex: #00ff9d)
- `title`: Título del embed
- `description`: Descripción del embed
- `imageUrl`: URL de la imagen principal
- `thumbnailUrl`: URL del thumbnail personalizado
- `footerText`: Texto del footer
- `footerUrl`: URL mostrada en el footer
- `useMCSkin`: Usar skin de Minecraft como thumbnail (true/false)

#### `/webhook fields`
Configura qué campos mostrar en el embed.
```
/webhook fields username:true price:true packages:true date:true
```

**Campos disponibles:**
- `username`: Nombre del comprador
- `price`: Precio de la compra
- `packages`: Paquetes adquiridos
- `date`: Fecha y hora
- `transactionid`: ID de la transacción

#### `/webhook emojis`
Configura los emojis del embed.
```
/webhook emojis tipo:title emoji:💰
/webhook emojis tipo:currency emoji:💵
/webhook emojis tipo:reaction emoji:✅
```

**Tipos de emoji:**
- `title`: Emoji en el título
- `currency`: Emoji de moneda
- `package`: Emoji de paquete
- `user`: Emoji de usuario
- `reaction`: Reacción automática al mensaje

#### `/webhook info`
Muestra la configuración actual del webhook.

#### `/webhook test`
Envía un mensaje de prueba al canal configurado.

### 👋 Comandos de Bienvenida

#### `/welcome enable`
Habilita el sistema de bienvenida.
```
/welcome enable canal:#bienvenida rol:@Miembro
```

#### `/welcome disable`
Deshabilita los mensajes de bienvenida.

#### `/welcome mensaje`
Configura el mensaje de texto.
```
/welcome mensaje contenido:¡Hola {user}! Bienvenido a {server} 🎉
```

**Placeholders disponibles:**
- `{user}`: Mención del usuario
- `{username}`: Nombre del usuario
- `{server}`: Nombre del servidor
- `{members}`: Cantidad de miembros
- `{avatar}`: URL del avatar del usuario
- `{serverIcon}`: URL del icono del servidor

#### `/welcome embed`
Habilita o deshabilita el embed.
```
/welcome embed estado:true
```

#### `/welcome embed-config`
Configura la apariencia del embed.
```
/welcome embed-config opcion:color valor:#7289da
/welcome embed-config opcion:title valor:¡Bienvenido a {server}! 🌟
/welcome embed-config opcion:thumbnailUrl valor:{avatar}
```

**Opciones disponibles:**
- `color`: Color del embed
- `title`: Título del embed
- `description`: Descripción del embed
- `imageUrl`: URL de la imagen principal
- `thumbnailUrl`: URL del thumbnail (usa `{avatar}` para el avatar del usuario)
- `footerText`: Texto del footer
- `footerIcon`: Icono del footer (usa `{serverIcon}` para el icono del servidor)

#### `/welcome embed-field`
Añade un campo al embed.
```
/welcome embed-field nombre:📜 Reglas valor:Lee las reglas en #reglas inline:false
```

#### `/welcome embed-clear-fields`
Elimina todos los campos del embed.

#### `/welcome info`
Muestra la configuración actual de bienvenida.

#### `/welcome test`
Envía un mensaje de prueba de bienvenida.

## 🔧 Configuración de Tebex

1. Ve a tu panel de Tebex
2. Navega a **Developers** > **Webhooks**
3. Haz clic en **Create Webhook**
4. Añade la URL de tu bot: `https://tu-dominio.railway.app/webhook/tebex`
5. Selecciona el evento: **Payment: Complete**
6. Guarda los cambios

Tebex enviará una solicitud de validación automáticamente. Si todo está correcto, verás el webhook como "Verified".

## 📊 Placeholders de Tebex

Los siguientes datos están disponibles automáticamente:
- Username del comprador
- Precio total
- Moneda
- Paquetes adquiridos
- Cantidad de cada paquete
- Servidores asociados
- ID de transacción
- Fecha y hora

## 🎨 Ejemplos de Configuración

### Ejemplo 1: Estilo Minimalista
```
/webhook config opcion:color valor:#2ecc71
/webhook config opcion:title valor:Nueva Compra
/webhook config opcion:useMCSkin valor:true
/webhook fields username:true price:true packages:true
```

### Ejemplo 2: Estilo Completo
```
/webhook config opcion:color valor:#9b59b6
/webhook config opcion:title valor:💎 Nueva Donación
/webhook config opcion:description valor:¡Gracias por apoyar el servidor!
/webhook config opcion:imageUrl valor:https://i.imgur.com/banner.png
/webhook fields username:true price:true packages:true date:true transactionid:true
```

### Ejemplo 3: Bienvenida Personalizada
```
/welcome mensaje contenido:¡Hola {user}! 🎉
/welcome embed estado:true
/welcome embed-config opcion:title valor:¡Bienvenido a {server}! 🌟
/welcome embed-config opcion:description valor:Nos alegra tenerte aquí
/welcome embed-config opcion:color valor:#7289da
/welcome embed-config opcion:thumbnailUrl valor:{avatar}
/welcome embed-config opcion:footerText valor:Ahora somos {members} contigo!
/welcome embed-field nombre:📜 Reglas valor:Lee #reglas para empezar
/welcome embed-field nombre:❓ Soporte valor:Abre un ticket si necesitas ayuda
```

## 🐛 Solución de Problemas

### El bot no responde a los comandos
1. Verifica que el bot tenga permisos de administrador
2. Asegúrate de que los intents estén habilitados en el Developer Portal
3. Reinicia el bot

### Los webhooks no llegan
1. Verifica la URL en Tebex (debe terminar en `/webhook/tebex`)
2. Revisa que el webhook esté habilitado con `/webhook enable`
3. Verifica los logs del servidor

### El mensaje de bienvenida no se envía
1. Usa `/welcome info` para verificar la configuración
2. Asegúrate de que el bot tenga permisos en el canal
3. Verifica que el Intent "Server Members" esté habilitado

## 📄 Licencia

MIT License - Siéntete libre de usar y modificar este bot.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📞 Soporte

Si tienes problemas, crea un issue en el repositorio o contacta al desarrollador.
