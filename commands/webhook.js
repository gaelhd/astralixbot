const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('webhook')
    .setDescription('Configurar sistema de webhooks de Tebex')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Habilitar webhook de Tebex')
        .addChannelOption(option =>
          option
            .setName('canal')
            .setDescription('Canal donde se enviarán las notificaciones de compras')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Deshabilitar webhook de Tebex')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('config')
        .setDescription('Configurar apariencia del embed')
        .addStringOption(option =>
          option
            .setName('opcion')
            .setDescription('Opción a configurar')
            .setRequired(true)
            .addChoices(
              { name: 'Color del embed', value: 'color' },
              { name: 'Título', value: 'title' },
              { name: 'Descripción', value: 'description' },
              { name: 'URL de imagen principal', value: 'imageUrl' },
              { name: 'URL de thumbnail personalizado', value: 'thumbnailUrl' },
              { name: 'Texto del footer', value: 'footerText' },
              { name: 'URL en el footer', value: 'footerUrl' },
              { name: 'Usar skin de Minecraft', value: 'useMCSkin' }
            )
        )
        .addStringOption(option =>
          option
            .setName('valor')
            .setDescription('Nuevo valor (true/false para usar skin de MC)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('fields')
        .setDescription('Configurar campos visibles en el embed')
        .addBooleanOption(option =>
          option
            .setName('username')
            .setDescription('Mostrar nombre de usuario')
        )
        .addBooleanOption(option =>
          option
            .setName('price')
            .setDescription('Mostrar precio')
        )
        .addBooleanOption(option =>
          option
            .setName('packages')
            .setDescription('Mostrar paquetes')
        )
        .addBooleanOption(option =>
          option
            .setName('date')
            .setDescription('Mostrar fecha')
        )
        .addBooleanOption(option =>
          option
            .setName('transactionid')
            .setDescription('Mostrar ID de transacción')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('emojis')
        .setDescription('Configurar emojis del embed')
        .addStringOption(option =>
          option
            .setName('tipo')
            .setDescription('Tipo de emoji')
            .setRequired(true)
            .addChoices(
              { name: 'Título', value: 'title' },
              { name: 'Moneda', value: 'currency' },
              { name: 'Paquete', value: 'package' },
              { name: 'Usuario', value: 'user' },
              { name: 'Reacción', value: 'reaction' }
            )
        )
        .addStringOption(option =>
          option
            .setName('emoji')
            .setDescription('Emoji a usar (emoji o ID personalizado)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('Ver configuración actual del webhook')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('test')
        .setDescription('Enviar un mensaje de prueba')
    ),

  async execute(interaction, config, saveConfig) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'enable') {
      const channel = interaction.options.getChannel('canal');
      
      config.webhooks.tebex.enabled = true;
      config.webhooks.tebex.channelId = channel.id;
      saveConfig();

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Webhook de Tebex Habilitado')
        .setDescription(`Las notificaciones de compras se enviarán a ${channel}`)
        .addFields(
          { 
            name: '📝 URL del Webhook', 
            value: `\`\`\`https://tu-dominio.railway.app/webhook/tebex\`\`\``,
            inline: false
          },
          {
            name: '⚙️ Configuración en Tebex',
            value: '1. Ve a tu panel de Tebex\n2. Navega a **Developers > Webhooks**\n3. Añade la URL mostrada arriba\n4. Guarda los cambios',
            inline: false
          }
        )
        .setFooter({ text: 'Usa /webhook info para ver la configuración completa' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (subcommand === 'disable') {
      config.webhooks.tebex.enabled = false;
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Webhook de Tebex Deshabilitado')
            .setDescription('Las notificaciones de compras han sido deshabilitadas.')
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'config') {
      const option = interaction.options.getString('opcion');
      const value = interaction.options.getString('valor');

      if (option === 'useMCSkin') {
        config.webhooks.tebex.embedConfig.useMCSkin = value.toLowerCase() === 'true';
      } else if (option === 'color') {
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          return interaction.reply({
            content: '❌ Color inválido. Usa formato hexadecimal (ejemplo: #00ff9d)',
            ephemeral: true
          });
        }
        config.webhooks.tebex.embedConfig.color = value;
      } else {
        config.webhooks.tebex.embedConfig[option] = value;
      }

      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Configuración Actualizada')
            .addFields({
              name: option,
              value: `\`${value}\``,
              inline: false
            })
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'fields') {
      const updates = [];
      const options = ['username', 'price', 'packages', 'date', 'transactionid'];

      for (const opt of options) {
        const value = interaction.options.getBoolean(opt);
        if (value !== null) {
          const key = opt === 'transactionid' ? 'transactionId' : opt;
          config.webhooks.tebex.embedConfig.fields[key] = value;
          updates.push(`${opt}: ${value ? '✅' : '❌'}`);
        }
      }

      if (updates.length === 0) {
        return interaction.reply({
          content: '❌ Debes especificar al menos un campo a modificar.',
          ephemeral: true
        });
      }

      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Campos Actualizados')
            .setDescription(updates.join('\n'))
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'emojis') {
      const tipo = interaction.options.getString('tipo');
      const emoji = interaction.options.getString('emoji');

      config.webhooks.tebex.embedConfig.emojis[tipo] = emoji;
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Emoji Actualizado')
            .addFields({
              name: tipo,
              value: `${emoji} \`${emoji}\``,
              inline: false
            })
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'info') {
      const webhookConfig = config.webhooks.tebex;
      const embedConfig = webhookConfig.embedConfig;

      const embed = new EmbedBuilder()
        .setColor(embedConfig.color || '#00ff9d')
        .setTitle('⚙️ Configuración del Webhook de Tebex')
        .addFields(
          {
            name: '📊 Estado',
            value: webhookConfig.enabled ? '✅ Habilitado' : '❌ Deshabilitado',
            inline: true
          },
          {
            name: '📺 Canal',
            value: webhookConfig.channelId ? `<#${webhookConfig.channelId}>` : 'No configurado',
            inline: true
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: true
          },
          {
            name: '🎨 Apariencia',
            value: `**Color:** ${embedConfig.color}\n**Título:** ${embedConfig.title}\n**Usar MC Skin:** ${embedConfig.useMCSkin ? '✅' : '❌'}`,
            inline: false
          },
          {
            name: '📝 Campos Visibles',
            value: Object.entries(embedConfig.fields)
              .map(([key, value]) => `${key}: ${value ? '✅' : '❌'}`)
              .join('\n'),
            inline: false
          },
          {
            name: '😀 Emojis',
            value: Object.entries(embedConfig.emojis)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n'),
            inline: false
          }
        )
        .setFooter({ text: 'Usa /webhook config para modificar' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (subcommand === 'test') {
      if (!config.webhooks.tebex.enabled || !config.webhooks.tebex.channelId) {
        return interaction.reply({
          content: '❌ El webhook no está configurado. Usa `/webhook enable` primero.',
          ephemeral: true
        });
      }

      const channel = interaction.guild.channels.cache.get(config.webhooks.tebex.channelId);
      if (!channel) {
        return interaction.reply({
          content: '❌ Canal no encontrado. Configura el webhook nuevamente.',
          ephemeral: true
        });
      }

      // Crear mensaje de prueba
      const embedConfig = config.webhooks.tebex.embedConfig;
      const testEmbed = new EmbedBuilder()
        .setColor(embedConfig.color || '#00ff9d')
        .setTitle(`${embedConfig.emojis.title || ''} ${embedConfig.title || 'Nueva Compra'}`.trim())
        .setTimestamp();

      if (embedConfig.description) {
        testEmbed.setDescription(embedConfig.description);
      }

      if (embedConfig.useMCSkin) {
        testEmbed.setThumbnail('https://mc-heads.net/avatar/Steve');
      } else if (embedConfig.thumbnailUrl) {
        testEmbed.setThumbnail(embedConfig.thumbnailUrl);
      }

      if (embedConfig.imageUrl) {
        testEmbed.setImage(embedConfig.imageUrl);
      }

      if (embedConfig.fields.username) {
        testEmbed.addFields({
          name: `${embedConfig.emojis.user || '👤'} Usuario:`,
          value: 'TestUser123',
          inline: true
        });
      }

      if (embedConfig.fields.price) {
        testEmbed.addFields({
          name: 'Valor Total:',
          value: `15.99 USD ${embedConfig.emojis.currency || '💵'}`,
          inline: true
        });
      }

      if (embedConfig.fields.packages) {
        testEmbed.addFields({
          name: 'Paquete Adquirido:',
          value: `${embedConfig.emojis.package || '📦'} Rango VIP x1 - $15.99`,
          inline: false
        });
      }

      if (embedConfig.fields.date) {
        testEmbed.addFields({
          name: '📅 Fecha:',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
        });
      }

      if (embedConfig.footerText) {
        const footerText = embedConfig.footerUrl 
          ? `${embedConfig.footerText} ${embedConfig.footerUrl.replace('https://', '').replace('http://', '')}`
          : embedConfig.footerText;
        testEmbed.setFooter({ text: footerText });
      }

      const message = await channel.send({ embeds: [testEmbed] });
      
      if (embedConfig.emojis.reaction) {
        await message.react(embedConfig.emojis.reaction).catch(console.error);
      }

      await interaction.reply({
        content: `✅ Mensaje de prueba enviado a ${channel}`,
        ephemeral: true
      });
    }
  }
};
