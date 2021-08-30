import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from '../components/icons';
import {FocusAwareStatusBar} from '../constants/helper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SingleDetail = (props) => {
  const {navigation, route} = props;
  const RouteParams = route.params;
  const [text, setText] = useState('');
  if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
    var [passwordsholder, setpasswordsholder] = useState(RouteParams.item);
    var [passwords, setPasswords] = useState(RouteParams.item);
    var [passwordTypeName, setpasswordTypeName] = useState(
      RouteParams.passwordType,
    );
  } else {
  }
  const searchData = (text) => {
    const newData = passwordsholder.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setPasswords(newData);
    setText(text);
  };
  return (
    <View
      style={{
        backgroundColor: '#f9f9f9',
        flex: 1,
        height: windowHeight,
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
              {passwordTypeName}
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
          backgroundColor: '#FFF',
          paddingVertical: 0,
          paddingHorizontal: 20,
          marginHorizontal: 20,
          borderRadius: 15,
          marginTop: -25,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 3,
          marginBottom: 15,
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
      <View
        style={{
          width: '100%',
          paddingLeft: 10,
          flex: 1,
        }}>
        <FlatList
          data={passwords}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate('HelloForm', {
                  item: item,
                  createFlag: 0,
                })
              }
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
                  {item.name}
                </Text>
              </View>
              <Text style={styles.passwordSectext}>{item.website}</Text>
            </TouchableOpacity>
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
    color: '#0336FF',
    paddingTop: 3,
  },
});
export default SingleDetail;
