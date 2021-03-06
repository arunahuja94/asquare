import React, {useContext, useState} from 'react';
import {
  Image,
  Platform,
  View,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import styles from './SignInScreen.styles';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
import {AuthContext} from '../store/authContext';
import {Formik} from 'formik';
import i18n from 'i18n-js';
import appColors from '../constants/Colors';
import appConstant from '../constants/AppConstant';

function SignUpScreen() {
  const {authState, authActions} = useContext(AuthContext);
  const [secondTextInput, secondTextInputUpdate] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={appColors.appBlack}
      />
      <View style={signUpStyles.logoConatiner}>
        <Image
          resizeMode={'contain'}
          style={styles.logo_style}
          source={require('../assets/img/logo2-darkbg.png')}
        />
      </View>
      <View style={signUpStyles.signUpFormConatiner}>
        <View>
          <Formik
            initialValues={{password: '', confirm_password: ''}}
            onSubmit={(values, actions) => {
              if (values.password == '') {
                globalToast(i18n.t('master_password_required'));
              } else if (values.confirm_password == '') {
                globalToast(i18n.t('confirm_master_password_required'));
              } else if (values.password !== values.confirm_password) {
                globalToast(i18n.t('password_not_match'));
              } else {
                authActions.signUp(values, actions);
              }
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <View>
                <TextInput
                  keyboardType="numeric"
                  placeholder={i18n.t('master_password')}
                  placeholderTextColor={appColors.appwhite}
                  onChangeText={handleChange(appConstant.password)}
                  onBlur={handleBlur(appConstant.password)}
                  secureTextEntry={true}
                  style={signUpStyles.signUpTextInput}
                  value={values.password}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    secondTextInput.focus();
                  }}
                />
                <TextInput
                  keyboardType="numeric"
                  ref={(input) => {
                    secondTextInputUpdate(input);
                  }}
                  placeholder={i18n.t('confirm_master_password')}
                  placeholderTextColor={appColors.appwhite}
                  onChangeText={handleChange(appConstant.confirm_password)}
                  onBlur={handleBlur(appConstant.confirm_password)}
                  secureTextEntry={true}
                  style={signUpStyles.signUpTextInput}
                  value={values.confirm_password}
                  onSubmitEditing={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const signUpStyles = StyleSheet.create({
  signUpTextInput: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: appColors.appBackgroundOne,
    color: appColors.appwhite,
    elevation: 7,
    borderRadius: 15 / 2,
    width: 350,
    marginTop: 10,
  },
  signUpFormConatiner: {flex: 3, flexDirection: 'column', alignItems: 'center'},
  logoConatiner: {flex: 3, width: 300, height: 80},
});

export default SignUpScreen;
