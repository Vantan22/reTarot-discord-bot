const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');

dotenv.config();

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

// Lấy module controller
const Controller = require('./controller/controller.js');

// Function chạy khi bot đăng nhập thành công
client.once('ready', () => {
  const messageContent = 'I AM ALIVE!';
  try {
    Controller.sendMsgDefault(client, messageContent)
      .then(() => console.log('Message sent successfully!'))
      .catch(error => console.error('Error sending message:', error));
  } catch {
      console.error('Channel not found!');
  }
  console.log(`Logged in as ${client.user.tag}!`);
});

// Function chạy khi thành viên mới được thêm vào
client.on('guildMemberAdd', async (member) => {
  try{
    const roleId = process.env.NEW_MEMBER_ROLE_ID;
    Controller.assignRole(member, roleId)
      .then(() => {
        console.log(`Assigned role ${roleId} to ${member.user}`);
        Controller.sendMsgDefault(client, `Welcome to the server, ${member.user}! You have been assigned the new member role.`);
      })
      .catch((error) => {
        console.error(`Failed to assign role to ${member.user}:`, error);
      });
  } catch (error) {
    console.error("Error in guildMemberAdd:", error)
  }
});

client.on('guildMemberRemove', (member) => {
  Controller.sendMsgDefault(client, `Goodbye ${member.user}, we hope to see you again!`);
});

client.login(process.env.DISCORD_TOKEN)
  .catch((error) => {
    console.error('Error logging in:', error);
  });

client.on('messageCreate', (message) => {
  Controller.command(client, message);
});