const DEFAULT_MAX_LENGTH = 2000;

// Built from character codes (rather than a \x00-\x1F\x7F escape literal) so the control
// range is unambiguous in source and can't be silently mangled into invisible raw bytes.
const CONTROL_CHAR_CODES = [];
for (let code = 0; code <= 31; code += 1) {
  CONTROL_CHAR_CODES.push(code);
}
CONTROL_CHAR_CODES.push(127);
const CONTROL_CHAR_PATTERN = new RegExp(
  '[' + CONTROL_CHAR_CODES.map((code) => String.fromCharCode(code)).join('') + ']',
  'g'
);

/**
 * Cleans free-text input at the boundary where it enters app state: strips control
 * characters (including null bytes), collapses whitespace, trims, and caps length.
 *
 * Deliberately does NOT escape or strip <, >, &, quotes, etc. React already renders all
 * of this text through plain JSX interpolation ({text}), never dangerouslySetInnerHTML,
 * so those characters can never be interpreted as markup - encoding them here would only
 * corrupt legitimate text (a user typing "x < y" would see literal "&lt;" on screen).
 */
export function sanitizeInput(rawValue, maxLength = DEFAULT_MAX_LENGTH) {
  if (typeof rawValue !== 'string') return '';

  const withoutControlChars = rawValue.replace(CONTROL_CHAR_PATTERN, ' ');
  const collapsedWhitespace = withoutControlChars.replace(/\s+/g, ' ').trim();

  return collapsedWhitespace.slice(0, maxLength);
}
