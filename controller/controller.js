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
  handleJoinEvent,
  handleGetUser,
} from "./textCommands.js";
import { register } from "../auth/register.js";
// import { login } from "../auth/login.js";
// import { resetPassword } from "../auth/resetPassword.js";
// import { forgotPassword } from "../auth/forgotPassword.js";

export const command = (message) => {
  const rawMessage = message.content;
  if (!rawMessage.startsWith(process.env.PREFIX, 0)) {
    return;
  }
  const userCommand = rawMessage
    .split(" ")[0]
    .substring(process.env.PREFIX.length);
  const args = rawMessage.split(" ").slice(1).join(" ");
  // Trích xuất thông tin cần thiết
  const client = message.client;
  const author = message.author;
  const channel = message.channel;

  // Admin thêm role, sửa role, xóa role user
  switch (userCommand) {
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
    case "user":
      handleGetUser(author, channel);
      break;
    case "test":
      channel.send(author.id);
      break;
    case "message":
      console.log(message);
    default:
      channel.send(
        "Lệnh không hợp lệ. Vui lòng thử lại. Gõ !help để xem danh sách lệnh."
      );
      break;
  }
};

export function button(interaction) {
  switch (interaction.customId) {
    case "register":
      // console.log("Let's register");
      register(interaction);
      break;
    case "login":
      login(interaction);
      break;
    case "forgotPassword":
      forgotPassword(interaction);
      break;
    case "resetPassword":
      resetPassword(interaction);
      break;
    default:
      interaction.reply({
        content: "Lệnh không hợp lệ.",
        ephemeral: true,
      });
      break;
  }
}
