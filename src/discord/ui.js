import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
  EmbedBuilder,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { theme } from "./theme.js";

/**
 * @typedef {import("discord.js").ButtonBuilder} Button
 * @typedef {import("discord.js").ContainerBuilder} Container
 * @typedef {import("discord.js").LabelBuilder} ModalField
 * @typedef {import("discord.js").StringSelectMenuBuilder} SelectMenu
 */

// Embeds and buttons

/**
 * Create a standard Discord embed.
 *
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {import("discord.js").APIEmbedField[]} [options.fields]
 * @param {number} [options.color]
 * @param {string} [options.footer]
 * @param {boolean} [options.timestamp]
 * @returns {EmbedBuilder}
 */
export function createEmbed({
  title,
  description,
  fields = [],
  color = theme.accent,
  footer,
  timestamp = true,
}) {
  validateEmbed({ title, description, fields, color, footer });

  const embed = new EmbedBuilder().setColor(color);

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (fields.length > 0) embed.addFields(fields);
  if (footer) embed.setFooter({ text: footer });
  if (timestamp) embed.setTimestamp();

  return embed;
}

/**
 * Create a button. Link buttons need `url`; all other buttons need `customId`.
 *
 * @param {object} options
 * @param {string} [options.customId]
 * @param {string} [options.label]
 * @param {ButtonStyle} [options.style]
 * @param {string | { id: string, name: string, animated?: boolean }} [options.emoji]
 * @param {string} [options.url]
 * @param {boolean} [options.disabled]
 * @returns {Button}
 */
export function createButton({
  customId,
  label,
  style = ButtonStyle.Primary,
  emoji,
  url,
  disabled = false,
}) {
  validateButton({ customId, label, style, url });

  const button = new ButtonBuilder().setStyle(style).setDisabled(disabled);

  if (label) button.setLabel(label);
  if (emoji) button.setEmoji(emoji);

  if (style === ButtonStyle.Link) {
    button.setURL(url);
  } else {
    button.setCustomId(customId);
  }

  return button;
}

/**
 * Create a row of up to five buttons.
 *
 * @param {Button[]} [buttons]
 */
export function createButtonRow(buttons = []) {
  validateButtonRow(buttons);

  return new ActionRowBuilder().addComponents(buttons);
}

// Components V2

/**
 * Create a Components V2 container.
 *
 * Components V2 cannot be sent with normal `content` or `embeds`.
 *
 * @param {object} options
 * @param {string[]} [options.text]
 * @param {import("discord.js").ActionRowBuilder[]} [options.rows]
 * @param {number} [options.accentColor]
 * @param {boolean} [options.spoiler]
 * @returns {Container}
 */
export function createContainer({
  text = [],
  rows = [],
  accentColor,
  spoiler = false,
}) {
  validateContainer({ text, rows, accentColor });

  const container = new ContainerBuilder().setSpoiler(spoiler);

  if (accentColor !== undefined) container.setAccentColor(accentColor);

  for (const content of text) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(content),
    );
  }

  if (rows.length > 0) container.addActionRowComponents(rows);

  return container;
}

/**
 * Build the reply options required for a Components V2 message.
 *
 * @param {Container} container
 * @param {object} [options]
 * @param {boolean} [options.ephemeral]
 */
export function createV2Reply(container, { ephemeral = false } = {}) {
  return {
    components: [container],
    flags: ephemeral
      ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      : MessageFlags.IsComponentsV2,
  };
}

// Modals

/**
 * Create a labeled text field for a modal.
 * Use `TextInputStyle.Paragraph` for a longer answer such as a reason.
 *
 * @param {object} options
 * @param {string} options.customId
 * @param {string} options.label
 * @param {TextInputStyle} [options.style]
 * @param {string} [options.placeholder]
 * @param {string} [options.description]
 * @param {boolean} [options.required]
 * @param {number} [options.minLength]
 * @param {number} [options.maxLength]
 * @param {string} [options.value]
 * @returns {ModalField}
 */
export function createTextInput({
  customId,
  label,
  style = TextInputStyle.Short,
  placeholder,
  description,
  required = true,
  minLength,
  maxLength,
  value,
}) {
  validateTextInput({
    customId,
    label,
    description,
    placeholder,
    minLength,
    maxLength,
    value,
  });

  const input = new TextInputBuilder()
    .setCustomId(customId)
    .setStyle(style)
    .setRequired(required);

  if (placeholder) input.setPlaceholder(placeholder);
  if (minLength !== undefined) input.setMinLength(minLength);
  if (maxLength !== undefined) input.setMaxLength(maxLength);
  if (value !== undefined) input.setValue(value);

  const field = new LabelBuilder().setLabel(label).setTextInputComponent(input);

  if (description) field.setDescription(description);

  return field;
}

/**
 * Create a modal with up to five fields.
 *
 * @param {object} options
 * @param {string} options.customId
 * @param {string} options.title
 * @param {ModalField[]} [options.fields]
 * @returns {ModalBuilder}
 */
