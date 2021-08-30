import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import Icon from '../components/icons';
import {CreditCardInput} from 'react-native-credit-card-input-view';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
import {
  addcardData,
  deletecardData,
  EditDataCard,
  retrieveUserSession,
} from '../db/operations';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
  },
  label: {
    color: 'black',
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: 'black',
    borderBottomColor: 'grey',
  },

  cardType: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    flexDirection: 'row',
    width: 120,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    borderWidth: 0.5,
  },
  cardTypeSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    flexDirection: 'row',
    width: 120,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
    borderWidth: 1,
  },
  cardTypeText: {
    paddingLeft: 5,
  },
});

// seteditcreditdata(NULL);
// setcreditdata(NULL);
// updatecardType('');

function CreditcardInput(props) {
  const {navigation, route} = props;
  const RouteParams = route.params;
  const [creditdata, setcreditdata] = useState([]);
  const [editcreditdata, seteditcreditdata] = useState([]);
  const [cardType, updatecardType] = useState(1);
  const [id, setId] = useState('');

  useEffect(() => {
    if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
      setId(RouteParams.item.id);
      seteditcreditdata({
        name: RouteParams.item.name,
        number: RouteParams.item.number,
        expiry: RouteParams.item.expiry,
        cvc: RouteParams.item.cvc,
        postalCode: RouteParams.item.postalCode,
      });

      updatecardType(RouteParams.Ctype);
    }
  }, [RouteParams]);

  useEffect(() => {
    if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
      navigation.setOptions({
        title: 'Edit Card',
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Delete Card',
                  'Are you sure you want to delete this Card?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('cancelled'),
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: () => {
                        retrieveUserSession().then((key) => {
                          deletecardData(id, key)
                            .then((data) => {
                              navigation.goBack();
                              globalToast('Card has been deleted successfully');
                            })
                            .catch((error) => {
                              console.log('DeleteData ERROR', error);
                            });
                        });
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }}>
              <Icon.Ionicons color="#121212" name="trash-outline" size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginHorizontal: 15}}
              onPress={() => {
                if (creditdata.valid) {
                  if (cardType !== '') {
                    retrieveUserSession().then((key) => {
                      EditDataCard(creditdata.values, id, cardType, key)
                        .then((data) => {
                          globalToast('Card has been Updated successfully');
                          navigation.goBack();
                        })
                        .catch((error) => {
                          console.log('editData ERROR', error);
                        });
                    });
                  } else {
                    globalToast('Choose card Type');
                  }
                }
              }}>
              <Icon.Ionicons
                color="#121212"
                name="checkmark-circle-outline"
                size={25}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      // Create Form Navigation Option for
      navigation.setOptions({
        title: 'Add Card',
        headerRight: () => (
          <TouchableOpacity
            style={{marginHorizontal: 20}}
            onPress={() => {
              if (creditdata.valid) {
                if (cardType !== '') {
                  retrieveUserSession().then((key) => {
                    addcardData(creditdata.values, cardType, key)
                      .then((data) => {
                        globalToast('Card has been added successfully');
                        navigation.goBack();
                      })
                      .catch((error) => {
                        console.log('addcardData ERROR', error);
                      });
                  });
                } else {
                  globalToast('Choose card Type');
                }
              } else {
                globalToast('Please fill all the fields');
              }
            }}>
            <Icon.Ionicons
              color="#121212"
              name="checkmark-circle-outline"
              size={30}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [creditdata, cardType, id, RouteParams, navigation]);

  function _onChange(formData) {
    setcreditdata(formData);
  }
  function _onFocus(field) {
    //console.log("focusing", field);
  }

  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#ffc000" />
      <View
        style={{
          height: 150,
          backgroundColor: '#FFDE03',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingLeft: 20,
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 20, paddingVertical: 10}}>
          <TouchableOpacity
            onPress={() => updatecardType(1)}
            style={[
              cardType == 1 ? styles.cardTypeSelected : styles.cardType,
              {borderColor: cardType == 1 ? 'red' : 'black'},
            ]}>
            <Icon.Ionicons
              style={styles.cardTypeIcon}
              name="card-outline"
              color={cardType == 1 ? 'red' : 'black'}
              size={20}
            />
            <Text
              style={[
                styles.cardTypeText,
                {color: cardType == 1 ? 'red' : 'black'},
              ]}>
              Credit Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatecardType(2)}
            style={[
              cardType == 2 ? styles.cardTypeSelected : styles.cardType,
              {borderColor: cardType == 2 ? 'purple' : 'black'},
            ]}>
            <Icon.Ionicons
              style={styles.cardTypeIcon}
              name="card-outline"
              color={cardType == 2 ? 'purple' : 'black'}
              size={20}
            />
            <Text
              style={[
                styles.cardTypeText,
                {color: cardType == 2 ? 'purple' : 'black'},
              ]}>
              Debit Card
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.container}>
        <CreditCardInput
          // autoFocus
          allowScroll
          requiresName
          requiresCVC
          requiresPostalCode
          labels={{
            name: "CARDHOLDER'S NAME",
            number: 'CARD NUMBER',
            expiry: 'EXPIRY',
            cvc: 'CVC/CCV',
            postalCode: 'BANK NAME',
          }}
          values={editcreditdata}
          placeholders={{
            name: 'Full Name',
            number: '1234 5678 1234 5678',
            expiry: 'MM/YY',
            cvc: 'CVC',
            postalCode: 'Bank',
          }}
          // cardImageFront={require("./card.png")}
          // cardImageBack={require("./card.png")}
          cardScale={1.15}
          labelStyle={styles.label}
          inputStyle={styles.input}
          validColor={'black'}
          invalidColor={'red'}
          placeholderColor={'darkgray'}
          addtionalInputsProps={{
            bankname: {
              defaultValue: 'Bank name',
              maxLength: 60,
            },
          }}
          useVertical={true}
          onFocus={_onFocus}
          onChange={_onChange}
        />
      </View>
    </>
  );
}

export default CreditcardInput;
