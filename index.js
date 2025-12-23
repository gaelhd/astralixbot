const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Cargar configuración
let config = require('./config.json');

// Sobrescribir con variables de entorno si existen (para Railway)
if (process.env.BOT_TOKEN) {
  config.bot.token = process.env.BOT_TOKEN;
}
if (process.env.CLIENT_ID) {
  config.bot.clientId = process.env.CLIENT_ID;
}
if (process.env.DEBUG) {
  config.server.debug = process.env.DEBUG === 'true';
}

// Función para guardar configuración
function saveConfig() {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

// Crear cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Colección de comandos
client.commands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(colors.green(`✓ Comando cargado: ${command.data.name}`));
    }
  }
}

// Evento: Bot listo
client.once('ready', async () => {
  console.log(colors.green(`✓ Bot conectado como ${client.user.tag}`));
  console.log(colors.cyan(`✓ Servidores: ${client.guilds.cache.size}`));
  
  // Registrar comandos slash
  await registerCommands();
  
  // Iniciar servidor web
  startWebServer();
});

// Evento: Interacción (comandos slash)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, config, saveConfig);
  } catch (error) {
    console.error(colors.red(`Error ejecutando comando ${interaction.commandName}:`), error);
    const errorMessage = { content: '❌ Hubo un error al ejecutar este comando.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Evento: Nuevo miembro
client.on('guildMemberAdd', async member => {
  if (!config.welcome.enabled || !config.welcome.channelId) return;

  try {
    const channel = member.guild.channels.cache.get(config.welcome.channelId);
    if (!channel) return;

    // Asignar rol si está configurado
    if (config.welcome.roleId) {
      const role = member.guild.roles.cache.get(config.welcome.roleId);
      if (role) {
        await member.roles.add(role).catch(console.error);
      }
    }

    // Preparar mensaje con placeholders
    const messageContent = replacePlaceholders(config.welcome.message.content, {
      user: member.user,
      server: member.guild,
      members: member.guild.memberCount
    });

    const messageData = { content: messageContent };

    // Crear embed si está habilitado
    if (config.welcome.message.embed.enabled) {
      const embed = new EmbedBuilder()
        .setColor(config.welcome.message.embed.color || '#7289da');

      // Título
      if (config.welcome.message.embed.title) {
        embed.setTitle(replacePlaceholders(config.welcome.message.embed.title, {
          user: member.user,
          server: member.guild,
          members: member.guild.memberCount
        }));
      }

      // Descripción
      if (config.welcome.message.embed.description) {
        embed.setDescription(replacePlaceholders(config.welcome.message.embed.description, {
          user: member.user,
          server: member.guild,
          members: member.guild.memberCount
        }));
      }

      // Thumbnail
      if (config.welcome.message.embed.thumbnailUrl) {
        const thumbnailUrl = replacePlaceholders(config.welcome.message.embed.thumbnailUrl, {
          user: member.user,
          server: member.guild
        });
        embed.setThumbnail(thumbnailUrl);
      }

      // Imagen
      if (config.welcome.message.embed.imageUrl) {
        embed.setImage(config.welcome.message.embed.imageUrl);
      }

      // Fields
      if (config.welcome.message.embed.fields && config.welcome.message.embed.fields.length > 0) {
        for (const field of config.welcome.message.embed.fields) {
          embed.addFields({
            name: field.name,
            value: replacePlaceholders(field.value, {
              user: member.user,
              server: member.guild,
              members: member.guild.memberCount
            }),
            inline: field.inline || false
          });
        }
      }

      // Footer
      if (config.welcome.message.embed.footerText) {
        const footerText = replacePlaceholders(config.welcome.message.embed.footerText, {
          user: member.user,
          server: member.guild,
          members: member.guild.memberCount
        });
        const footerIcon = config.welcome.message.embed.footerIcon 
          ? replacePlaceholders(config.welcome.message.embed.footerIcon, { server: member.guild })
          : null;
        
        embed.setFooter({ text: footerText, iconURL: footerIcon });
      }

      embed.setTimestamp();
      messageData.embeds = [embed];
    }

    await channel.send(messageData);
  } catch (error) {
    console.error(colors.red('Error enviando mensaje de bienvenida:'), error);
  }
});

// Función para reemplazar placeholders
function replacePlaceholders(text, data) {
  if (!text) return text;
  
  let result = text;
  
  if (data.user) {
    result = result.replace(/{user}/g, `<@${data.user.id}>`);
    result = result.replace(/{username}/g, data.user.username);
    result = result.replace(/{avatar}/g, data.user.displayAvatarURL({ dynamic: true, size: 256 }));
  }
  
  if (data.server) {
    result = result.replace(/{server}/g, data.server.name);
    result = result.replace(/{serverIcon}/g, data.server.iconURL({ dynamic: true }) || '');
  }
  
  if (data.members) {
    result = result.replace(/{members}/g, data.members.toString());
  }
  
  return result;
}

// Función para registrar comandos slash
async function registerCommands() {
  try {
    const commands = [];
    for (const command of client.commands.values()) {
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(config.bot.token);
    
    console.log(colors.yellow(`Registrando ${commands.length} comandos slash...`));
    
    await rest.put(
      Routes.applicationCommands(config.bot.clientId),
      { body: commands }
    );
    
    console.log(colors.green('✓ Comandos slash registrados exitosamente'));
  } catch (error) {
    console.error(colors.red('Error registrando comandos:'), error);
  }
}

// Servidor web para webhooks
function startWebServer() {
  const app = express();
  const port = process.env.PORT || config.server.port || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ruta principal
  app.get('/', (req, res) => {
    res.json({ 
      status: 'online', 
      bot: client.user.tag,
      webhooks: {
        tebex: config.webhooks.tebex.enabled
      }
    });
  });

  // Webhook de Tebex
  app.post('/webhook/tebex', async (req, res) => {
    try {
      // Verificar IP si está habilitado
      const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const allowedIPs = config.webhooks.tebex.allowedIPs;
      
      if (allowedIPs && allowedIPs.length > 0) {
        const isAllowed = allowedIPs.some(ip => clientIP.includes(ip));
        if (!isAllowed && !clientIP.includes('127.0.0.1')) {
          console.log(colors.red(`IP no autorizada: ${clientIP}`));
          return res.status(403).json({ error: 'IP no autorizada' });
        }
      }

      // Validación de webhook de Tebex
      if (req.body.type === 'validation.webhook') {
        return res.status(200).json(req.body);
      }

      // Verificar que el webhook esté habilitado
      if (!config.webhooks.tebex.enabled || !config.webhooks.tebex.channelId) {
        return res.status(200).json({ message: 'Webhook deshabilitado' });
      }

      if (config.server.debug) {
        console.log(colors.cyan('Webhook recibido:'), JSON.stringify(req.body, null, 2));
      }

      // Procesar compra
      await processTebexPurchase(req.body);
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(colors.red('Error procesando webhook:'), error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  app.listen(port, () => {
    console.log(colors.green(`✓ Servidor web iniciado en puerto ${port}`));
  });
}

// Función para procesar compra de Tebex
async function processTebexPurchase(data) {
  try {
    const channel = client.channels.cache.get(config.webhooks.tebex.channelId);
    if (!channel) {
      console.error(colors.red('Canal de tienda no encontrado'));
      return;
    }

    const subject = data.subject;
    const customer = subject.customer;
    const products = subject.products || [];
    const price = subject.price;

    const embedConfig = config.webhooks.tebex.embedConfig;
    const embed = new EmbedBuilder()
      .setColor(embedConfig.color || '#00ff9d')
      .setTimestamp();

    // Título
    const title = embedConfig.title 
      ? `${embedConfig.emojis.title || ''} ${embedConfig.title}`.trim()
      : '💰 Nueva Compra';
    embed.setTitle(title);

    // Descripción (opcional)
    if (embedConfig.description) {
      embed.setDescription(embedConfig.description);
    }

    // Thumbnail (skin de Minecraft o personalizado)
    if (embedConfig.useMCSkin && customer.username && customer.username.username) {
      embed.setThumbnail(`https://mc-heads.net/avatar/${customer.username.username}`);
    } else if (embedConfig.thumbnailUrl) {
      embed.setThumbnail(embedConfig.thumbnailUrl);
    }

    // Imagen
    if (embedConfig.imageUrl) {
      embed.setImage(embedConfig.imageUrl);
    }

    // Fields configurables
    if (embedConfig.fields.username && customer.username) {
      embed.addFields({
        name: `${embedConfig.emojis.user || '👤'} Usuario:`,
        value: customer.username.username || 'Desconocido',
        inline: true
      });
    }

    if (embedConfig.fields.price && price) {
      const priceText = price.amount > 0 
        ? `${price.amount.toFixed(2)} ${price.currency} ${embedConfig.emojis.currency || '💵'}`
        : '🎁 Obtenido con GiftCard';
      
      embed.addFields({
        name: 'Valor Total:',
        value: priceText,
        inline: true
      });
    }

    if (embedConfig.fields.packages && products.length > 0) {
      const packagesList = products.map(p => {
        const serverInfo = p.servers && p.servers.length > 0 
          ? ` (${p.servers.map(s => s.name).join(', ')})`
          : '';
        return `${embedConfig.emojis.package || '📦'} ${p.name} x${p.quantity} - $${p.paid_price.amount.toFixed(2)}${serverInfo}`;
      }).join('\n');

      embed.addFields({
        name: products.length > 1 ? 'Paquetes Adquiridos:' : 'Paquete Adquirido:',
        value: packagesList,
        inline: false
      });
    }

    if (embedConfig.fields.date) {
      embed.addFields({
        name: '📅 Fecha:',
        value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
        inline: true
      });
    }

    if (embedConfig.fields.transactionId && subject.transaction_id) {
      embed.addFields({
        name: '🔖 ID Transacción:',
        value: subject.transaction_id,
        inline: true
      });
    }

    // Footer
    if (embedConfig.footerText) {
      const footerText = embedConfig.footerUrl 
        ? `${embedConfig.footerText} ${embedConfig.footerUrl.replace('https://', '').replace('http://', '')}`
        : embedConfig.footerText;
      embed.setFooter({ text: footerText });
    }

    // Enviar mensaje
    const message = await channel.send({ embeds: [embed] });
    
    // Agregar reacción
    if (embedConfig.emojis.reaction) {
      await message.react(embedConfig.emojis.reaction).catch(console.error);
    }

    console.log(colors.green('✓ Notificación de compra enviada'));
  } catch (error) {
    console.error(colors.red('Error enviando notificación de compra:'), error);
  }
}

// Exportar funciones
module.exports = { client, config, saveConfig };

// Iniciar bot
client.login(config.bot.token).catch(error => {
  console.error(colors.red('Error al iniciar el bot:'), error);
  process.exit(1);
});
