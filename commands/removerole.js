import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('removerole')
  .setDescription('Xóa vai trò của người dùng')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Người dùng cần xóa vai trò')
      .setRequired(true))
  .addRoleOption(option =>
    option.setName('role')
      .setDescription('Vai trò cần xóa')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction) {
  console.log("Executing removerole command...");
  
  try {
    // Lấy thông tin người dùng và vai trò từ options
    const targetUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    
    // Lấy thông tin member từ guild
    const guild = interaction.guild;
    const member = await guild.members.fetch(targetUser.id);
    
    // Kiểm tra quyền của bot
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({ content: 'Bot không có quyền quản lý vai trò!', ephemeral: true });
    }
    
    // Kiểm tra vị trí của vai trò so với vai trò cao nhất của bot
    if (role.position >= guild.members.me.roles.highest.position) {
      return interaction.reply({ content: 'Bot không thể xóa vai trò cao hơn hoặc bằng vai trò cao nhất của bot!', ephemeral: true });
    }
    
    // Kiểm tra xem người dùng có vai trò này không
    if (!member.roles.cache.has(role.id)) {
      return interaction.reply({ content: `${targetUser.tag} không có vai trò ${role.name}!`, ephemeral: true });
    }
    
    // Xóa vai trò của người dùng
    await member.roles.remove(role);
    
    // Gửi thông báo thành công
    await interaction.reply({ content: `Đã xóa vai trò ${role.name} của ${targetUser.tag}!`, ephemeral: false });
    console.log(`Removed role ${role.name} from ${targetUser.tag}`);
  } catch (error) {
    console.error("Error in removerole command:", error);
    await interaction.reply({ content: "Có lỗi xảy ra khi xóa vai trò. Vui lòng thử lại sau.", ephemeral: true });
  }
}