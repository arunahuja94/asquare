import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import importExport from '../screens/importExport';
import {DrawerContent} from '../components/DrawerContent';
import helpAbout from '../screens/helpAbout';
import {passwordStackNavigator,creditcardStackNavigator} from './StackNavigation';

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="password" component={passwordStackNavigator} />
    <Drawer.Screen name="cards" component={creditcardStackNavigator} />
    <Drawer.Screen name="importExport" component={importExport} />
    <Drawer.Screen name="helpAbout" component={helpAbout} />
  </Drawer.Navigator>
);

export default DrawerScreen;