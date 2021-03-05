import {Formik} from 'formik';
import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {FormButton} from './Center';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from '../components/icons';
import * as Yup from 'yup';
import {FocusAwareStatusBar, globalToast} from '../constants/helper';
import {
  deleteData,
  createDataNew,
  EditDataNew,
  retrieveUserSession,
} from '../db/operations';
import Clipboard from '@react-native-clipboard/clipboard';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Label')
    .required()
    .min(2, 'Must have at least 2 characters'),
  login: Yup.string().label('login').required('Username is a required field'),
  password: Yup.string()
    .label('password')
    .required('password is a required field'),
});

const CreateEditForm = (props) => {
  const {navigation, route} = props;
  const RouteParams = route.params;
  const [passwordType, updatepasswordType] = useState(1);
  const [showPassword, showPasswordUpdate] = useState(true);
  const [passwordIcon, passwordIconUpdate] = useState(false);
  var [Pass, setPass] = useState([]); //TODO
  const [isCreate, setIsCreate] = useState(false);
  const [id, setId] = useState(null);
  useEffect(() => {
    if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
      updatepasswordType(RouteParams.item.type);
      setPass(RouteParams.item);
      setId(RouteParams.item.id);
      // EDIT Form Navigation Option
      console.log(RouteParams);
    } else {
      setIsCreate(true);
    }
  }, []);

  useEffect(() => {
    if (!RouteParams.createFlag && RouteParams.item != 'No-Item') {
      props.navigation.setOptions({
        title: 'Edit Password',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Password',
                'Are you sure you want to delete this password?',
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
                        deleteData(id, key)
                          .then((data) => {
                            globalToast(
                              'Password has been deleted successfully',
                            );
                            navigation.goBack();
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
        ),
      });
    } else {
      props.navigation.setOptions({
        title: 'Add Password',
        headerRight: () => <></>,
      });
    }
    return () => {
      // Do something when the screen is unfocused
      // Useful for cleanup functions
    };
  }, [id]);
  function renderErrormsg(msg) {
    return <Text style={styles.errorMsg}>{msg}</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      onPress={Keyboard.dismiss}
      // enabled behavior="padding"
    >
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#ffc000" />
      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 20, paddingVertical: 10}}>
          <TouchableOpacity
            onPress={() => updatepasswordType(1)}
            style={[
              passwordType == 1
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 1 ? 'red' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="body-outline"
              color={passwordType == 1 ? 'red' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 1 ? 'red' : 'grey'},
              ]}>
              Personal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(2)}
            style={[
              passwordType == 2
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 2 ? 'purple' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="airplane-outline"
              color={passwordType == 2 ? 'purple' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 2 ? 'purple' : 'grey'},
              ]}>
              Travel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(3)}
            style={[
              passwordType == 3
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 3 ? 'blue' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="business-outline"
              color={passwordType == 3 ? 'blue' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 3 ? 'blue' : 'grey'},
              ]}>
              Work
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(4)}
            style={[
              passwordType == 4
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 4 ? 'green' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="cash-outline"
              color={passwordType == 4 ? 'green' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 4 ? 'green' : 'grey'},
              ]}>
              Finance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(5)}
            style={[
              passwordType == 5
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 5 ? 'yellow' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="cart-outline"
              color={passwordType == 5 ? 'yellow' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 5 ? 'yellow' : 'grey'},
              ]}>
              Shopping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(6)}
            style={[
              passwordType == 6
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 6 ? 'pink' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="share-social-outline"
              color={passwordType == 6 ? 'pink' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 6 ? 'pink' : 'grey'},
              ]}>
              Social
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => updatepasswordType(7)}
            style={[
              passwordType == 7
                ? styles.passwordTypeSelected
                : styles.passwordType,
              {borderColor: passwordType == 7 ? 'orange' : 'grey'},
            ]}>
            <Icon.Ionicons
              style={styles.passwordTypeIcon}
              name="medical-outline"
              color={passwordType == 7 ? 'orange' : 'grey'}
              size={20}
            />
            <Text
              style={[
                styles.passwordTypeText,
                {color: passwordType == 7 ? 'orange' : 'grey'},
              ]}>
              Others
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Formik
          enableReinitialize
          initialValues={{
            name: isCreate ? '' : Pass.name,
            webAddress: isCreate ? '' : Pass.website,
            login: isCreate ? '' : Pass.login,
            password: isCreate ? '' : Pass.password,
            note: isCreate ? '' : Pass.note,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              if (isCreate) {
                retrieveUserSession().then((key) => {
                  createDataNew(values, passwordType, key)
                    .then((data) => {
                      globalToast('Password has been added successfully');
                      navigation.navigate('Detail');
                      actions.setSubmitting(false);
                    })
                    .catch((error) => {
                      console.log('createData ERROR', error);
                    });
                });
              } else {
                retrieveUserSession().then((key) => {
                  EditDataNew(values, id, passwordType, key)
                    .then((data) => {
                      globalToast('Password has been Updated successfully');
                      navigation.goBack();
                      actions.setSubmitting(false);
                    })
                    .catch((error) => {
                      console.log('editData ERROR', error);
                    });
                });
              }
            }, 0);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            errors,
            isSubmitting,
          }) => (
            <View style={{marginHorizontal: 15}}>
              <View style={styles.FormfieldssCon}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {renderErrormsg(errors.name)}
              </View>
              <View style={styles.FormfieldssCon}>
                <Text style={styles.inputLabel}>webAddress</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.webAddress}
                  onChangeText={handleChange('webAddress')}
                  onBlur={handleBlur('webAddress')}
                />
              </View>
              <View style={styles.FormfieldssCon}>
                <Text style={styles.inputLabel}>Username/email/id</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.login}
                  onChangeText={handleChange('login')}
                  onBlur={handleBlur('login')}
                />
                {errors.login && renderErrormsg(errors.login)}
              </View>
              <View style={[styles.FormfieldssCon, {position: 'relative'}]}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={[styles.textInput, {flex: 1, paddingRight: 85}]}
                  secureTextEntry={showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />

                <TouchableOpacity
                  style={{position: 'absolute', right: 35, top: 20}}
                  onPress={() => {
                    showPasswordUpdate(!showPassword),
                      passwordIconUpdate(!passwordIcon);
                  }}>
                  <Icon.Ionicons
                    color="green"
                    name={passwordIcon ? 'eye-outline' : 'eye-off-outline'}
                    size={25}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{position: 'absolute', right: 5, top: 20}}
                  onPress={() => {
                    Clipboard.setString(values.password);
                    globalToast('Copied to Clipboard');
                  }}>
                  <Icon.Ionicons
                    color="green"
                    name="clipboard-outline"
                    size={25}
                  />
                </TouchableOpacity>
                {errors.password && renderErrormsg(errors.password)}
              </View>
              <View style={styles.FormfieldssCon}>
                <Text style={styles.inputLabel}>Note</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.note}
                  onChangeText={handleChange('note')}
                  onBlur={handleBlur('note')}
                />
              </View>

              <View
                style={{
                  marginVertical: 25,
                  marginHorizontal: 45,
                  borderRadius: 5,
                }}>
                <FormButton
                  buttonType="outline"
                  onPress={handleSubmit}
                  title={isCreate ? 'Save' : 'Update'}
                  buttonColor="#0336FF" //TODO
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  passwordType: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    flexDirection: 'row',
    width: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderWidth: 0.5,
  },
  passwordTypeSelected: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    flexDirection: 'row',
    width: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderWidth: 1,
  },
  passwordTypeText: {
    paddingLeft: 5,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingVertical: 5,
  },
  errorMsg: {
    color: 'red',
  },
  inputLabel: {
    paddingVertical: 0,
  },
  FormfieldssCon: {
    marginBottom: 25,
  },
});
export default CreateEditForm;