export function createModal({ customId, title, fields = [] }) {
  validateModal({ customId, title, fields });

  return new ModalBuilder()
    .setCustomId(customId)
    .setTitle(title)
    .addLabelComponents(fields);
}

// Select menus and autocomplete

/**
 * Create a dropdown containing fixed choices.
 *
 * @param {object} options
 * @param {string} options.customId
 * @param {string} [options.placeholder]
 * @param {import("discord.js").StringSelectMenuOptionBuilder[]} [options.options]
 * @param {number} [options.minValues]
 * @param {number} [options.maxValues]
 * @param {boolean} [options.disabled]
 * @returns {SelectMenu}
 */
export function createSelect({
  customId,
  placeholder,
  options = [],
  minValues = 1,
  maxValues = 1,
  disabled = false,
}) {
  validateSelect({ customId, options, placeholder, minValues, maxValues });

  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setOptions(options)
    .setMinValues(minValues)
    .setMaxValues(maxValues)
    .setDisabled(disabled);

  if (placeholder) menu.setPlaceholder(placeholder);

  return menu;
}

/**
 * Put one dropdown inside its required row.
 *
 * @param {SelectMenu} select
 */
export function createSelectRow(select) {
  return new ActionRowBuilder().addComponents(select);
}

/**
 * Filter data into up to 25 autocomplete choices.
 * Use it with `interaction.respond(filterChoices(...))`.
 *
 * @template T
 * @param {T[]} items
 * @param {string} query
 * @param {object} [options]
 * @param {(item: T) => string} [options.getName]
 * @param {(item: T) => string | number} [options.getValue]
 * @param {number} [options.limit]
 * @returns {{ name: string, value: string | number }[]}
 */
export function filterChoices(
  items,
  query,
  {
    getName = (item) => item.name,
    getValue = (item) => item.value,
    limit = 25,
  } = {},
) {
  validateAutocomplete({ items, query, limit });

  const normalizedQuery = query.trim().toLocaleLowerCase();

  return items
    .filter((item) =>
      String(getName(item)).toLocaleLowerCase().includes(normalizedQuery),
    )
    .slice(0, Math.min(limit, 25))
    .map((item) => ({
      name: String(getName(item)).slice(0, 100),
      value: getValue(item),
    }));
}

/**
 * Return new action rows with matching buttons enabled or disabled.
 * Omit `customIds` to update every button. Link buttons are left unchanged.
 *
 * @param {import("discord.js").ActionRowBuilder[]} rows
 * @param {string[]} [customIds]
 * @param {boolean} [disabled]
 */
export function setButtonsDisabled(rows, customIds, disabled = true) {
  validateButtonRows(rows, customIds);

  const ids = customIds ? new Set(customIds) : null;

  return rows.map((row) => {
    const data = row.toJSON();
    const components = data.components.map((component) => {
      const matches =
        component.type === ComponentType.Button &&
        component.custom_id &&
        (!ids || ids.has(component.custom_id));

      return matches ? { ...component, disabled } : component;
    });

    return new ActionRowBuilder({ ...data, components });
  });
}

/**
 * Return new action rows with one button added to the selected row.
 *
 * @param {import("discord.js").ActionRowBuilder[]} rows
 * @param {Button} button
 * @param {number} [rowIndex]
 */
export function addButton(rows, button, rowIndex = 0) {
  validateAddButton(rows, rowIndex);

  const updatedRows = rows.map((row) => new ActionRowBuilder(row.toJSON()));

  if (updatedRows.length === 0) {
    return [createButtonRow([button])];
  }

  const row = updatedRows[rowIndex];
  if (!row) throw new Error(`Button row ${rowIndex} does not exist.`);
  if (row.components.length >= 5) {
    throw new Error(`Button row ${rowIndex} already has five components.`);
  }

  row.addComponents(button);
  return updatedRows;
}

/**
 * Return new action rows with matching buttons removed.
 * Omit `customIds` to remove all buttons while keeping non-button components.
 *
 * @param {import("discord.js").ActionRowBuilder[]} rows
 * @param {string[]} [customIds]
 */
export function removeButtons(rows, customIds) {
  validateButtonRows(rows, customIds);

  const ids = customIds ? new Set(customIds) : null;

  return rows
    .map((row) => {
      const data = row.toJSON();
      const components = data.components.filter((component) => {
        const isMatchingButton =
          component.type === ComponentType.Button &&
          component.custom_id &&
          (!ids || ids.has(component.custom_id));

        return !isMatchingButton;
      });

      return new ActionRowBuilder({ ...data, components });
    })
    .filter((row) => row.components.length > 0);
}

// Readable aliases for the common cases.
export const disableButtons = (rows, customIds) =>
  setButtonsDisabled(rows, customIds, true);

export const enableButtons = (rows, customIds) =>
  setButtonsDisabled(rows, customIds, false);

// Validation — private to this file

