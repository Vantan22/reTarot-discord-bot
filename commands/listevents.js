import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { events } from './createevent.js';

export const data = new SlashCommandBuilder()
  .setName('listevents')
  .setDescription('Liệt kê tất cả sự kiện');

export async function execute(interaction) {
  console.log("Executing listevents command...");
  
  try {
    // Kiểm tra có sự kiện nào không
    if (events.size === 0) {
      return interaction.reply({ content: "Hiện tại không có sự kiện nào được tạo!", ephemeral: false });
    }
    
    // Tạo embed để hiển thị danh sách sự kiện
    const eventListEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Danh sách sự kiện')
      .setDescription('Dưới đây là danh sách các sự kiện hiện có:')
      .setTimestamp()
      .setFooter({ text: 'Sử dụng /joinevent để tham gia sự kiện' });
    
    // Thêm thông tin từng sự kiện vào embed
    events.forEach(event => {
      // Tính số người tham gia
      const participantCount = event.participants.length;
      
      // Thêm field cho sự kiện
      eventListEmbed.addFields({
        name: `${event.name} (ID: ${event.id})`,
        value: `Mô tả: ${event.description}\nThời gian: ${event.dateTime}\nSố người tham gia: ${participantCount}\nNgười tạo: <@${event.creator}>`,
        inline: false
      });
    });
    
    console.log("Sending event list embed...");
    // Gửi embed
    await interaction.reply({ embeds: [eventListEmbed] });
    console.log("Event list embed sent successfully!");
  } catch (error) {
    console.error("Error in listevents command:", error);
    await interaction.reply({ content: "Có lỗi xảy ra khi hiển thị danh sách sự kiện. Vui lòng thử lại sau.", ephemeral: true });
  }
}