import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Image, Dimensions, AppState} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Detail from '../screens/Detail';
import singleDetail from '../screens/singleDetail';
import CreateEditForm from '../screens/CreateEditForm';
import creditCard from '../screens/creditCard';
import singleCardCat from '../screens/singleCardCat';
import creditcardInput from '../screens/creditcardInput';
import importExport from '../screens/importExport';
import {DrawerContent} from '../components/DrawerContent';
import {generateKey,ensalt} from '../constants/enhelper';
import {globalToast,AuthContext} from '../constants/helper';

const windowHeight = Dimensions.get('window').height;

function SplashScreen() {
  return (
    <View
      style={{
        backgroundColor: '#121212',
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{width: 300, height: 80}}>
        <Image
          style={{flex: 1, width: '100%', height: undefined}}
          source={require('../assets/img/logo2-darkbg.png')}
        />
      </View>
    </View>
  );
}

const Stack = createStackNavigator();
const RootStack = createStackNavigator();
const passwordStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerShown: false,
          title: 'Password Manager',
        }}
      />
      <Stack.Screen
        name="singleDetail"
        component={singleDetail}
        options={{
          headerShown: false,
          title: 'Password',
        }}
      />
      <Stack.Screen
        name="HelloForm"
        component={CreateEditForm}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#FFDE03', //TODO
            elevation: 0, // remove shadow on Android
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#121212',
        }}
        screenOptions={{
          gestureResponseDistance: 'horizontal',
          gestureEnabled: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const creditcardStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="creditCard"
        component={creditCard}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="creditcardInput"
        component={creditcardInput}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#FFDE03', //TODO
            elevation: 0, // remove shadow on Android
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: '#121212',
        }}
        screenOptions={{
          gestureResponseDistance: 'horizontal',
          gestureEnabled: true,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="singleCardCat"
        component={singleCardCat}
        options={{headerShown: false, title: 'Cards'}}
      />
    </Stack.Navigator>
  );
};
// const Tabs = createBottomTabNavigator();
// const TabsScreen = () => (
//   <Tabs.Navigator>
//     <Tabs.Screen name="password" component={passwordStackNavigator} />
//     <Tabs.Screen name="Cards" component={creditcardStackNavigator} />
//   </Tabs.Navigator>
// );

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="password" component={passwordStackNavigator} />
    <Drawer.Screen name="cards" component={creditcardStackNavigator} />
    <Drawer.Screen name="importExport" component={importExport} />
  </Drawer.Navigator>
);

function MainStackNavigator() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'RESTORE_REG':
          return {
            ...prevState,
            userReg: action.token,
            isLoading: false,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            userReg: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );
  const appState = useRef(AppState.currentState);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

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

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            // gestureDirection: 'horizontal',
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
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : state.userReg != null ? (
            state.userToken != null ? (
              <>
                <Stack.Screen
                  name="App"
                  component={DrawerScreen}
                  options={{
                    title: '',
                    headerShown: false,
                  }}
                />
              </>
            ) : (
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
            )
          ) : (
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
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
