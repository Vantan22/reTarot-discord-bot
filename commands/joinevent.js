import { SlashCommandBuilder } from 'discord.js';
import { events } from './createevent.js';

export const data = new SlashCommandBuilder()
  .setName('joinevent')
  .setDescription('Tham gia sự kiện')
  .addStringOption(option =>
    option.setName('eventid')
      .setDescription('ID của sự kiện')
      .setRequired(true));

export async function execute(interaction) {
  console.log("Executing joinevent command...");
  
  try {
    // Lấy ID sự kiện từ options
    const eventId = interaction.options.getString('eventid');
    
    // Kiểm tra sự kiện có tồn tại không
    if (!events.has(eventId)) {
      return interaction.reply({ content: `Không tìm thấy sự kiện với ID: ${eventId}`, ephemeral: true });
    }
    
    // Lấy thông tin sự kiện
    const event = events.get(eventId);
    
    // Kiểm tra người dùng đã tham gia chưa
    if (event.participants.includes(interaction.user.id)) {
      return interaction.reply({ content: `Bạn đã tham gia sự kiện "${event.name}" rồi!`, ephemeral: true });
    }
    
    // Thêm người dùng vào danh sách tham gia
    event.participants.push(interaction.user.id);
    
    // Cập nhật sự kiện
    events.set(eventId, event);
    
    // Gửi thông báo thành công
    await interaction.reply({ content: `Bạn đã tham gia sự kiện "${event.name}" thành công!`, ephemeral: false });
    console.log(`User ${interaction.user.tag} joined event ${eventId}`);
  } catch (error) {
    console.error("Error in joinevent command:", error);
    await interaction.reply({ content: "Có lỗi xảy ra khi tham gia sự kiện. Vui lòng thử lại sau.", ephemeral: true });
  }
}