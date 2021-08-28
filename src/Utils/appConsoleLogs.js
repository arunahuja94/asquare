import React from 'react';
import env from '../../env.json';

export default function appConsoleLogs(value = '') {
  if (env.SHOW_CONSOLE_LOGS) {
    console.log(value);
  }
}
