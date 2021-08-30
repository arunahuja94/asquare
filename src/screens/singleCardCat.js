import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from '../components/icons';
import {CardView} from 'react-native-credit-card-input-view';
const windowWidth = Dimensions.get('window').width;
import {FocusAwareStatusBar} from '../constants/helper';
const SingleCardCat = (props) => {
  const {navigation, route} = props;
  const RouteParams = route.params;
  const [text, setText] = useState('');
  if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
    var [cardsholder, setcardsholder] = useState(RouteParams.item);
    var [cards, setcards] = useState(RouteParams.item);
    var [cardTypeName, setcardTypeName] = useState(RouteParams.cardType);
  } else {
  }
  const searchData = (text) => {
    const newData = cardsholder.filter((item) => {
      const itemData = item.number.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setcards(newData);
    setText(text);
  };
  function renderSeparator() {
    return (
      <View
        style={{
          height: 30,
        }}
      />
    );
  }
  return (
    <View
      style={{
        backgroundColor: '#f9f9f9',
        flex: 1,
      }}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#ffc000" />
      <View
        style={{
          backgroundColor: '#FFDE03',
          height: 190,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon.Ionicons color="#121212" name="arrow-back-outline" size={25} />
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
              {cardTypeName}
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
      <View>
        <View
          style={{
            backgroundColor: '#FFF',
            paddingVertical: 0,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            borderRadius: 15,
            marginTop: -25,
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
            marginBottom: 25,
          }}>
          <TextInput
            placeholder="Search"
            onChangeText={(text) => searchData(text)}
            placeholderTextColor="#0336FF"
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              width: 260,
            }}
          />
          <Icon.Ionicons color="#0336FF" name="search-outline" size={20} />
        </View>
      </View>
      <View
        style={{
          width: windowWidth,
          paddingBottom: 20,
          flex: 1,
        }}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={renderSeparator}
          renderItem={({item}) => (
            <View
              style={{
                width: windowWidth,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <CardView
                number={item.number}
                cvc={item.cvc}
                expiry={item.expiry}
                brand={item.cdtype}
                postalCode={item.postalCode}
                name={item.name}
                display={true}
                clickable={() =>
                  navigation.navigate('creditcardInput', {
                    item: item,
                    Ctype: item.type,
                    createFlag: 0,
                  })
                }
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  passwordList: {
    height: 60,
    elevation: 2,
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: windowWidth / 2 - 25,
    marginHorizontal: '2%',
  },
  passwordSectext: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#b1e5d3',
    paddingTop: 3,
  },
});
export default SingleCardCat;
