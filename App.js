import React from 'react';
import { I18nManager} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import i18n from 'i18n-js';
const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require("./src/translations/en.json"),
  fr: () => require("./src/translations/fr.json")
};
const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };

  const { languageTag, isRTL } = fallback;  // add dynamic language here

  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};
console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }
  render() {
    return <MainStackNavigator />;
  }
}