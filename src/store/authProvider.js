import React, {useEffect, useRef, useReducer, useMemo} from 'react';
import {AppState} from 'react-native';
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
  const appState = useRef(AppState.currentState);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    SplashScreen.hide();

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      appConsoleLogs('App has come to the foreground!');
    } else {
      // dispatch({ type: 'SIGN_OUT' });
      // globalToast("App Locked");
    }

    appState.current = nextAppState;
    //setAppStateVisible(appState.current);
    appConsoleLogs('AppState', appState.current);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
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

    bootstrapAsync();
  }, []);

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
          } else {
          }
        } catch (error) {
          // There was an error on the native side
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
