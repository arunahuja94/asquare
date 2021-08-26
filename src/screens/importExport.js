import React, {useState} from 'react';
import moment from 'moment';
import {
  View,
  Pressable,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Share from 'react-native-share';
import Icon from '../components/icons';
import {FocusAwareStatusBar,globalToast} from '../constants/helper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  getAllExportData,
  retrieveUserSession,
  deleteAllData,
  insertAllData,
} from '../db/operations';
import {
  encryptData,
  generateKey,
  decryptData,
  ensalt,
} from '../constants/enhelper';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import DocumentPicker from 'react-native-document-picker';

const importExport = ({navigation}) => {
  const [allExportData, setallExportData] = useState({});
  const [restorePassword, setRestorePassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [rmodalVisible, setRModalVisible] = useState(false);
  const [emodalVisible, setEModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const [exporting, setExporting] = useState(false);
  const [pickeduri, setPickeduri] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      retrieveUserSession().then((key) => {
        getAllExportData(key)
          .then((data) => {
            if (Object.keys(data).length > 0) {
              setallExportData(data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setallExportData({});
      };
    }, []),
  );

  let data = '';
  const readFromFile = async (token) => {
    generateKey(token, ensalt, 5000, 256)
      .then((key) => {
        ReactNativeBlobUtil.fs
          .readStream(pickeduri, 'utf8')
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
              data = data.substring(32, data.length);
             // console.log(iv);
              decryptData({data, iv}, key)
                .then((text) => {
                  retrieveUserSession().then((sessionkey) => {
                    deleteAllData(sessionkey)
                      .then((data) => {
                        //console.log('delete done', data);
                        insertAllData(text, sessionkey).then((data) => {
                          globalToast('Database Restored');
                          setRModalVisible(!rmodalVisible);
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });
                  //console.log('Decrypted:', text);
                })
                .catch((error) => {
                  globalToast('Incorrect Restore Password');
                  //console.log(error,error.name);
                });
            });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const headers = {
    passwords: {
      login: 'Login', // remove commas to avoid errors
      name: 'Name',
      website: 'Website',
      password: 'Password',
    },
    cards: {
      number: 'Card Number', // remove commas to avoid errors
      name: 'Name',
      cvc: 'cvc',
      expiry: 'Expiry',
      postalCode: 'Bank Name',
      cdtype: 'Card Company',
    },
  };

  const convertToCSV = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      const regex = /,/gi;
      for (var index in array[0]) {
        if (line != '') line += ',';
        line +=
          (index == 'name' || index == 'postalCode') && array[i][index] !== ''
            ? array[i][index].replace(regex, ' ')
            : array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  };

  const onShare = async (file1) => {
      const shareOptions = {
        title: 'Save file',
        failOnCancel: false,
        saveToFiles: true,
        url : 'file://'+file1,
      };
      try {
        const ShareResponse = await Share.open(shareOptions);
        if (ShareResponse.dismissedAction) globalToast('Dismissed');
        //console.log(ShareResponse);
        //ReactNativeBlobUtil.fs.unlink(file1)
      } catch (error) {
        console.log('Error =>', error);
        //setResult('error: '.concat(getErrorString(error)));
      }
  
  };
  const exportCSVFile = (headers, items, fileTitle) => {
    if (headers) {
      items.unshift(headers);
    }
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = convertToCSV(jsonObject);
    var exportedFilename = fileTitle + '_' + moment.utc().valueOf() + '.csv';
    ReactNativeBlobUtil.fs
      .createFile(
        ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + exportedFilename,
        csv,
        'utf8',
      )
      .then(() => {
        onShare(ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + exportedFilename)
        //globalToast('Csv File Downloaded Successfully');
        setExporting(false);
      });
  };
  const csvExport = (type) => {
    if (
      Object.keys(allExportData).length > 0 &&
      allExportData[type].length > 0
    ) {
      exportCSVFile(headers[type], allExportData[type], 'asquare_' + type); // call the exportCSVFile() function to process the JSON and trigger the download
    }
  };

  const createFileUTF8Call = (key) => {
    if (Object.keys(allExportData).length > 0) {
      const backupData = allExportData;
      Object.keys(backupData).map(function (x) {
        return backupData[x].map(function (v) {
          v.id = '';
          v.lastUpdatedDate = '';
          return v;
        });
      });
      encryptData(JSON.stringify(backupData), key)
        .then(({cipher, iv}) => {
          var backupFile = 'brfile_'+moment.utc().valueOf()+'.db';
              ReactNativeBlobUtil.fs
                .createFile(
                  ReactNativeBlobUtil.fs.dirs.DocumentDir +'/'+backupFile,
                  iv + '' + cipher,
                  'utf8',
                )
                .then(() => {
                  //console.log('iv',iv);
                  onShare(ReactNativeBlobUtil.fs.dirs.DocumentDir +'/'+backupFile);
                  //globalToast('Backup Created Successfully');
                });
            
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      globalToast('No data to create backup');
    }
  };

  const existsCall = (type) => {
    EncryptedStorage.getItem('masterToken')
      .then((token) => {
        generateKey(token, ensalt, 5000, 256)
          .then((key) => {
           // console.log(type);
            if (type == '2') {
              createFileUTF8Call(key);
            } else if (type == '1') {
              try {
                DocumentPicker.pick({
                  type: [DocumentPicker.types.allFiles],
                  copyTo: 'cachesDirectory',
                }).then((res) => {
                 // console.log(res);
                  if (!res.name.endsWith(".db")) 
                  {globalToast('Incorrect Backup File');}
                  else if (res.fileCopyUri) {
                    setRModalVisible(!rmodalVisible);
                    setPickeduri(res.fileCopyUri);
                  }
                })
                .catch ((err) => {
                  if (DocumentPicker.isCancel(err)) {
                    globalToast('No files Selected');
                    console.log(err);
                  } else {
                    globalToast('No files Selected');
                    throw err;
                  }
                });
              } catch (err) {
                console.log(err);
              }
            } else {
              globalToast('Something Went Wrong');
            }
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
        backgroundColor: '#FFDE03',
        flex: 1,
      }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#ffc000" />
      {/*  Info Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHead}>
              <Text style={styles.modalHText}>{modalData.head}</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalTextLeft}>{modalData.body}</Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.buttonClose}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/*  Restore BAckup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={rmodalVisible}
        onRequestClose={() => {
          setRModalVisible(!rmodalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHead}>
              <Text style={styles.modalHText}>Enter Master Password</Text>
            </View>
            <View style={styles.modalBody}>
              <TextInput
              keyboardType="numeric"
                placeholder="Master password"
                placeholderTextColor="grey"
                onChangeText={(text) => setRestorePassword(text)}
                secureTextEntry={true}
                style={{
                  fontSize: 20,
                  color: '#000',
                  width: '100%',
                  height: 50,
                  borderBottomWidth: 2,
                  borderBottomColor: 'grey',
                }}
                value={restorePassword}
              />
              <View>
                <Text style={styles.modalbText}>
                  All the data will be deleted and restored with the last backup
                </Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => setRModalVisible(!rmodalVisible)}>
                <Text style={styles.buttonClose}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (restorePassword !== '') {
                    readFromFile(restorePassword);
                  } else {
                    globalToast('Please Enter Master Password');
                  }
                }}>
                <Text style={styles.buttonClose}>Restore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*  Export modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={emodalVisible}
        onRequestClose={() => {
          setModalVisible(!emodalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.emodalHead}>
              <Text style={styles.modalHText}>Export Passwords as csv </Text>
              {exporting && <ActivityIndicator size="small" color="#FFDE03" />}
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.ebutton}
                onPress={() => {
                  csvExport('passwords');
                  setExporting(true);
                }}>
                <Icon.Ionicons
                  name="lock-closed-outline"
                  color="#121212"
                  size={25}
                />
                <Text style={styles.emodalText}>Passwords</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ebutton}
                onPress={() => {
                  csvExport('cards');
                  setExporting(true);
                }}>
                <Icon.Ionicons name="card-outline" color="#121212" size={25} />
                <Text style={styles.emodalText}>Cards</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => setEModalVisible(!emodalVisible)}>
                <Text style={styles.buttonClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          height: 170,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
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
            //    flexDirection:"row",
            alignItems: 'center',
            marginTop: 25,
            width: '100%',
          }}>
          <View style={{width: '100%', paddingBottom: 30}}>
            <Text
              style={{
                fontSize: 28,
                color: '#121212',
                fontWeight: 'bold',
              }}>
              Backup/Restore/Export
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#121212',
              }}>
              Backup/Restore your saved cards/passwords or download it as a Csv
              File
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
          <Icon.Ionicons color="#0336FF" name="arrow-down" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 150,
              }}>
              Backup your saved cards/passwords
            </Text>
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setModalData({
                  head: 'Backup Note',
                  body:
                    'The backup is protected by your MASTER PASSWORD. In Future if you change your MASTER PASSWORD, old backups will still require OLD MASTER PASSWORD to restore that backup and dont change the location of the backup file or make changes in the file in order to restore it properly',
                });
              }}>
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
            style={styles.backButton}>
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
          <Icon.Ionicons color="#0336FF" name="arrow-up" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 150,
              }}>
              Restore from Last Created Backup
            </Text>
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setModalData({
                  head: 'Restore Note',
                  body:
                    'The backup is protected by your MASTER PASSWORD. MASTER PASSWORD at the time of last backup will be required to restore that backup',
                });
              }}>
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
            onPress={() => existsCall('1')}
            style={styles.backButton}>
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
          <Icon.Ionicons color="#0336FF" name="arrow-down" size={30} />
          <View>
            <Text
              style={{
                color: '#345c74',
                fontFamily: 'Bold',
                fontSize: 13,
                paddingHorizontal: 20,
                width: 150,
              }}>
              Download as a csv File
            </Text>
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setModalData({
                  head: 'Restore Note',
                  body:
                    'The backup is protected by your MASTER PASSWORD. MASTER PASSWORD at the time of last backup will be required to restore that backup',
                });
              }}>
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
            onPress={() => setEModalVisible(!emodalVisible)}
            style={styles.backButton}>
            <Text style={{color: '#fff'}}>Export as csv</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    height: windowHeight,
    width: windowWidth,
    backgroundColor: '#00000063',
    opacity: 50,
  },
  modalHead: {
    padding: 35,
    backgroundColor: '#0336FF',
    width: windowWidth - 50,
  },
  emodalHead: {
    flexDirection: 'row',
    padding: 35,
    backgroundColor: '#0336FF',
    width: windowWidth - 50,
  },
  modalBody: {
    padding: 35,
    width: windowWidth - 50,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: windowWidth - 50,
  },
  ebutton: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  modalView: {
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  button: {
    padding: 10,
    margin: 20,
  },

  buttonClose: {
    color: '#0336FF',
    fontSize: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalHText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    paddingRight: 10,
  },
  modalbText: {
    color: 'red',
    fontSize: 12,
    paddingRight: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextLeft: {
    marginBottom: 15,
    textAlign: 'left',
  },
  emodalText: {
    paddingLeft: 10,
    fontSize: 18,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#0336FF',
    padding: 10,
    width: 120,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop:10
  },
});
export default importExport;
