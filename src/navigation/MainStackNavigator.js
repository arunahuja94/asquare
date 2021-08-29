import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DrawerScreen from './DrawerNavigation';
import {AuthContext} from '../store/authContext';

const RootStack = createStackNavigator();
const Stack = createStackNavigator();

function MainStackNavigator() {
  const { authState, authActions } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <RootStack.Navigator
        //initialRouteName="Splash"
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
        {!authState.userReg && (
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          />
        )}
        {authState.userReg && !authState.userToken && (
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: '',
              headerShown: false,
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: authState.isSignout ? 'pop' : 'push',
            }}
          />
        )}
        {authState.userReg && authState.userToken && (
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
  );
}

export default MainStackNavigator;
