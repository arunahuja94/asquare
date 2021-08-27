import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {AppState} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import JailBreakScreen from '../screens/JailBreak';
import {generateKey, ensalt} from '../constants/enhelper';
import {globalToast, AuthContext} from '../constants/helper';
import SplashScreen from 'react-native-splash-screen';
import DrawerScreen from './DrawerNavigation';
import {appReducer, initialState} from '../store/reducer';
import JailMonkey from 'jail-monkey'

const RootStack = createStackNavigator();
const Stack = createStackNavigator();

function MainStackNavigator() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
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
      console.log('App has come to the foreground!');
    } else {
      // dispatch({ type: 'SIGN_OUT' });
      // globalToast("App Locked");
    }

    appState.current = nextAppState;
    //setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userReg;
      let userToken;
      try {
        userReg = await EncryptedStorage.getItem('userReg');
        userToken = await EncryptedStorage.getItem('userToken');
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

  const authContext = React.useMemo(
    () => ({
      signIn: async (data, actions, type) => {
        try {
          const masterToken = await EncryptedStorage.getItem('masterToken');
          if (type == 'mp' && masterToken !== undefined) {
            let passs = data.password;
            actions.setSubmitting(false);
            if (masterToken === passs) {
              dispatch({type: 'SIGN_IN', token: 'true'});
              globalToast('Signed In');
            } else {
              globalToast('Enter the correct Master password');
            }
          } else if (type == 'fp') {
            console.log('returned');
            dispatch({type: 'SIGN_IN', token: 'true'});
            globalToast('Signed In');
          } else {
          }
        } catch (error) {
          // There was an error on the native side
        }
      },
      signOut: () => {
        dispatch({type: 'SIGN_OUT'});
        globalToast('Signed Out');
      },
      signUp: async (data, actions) => {
        let master_pass = data.password;
        try {
          await EncryptedStorage.setItem('userReg', 'true');
          await EncryptedStorage.setItem('masterToken', master_pass);
          generateKey(master_pass, ensalt, 5000, 350).then((key) => {
            EncryptedStorage.setItem('masterTokenHash', key);
          });
          dispatch({type: 'SIGN_UP', token: 'true'});
          globalToast('Master Password Created Successfully');
        } catch (error) {
          console.log(error);
        }
      },
    }),
    [],
  );

  if (JailMonkey.isJailBroken()) {
    return JailBreakScreen();
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            gestureEnabled: true,
            headerMode: 'float',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
          }}
          headerMode="float">
          {state.userReg == null && (
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: '',
                headerShown: false,
              }}
            />
          )}
          {state.userReg != null && state.userToken == null && (
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: '',
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          )}
          {state.userReg != null && state.userToken != null && (
            <Stack.Screen
              name="App"
              component={DrawerScreen}
              options={{
                title: '',
                headerShown: false,
              }}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default MainStackNavigator;
