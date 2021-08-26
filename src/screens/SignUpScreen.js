import React, { useEffect } from 'react';
import {
  Image,
  Platform,
  TouchableOpacity,
  View,
  AppState,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import Icon from '../components/icons';
import styles from './SignInScreen.styles';
import {AuthContext, FocusAwareStatusBar,globalToast} from '../constants/helper';
import { Formik } from 'formik';
function SignUpScreen() {
  const { signIn, signUp } = React.useContext(AuthContext);
  const [secondTextInput, secondTextInputUpdate] = React.useState('');
  useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
    };
  });
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="#000" />
  <View style={{flex:3,width: 300, height:80 }} >
  <Image resizeMode={'contain'} style={styles.logo_style} source={require('../assets/img/logo2-darkbg.png')} />
    </View>
    <View style={{flex:3,flexDirection: 'column',
    alignItems: 'center',}}>      
     <View>
     <Formik
     initialValues={{ password: '',confirm_password: '' }}
     onSubmit={(values,actions) => 
      {
      if(values.password =='')
      {
        globalToast("Master Password is required");
      }
      else if(values.confirm_password == '')
      {
        globalToast("Confirm Master Password is required");
      }
     else if(values.password !== values.confirm_password)
      {
        globalToast("Password doesn't matchh");
      }
      else
      {
        signUp(values, actions); 
      }

     }}
   >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View>
         <TextInput
         keyboardType="numeric"
          placeholder="Master password"
           placeholderTextColor="#fff"
           onChangeText={handleChange('password')}
           onBlur={handleBlur('password')}
           secureTextEntry={true}
           style={{fontSize: 20,textAlign: 'center',backgroundColor:"#212121",color:'#fff',elevation:7,borderRadius:15/2,width:350}}
           value={values.password}
           blurOnSubmit={false}
           onSubmitEditing={() => { secondTextInput.focus(); }}
         />
           <TextInput
           keyboardType="numeric"
          ref={(input) => { secondTextInputUpdate(input); }}
          placeholder="Confirm Master password"
           placeholderTextColor="#fff"
           onChangeText={handleChange('confirm_password')}
           onBlur={handleBlur('confirm_password')}
           secureTextEntry={true}
           style={{marginTop:20,fontSize: 20,textAlign: 'center',backgroundColor:"#212121",color:'#fff',elevation:7,borderRadius:15/2,width:350}}
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
 

export default SignUpScreen;
