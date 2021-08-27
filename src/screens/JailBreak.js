import React from 'react';
import {Dimensions, View, Image, Text, StatusBar} from 'react-native';
import appColors from '../constants/Colors';

const {height, width} = Dimensions.get('window');
export default function JailBreakScreen() {
  return (
    <View
      style={{
        backgroundColor: appColors.appBackgroundOne,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={appColors.appBlack}
      />
      <View style={{width: width - 50, height: 80}}>
        <Image
          style={{flex: 1, width: '100%', height: undefined}}
          source={require('../assets/img/logo2-darkbg.png')}
        />
      </View>
      <Text style={{fontSize: 20, color: appColors.appRed, marginTop: 20}}>
        Not Secure
      </Text>
    </View>
  );
}
