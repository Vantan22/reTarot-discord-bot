import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

// Map để lưu trữ các sự kiện
let events = new Map();
// Biến đếm ID sự kiện
let eventIdCounter = 1;

export const data = new SlashCommandBuilder()
  .setName("createevent")
  .setDescription("Tạo sự kiện mới")
  .addStringOption((option) =>
    option.setName("name").setDescription("Tên sự kiện").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Mô tả sự kiện")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("datetime")
      .setDescription("Thời gian sự kiện (định dạng: YYYY-MM-DD HH:MM)")
      .setRequired(true)
  );

export async function execute(interaction) {
  console.log("Executing createevent command...");

  try {
    // Lấy thông tin sự kiện từ options
    const eventName = interaction.options.getString("name");
    const eventDescription = interaction.options.getString("description");
    const eventDateTime = interaction.options.getString("datetime");

    // Kiểm tra định dạng thời gian
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(eventDateTime)) {
      return interaction.reply({
        content:
          "Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD HH:MM.",
        ephemeral: true,
      });
    }

    // Tạo ID sự kiện
    const eventId = `EV${eventIdCounter++}`;

    // Lưu thông tin sự kiện
    events.set(eventId, {
      id: eventId,
      name: eventName,
      description: eventDescription,
      dateTime: eventDateTime,
      creator: interaction.user.id,
      participants: [interaction.user.id], // Người tạo tự động tham gia
    });

    // Tạo embed thông báo sự kiện
    const eventEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Sự kiện: ${eventName}`)
      .setDescription(eventDescription)
      .addFields(
        {
          name: "Thời gian",
          value: eventDateTime,
          inline: true,
        },
        {
          name: "Người tạo",
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: "ID Sự kiện",
          value: eventId,
          inline: true,
        },
        {
          name: "Tham gia",
          value: `Sử dụng lệnh: /joinevent với ID: ${eventId}`,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Sự kiện được tạo lúc" });

    console.log("Sending event creation embed...");
    // Gửi thông báo
    await interaction.reply({ embeds: [eventEmbed] });
    console.log("Event creation embed sent successfully!");

    // Đặt lịch nhắc nhở
    const eventDate = new Date(`${eventDateTime}:00`);
    const now = new Date();
    const timeUntilEvent = eventDate.getTime() - now.getTime();

    if (timeUntilEvent > 0) {
      // Nhắc nhở trước 1 giờ
      const reminderTime = timeUntilEvent - 60 * 60 * 1000;
      if (reminderTime > 0) {
        setTimeout(() => {
          const event = events.get(eventId);
          if (event) {
            // Tạo danh sách người tham gia
            const participantsList = event.participants
              .map((id) => `<@${id}>`)
              .join(", ");

            // Gửi nhắc nhở
            interaction.channel.send(
              `Nhắc nhở: Sự kiện "${event.name}" sẽ diễn ra sau 1 giờ nữa!\nNgười tham gia: ${participantsList}`
            );
          }
        }, reminderTime);
      }
    }

    console.log(`Event created: ${eventName} at ${eventDateTime}`);
  } catch (error) {
    console.error("Error in createevent command:", error);
    await interaction.reply({
      content: "Có lỗi xảy ra khi tạo sự kiện. Vui lòng thử lại sau.",
      ephemeral: true,
    });
  }
}

// Export events map để các lệnh khác có thể sử dụng
export { events };
