import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  FlatList,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAllData, retrieveUserSession} from './../db/operations';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from '../components/icons';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
const Detail = ({navigation}) => {
  const [passwords, SetPasswords] = useState([]);
  const [hasData, sethasData] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      retrieveUserSession().then((key) => {
        getAllData(key)
          .then((data) => {
            if (data.length > 0) {
              SetPasswords(data);
              sethasData(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        SetPasswords([]);
        sethasData(false);
      };
    }, []),
  );

  function passwordsperType(passwords, type) {
    var passwordsperType = passwords.filter(function (el) {
      return el.type == type;
    });
    return passwordsperType;
  }
  const FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={styles.listItemSeparatorStyle} />
    );
  };
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
          <View style={{width: '70%'}}>
            <Text
              style={{
                fontSize: 28,
                color: '#121212',
                fontWeight: 'bold',
              }}>
              My Passwords
            </Text>
          </View>
          <View style={{width: '30%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#0336FF',
                borderRadius: 100,
                elevation: 1,
              }}
              onPress={() =>
                navigation.navigate('HelloForm', {
                  item: 'No-Item',
                  createFlag: 1,
                })
              }>
              <Icon.Ionicons color="#fff" name="add-outline" size={30} />
            </TouchableOpacity>
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
        {!hasData && (
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              height: 400,
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/img/noPwd.png')}
              style={styles.noPwd}
            />
            <Text style={{marginTop: 30, fontSize: 15}}>No Passwords</Text>
          </View>
        )}
        {hasData && (
          <SectionList
            ItemSeparatorComponent={FlatListItemSeparator}
            sections={[
              {
                title: 'Personal Password',
                type: '1',
                alldata: passwordsperType(passwords, '1'),
                data: passwordsperType(passwords, '1').slice(0, 3),
                total: passwordsperType(passwords, '1').length,
              },
              {
                title: 'Travel Password',
                type: '2',
                alldata: passwordsperType(passwords, '2'),
                data: passwordsperType(passwords, '2').slice(0, 3),
                total: passwordsperType(passwords, '2').length,
              },
              {
                title: 'Work Password',
                type: '3',
                alldata: passwordsperType(passwords, '3'),
                data: passwordsperType(passwords, '3').slice(0, 3),
                total: passwordsperType(passwords, '3').length,
              },
              {
                title: 'Finance Password',
                type: '4',
                alldata: passwordsperType(passwords, '4'),
                data: passwordsperType(passwords, '4').slice(0, 3),
                total: passwordsperType(passwords, '4').length,
              },
              {
                title: 'Shopping Password',
                type: '5',
                alldata: passwordsperType(passwords, '5'),
                data: passwordsperType(passwords, '5').slice(0, 3),
                total: passwordsperType(passwords, '5').length,
              },
              {
                title: 'Social Password',
                type: '6',
                alldata: passwordsperType(passwords, '6'),
                data: passwordsperType(passwords, '6').slice(0, 3),
                total: passwordsperType(passwords, '6').length,
              },
              {
                title: 'Others',
                type: '7',
                alldata: passwordsperType(passwords, '7'),
                data: passwordsperType(passwords, '7').slice(0, 3),
                total: passwordsperType(passwords, '7').length,
              },
            ]}
            renderSectionHeader={({section}) => {
              if (section.total === 0) {
                return;
              }
              return (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <View style={{width: '70%'}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 17,
                          color: '#121212',
                        }}>
                        {section.title}
                      </Text>
                      <View
                        style={{
                          height: 2,
                          backgroundColor: '#0336FF',
                          width: 115,
                          marginTop: -3,
                        }}></View>
                    </View>
                    {section.total > 3 && (
                      <View style={{width: '30%', alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#0336FF',
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            borderRadius: 15,
                          }}
                          onPress={() =>
                            navigation.navigate('singleDetail', {
                              item: section.alldata,
                              createFlag: 0,
                              Ptype: section.type,
                              passwordType: section.title,
                            })
                          }>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 13,
                              color: '#FFF',
                            }}>
                            More
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <FlatList
                    horizontal
                    data={section.data}
                    renderItem={({item}) => (
                      <Pressable
                        key={item.id}
                        onPress={() =>
                          navigation.navigate('HelloForm', {
                            item: item,
                            createFlag: 0,
                          })
                        }
                        onLongPress={() => {
                          Clipboard.setString(item.password);
                          globalToast('Password copied to Clipboard');
                        }}
                        android_ripple={{color: '#F9F9F9'}}
                        style={styles.passwordList}>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingTop: 10,
                            paddingHorizontal: 10,
                          }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}>
                            {item.name.length > 16
                              ? item.name.substring(0, 16) + '...'
                              : item.name}
                          </Text>
                        </View>
                        <Text style={styles.passwordSectext}>
                          {item.website.length > 16
                            ? item.website.substring(0, 16) + '...'
                            : item.website}
                        </Text>
                      </Pressable>
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </>
              );
            }}
            renderItem={({item, section}) => {
              return null;
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  passwordList: {
    height: 60,
    elevation: 2,
    backgroundColor: '#FFF',
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: 160,
  },
  passwordSectext: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#0336FF',
    paddingTop: 3,
  },
  listItemSeparatorStyle: {
    height: 20,
  },
});
export default Detail;
