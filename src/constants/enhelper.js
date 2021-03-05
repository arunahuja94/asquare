import {NativeModules} from 'react-native';
var Aes = NativeModules.Aes

function generateRandomKey() {
    return Math.random().toString(16).substring(2);
}
export const encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
        return Aes.encrypt(text, key, iv).then(cipher => ({
            cipher,
            iv,
        }))
    })
};
export const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length);
export const decryptData = (encryptedData, key) => Aes.decrypt(encryptedData.data, key, encryptedData.iv);
export const ensalt = generateRandomKey();
