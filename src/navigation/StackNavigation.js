import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Detail from '../screens/Detail';
import singleDetail from '../screens/singleDetail';
import CreateEditForm from '../screens/CreateEditForm';
import creditCard from '../screens/creditCard';
import singleCardCat from '../screens/singleCardCat';
import creditcardInput from '../screens/creditcardInput';

const Stack = createStackNavigator();
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

export {passwordStackNavigator, creditcardStackNavigator};
