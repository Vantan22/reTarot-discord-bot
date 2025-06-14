# reTarot-discord-bot
Discord bot for reTarot server

## Features
- Role management: Add, edit, and remove roles for users
- Event scheduling: Create, join, and list events with reminders
- Slash commands: Modern Discord interaction commands

## Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the bot with `npm start`

## Environment Variables
Create a `.env` file with the following variables:
```
DISCORD_TOKEN=your_discord_bot_token
PREFIX=!
DEFAULT_CHANNEL_ID=your_default_channel_id
NEW_MEMBER_ROLE_ID=your_new_member_role_id
```

## Commands

### Slash Commands (Mới)
Bot hỗ trợ các slash commands hiện đại của Discord:

#### Role Management
- `/addrole user:@user role:@role` - Thêm vai trò cho người dùng
- `/removerole user:@user role:@role` - Xóa vai trò của người dùng

#### Event Scheduling
- `/createevent name:tên description:mô_tả datetime:thời_gian` - Tạo sự kiện mới
- `/joinevent eventid:ID` - Tham gia sự kiện
- `/listevents` - Liệt kê tất cả sự kiện

#### Other
- `/help` - Hiển thị trợ giúp
- `/ping` - Kiểm tra độ trễ của bot
- `/status` - Kiểm tra trạng thái của bot

### Text Commands (Cũ)
Bot vẫn hỗ trợ các lệnh văn bản truyền thống:

#### Role Management
- `!addrole @user @role` - Thêm vai trò cho người dùng
- `!editrole @user @oldrole @newrole` - Thay đổi vai trò của người dùng
- `!removerole @user @role` - Xóa vai trò của người dùng

#### Event Scheduling
- `!createevent <name> <description> <datetime>` - Tạo sự kiện mới
- `!joinevent <ID>` - Tham gia sự kiện
- `!listevents` - Liệt kê tất cả sự kiện

#### Other
- `!help` - Hiển thị trợ giúp
- `!ping` - Kiểm tra độ trễ của bot
- `!status` - Kiểm tra trạng thái của bot
