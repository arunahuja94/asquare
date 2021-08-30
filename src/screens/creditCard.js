import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SectionList,
} from 'react-native';
import {CardView} from 'react-native-credit-card-input-view';
import Icon from '../components/icons';
import {useFocusEffect} from '@react-navigation/native';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
import {getAllcardData, retrieveUserSession} from './../db/operations';
import Clipboard from '@react-native-clipboard/clipboard';
const creditCard = ({navigation}) => {
  const [hasData, sethasData] = useState(false);
  const [cards, SetCards] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      retrieveUserSession().then((key) => {
        getAllcardData(key)
          .then((data) => {
            if (data.length > 0) {
              SetCards(data);
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
        SetCards([]);
        sethasData(false);
      };
    }, []),
  );
  function cardperType(cards, type) {
    var cardsperType = cards.filter(function (el) {
      return el.type == type;
    });
    return cardsperType;
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
              My Cards
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
              }}
              onPress={() =>
                navigation.navigate('creditcardInput', {
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
            <Text style={{marginTop: 30, fontSize: 15}}>No Cards</Text>
          </View>
        )}

        {hasData && (
          <SectionList
            ItemSeparatorComponent={FlatListItemSeparator}
            sections={[
              {
                title: 'Credit Card',
                type: '1',
                alldata: cardperType(cards, '1'),
                data: cardperType(cards, '1').slice(0, 2),
                total: cardperType(cards, '1').length,
              },
              {
                title: 'Debit Card',
                type: '2',
                alldata: cardperType(cards, '2'),
                data: cardperType(cards, '2').slice(0, 2),
                total: cardperType(cards, '2').length,
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
                    {section.total > 2 && (
                      <View style={{width: '30%', alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#0336FF',
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            borderRadius: 15,
                          }}
                          onPress={() =>
                            navigation.navigate('singleCardCat', {
                              item: section.alldata,
                              createFlag: 0,
                              cardType: section.title,
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
                  <View style={{marginVertical: 20}}>
                    <FlatList
                      horizontal
                      data={section.data}
                      renderItem={({item}) => (
                        <View key={item.id} style={{marginHorizontal: 20}}>
                          <CardView
                            number={item.number}
                            cvc={item.cvc}
                            expiry={item.expiry}
                            brand={item.cdtype}
                            postalCode={item.postalCode}
                            name={item.name}
                            display={true}
                            flipDirection="v"
                            onPressfunc={() =>
                              navigation.navigate('creditcardInput', {
                                item: item,
                                Ctype: section.type,
                                createFlag: 0,
                              })
                            }
                            onLongPressfunc={() => {
                              Clipboard.setString(item.number);
                              globalToast(
                                'Credit card number copied to Clipboard',
                              );
                            }}
                          />
                        </View>
                      )}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
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
    color: '#b1e5d3',
    paddingTop: 3,
  },
  listItemSeparatorStyle: {
    height: 20,
  },
});
export default creditCard;
