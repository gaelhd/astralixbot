const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra información de ayuda sobre el bot')
    .addStringOption(option =>
      option
        .setName('categoria')
        .setDescription('Categoría de ayuda')
        .addChoices(
          { name: 'Webhooks de Tebex', value: 'webhook' },
          { name: 'Sistema de Bienvenida', value: 'welcome' },
          { name: 'Placeholders', value: 'placeholders' }
        )
    ),

  async execute(interaction) {
    const categoria = interaction.options.getString('categoria');

    if (!categoria) {
      // Ayuda general
      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🤖 Ayuda del Bot')
        .setDescription('Bot de Discord con webhooks de Tebex y sistema de bienvenida personalizable.')
        .addFields(
          {
            name: '🛒 Webhooks de Tebex',
            value: 'Recibe notificaciones automáticas de compras desde tu tienda Tebex.\nUsa `/help categoria:Webhooks de Tebex` para más información.',
            inline: false
          },
          {
            name: '👋 Sistema de Bienvenida',
            value: 'Da la bienvenida a nuevos miembros con mensajes personalizados.\nUsa `/help categoria:Sistema de Bienvenida` para más información.',
            inline: false
          },
          {
            name: '📝 Comandos Principales',
            value: '`/webhook` - Configurar webhooks de Tebex\n`/welcome` - Configurar sistema de bienvenida\n`/help` - Ver esta ayuda',
            inline: false
          },
          {
            name: '🔗 Enlaces Útiles',
            value: '[Documentación Completa](https://github.com/tu-repo) | [Soporte](https://discord.gg/tu-server)',
            inline: false
          }
        )
        .setFooter({ text: 'Usa los comandos con /help categoria para más detalles' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (categoria === 'webhook') {
      const embed = new EmbedBuilder()
        .setColor('#00ff9d')
        .setTitle('🛒 Ayuda: Webhooks de Tebex')
        .setDescription('Configuración de notificaciones de compras desde Tebex.')
        .addFields(
          {
            name: '📋 Comandos Disponibles',
            value: '`/webhook enable` - Habilitar webhooks\n`/webhook disable` - Deshabilitar webhooks\n`/webhook config` - Configurar apariencia\n`/webhook fields` - Configurar campos visibles\n`/webhook emojis` - Configurar emojis\n`/webhook info` - Ver configuración actual\n`/webhook test` - Enviar mensaje de prueba',
            inline: false
          },
          {
            name: '⚙️ Configuración Inicial',
            value: '1. `/webhook enable canal:#compras`\n2. Copia la URL del webhook\n3. Configúrala en tu panel de Tebex\n4. Prueba con `/webhook test`',
            inline: false
          },
          {
            name: '🎨 Personalización',
            value: '**Color:** `/webhook config opcion:color valor:#00ff9d`\n**Título:** `/webhook config opcion:title valor:💰 Nueva Compra`\n**Skin de MC:** `/webhook config opcion:useMCSkin valor:true`',
            inline: false
          },
          {
            name: '📊 Campos Configurables',
            value: '• `username` - Nombre del comprador\n• `price` - Precio de la compra\n• `packages` - Paquetes adquiridos\n• `date` - Fecha y hora\n• `transactionid` - ID de transacción',
            inline: false
          },
          {
            name: '🔗 URL del Webhook',
            value: '`https://tu-dominio.railway.app/webhook/tebex`',
            inline: false
          }
        )
        .setFooter({ text: 'Usa /webhook info para ver tu configuración actual' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (categoria === 'welcome') {
      const embed = new EmbedBuilder()
        .setColor('#7289da')
        .setTitle('👋 Ayuda: Sistema de Bienvenida')
        .setDescription('Configuración de mensajes de bienvenida para nuevos miembros.')
        .addFields(
          {
            name: '📋 Comandos Disponibles',
            value: '`/welcome enable` - Habilitar sistema\n`/welcome disable` - Deshabilitar sistema\n`/welcome mensaje` - Configurar mensaje de texto\n`/welcome embed` - Habilitar/deshabilitar embed\n`/welcome embed-config` - Configurar apariencia del embed\n`/welcome embed-field` - Añadir campos al embed\n`/welcome embed-clear-fields` - Limpiar campos\n`/welcome info` - Ver configuración\n`/welcome test` - Enviar prueba',
            inline: false
          },
          {
            name: '⚙️ Configuración Inicial',
            value: '1. `/welcome enable canal:#bienvenida rol:@Miembro`\n2. `/welcome mensaje contenido:¡Hola {user}!`\n3. `/welcome embed estado:true`\n4. Prueba con `/welcome test`',
            inline: false
          },
          {
            name: '🎨 Personalización del Embed',
            value: '**Color:** `/welcome embed-config opcion:color valor:#7289da`\n**Título:** `/welcome embed-config opcion:title valor:¡Bienvenido a {server}!`\n**Thumbnail:** `/welcome embed-config opcion:thumbnailUrl valor:{avatar}`',
            inline: false
          },
          {
            name: '📝 Añadir Campos',
            value: '`/welcome embed-field nombre:📜 Reglas valor:Lee #reglas`\n`/welcome embed-field nombre:❓ Soporte valor:Abre un ticket`',
            inline: false
          },
          {
            name: '🔖 Placeholders Disponibles',
            value: '• `{user}` - Mención del usuario\n• `{username}` - Nombre del usuario\n• `{server}` - Nombre del servidor\n• `{members}` - Total de miembros\n• `{avatar}` - Avatar del usuario\n• `{serverIcon}` - Icono del servidor',
            inline: false
          }
        )
        .setFooter({ text: 'Usa /help categoria:Placeholders para más info sobre placeholders' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (categoria === 'placeholders') {
      const embed = new EmbedBuilder()
        .setColor('#f1c40f')
        .setTitle('🔖 Ayuda: Placeholders')
        .setDescription('Variables dinámicas que puedes usar en tus mensajes.')
        .addFields(
          {
            name: '👤 Placeholders de Usuario',
            value: '`{user}` - Mención del usuario (@Usuario)\n`{username}` - Nombre del usuario\n`{avatar}` - URL del avatar del usuario',
            inline: false
          },
          {
            name: '🏰 Placeholders del Servidor',
            value: '`{server}` - Nombre del servidor\n`{serverIcon}` - URL del icono del servidor\n`{members}` - Cantidad total de miembros',
            inline: false
          },
          {
            name: '💡 Ejemplos de Uso',
            value: '**Mensaje simple:**\n```¡Hola {user}! Bienvenido a {server}```\n\n**Con detalles:**\n```¡Hola {username}! Eres el miembro #{members} de {server} 🎉```',
            inline: false
          },
          {
            name: '🎯 Dónde Usar Placeholders',
            value: '✅ Mensaje de texto de bienvenida\n✅ Título del embed\n✅ Descripción del embed\n✅ Campos del embed\n✅ Footer del embed\n✅ URLs de thumbnail y footer icon',
            inline: false
          },
          {
            name: '⚠️ Notas Importantes',
            value: '• Los placeholders distinguen entre mayúsculas y minúsculas\n• Usa `{avatar}` solo en campos de URL\n• `{user}` crea una mención, `{username}` solo el texto\n• Los placeholders se reemplazan automáticamente',
            inline: false
          },
          {
            name: '📝 Ejemplo Completo',
            value: '```/welcome mensaje contenido:¡Hola {user}! 🎉\n/welcome embed-config opcion:title valor:Bienvenido a {server}\n/welcome embed-config opcion:description valor:{username}, eres nuestro miembro #{members}\n/welcome embed-config opcion:thumbnailUrl valor:{avatar}\n/welcome embed-config opcion:footerText valor:Gracias por unirte a {server}```',
            inline: false
          }
        )
        .setFooter({ text: 'Experimenta con /welcome test para ver los resultados' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
