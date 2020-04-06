import yoOptionOrPrompt from 'yo-option-or-prompt';

export default async function initializing(yo) {
  yo.context = {};
  yo.optionOrPrompt = yoOptionOrPrompt;
}
