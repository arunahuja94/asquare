import EncryptedStorage from 'react-native-encrypted-storage';

class AppStorage {
  static getItem(key) {
    return EncryptedStorage.getItem(key);
  }

  static setItem(key, value) {
    EncryptedStorage.setItem(key, value);
  }
}

export default AppStorage;
