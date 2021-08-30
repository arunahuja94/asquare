import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Detail from '../screens/Detail';
import SingleDetail from '../screens/SingleDetail';
import CreateEditForm from '../screens/CreateEditForm';
import CreditCard from '../screens/CreditCard';
import SingleCardCat from '../screens/SingleCardCat';
import CreditcardInput from '../screens/CreditcardInput';

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
        component={SingleDetail}
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
        name="CreditCard"
        component={CreditCard}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="creditcardInput"
        component={CreditcardInput}
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
        component={SingleCardCat}
        options={{headerShown: false, title: 'Cards'}}
      />
    </Stack.Navigator>
  );
};

export {passwordStackNavigator, creditcardStackNavigator};
