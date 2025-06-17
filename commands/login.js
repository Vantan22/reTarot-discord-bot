import { BaseClient, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import redis from "../config/redis.js";
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
    // dotenv.config();
    // const JWT_SECRET = process.env.JWT_SECRET;
    const backendUrl = process.env.BACKEND_URL;
    const email = interaction.options.getString("email");
    const password = interaction.options.getString("password");
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    // console.log(response.headers);.
    const cookies = response.headers.get("set-cookie");
    const cookiesSplited = cookies.split(";");
    const accessToken = cookiesSplited
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      .split("=")[1];
    const refreshToken = cookiesSplited[5].split(", ")[1].split("=")[1];
    // const accessTokenDecoded = jwt.verify(accessToken, JWT_SECRET);
    // const refreshTokenDecoded = jwt.verify(refreshToken, JWT_SECRET);
    // console.log('accesToken: ', jwt.verify(accessToken, JWT_SECRET));
    // console.log('refreshToken', jwt.verify(refreshToken, JWT_SECRET));

    // redis.set(email, JSON.stringify(data), 'EX', 60 * 60 * 24 * 30);
    redis.set(`${interaction.user.id}_accessToken`, accessToken, "EX", 60 * 15);
    redis.set(
      `${interaction.user.id}_refreshToken`,
      refreshToken,
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
