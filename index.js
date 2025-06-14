import { Client, GatewayIntentBits, REST, Routes, Collection, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  assignRole,
  command,
  sendMsgToDefaultChannel,
} from "./controller/controller.js";
dotenv.config();

// Thiết lập đường dẫn cho thư mục commands
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, 'commands');

// Khởi tạo bot discord
const client = new Client({
  /*
  Những thứ con bot sẽ lấy:
  - Thông tin server
  - Tin nhắn server
  - Thành viên server
  - Nội dung tin nhắn
  */
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Tạo collection để lưu trữ slash commands
client.commands = new Collection();

// Lấy module controller

// Hàm đọc và đăng ký slash commands
async function loadSlashCommands() {
  const commands = [];
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
      const command = await import(fileUrl);
      
      // Kiểm tra xem module có chứa data và execute không
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`Loaded command: ${command.data.name}`);
      } else {
        console.warn(`Command at ${filePath} is missing required properties.`);
      }
    } catch (error) {
      console.error(`Error loading command from ${file}:`, error);
    }
  }
  
  return commands;
}

// Function chạy khi bot đăng nhập thành công
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  try {
    // Đọc và đăng ký slash commands
    const commands = await loadSlashCommands();
    
    // Khởi tạo REST API client
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    // Đăng ký commands với Discord API
    console.log(`Refreshing ${commands.length} slash commands...`);
    
    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    
    console.log(`Successfully registered ${data.length} slash commands!`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

// Function chạy khi thành viên mới được thêm vào
client.on("guildMemberAdd", async (member) => {
  try {
    const roleId = process.env.NEW_MEMBER_ROLE_ID;
    assignRole(member, roleId)
      .then(() => {
        console.log(`Assigned role ${roleId} to ${member.user}`);
        sendMsgToDefaultChannel(
          client,
          `Welcome to the server, ${member.user}! You have been assigned the new member role.`
        );
      })
      .catch((error) => {
        console.error(`Failed to assign role to ${member.user}:`, error);
      });
  } catch (error) {
    console.error("Error in guildMemberAdd:", error);
  }
});

client.on("guildMemberRemove", (member) => {
  try {
    console.log(`Member left: ${member.user.tag}`);
    sendMsgToDefaultChannel(
      client,
      `Goodbye <@${member.user.id}>, we hope to see you again!`
    );
  } catch (error) {
    console.error('Error in guildMemberRemove event:', error);
  }
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Error logging in:", error);
});

// Xử lý tin nhắn thông thường
client.on("messageCreate", (message) => {
  command(message);
});

// Xử lý slash commands
client.on('interactionCreate', async interaction => {
  // Kiểm tra xem có phải là slash command không
  if (!interaction.isChatInputCommand()) return;

  console.log(`Received slash command: ${interaction.commandName}`);
  
  // Lấy command từ collection
  const command = interaction.client.commands.get(interaction.commandName);

  // Nếu không tìm thấy command
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return interaction.reply({ content: 'Lệnh này không tồn tại!', ephemeral: true });
  }

  try {
    // Thực thi command
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    // Trả lời người dùng nếu có lỗi
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Có lỗi xảy ra khi thực hiện lệnh này!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Có lỗi xảy ra khi thực hiện lệnh này!', ephemeral: true });
    }
  }
});