const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Configurar sistema de bienvenida')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Habilitar mensajes de bienvenida')
        .addChannelOption(option =>
          option
            .setName('canal')
            .setDescription('Canal donde se enviarán los mensajes de bienvenida')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('rol')
            .setDescription('Rol automático para nuevos miembros (opcional)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Deshabilitar mensajes de bienvenida')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('mensaje')
        .setDescription('Configurar mensaje de texto')
        .addStringOption(option =>
          option
            .setName('contenido')
            .setDescription('Mensaje de bienvenida (usa {user} para mencionar)')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('embed')
        .setDescription('Habilitar/deshabilitar embed de bienvenida')
        .addBooleanOption(option =>
          option
            .setName('estado')
            .setDescription('Habilitar o deshabilitar embed')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('embed-config')
        .setDescription('Configurar apariencia del embed')
        .addStringOption(option =>
          option
            .setName('opcion')
            .setDescription('Opción a configurar')
            .setRequired(true)
            .addChoices(
              { name: 'Color', value: 'color' },
              { name: 'Título', value: 'title' },
              { name: 'Descripción', value: 'description' },
              { name: 'URL de imagen', value: 'imageUrl' },
              { name: 'URL de thumbnail', value: 'thumbnailUrl' },
              { name: 'Texto del footer', value: 'footerText' },
              { name: 'Icono del footer', value: 'footerIcon' }
            )
        )
        .addStringOption(option =>
          option
            .setName('valor')
            .setDescription('Nuevo valor (usa placeholders: {user}, {username}, {server}, {members}, {avatar}, {serverIcon})')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('embed-field')
        .setDescription('Agregar un campo al embed')
        .addStringOption(option =>
          option
            .setName('nombre')
            .setDescription('Nombre del campo')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('valor')
            .setDescription('Valor del campo')
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option
            .setName('inline')
            .setDescription('Campo en línea')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('embed-clear-fields')
        .setDescription('Limpiar todos los campos del embed')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('Ver configuración actual')
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
      const role = interaction.options.getRole('rol');
      
      config.welcome.enabled = true;
      config.welcome.channelId = channel.id;
      if (role) {
        config.welcome.roleId = role.id;
      }
      saveConfig();

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Sistema de Bienvenida Habilitado')
        .setDescription(`Los mensajes de bienvenida se enviarán a ${channel}`)
        .setTimestamp();

      if (role) {
        embed.addFields({
          name: '🎭 Rol Automático',
          value: `Se asignará ${role} a los nuevos miembros`,
          inline: false
        });
      }

      embed.setFooter({ text: 'Usa /welcome info para ver la configuración completa' });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (subcommand === 'disable') {
      config.welcome.enabled = false;
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ Sistema de Bienvenida Deshabilitado')
            .setDescription('Los mensajes de bienvenida han sido deshabilitados.')
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'mensaje') {
      const contenido = interaction.options.getString('contenido');
      
      config.welcome.message.content = contenido;
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Mensaje Actualizado')
            .setDescription('Vista previa:')
            .addFields({
              name: 'Mensaje',
              value: contenido.replace(/{user}/g, interaction.user.toString()),
              inline: false
            })
            .setFooter({ text: 'Placeholders disponibles: {user}, {username}, {server}, {members}' })
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'embed') {
      const estado = interaction.options.getBoolean('estado');
      
      config.welcome.message.embed.enabled = estado;
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(estado ? '#00ff00' : '#ff0000')
            .setTitle(estado ? '✅ Embed Habilitado' : '❌ Embed Deshabilitado')
            .setDescription(estado 
              ? 'El mensaje de bienvenida ahora incluirá un embed personalizado.'
              : 'El mensaje de bienvenida solo mostrará texto.')
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'embed-config') {
      const option = interaction.options.getString('opcion');
      const value = interaction.options.getString('valor');

      if (option === 'color') {
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          return interaction.reply({
            content: '❌ Color inválido. Usa formato hexadecimal (ejemplo: #7289da)',
            ephemeral: true
          });
        }
      }

      config.welcome.message.embed[option] = value;
      saveConfig();

      const previewValue = value
        .replace(/{user}/g, interaction.user.toString())
        .replace(/{username}/g, interaction.user.username)
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{members}/g, interaction.guild.memberCount.toString())
        .replace(/{avatar}/g, 'URL del avatar')
        .replace(/{serverIcon}/g, 'URL del icono del servidor');

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Configuración Actualizada')
            .addFields(
              {
                name: 'Opción',
                value: option,
                inline: true
              },
              {
                name: 'Valor',
                value: `\`${value}\``,
                inline: true
              },
              {
                name: 'Vista Previa',
                value: previewValue,
                inline: false
              }
            )
            .setFooter({ text: 'Placeholders: {user}, {username}, {server}, {members}, {avatar}, {serverIcon}' })
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'embed-field') {
      const nombre = interaction.options.getString('nombre');
      const valor = interaction.options.getString('valor');
      const inline = interaction.options.getBoolean('inline') || false;

      if (!config.welcome.message.embed.fields) {
        config.welcome.message.embed.fields = [];
      }

      config.welcome.message.embed.fields.push({
        name: nombre,
        value: valor,
        inline: inline
      });
      saveConfig();

      const previewValue = valor
        .replace(/{user}/g, interaction.user.toString())
        .replace(/{username}/g, interaction.user.username)
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{members}/g, interaction.guild.memberCount.toString());

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Campo Agregado')
            .addFields({
              name: nombre,
              value: previewValue,
              inline: inline
            })
            .setFooter({ text: `Total de campos: ${config.welcome.message.embed.fields.length}` })
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'embed-clear-fields') {
      config.welcome.message.embed.fields = [];
      saveConfig();

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle('🗑️ Campos Eliminados')
            .setDescription('Todos los campos del embed han sido eliminados.')
            .setTimestamp()
        ],
        ephemeral: true
      });
    }

    else if (subcommand === 'info') {
      const welcomeConfig = config.welcome;
      const embedConfig = welcomeConfig.message.embed;

      const embed = new EmbedBuilder()
        .setColor(embedConfig.color || '#7289da')
        .setTitle('⚙️ Configuración de Bienvenida')
        .addFields(
          {
            name: '📊 Estado',
            value: welcomeConfig.enabled ? '✅ Habilitado' : '❌ Deshabilitado',
            inline: true
          },
          {
            name: '📺 Canal',
            value: welcomeConfig.channelId ? `<#${welcomeConfig.channelId}>` : 'No configurado',
            inline: true
          },
          {
            name: '🎭 Rol Automático',
            value: welcomeConfig.roleId ? `<@&${welcomeConfig.roleId}>` : 'Ninguno',
            inline: true
          },
          {
            name: '💬 Mensaje de Texto',
            value: `\`\`\`${welcomeConfig.message.content}\`\`\``,
            inline: false
          },
          {
            name: '📝 Embed',
            value: embedConfig.enabled ? '✅ Habilitado' : '❌ Deshabilitado',
            inline: false
          }
        );

      if (embedConfig.enabled) {
        embed.addFields(
          {
            name: '🎨 Configuración del Embed',
            value: `**Color:** ${embedConfig.color}\n**Título:** ${embedConfig.title || 'Sin título'}\n**Descripción:** ${embedConfig.description || 'Sin descripción'}`,
            inline: false
          },
          {
            name: '🖼️ Imágenes',
            value: `**Thumbnail:** ${embedConfig.thumbnailUrl || 'Avatar del usuario'}\n**Imagen:** ${embedConfig.imageUrl || 'Ninguna'}`,
            inline: false
          },
          {
            name: '📋 Campos',
            value: embedConfig.fields && embedConfig.fields.length > 0 
              ? `${embedConfig.fields.length} campo(s) configurado(s)`
              : 'Sin campos',
            inline: false
          }
        );
      }

      embed.setFooter({ text: 'Usa /welcome test para ver una vista previa' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    else if (subcommand === 'test') {
      if (!config.welcome.enabled) {
        return interaction.reply({
          content: '❌ El sistema de bienvenida no está habilitado. Usa `/welcome enable` primero.',
          ephemeral: true
        });
      }

      // Simular datos de un nuevo miembro
      const testData = {
        user: interaction.user,
        server: interaction.guild,
        members: interaction.guild.memberCount
      };

      // Preparar mensaje
      const messageContent = config.welcome.message.content
        .replace(/{user}/g, testData.user.toString())
        .replace(/{username}/g, testData.user.username)
        .replace(/{server}/g, testData.server.name)
        .replace(/{members}/g, testData.members.toString());

      const messageData = { content: messageContent };

      // Crear embed si está habilitado
      if (config.welcome.message.embed.enabled) {
        const embedConfig = config.welcome.message.embed;
        const testEmbed = new EmbedBuilder()
          .setColor(embedConfig.color || '#7289da');

        if (embedConfig.title) {
          testEmbed.setTitle(
            embedConfig.title
              .replace(/{user}/g, testData.user.toString())
              .replace(/{username}/g, testData.user.username)
              .replace(/{server}/g, testData.server.name)
              .replace(/{members}/g, testData.members.toString())
          );
        }

        if (embedConfig.description) {
          testEmbed.setDescription(
            embedConfig.description
              .replace(/{user}/g, testData.user.toString())
              .replace(/{username}/g, testData.user.username)
              .replace(/{server}/g, testData.server.name)
              .replace(/{members}/g, testData.members.toString())
          );
        }

        if (embedConfig.thumbnailUrl) {
          const thumbnailUrl = embedConfig.thumbnailUrl
            .replace(/{avatar}/g, testData.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .replace(/{serverIcon}/g, testData.server.iconURL({ dynamic: true }) || '');
          testEmbed.setThumbnail(thumbnailUrl);
        }

        if (embedConfig.imageUrl) {
          testEmbed.setImage(embedConfig.imageUrl);
        }

        if (embedConfig.fields && embedConfig.fields.length > 0) {
          for (const field of embedConfig.fields) {
            testEmbed.addFields({
              name: field.name,
              value: field.value
                .replace(/{user}/g, testData.user.toString())
                .replace(/{username}/g, testData.user.username)
                .replace(/{server}/g, testData.server.name)
                .replace(/{members}/g, testData.members.toString()),
              inline: field.inline || false
            });
          }
        }

        if (embedConfig.footerText) {
          const footerText = embedConfig.footerText
            .replace(/{user}/g, testData.user.toString())
            .replace(/{username}/g, testData.user.username)
            .replace(/{server}/g, testData.server.name)
            .replace(/{members}/g, testData.members.toString());
          
          const footerIcon = embedConfig.footerIcon
            ? embedConfig.footerIcon.replace(/{serverIcon}/g, testData.server.iconURL({ dynamic: true }) || '')
            : null;
          
          testEmbed.setFooter({ text: footerText, iconURL: footerIcon });
        }

        testEmbed.setTimestamp();
        messageData.embeds = [testEmbed];
      }

      await interaction.reply(messageData);
    }
  }
};
