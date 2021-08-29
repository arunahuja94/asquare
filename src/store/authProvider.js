import React, {useEffect, useRef, useReducer, useMemo} from 'react';
import {generateKey, ensalt} from '../constants/enhelper';
import {globalToast} from '../constants/helper';
import SplashScreen from 'react-native-splash-screen';
import {appReducer, initialState} from '../store/reducer';
import i18n from 'i18n-js';
import appConstant from '../constants/AppConstant';
import appConsoleLogs from '../Utils/appConsoleLogs';
import AppStorage from '../Utils/appStorageService';
import {AuthContext} from '../store/authContext';

function AuthProvider(props) {
  const [authState, dispatch] = useReducer(appReducer, initialState);
  useEffect(() => {
    bootstrapAsync();
  }, []);

  useEffect(() => {
    if (!authState.isLoading) {
      SplashScreen.hide();
    }
  }, [authState.isLoading]);

  const bootstrapAsync = async () => {
    let userReg;
    let userToken;
    try {
      userReg = await AppStorage.getItem(appConstant.User_Reg_Key);
      userToken = await AppStorage.getItem(appConstant.User_Token);
    } catch (e) {
      // Restoring token failed
    }
    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({type: 'RESTORE_REG', token: userReg});
    dispatch({type: 'RESTORE_TOKEN', token: userToken});
  };

  const authActions = useMemo(
    () => ({
      signIn: async (data, actions, type) => {
        try {
          const masterToken = await AppStorage.getItem(
            appConstant.Master_Token,
          );
          if (type == 'mp' && masterToken !== undefined) {
            let passs = data.password;
            actions.setSubmitting(false);
            if (masterToken === passs) {
              dispatch({type: 'SIGN_IN', token: 'true'});
              globalToast(i18n.t('Signed_In'));
            } else {
              globalToast(i18n.t('master_password_incorrect'));
            }
          } else if (type == 'fp') {
            appConsoleLogs('returned');
            dispatch({type: 'SIGN_IN', token: 'true'});
            globalToast(i18n.t('Signed_In'));
          }
        } catch (error) {
            appConsoleLogs(error, 'error in store actions');
        }
      },
      signOut: () => {
        dispatch({type: 'SIGN_OUT'});
        globalToast(i18n.t('Signed_Out'));
      },
      signUp: async (data, actions) => {
        let master_pass = data.password;
        try {
          AppStorage.setItem(appConstant.User_Reg_Key, 'true');
          AppStorage.setItem(appConstant.Master_Token, master_pass);
          generateKey(master_pass, ensalt, 5000, 350).then((key) => {
            AppStorage.setItem(appConstant.Master_Token_Hash, key);
          });
          dispatch({type: 'SIGN_UP', token: 'true'});
          globalToast(i18n.t('master_password_created'));
        } catch (error) {
          appConsoleLogs(error);
        }
      },
    }),
    [],
  );

  if (authState.isLoading) {
    return <></>;
  }

  return (
    <AuthContext.Provider
      value={{
        authState: authState,
        authActions: authActions,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
