import 'react-native-gesture-handler/jestSetup';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  default: jest.fn(),
}));

jest.mock('react-native-encrypted-storage', () => ({
  default: jest.fn(),
}));

jest.mock('react-native-document-picker', () => ({default: jest.fn()}));

jest.mock('@react-native-clipboard/clipboard', () => ({default: jest.fn()}));

jest.mock('jail-monkey', () => ({default: jest.fn()}));

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
