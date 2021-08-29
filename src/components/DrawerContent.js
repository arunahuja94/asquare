import React, {useContext} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import Icon from '../components/icons';

import {AuthContext} from '../store/authContext';

export function DrawerContent(props) {
  const drawerColor = '#fff';
  const drawerIconSize = 20;

  const { authState, authActions } = useContext(AuthContext);

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.circle1}></View>
            <View style={styles.circle2}></View>
            <View style={styles.circle3}></View>
            <View
              style={{
                width: 200,
                height: 70,
                marginTop: 40,
                marginLeft: 35,
                marginBottom: 20,
              }}>
              <Image
                resizeMode={'contain'}
                style={styles.logo_style}
                source={require('../assets/img/logo2-darkbg.png')}
              />
            </View>
          </View>

          <View style={styles.drawerSection}>
            <DrawerItem
              icon={() => (
                <Icon.Ionicons
                  name="lock-closed-outline"
                  color={drawerColor}
                  size={drawerIconSize}
                />
              )}
              label={() => <Text style={{color: drawerColor}}>Passwords</Text>}
              onPress={() => {
                props.navigation.navigate('password');
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon.Ionicons
                  name="card-outline"
                  color={drawerColor}
                  size={drawerIconSize}
                />
              )}
              label={() => <Text style={{color: drawerColor}}>Cards</Text>}
              onPress={() => {
                props.navigation.navigate('cards');
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon.Ionicons
                  name="swap-vertical-outline"
                  color={drawerColor}
                  size={drawerIconSize}
                />
              )}
              label={() => (
                <Text style={{color: drawerColor}}>
                  Backup, Restore & Export
                </Text>
              )}
              onPress={() => {
                props.navigation.navigate('importExport');
              }}
            />
              <DrawerItem
              icon={() => (
                <Icon.Ionicons
                  name="alert-circle-outline"
                  color={drawerColor}
                  size={drawerIconSize}
                />
              )}
              label={() => (
                <Text style={{color: drawerColor}}>Help & About</Text>
              )}
              onPress={() => {
                props.navigation.navigate('helpAbout');
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => (
            <Icon.Ionicons
              name="exit-outline"
              color={drawerColor}
              size={drawerIconSize}
            />
          )}
          label={() => <Text style={{color: drawerColor}}>SIgn Out</Text>}
          onPress={() => {
            authActions.signOut();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    minHeight: 300,
  },
  circle1: {
    position: 'absolute',
    width: 204,
    height: 204,
    borderRadius: 204 / 2,
    backgroundColor: '#fff',
    opacity: 0.1,
    top: -50,
    left: -50,
  },
  circle2: {
    position: 'absolute',
    width: 284,
    height: 284,
    borderRadius: 284 / 2,
    backgroundColor: '#fff',
    opacity: 0.1,
    top: -78,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 364,
    height: 364,
    borderRadius: 364 / 2,
    backgroundColor: '#fff',
    opacity: 0.06,
    top: -105,
    left: -110,
  },
  logo_style: {
    width: '100%',
    height: '100%',
  },
  userInfoSection: {
    position: 'relative',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 10,
    marginLeft: 22,
    minHeight: 300,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#181818',
    borderTopWidth: 1,
    paddingLeft: 22,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
