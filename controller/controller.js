require('dotenv').config();
require('discord.js');

module.exports = {
    async command(client, message, member, roleId) {
        if (!member) {
            console.error('Member is not defined');
            return;
        }
        
        const rawMessage = message.content;
        if (!rawMessage.startsWith(process.env.PREFIX) || message.author.bot) {
            return;
        }
        const userCommand = rawMessage.split(" ")[0].substring(process.env.PREFIX.length);
        const args = rawMessage.split(" ").slice(1).join(" ");
        // Admin thêm role, sửa role, xóa role user

        // Set lịch event và gửi thông báo cho người dùng bấm xác nhận tham gia
    },

    async sendMsgDefault(client, content) {
        const channelId = process.env.DEFAULT_CHANNEL_ID;
        const channel = client.channels.cache.get(channelId);
        channel.send(content);
    },

    async assignRole(member, roleId) {
        try {
            await member.roles.add(roleId);
            console.log(`Assigned role ${roleId} to ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to assign role to ${member.user.tag}:`, error);
        }
    },

    async removeRole(member, roleId) {
        try {
            await member.roles.remove(roleId);
            console.log(`Removed role ${roleId} from ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to remove role from ${member.user.tag}:`, error);
        }
    }
};