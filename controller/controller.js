import dotenv from "dotenv";
dotenv.config();
import {
  handlePing,
  handleStatus,
  handleHelp,
  handleListEvents,
  handleAddRole,
  handleRemoveRole,
  handleEditRole,
  handleCreateEvent,
  handleJoinEvent
} from "./textCommands.js";
export const command = async (message) => {
  const rawMessage = message.content;
  if (!rawMessage.startsWith(process.env.PREFIX, 0) || message.author.bot) {
    return;
  }
  const userCommand = rawMessage
    .split(" ")[0]
    .substring(process.env.PREFIX.length);
  const args = rawMessage.split(" ").slice(1).join(" ");
  
  console.log(`Text command detected: ${userCommand}, Args: ${args}`);
  
  // Trích xuất thông tin cần thiết
  const client = message.client;
  const author = message.author;
  const channel = message.channel;
  
  // Admin thêm role, sửa role, xóa role user
  switch (userCommand){
    case "addrole":
      handleAddRole(author, channel);
      break;
    case "editrole":
      handleEditRole(author, channel);
      break;
    case "removerole":
      handleRemoveRole(author, channel);
      break;
    case "createevent":
      handleCreateEvent(author, args, channel);
      break;
    case "joinevent":
      handleJoinEvent(author, args, channel);
      break;
    case "listevents":
      handleListEvents(channel);
      break;
    case "help":
      handleHelp(channel);
      break;
    case "ping":
      handlePing(client, channel);
      break;
    case "status":
      handleStatus(client, channel);
      break;
    case "test":
      channel.send("test");
      break;
    default:
      channel.send("Lệnh không hợp lệ. Vui lòng thử lại. Gõ !help để xem danh sách lệnh.");
      break;
  }

  // Set lịch event và gửi thông báo cho người dùng bấm xác nhận tham gia
};

// Export các hàm xử lý lệnh văn bản để có thể sử dụng từ các file khác
export { handlePing, handleStatus, handleHelp, handleListEvents, handleAddRole, handleRemoveRole, handleEditRole, handleCreateEvent, handleJoinEvent };

export async function sendMsgToDefaultChannel(client, content) {
  try {
    const channelId = process.env.DEFAULT_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);
    
    if (!channel) {
      console.error(`Channel with ID ${channelId} not found. Check your DEFAULT_CHANNEL_ID in .env file.`);
      return;
    }
    
    // Kiểm tra quyền truy cập
    if (!channel.permissionsFor(client.user).has('SendMessages')) {
      console.error(`Bot does not have permission to send messages in channel ${channel.name} (${channelId}).`);
      return;
    }
    
    await channel.send(content);
    console.log(`Message sent to channel ${channel.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
  } catch (error) {
    console.error('Error sending message to default channel:', error);
  }
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
