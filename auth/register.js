import { ActionRowBuilder, ChannelType, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import { authCountRedis } from "../config/redis.js";
dotenv.config();
export async function register(interaction) {
  const authCategoryId = process.env.AUTH_CATEGORY_ID;
  const newChannel = await interaction.guild.channels.create({
    name: `${interaction.user.id}-registartion`,
    type: ChannelType.GuildText,
    parent: authCategoryId,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: ["ViewChannel"],
      },
      {
        id: interaction.user.id,
        allow: ["ViewChannel"],
      },
    ],
  });
  // Set timeout for deletion
  const timeoutMs = 15 * 60 * 1000; // 15p sau khi tạo sẽ xóa
  setTimeout(async () => {
    try {
      await newChannel.delete(`Channel timeout expired after 15 minutes`);
      console.log(`Deleted temporary channel #${newChannel.name}`);
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  }, timeoutMs);
  interaction.reply({
    content: `Truy cập vào kênh <#${newChannel.id}> để thực hiện tiếp nhé`,
    ephemeral: true,
  });
  const welcomeEmbed = new EmbedBuilder()
    .setTitle("Đăng ký tài khoản")
    .setDescription("Chào mừng bạn đến với kênh đăng ký tài khoản!")
    .addFields({
      name: "Bước 1:",
      value: "Hãy nhập vào địa chỉ email của bạn",
    });

  newChannel.send({ embeds: [welcomeEmbed] });
  const userData = { step: "step1", email: "" };
  authCountRedis.set(
    `${interaction.user.id}-registration`,
    JSON.stringify(userData)
  );
}

export function handleRegistrationStep(message) {
  const userId = message.author.id;
  authCountRedis.get(`${userId}-registration`).then((userData) => {
    const userDataJson = JSON.parse(userData);
    switch (userDataJson.step) {
      case "step1":
        // Xử lý step 1
        const email = message.content;
        if (validateEmail(email)) {
          userDataJson.step = "step2";
          userDataJson.email = email;
          authCountRedis.set(
            `${userId}-registration`,
            JSON.stringify(userDataJson)
          );
          message.channel.send(
            "Địa chỉ email của bạn đã được đăng ký. Hãy nhập mật khẩu mới."
          );
        } else {
          message.channel.send(
            "Địa chỉ email không hợp lệ. Vui lòng nhập lại."
          );
        }
        break;
      case "step2":
        // Xử lý step 2
        break;
    }
  });
}

function validateEmail(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
}
