import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";

export const command = async (client, author, content, channel) => {
  const rawMessage = content;
  if (!rawMessage.startsWith(process.env.PREFIX) || author.bot) {
    return;
  }

  const userCommand = rawMessage
    .split(" ")[0]
    .substring(process.env.PREFIX.length);
  const args = rawMessage.split(" ").slice(1).join(" ");
  // Admin thêm role, sửa role, xóa role user

  // Set lịch event và gửi thông báo cho người dùng bấm xác nhận tham gia
};

export async function sendMsgToDefaultChannel(client, content) {
  const channelId = process.env.DEFAULT_CHANNEL_ID;
  const channel = client.channels.cache.get(channelId);
  channel.send(content);
}
export async function assignRole(member, roleId) {
  try {
    await member.roles.add(roleId);
  } catch (error) {
    console.error(`Failed to assign role to ${member.user.tag}:`, error);
  }
}
export async function removeRole(member, roleId) {
  try {
    await member.roles.remove(roleId);
    console.log(`Removed role ${roleId} from ${member.user.tag}`);
  } catch (error) {
    console.error(`Failed to remove role from ${member.user.tag}:`, error);
  }
}
