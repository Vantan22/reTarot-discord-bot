import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import callApi from "../config/call-api.js";
import { tokenRedis } from "../config/redis.js";

dotenv.config();

export const data = new SlashCommandBuilder()
  .setName("login")
  .setDescription("Login vào tài khoản reTarot")
  .addStringOption((option) =>
    option.setName("email").setDescription("Tài khoản").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("password").setDescription("Mật khẩu").setRequired(true)
  );

export async function execute(interaction) {
  console.log("Executing login...");
  try {
    const email = interaction.options.getString("email");
    const password = interaction.options.getString("password");

    const response = await callApi.post(
      interaction.user.id,
      "/api/auth-discord/login",
      {
        email,
        password,
      }
    );

    tokenRedis.set(
      `${interaction.user.id}_accessToken`,
      response.data.accessToken,
      "EX",
      60 * 15
    );
    tokenRedis.set(
      `${interaction.user.id}_refreshToken`,
      response.data.refreshToken,
      "EX",
      60 * 60 * 24 * 7
    );
    interaction.reply({
      content: "Đăng nhập thành công",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "Đăng nhập thất bại",
      ephemeral: true,
    });
  }
}
