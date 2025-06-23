import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Kiểm tra trạng thái của bot");

export async function execute(interaction) {
  console.log("Executing status command...");

  try {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    const statusEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("Trạng thái Bot")
      .addFields(
        {
          name: "⏱️ Thời gian hoạt động",
          value: `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`,
          inline: false,
        },
        {
          name: "🔄 Độ trễ",
          value: `${Math.round(interaction.client.ws.ping)}ms`,
          inline: true,
        },
        {
          name: "🧠 Bộ nhớ sử dụng",
          value: `${
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100
          } MB`,
          inline: true,
        },
        {
          name: "🤖 Phiên bản",
          value: "v1.0.0",
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Bot được phát triển bởi Tarot Team" });

    console.log("Sending status embed...");
    await interaction.reply({ embeds: [statusEmbed] });
    console.log("Status embed sent successfully!");
  } catch (error) {
    console.error("Error in status command:", error);
    await interaction.reply({
      content: "Có lỗi xảy ra khi kiểm tra trạng thái. Vui lòng thử lại sau.",
      ephemeral: true,
    });
  }
}
