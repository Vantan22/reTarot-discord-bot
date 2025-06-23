import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import callApi from "../config/call-api.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Hiển thị thông tin người dùng")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Người dùng muốn xem thông tin")
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const id = interaction.options.getUser("user")
      ? interaction.options.getUser("user").id
      : interaction.user.id;
    const response = await callApi.get(id, "/api/me");
    const user = response.data;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Thông tin người dùng")
      .setDescription(
        `Tên: ${user.profile.full_name}\n
        Ngày sinh: ${user.profile.birth_date.split("T")[0]}\n
        Giới tính: ${user.profile.gender === "male" ? "Nam" : "Nữ"}\n
        Role: ${user.role}`
      )
      .setImage(user.profile.avatar)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  } catch (error) {
    // console.error("Lỗi khi lấy thông tin người dùng:", error);
    interaction.reply({
      content: "Đã xảy ra lỗi khi lấy thông tin người dùng.",
      ephemeral: true,
    });
  }
}
