/**
 * Tiny coloured logger (ANSI codes, no dependency).
 * Colours are disabled when NO_COLOR is set or output isn't a TTY in CI logs that don't support it.
 */
const useColor = !process.env.NO_COLOR;

const paint = (code: number) => (text: string) =>
  useColor ? `\x1b[${code}m${text}\x1b[0m` : text;

export const color = {
  red: paint(31),
  green: paint(32),
  yellow: paint(33),
  blue: paint(34),
  magenta: paint(35),
  cyan: paint(36),
  gray: paint(90),
  bold: paint(1),
};

const envTag = () => color.magenta(`[${(process.env.TEST_ENV ?? '??').toUpperCase()}]`);

export const log = {
  header: (msg: string) => console.log(`\n${color.bold(color.cyan(`▶ ${msg}`))}`),
  info: (msg: string) => console.log(`${envTag()} ${color.blue('ℹ')} ${msg}`),
  success: (msg: string) => console.log(`${envTag()} ${color.green('✔')} ${msg}`),
  warn: (msg: string) => console.warn(`${envTag()} ${color.yellow('⚠')} ${color.yellow(msg)}`),
  error: (msg: string) => console.error(`${envTag()} ${color.red('✖')} ${color.red(msg)}`),
  skip: (testTitle: string, reason: string) =>
    console.warn(
      `${envTag()} ${color.yellow('⏭  SKIPPED')} ${color.bold(testTitle)} ${color.gray('—')} ${color.yellow(reason)}`,
    ),
};