function validateEmbed({ title, description, fields, color, footer }) {
  assertOptionalText(title, "Embed title", 256);
  assertOptionalText(description, "Embed description", 4_096);
  assertOptionalText(footer, "Embed footer", 2_048);
  assertMax(fields, 25, "An embed");
  assertColor(color, "Embed color");

  const fieldLength = fields.reduce((total, field) => {
    assertText(field.name, "Embed field name", 256);
    assertText(field.value, "Embed field value", 1_024);
    return total + field.name.length + field.value.length;
  }, 0);

  assertMaxValue(
    (title?.length ?? 0) +
      (description?.length ?? 0) +
      (footer?.length ?? 0) +
      fieldLength,
    6_000,
    "An embed's total text length",
  );
}

function validateButton({ customId, label, style, url }) {
  assertOptionalText(label, "Button label", 80);

  if (style === ButtonStyle.Link) {
    assertText(url, "A link button URL", 512);
    return;
  }

  assertText(customId, "A button custom ID", 100);
}

function validateButtonRow(buttons) {
  assertMax(buttons, 5, "A button row");
}

function validateButtonRows(rows, customIds) {
  assertArray(rows, "Button rows");
  assertOptionalIds(customIds, "Button custom IDs");
}

function validateAddButton(rows, rowIndex) {
  validateButtonRows(rows);
  assertRange(rowIndex, 0, Number.MAX_SAFE_INTEGER, "Button row index");
}

function validateContainer({ text, rows, accentColor }) {
  assertArray(text, "Container text blocks");
  assertArray(rows, "Container rows");
  assertColor(accentColor, "Container accent color", { optional: true });

  for (const content of text) {
    assertText(content, "Container text", 4_000);
  }
}

function validateTextInput({
  customId,
  label,
  description,
  placeholder,
  minLength,
  maxLength,
  value,
}) {
  assertText(customId, "Text input custom ID", 100);
  assertText(label, "Text input label", 45);
  assertOptionalText(description, "Text input description", 100);
  assertOptionalText(placeholder, "Text input placeholder", 100);
  assertOptionalText(value, "Text input value", 4_000, { allowEmpty: true });
  assertTextInputLengths(minLength, maxLength);
}

function validateModal({ customId, title, fields }) {
  assertText(customId, "Modal custom ID", 100);
  assertText(title, "Modal title", 45);
  assertArray(fields, "Modal fields");
  assertRange(fields.length, 1, 5, "A modal field count");
}

function validateSelect({
  customId,
  options,
  placeholder,
  minValues,
  maxValues,
}) {
  assertText(customId, "Select menu custom ID", 100);
  assertArray(options, "Select menu options");
  assertRange(options.length, 1, 25, "A select menu option count");
  assertOptionalText(placeholder, "Select menu placeholder", 150);
  assertRange(minValues, 0, 25, "Select menu minimum values");
  assertRange(maxValues, 0, 25, "Select menu maximum values");

  if (minValues > maxValues) {
    throw new Error("Select menu minimum values cannot exceed maximum values.");
  }
}

function validateAutocomplete({ items, query, limit }) {
  assertArray(items, "Autocomplete items");
  assertText(query, "Autocomplete query", 100, { allowEmpty: true });
  assertRange(limit, 1, 25, "Autocomplete limit");
}

function assertArray(value, name) {
  if (!Array.isArray(value)) {
    throw new Error(`${name} must be an array.`);
  }
}

function assertMax(items, max, name) {
  assertArray(items, name);

  if (items.length > max) {
    throw new Error(`${name} can contain at most ${max} items.`);
  }
}

function assertMaxValue(value, max, name) {
  if (value > max) {
    throw new Error(`${name} must not exceed ${max}.`);
  }
}

function assertOptionalIds(ids, name) {
  if (ids === undefined) return;

  assertArray(ids, name);
  for (const id of ids) assertText(id, "Button custom ID", 100);
}

function assertOptionalText(value, name, max, { allowEmpty = false } = {}) {
  if (value === undefined) return;
  assertText(value, name, max, { allowEmpty });
}

function assertRange(value, min, max, name) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(
      `${name} must be a whole number between ${min} and ${max}.`,
    );
  }
}

function assertText(value, name, max, { allowEmpty = false } = {}) {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0)) {
    throw new Error(
      `${name} must be ${allowEmpty ? "a string" : "a non-empty string"}.`,
    );
  }

  if (value.length > max) {
    throw new Error(`${name} must not exceed ${max} characters.`);
  }
}

function assertColor(color, name, { optional = false } = {}) {
  if (color === undefined && optional) return;
  assertRange(color, 0, 0xffffff, name);
}

function assertTextInputLengths(minLength, maxLength) {
  if (minLength !== undefined) {
    assertRange(minLength, 0, 4_000, "Text input minimum length");
  }

  if (maxLength !== undefined) {
    assertRange(maxLength, 1, 4_000, "Text input maximum length");
  }

  if (
    minLength !== undefined &&
    maxLength !== undefined &&
    minLength > maxLength
  ) {
    throw new Error("Text input minimum length cannot exceed maximum length.");
  }
}
