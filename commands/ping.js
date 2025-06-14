import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Kiểm tra độ trễ của bot');

export async function execute(interaction) {
  // Ghi lại thời điểm nhận được lệnh
  const sent = await interaction.reply({ content: 'Đang tính toán ping...', fetchReply: true });

  // Tính toán độ trễ
  const pingTime = sent.createdTimestamp - interaction.createdTimestamp;

  // Cập nhật phản hồi với thông tin độ trễ
  await interaction.editReply(`🏓 Pong! Độ trễ là ${pingTime}ms. API Latency là ${Math.round(interaction.client.ws.ping)}ms`);
  console.log(`Ping command executed: ${pingTime}ms`);
}