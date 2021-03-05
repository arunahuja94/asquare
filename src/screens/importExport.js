import React from 'react';
import {
  View,
  Pressable,
  Alert,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '../components/icons';
import {FocusAwareStatusBar} from '../constants/helper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getAllExportData, retrieveUserSession} from '../db/operations';
import {encryptData, generateKey, decryptData,ensalt} from '../constants/enhelper';
import {globalToast} from '../constants/helper';
const importExport = ({navigation}) => {
  let data = '';
  const readFromFile = async (key) => {
    ReactNativeBlobUtil.fs
      .readStream(
        ReactNativeBlobUtil.fs.dirs.DocumentDir + '/backup/brfile.db',
        'utf8',
      )
      .then((ifstream) => {
        ifstream.open();
        ifstream.onData((chunk) => {
          data = chunk;
        });
        ifstream.onError((err) => {
          console.log('oops', err);
        });
        ifstream.onEnd(() => {
            const iv = data.substring(0, 32);
           data= data.substring(32, data.length);

          decryptData({data, iv}, key)
            .then((text) => {
              console.log('Decrypted:', text);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
  };
  const createFileUTF8Call = (key) => {
    retrieveUserSession().then((ekey) => {
        getAllExportData(ekey)
          .then((data) => {
            if (Object.keys(data).length > 0) {
                Object.keys(data).map(function(x) { 
                   return data[x].map(function(v) {
                     v.id = ""; 
                     v.lastUpdatedDate = ""; 
                     return v
                  });
                });
              encryptData(JSON.stringify(data), key)
                .then(({cipher, iv}) => {
                  ReactNativeBlobUtil.fs.mkdir(ReactNativeBlobUtil.fs.dirs.DocumentDir + '/backup')
      .then(() => {
        ReactNativeBlobUtil.fs.createFile(
            ReactNativeBlobUtil.fs.dirs.DocumentDir + '/backup/brfile.db',
            iv+''+cipher,
            'utf8',
          ).then(() => {
            globalToast('Backup Created Successfully');
          })
      })
      .catch((err) => {
        console.log(err.message);
      })
                  
                   
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              globalToast('No data to create backup');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
  };
 
  const writeToFile = (key) => {
    retrieveUserSession().then((ekey) => {
      getAllExportData(ekey)
        .then((data) => {
          if (Object.keys(data).length > 0) {
            Object.keys(data).map(function(x) { 
               return data[x].map(function(v) {
                 v.id = ""; 
                 v.lastUpdatedDate = ""; 
                 return v
              });
            });
            encryptData(JSON.stringify(data), key)
              .then(({cipher, iv}) => {
                console.log(iv);
                ReactNativeBlobUtil.fs
                  .writeStream(
                    ReactNativeBlobUtil.fs.dirs.DocumentDir + '/backup/brfile.db',
                    'utf8',
                    false,
                  )
                  .then((stream) => Promise.all([stream.write(iv+''+cipher)]))
                  .then(([stream]) => {stream.close(); globalToast('Backup Created Successfully'); })
                  .catch(console.error);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            globalToast('No data to create backup');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const existsCall = (type) => {
    EncryptedStorage.getItem('masterToken')
      .then((token) => {
        generateKey(token, ensalt, 5000, 256)
          .then((key) => {
            ReactNativeBlobUtil.fs
              .exists(ReactNativeBlobUtil.fs.dirs.DocumentDir + '/backup/brfile.db')
              .then((result) => {
                console.log(result,type);
                if (result && type == '2') {
                  writeToFile(key);
                } else if (!result && type == '2') {
                  createFileUTF8Call(key);
                } else if (result && type == '1') {
                  readFromFile(key);
                } else if (!result && type == '1') {
                  globalToast('No Backup File Exist');
                } else {
                  globalToast('Something Went Wrong');
                }
              })
              .catch((err) => {
                console.log(err.message);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View
      style={{
        backgroundColor: '#9dbe63',
        flex: 1,
      }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#9dbe63" />
      <View
        style={{
          height: '20%',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={require('../images/1.png')}
            style={{
              height: 10,
              width: 20,
              marginTop: 20,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            //    flexDirection:"row",
            alignItems: 'center',
            marginTop: 25,
            width: '100%',
          }}>
          <View style={{width: '100%', paddingBottom: 30}}>
            <Text
              style={{
                fontSize: 28,
                color: '#FFF',
                fontWeight: 'bold',
              }}>
              Backup/Restore
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#FFF',
              }}>
              Backup or Restore your saved cards/passwords or download it as a Csv File
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#f9f9f9',
          height: '100%',
          paddingTop: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Icon.Ionicons color="green" name="arrow-down" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 170,
              }}>
              Backup your saved cards/passwords
            </Text>
            <Pressable onPress={() => Alert.alert(
  'Backup Note',
  'The backup is protected by your MASTER PASSWORD. In Future if you change your MASTER PASSWORD, old backups will still require OLD MASTER PASSWORD to restore that backup and dont change the location of the backup file or make changes in the file in order to restore it properly',
  [
    { text: 'OK', onPress: () => console.log('OK Pressed') }
  ],
  { cancelable: true }
)}>
            <Text
              style={{
                color: '#f58084',
                fontFamily: 'Medium',
                fontSize: 12,
                paddingHorizontal: 20,
              }}>
              Read This
            </Text>
</Pressable>
          
          </View>

          <TouchableOpacity
            onPress={() => existsCall('2')}
            style={{
              flexDirection: 'row',
              backgroundColor: '#9dbe63',
              padding: 10,
              width: 100,
              marginHorizontal: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              //marginTop:10
            }}>
            <Text style={{color: '#fff'}}>Backup</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Icon.Ionicons color="green" name="arrow-up" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 170,
              }}>
              Restore from Last Created Backup
            </Text>
            <Text
              style={{
                color: '#f58084',
                fontFamily: 'Medium',
                fontSize: 12,
                paddingHorizontal: 20,
              }}>
              Read This
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => existsCall('1')}
            style={{
              flexDirection: 'row',
              backgroundColor: '#9dbe63',
              padding: 10,
              width: 100,
              marginHorizontal: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              //marginTop:10
            }}>
            <Text style={{color: '#fff'}}>Restore</Text>
          </TouchableOpacity>
        </View>
       
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 20,
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Icon.Ionicons color="green" name="arrow-down" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 170,
              }}>
              Restore from Last Created Backup
            </Text>
            <Text
              style={{
                color: '#f58084',
                fontFamily: 'Medium',
                fontSize: 12,
                paddingHorizontal: 20,
              }}>
              Read This
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => csvExport()}
            style={{
              flexDirection: 'row',
              backgroundColor: '#9dbe63',
              padding: 10,
              width: 100,
              marginHorizontal: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              //marginTop:10
            }}>
            <Text style={{color: '#fff'}}>Export as csv</Text>
          </TouchableOpacity>
        </View>
       
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default importExport;
