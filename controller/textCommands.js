// Các hàm xử lý lệnh văn bản
import { EmbedBuilder } from 'discord.js';
import { events } from '../commands/createevent.js';

// Hàm xử lý lệnh ping
export async function handlePing(client, channel) {
  try {
    const sent = await channel.send('Đang tính toán ping...');
    const pingTime = sent.createdTimestamp - Date.now();
    const apiPing = Math.round(client.ws.ping);
    
    await sent.edit(`🏓 Pong!\n📶 Độ trễ: ${pingTime}ms\n🌐 API: ${apiPing}ms`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh ping:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh ping.');
  }
}

// Hàm xử lý lệnh status
export async function handleStatus(client, channel) {
  try {
    // Tính thời gian hoạt động
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);
    
    // Tính memory usage
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    
    // Tạo embed
    const statusEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('Trạng thái Bot')
      .addFields(
        { name: 'Thời gian hoạt động', value: `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây` },
        { name: 'Độ trễ', value: `${Math.round(client.ws.ping)}ms` },
        { name: 'Bộ nhớ sử dụng', value: `${memoryUsage.toFixed(2)} MB` },
        { name: 'Phiên bản', value: 'v1.0.0' }
      )
      .setTimestamp();
    
    await channel.send({ embeds: [statusEmbed] });
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh status:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh status.');
  }
}

// Hàm xử lý lệnh help
export async function handleHelp(channel) {
  try {
    // Tạo embed để hiển thị trợ giúp
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Danh sách lệnh')
      .setDescription('Dưới đây là danh sách các lệnh có sẵn:')
      .addFields(
        {
          name: 'Quản lý vai trò',
          value: '`!addrole @user @role` - Thêm vai trò cho người dùng\n`!editrole @user @oldrole @newrole` - Thay đổi vai trò của người dùng\n`!removerole @user @role` - Xóa vai trò của người dùng'
        },
        {
          name: 'Quản lý sự kiện',
          value: '`!createevent <name> <description> <datetime>` - Tạo sự kiện mới\n`!joinevent <ID>` - Tham gia sự kiện\n`!listevents` - Liệt kê tất cả sự kiện'
        },
        {
          name: 'Khác',
          value: '`!help` - Hiển thị trợ giúp\n`!ping` - Kiểm tra độ trễ của bot\n`!status` - Kiểm tra trạng thái của bot'
        }
      )
      .setTimestamp()
      .setFooter({ text: 'Sử dụng ! làm prefix cho các lệnh' });
    
    await channel.send({ embeds: [helpEmbed] });
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh help:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh help.');
  }
}

