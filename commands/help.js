import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Hiển thị danh sách lệnh');

export async function execute(interaction) {
  console.log("Executing help command...");
  
  try {
    // Tạo embed để hiển thị trợ giúp
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Danh sách lệnh')
      .setDescription('Dưới đây là danh sách các lệnh có sẵn:')
      .addFields(
        {
          name: '🛡️ Quản lý vai trò',
          value: '`/addrole` - Thêm vai trò cho người dùng\n`/editrole` - Thay đổi vai trò của người dùng\n`/removerole` - Xóa vai trò của người dùng',
          inline: false
        },
        {
          name: '📅 Quản lý sự kiện',
          value: '`/createevent` - Tạo sự kiện mới\n`/joinevent` - Tham gia sự kiện\n`/listevents` - Xem danh sách sự kiện',
          inline: false
        },
        {
          name: '🔍 Khác',
          value: '`/help` - Hiển thị trợ giúp này\n`/ping` - Kiểm tra độ trễ của bot\n`/status` - Kiểm tra trạng thái của bot',
          inline: false
        }
      )
      .setTimestamp()
      .setFooter({ text: 'Bot được phát triển bởi Tarot Team' });
    
    console.log("Sending help embed...");
    // Gửi embed
    await interaction.reply({ embeds: [helpEmbed] });
    console.log("Help embed sent successfully!");
  } catch (error) {
    console.error("Error in help command:", error);
    await interaction.reply({ content: "Có lỗi xảy ra khi hiển thị trợ giúp. Vui lòng thử lại sau.", ephemeral: true });
  }
}