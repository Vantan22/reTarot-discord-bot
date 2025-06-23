import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} from "discord.js";

// Inside a slash command interaction
export const data = new SlashCommandBuilder()
  .setName("feedback")
  .setDescription("Submit feedback");

export async function execute(interaction) {
  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId("feedbackModal")
    .setTitle("Feedback Form");

  // Create the text input components
  const feedbackInput = new TextInputBuilder()
    .setCustomId("feedbackInput")
    .setLabel("What's your feedback?")
    .setStyle(TextInputStyle.Paragraph) // Use `.Short` for single-line input
    .setRequired(true);

  // Add components to modal
  const firstActionRow = new ActionRowBuilder().addComponents(feedbackInput);
  modal.addComponents(firstActionRow);

  // Show the modal to the user
  await interaction.showModal(modal);
}
