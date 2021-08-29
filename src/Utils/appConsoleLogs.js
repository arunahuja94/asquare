import env from '../../env.json';

export default function appConsoleLogs(...rest) {
  if (env.SHOW_CONSOLE_LOGS && __DEV__) {
    console.log.apply(console, rest);
  }
}
