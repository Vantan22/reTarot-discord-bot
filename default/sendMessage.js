import dotenv from "dotenv";
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
dotenv.config();

export async function sendMsgToDefaultChannel(client, content) {
  try {
    const channelId = process.env.DEFAULT_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      console.error(
        `Channel with ID ${channelId} not found. Check your DEFAULT_CHANNEL_ID in .env file.`
      );
      return;
    }

    // Kiểm tra quyền truy cập
    if (!channel.permissionsFor(client.user).has("SendMessages")) {
      console.error(
        `Bot does not have permission to send messages in channel ${channel.name} (${channelId}).`
      );
      return;
    }

    await channel.send(content);
    console.log(
      `Message sent to channel ${channel.name}: ${content.substring(0, 50)}${
        content.length > 50 ? "..." : ""
      }`
    );
  } catch (error) {
    console.error("Error sending message to default channel:", error);
  }
}

export async function sendMsgToAccountChannel(client) {
  try {
    const channelId = process.env.ACCOUNT_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      console.error(
        `Channel with ID ${channelId} not found. Check your ACCOUNT_CHANNEL_ID in .env file.`
      );
      return;
    }

    const register = new ButtonBuilder()
      .setCustomId("register")
      .setLabel("Đăng ký")
      .setStyle(ButtonStyle.Primary);
    const login = new ButtonBuilder()
      .setCustomId("login")
      .setLabel("Đăng nhập")
      .setStyle(ButtonStyle.Primary);
    const forgotPassword = new ButtonBuilder()
      .setCustomId("forgotPassword")
      .setLabel("Quên mật khẩu")
      .setStyle(ButtonStyle.Primary);
    const resetPassword = new ButtonBuilder()
      .setCustomId("resetPassword")
      .setLabel("Đặt lại mật khẩu")
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(
      register,
      login,
      forgotPassword,
      resetPassword
    );
    await channel.send({
      content: "Bấm vào nút dưới đây để thực hiện lệnh tương ứng nhé",
      components: [row],
    });
  } catch (error) {
    console.error("Error sending message to account channel:", error);
  }
}
