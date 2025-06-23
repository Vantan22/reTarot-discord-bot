import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("addrole")
  .setDescription("Thêm vai trò cho người dùng")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Người dùng cần thêm vai trò")
      .setRequired(true)
  )
  .addRoleOption((option) =>
    option.setName("role").setDescription("Vai trò cần thêm").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction) {
  console.log("Executing addrole command...");

  try {
    // Lấy thông tin người dùng và vai trò từ options
    const targetUser = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");

    // Lấy thông tin member từ guild
    const guild = interaction.guild;
    const member = await guild.members.fetch(targetUser.id);

    // Kiểm tra quyền của bot
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return interaction.reply({
        content: "Bot không có quyền quản lý vai trò!",
        ephemeral: true,
      });
    }

    // Kiểm tra vị trí của vai trò so với vai trò cao nhất của bot
    if (role.position >= guild.members.me.roles.highest.position) {
      return interaction.reply({
        content:
          "Bot không thể thêm vai trò cao hơn hoặc bằng vai trò cao nhất của bot!",
        ephemeral: true,
      });
    }

    // Thêm vai trò cho người dùng
    await member.roles.add(role);

    // Gửi thông báo thành công
    await interaction.reply({
      content: `Đã thêm vai trò ${role.name} cho ${targetUser.tag}!`,
      ephemeral: true,
    });
    console.log(`Added role ${role.name} to ${targetUser.tag}`);
  } catch (error) {
    console.error("Error in addrole command:", error);
    await interaction.reply({
      content: "Có lỗi xảy ra khi thêm vai trò. Vui lòng thử lại sau.",
      ephemeral: true,
    });
  }
}
