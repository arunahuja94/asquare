import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {deleteAllData, retrieveUserSession} from './../db/operations';
import {Ripple, Center} from './Center';
import Icon from '../components/icons';
import styles from './helpAbout.styles.js';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
import {getVersion} from 'react-native-device-info';

const helpAbout = ({navigation}) => {
  return (
    <View
      style={{
        backgroundColor: '#FFDE03',
        flex: 1,
      }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#ffc000" />
      <View
        style={{
          height: '20%',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            width: 50,
          }}
          onPress={() => navigation.openDrawer()}>
          <Image
            resizeMode={'contain'}
            source={require('../images/1.png')}
            style={{
              height: 30,
              width: 40,
              marginTop: 20,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 25,
            width: '100%',
          }}>
          <View style={{width: '100%'}}>
            <Text
              style={{
                fontSize: 28,
                color: '#121212',
                fontWeight: 'bold',
              }}>
              Help & About
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#f9f9f9',
          paddingTop: 30,
          flex: 1,
        }}>
        <View style={styles.seperator}></View>
        <View style={styles.haList}>
          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => Linking.openURL('mailto:arunahuja94@gmail.com')}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons name="mail-outline" color="#fff" size={25} />
            </View>
            <Text>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => Linking.openURL('mailto:arunahuja94@gmail.com')}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons name="bulb-outline" color="#fff" size={25} />
            </View>
            <Text>Suggestion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => Linking.openURL('mailto:arunahuja94@gmail.com')}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons name="bug-outline" color="#fff" size={25} />
            </View>
            <Text>Report Bug</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.seperator}></View>
        <View style={styles.haList}>
          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => navigation.openDrawer()}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons name="help-outline" color="#fff" size={25} />
            </View>
            <Text>FAQ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => navigation.openDrawer()}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons
                name="shield-checkmark-outline"
                color="#fff"
                size={25}
              />
            </View>
            <Text>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haListChild}
            onPress={() => {
              Alert.alert(
                'Delete All Data',
                'Are you sure you want to delete All data?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('cancelled'),
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      retrieveUserSession()
                        .then((sessionkey) => {
                          deleteAllData(sessionkey).then((data) => {
                            globalToast('All Data Deleted');
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    },
                  },
                ],
                {cancelable: false},
              );
            }}>
            <View
              style={[styles.haListChildIcon, {backgroundColor: '#0336FF'}]}>
              <Icon.Ionicons name="trash-bin-outline" color="#fff" size={25} />
            </View>
            <Text>Delete All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aboutData}>
          <Image
            resizeMode={'contain'}
            style={styles.logo_style}
            source={require('../assets/img/logo2-lightbg.png')}
          />
          <Text style={styles.version}>v {getVersion()}</Text>
        </View>
      </View>
    </View>
  );
};
export default helpAbout;