// Hàm xử lý lệnh addrole
export async function handleAddRole(author, channel) {
  try {
    // Kiểm tra quyền của người dùng
    const member = channel.guild.members.cache.get(author.id);
    if (!member.permissions.has('ManageRoles')) {
      return channel.send('Bạn không có quyền quản lý vai trò!');
    }
    
    // Phân tích cú pháp lệnh
    const mentionedUsers = Array.from(channel.messages.cache.last().mentions.users.values());
    const mentionedRoles = Array.from(channel.messages.cache.last().mentions.roles.values());
    
    if (mentionedUsers.length === 0 || mentionedRoles.length === 0) {
      return channel.send('Vui lòng đề cập đến người dùng và vai trò! Ví dụ: !addrole @user @role');
    }
    
    const targetUser = mentionedUsers[0];
    const role = mentionedRoles[0];
    
    // Lấy thông tin member từ guild
    const guild = channel.guild;
    const targetMember = await guild.members.fetch(targetUser.id);
    
    // Kiểm tra quyền của bot
    if (!guild.members.me.permissions.has('ManageRoles')) {
      return channel.send('Bot không có quyền quản lý vai trò!');
    }
    
    // Kiểm tra vị trí vai trò
    if (role.position >= guild.members.me.roles.highest.position) {
      return channel.send('Bot không thể thêm vai trò cao hơn hoặc bằng vai trò cao nhất của bot!');
    }
    
    // Thêm vai trò
    await targetMember.roles.add(role);
    channel.send(`Đã thêm vai trò ${role.name} cho ${targetUser.username}!`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh addrole:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh addrole.');
  }
}

// Hàm xử lý lệnh editrole
export async function handleEditRole(author, channel) {
  try {
    // Kiểm tra quyền của người dùng
    const member = channel.guild.members.cache.get(author.id);
    if (!member.permissions.has('ManageRoles')) {
      return channel.send('Bạn không có quyền quản lý vai trò!');
    }
    
    // Phân tích cú pháp lệnh
    const mentionedUsers = Array.from(channel.messages.cache.last().mentions.users.values());
    const mentionedRoles = Array.from(channel.messages.cache.last().mentions.roles.values());
    
    if (mentionedUsers.length === 0 || mentionedRoles.length < 2) {
      return channel.send('Vui lòng đề cập đến người dùng, vai trò cũ và vai trò mới! Ví dụ: !editrole @user @oldrole @newrole');
    }
    
    const targetUser = mentionedUsers[0];
    const oldRole = mentionedRoles[0];
    const newRole = mentionedRoles[1];
    
    // Lấy thông tin member từ guild
    const guild = channel.guild;
    const targetMember = await guild.members.fetch(targetUser.id);
    
    // Kiểm tra quyền của bot
    if (!guild.members.me.permissions.has('ManageRoles')) {
      return channel.send('Bot không có quyền quản lý vai trò!');
    }
    
    // Kiểm tra vị trí vai trò
    if (oldRole.position >= guild.members.me.roles.highest.position || 
        newRole.position >= guild.members.me.roles.highest.position) {
      return channel.send('Bot không thể quản lý vai trò cao hơn hoặc bằng vai trò cao nhất của bot!');
    }
    
    // Xóa vai trò cũ và thêm vai trò mới
    await targetMember.roles.remove(oldRole);
    await targetMember.roles.add(newRole);
    channel.send(`Đã thay đổi vai trò từ ${oldRole.name} sang ${newRole.name} cho ${targetUser.username}!`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh editrole:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh editrole.');
  }
}

// Hàm xử lý lệnh removerole
export async function handleRemoveRole(author, channel) {
  try {
    // Kiểm tra quyền của người dùng
    const member = channel.guild.members.cache.get(author.id);
    if (!member.permissions.has('ManageRoles')) {
      return channel.send('Bạn không có quyền quản lý vai trò!');
    }
    
    // Phân tích cú pháp lệnh
    const mentionedUsers = Array.from(channel.messages.cache.last().mentions.users.values());
    const mentionedRoles = Array.from(channel.messages.cache.last().mentions.roles.values());
    
    if (mentionedUsers.length === 0 || mentionedRoles.length === 0) {
      return channel.send('Vui lòng đề cập đến người dùng và vai trò! Ví dụ: !removerole @user @role');
    }
    
    const targetUser = mentionedUsers[0];
    const role = mentionedRoles[0];
    
    // Lấy thông tin member từ guild
    const guild = channel.guild;
    const targetMember = await guild.members.fetch(targetUser.id);
    
    // Kiểm tra quyền của bot
    if (!guild.members.me.permissions.has('ManageRoles')) {
      return channel.send('Bot không có quyền quản lý vai trò!');
    }
    
    // Kiểm tra vị trí vai trò
    if (role.position >= guild.members.me.roles.highest.position) {
      return channel.send('Bot không thể xóa vai trò cao hơn hoặc bằng vai trò cao nhất của bot!');
    }
    
    // Xóa vai trò
    await targetMember.roles.remove(role);
    channel.send(`Đã xóa vai trò ${role.name} của ${targetUser.username}!`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh removerole:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh removerole.');
  }
}

// Hàm xử lý lệnh createevent
export async function handleCreateEvent(author, args, channel) {
  try {
    // Phân tích cú pháp lệnh
    const parts = args.split(' ');
    if (parts.length < 3) {
      return channel.send('Vui lòng cung cấp đủ thông tin! Ví dụ: !createevent Tên "Mô tả" "YYYY-MM-DD HH:MM"');
    }
    
    // Tìm vị trí của các dấu ngoặc kép để trích xuất mô tả
    const firstQuote = args.indexOf('"');
    const secondQuote = args.indexOf('"', firstQuote + 1);
    const thirdQuote = args.indexOf('"', secondQuote + 1);
    const fourthQuote = args.indexOf('"', thirdQuote + 1);
    
    if (firstQuote === -1 || secondQuote === -1 || thirdQuote === -1 || fourthQuote === -1) {
      return channel.send('Vui lòng sử dụng dấu ngoặc kép cho mô tả và thời gian! Ví dụ: !createevent Tên "Mô tả" "YYYY-MM-DD HH:MM"');
    }
    
    const eventName = args.substring(0, firstQuote).trim();
    const eventDescription = args.substring(firstQuote + 1, secondQuote);
    const eventDateTime = args.substring(thirdQuote + 1, fourthQuote);
    
    // Kiểm tra định dạng thời gian
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(eventDateTime)) {
      return channel.send('Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD HH:MM.');
    }
    
    // Tạo ID sự kiện
    const eventId = `EV${events.size + 1}`;
    
    // Lưu thông tin sự kiện
    events.set(eventId, {
      id: eventId,
      name: eventName,
      description: eventDescription,
      dateTime: eventDateTime,
      creator: author.id,
      createdAt: new Date().toISOString(),
      participants: [author.id]
    });
    
    // Tạo embed để thông báo sự kiện
    const eventEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Sự kiện mới: ${eventName}`)
      .setDescription(eventDescription)
      .addFields(
        { name: 'ID', value: eventId },
        { name: 'Thời gian', value: eventDateTime },
        { name: 'Người tạo', value: `<@${author.id}>` }
      )
      .setTimestamp()
      .setFooter({ text: `Sử dụng !joinevent ${eventId} để tham gia` });
    
    await channel.send({ embeds: [eventEmbed] });
    
    // Thiết lập nhắc nhở trước 1 giờ
    const eventDate = new Date(eventDateTime);
    const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 giờ trước
    const now = new Date();
    
    if (reminderDate > now) {
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      setTimeout(() => {
        // Lấy danh sách người tham gia
        const event = events.get(eventId);
        if (event) {
          const participantMentions = event.participants.map(id => `<@${id}>`).join(' ');
          channel.send(`${participantMentions} Nhắc nhở: Sự kiện "${eventName}" sẽ diễn ra sau 1 giờ nữa!`);
        }
      }, timeUntilReminder);
    }
    
    console.log(`Sự kiện ${eventId} đã được tạo bởi ${author.username}`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh createevent:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh createevent.');
  }
}

// Hàm xử lý lệnh joinevent
export async function handleJoinEvent(author, args, channel) {
  try {
    // Phân tích cú pháp lệnh
    const eventId = args.trim();
    
    // Kiểm tra sự kiện có tồn tại không
    if (!events.has(eventId)) {
      return channel.send(`Không tìm thấy sự kiện với ID: ${eventId}`);
    }
    
    // Lấy thông tin sự kiện
    const event = events.get(eventId);
    
    // Kiểm tra người dùng đã tham gia chưa
    if (event.participants.includes(author.id)) {
      return channel.send('Bạn đã tham gia sự kiện này rồi!');
    }
    
    // Thêm người dùng vào danh sách tham gia
    event.participants.push(author.id);
    
    // Cập nhật sự kiện
    events.set(eventId, event);
    
    channel.send(`<@${author.id}> đã tham gia sự kiện "${event.name}"!`);
    console.log(`${author.username} đã tham gia sự kiện ${eventId}`);
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh joinevent:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh joinevent.');
  }
}

// Hàm xử lý lệnh listevents
export async function handleListEvents(channel) {
  try {
    // Kiểm tra có sự kiện nào không
    if (events.size === 0) {
      return channel.send('Hiện tại không có sự kiện nào được tạo!');
    }
    
    // Tạo embed để hiển thị danh sách sự kiện
    const eventListEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Danh sách sự kiện')
      .setDescription('Dưới đây là danh sách các sự kiện hiện có:')
      .setTimestamp()
      .setFooter({ text: 'Sử dụng !joinevent <ID> để tham gia sự kiện' });
    
    // Thêm thông tin từng sự kiện vào embed
    events.forEach(event => {
      // Tính số người tham gia
      const participantCount = event.participants.length;
      
      // Thêm field cho sự kiện
      eventListEmbed.addFields({
        name: `${event.name} (ID: ${event.id})`,
        value: `Mô tả: ${event.description}\nThời gian: ${event.dateTime}\nSố người tham gia: ${participantCount}\nNgười tạo: <@${event.creator}>`
      });
    });
    
    await channel.send({ embeds: [eventListEmbed] });
  } catch (error) {
    console.error('Lỗi khi thực hiện lệnh listevents:', error);
    channel.send('Đã xảy ra lỗi khi thực hiện lệnh listevents.');
  }
}