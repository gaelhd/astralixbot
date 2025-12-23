# 🚀 Guía de Inicio Rápido

## 📋 Pasos para Configurar el Bot

### 1️⃣ Configurar el Bot en Discord (5 minutos)

1. Ve a https://discord.com/developers/applications
2. Haz clic en "New Application" y dale un nombre
3. Ve a la sección "Bot":
   - Haz clic en "Add Bot"
   - Copia el **TOKEN** (lo necesitarás después)
   - Activa estos intents:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
4. Ve a la sección "OAuth2" > "General":
   - Copia el **Client ID**

### 2️⃣ Invitar el Bot a tu Servidor

Usa esta URL (reemplaza CLIENT_ID):
```
https://discord.com/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 3️⃣ Configurar el Proyecto Localmente

```bash
# Instalar dependencias
npm install

# Editar configuración
# Abre config.json y añade tu TOKEN y CLIENT_ID
```

```json
{
  "bot": {
    "token": "TU_TOKEN_AQUI",
    "clientId": "TU_CLIENT_ID_AQUI"
  }
}
```

### 4️⃣ Iniciar el Bot

```bash
npm start
```

## 🌐 Desplegar en Railway

### Opción A: Desde GitHub

1. Sube tu código a GitHub (SIN el config.json)
2. Ve a https://railway.app
3. Conecta tu repositorio
4. Añade estas variables de entorno:
   - `BOT_TOKEN`: Tu token de Discord
   - `CLIENT_ID`: Tu Client ID
5. ¡Despliega!

### Opción B: Desde CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Añadir variables
railway variables set BOT_TOKEN=tu_token_aqui
railway variables set CLIENT_ID=tu_client_id_aqui

# Desplegar
railway up
```

## ⚡ Configuración Rápida en Discord

### Configurar Webhooks de Tebex

```
1. /webhook enable canal:#compras
2. /webhook config opcion:useMCSkin valor:true
3. /webhook test
```

### Configurar Sistema de Bienvenida

```
1. /welcome enable canal:#bienvenida rol:@Miembro
2. /welcome embed estado:true
3. /welcome test
```

## 🔗 Conectar con Tebex

1. Anota tu URL de Railway: `https://tu-proyecto.railway.app`
2. Ve a tu panel de Tebex > Developers > Webhooks
3. Añade: `https://tu-proyecto.railway.app/webhook/tebex`
4. Selecciona evento: "Payment: Complete"
5. ¡Listo!

## 📊 Verificar que Todo Funciona

### ✅ Checklist

- [ ] Bot online en Discord
- [ ] Comandos slash aparecen en Discord
- [ ] `/webhook enable` funciona
- [ ] `/webhook test` envía mensaje
- [ ] `/welcome enable` funciona
- [ ] `/welcome test` envía mensaje
- [ ] Webhook de Tebex verificado

## 🆘 Problemas Comunes

**"Bot no se conecta"**
→ Verifica que el token sea correcto

**"Comandos no aparecen"**
→ Espera 5 minutos, Discord tarda en actualizar
→ Verifica que el Client ID sea correcto

**"Webhook de Tebex falla"**
→ Asegúrate de que la URL termine en `/webhook/tebex`
→ Verifica que el bot esté desplegado y online

**"Bienvenida no funciona"**
→ Activa "Server Members Intent" en Discord Developer Portal
→ Espera 5 minutos y reinicia el bot

## 💡 Próximos Pasos

1. Personaliza los embeds con `/webhook config`
2. Añade campos personalizados con `/welcome embed-field`
3. Configura emojis personalizados con `/webhook emojis`
4. Prueba diferentes estilos con `/webhook test` y `/welcome test`

---

**¿Necesitas ayuda?** Revisa el README.md completo para documentación detallada.
