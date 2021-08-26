const Realm = require('realm');
import moment from 'moment';
import EncryptedStorage from 'react-native-encrypted-storage';
const {Base64} = require('js-base64');
export const retrieveUserSession = async () => {
  try {
    let session = Base64.toUint8Array(
      await EncryptedStorage.getItem('masterTokenHash'),
    );
    return session !== undefined ? session : '';
  } catch (error) {
    // There was an error on the native side
  }
};

export const PasswordSchema = {
  name: 'Passwords',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    website: 'string',
    login: 'string',
    password: 'string',
    note: 'string',
    type: 'int',
    lastUpdatedDate: 'int',
  },
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: 1,
  // encryptionKey: key,
};

export const cardSchema = {
  name: 'Card',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    expiry: 'string',
    cvc: 'string',
    number: 'string',
    postalCode: 'string',
    cdtype: 'string',
    type: 'int',
    lastUpdatedDate: 'int',
  },
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: 1,
  // encryptionKey: key,
};

export const getAllData = (key) => {
  return new Promise(function (resolve, reject) {
    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        // pupulate with a secure key
        const allPasswords = realm.objects('Passwords').sorted([
          ['type', false],
          ['lastUpdatedDate', true],
        ]);
        let pass = Array.from(allPasswords);
        //.slice(0, 5)
        resolve(JSON.parse(JSON.stringify(pass)));
        realm.close();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getAllExportData = (key) => {
  return new Promise(function (resolve, reject) {
    Realm.open({
      schema: [PasswordSchema, cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        // pupulate with a secure key
        const allExportpdata = realm.objects('Passwords').sorted([
          ['type', false],
          ['lastUpdatedDate', true],
        ]);
        const allExportcdata = realm.objects('Card').sorted([
          ['type', false],
          ['lastUpdatedDate', true],
        ]);
        let allData = {};
        if (allExportpdata.length > 0) {
          allData['passwords'] = allExportpdata;
        }
        if (allExportcdata.length > 0) {
          allData['cards'] = allExportcdata;
        }
        resolve(JSON.parse(JSON.stringify(allData)));
        realm.close();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getAllcardData = (key) => {
  return new Promise(function (resolve, reject) {
    Realm.open({
      schema: [cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        // pupulate with a secure key
        const allCards = realm.objects('Card').sorted([
          ['type', false],
          ['lastUpdatedDate', true],
        ]);
        let Card = Array.from(allCards);
        //.slice(0, 5)
 
        resolve(JSON.parse(JSON.stringify(Card)));
        realm.close();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const createDataNew = (item, passwordType, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          let data = realm.create(
            'Passwords',
            {
              id: moment.utc().valueOf(),
              name: item.name,
              website: item.webAddress || '',
              login: item.login,
              password: item.password,
              note: item.note || '',
              type: passwordType,
              lastUpdatedDate: moment.utc().valueOf(),
            },
            true,
          );
 
          // realm.close();
          resolve('DONE');
 
          console.log('CREATE createDataNew data', data);
        });
 
      })
      .catch((error) => {
        console.log('error', error);
        reject(error);
      });
  });
};

export const insertAllData = (data, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [cardSchema, PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          data = JSON.parse(data);

          if (Object.keys(data).length > 0) {
            Object.keys(data).map(function (x) {
              if (x == 'cards') {
                data['cards'].map(function (item) {
                  realm.create(
                    'Card',
                    {
                      id: moment.utc().valueOf(),
                      cvc: item.cvc,
                      expiry: item.expiry,
                      name: item.name,
                      number: item.number.replace(/\s/g, ''),
                      postalCode: item.postalCode,
                      cdtype: item.cdtype,
                      type: parseInt(item.type),
                      lastUpdatedDate: moment.utc().valueOf(),
                    },
                    true,
                  );
                });
              } else if (x == 'passwords') {
                data['passwords'].map(function (item) {
                  realm.create(
                    'Passwords',
                    {
                      id: moment.utc().valueOf(),
                      name: item.name,
                      website: item.website || '',
                      login: item.login,
                      password: item.password,
                      note: item.note || '',
                      type: parseInt(item.type),
                      lastUpdatedDate: moment.utc().valueOf(),
                    },
                    true,
                  );
                });
              }
            });
          }
          resolve('DONE');
        });
        realm.close();
      })
      .catch((error) => {
        console.log('error', error);
        reject(error);
      });
  });
};

export const addcardData = (item, cardType, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          let data = realm.create(
            'Card',
            {
              id: moment.utc().valueOf(),
              cvc: item.cvc,
              expiry: item.expiry,
              name: item.name,
              number: item.number.replace(/\s/g, ''),
              postalCode: item.postalCode,
              cdtype: item.type,
              type: parseInt(cardType),
              lastUpdatedDate: moment.utc().valueOf(),
            },
            true,
          );
          resolve('DONE');
          console.log('CREATE cardDataNew data', data);
        });
      })
      .catch((error) => {
        console.log('error', error);
        reject(error);
      });
  });
};

export const EditDataCard = (item, id, cardType, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        console.log('itemitemitemitemitem', item);
        console.log('itemitemitemitemitem', id);
        realm.write(() => {
          const cardEdit = realm.objects('Card').filtered('id = ' + id);
          console.log('itemitemitemitemitem 3', cardEdit[0]);
          cardEdit[0].name = item.name;
          cardEdit[0].number = item.number.replace(/\s/g, '');
          cardEdit[0].cvc = item.cvc;
          cardEdit[0].expiry = item.expiry;
          cardEdit[0].postalCode = item.postalCode;
          cardEdit[0].cdtype = item.type;
          cardEdit[0].type = parseInt(cardType);
          cardEdit[0].lastUpdatedDate = moment.utc().valueOf();
        });
        resolve('DONE');
      })
      .catch((error) => {
        console.log('error', error);
        reject(error);
      });
  });
};

export const EditDataNew = (item, id, passwordType, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          const passwordEdit = realm
            .objects('Passwords')
            .filtered('id = ' + id);
          passwordEdit[0].name = item.name;
          passwordEdit[0].website = item.webAddress;
          passwordEdit[0].login = item.login;
          passwordEdit[0].password = item.password;
          passwordEdit[0].note = item.note;
          passwordEdit[0].type = passwordType;
          passwordEdit[0].lastUpdatedDate = moment.utc().valueOf();
        });
        resolve('DONE');
      })
      .catch((error) => {
        console.log('error', error);
        reject(error);
      });
  });
};

export const deleteAllData = (key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [PasswordSchema, cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          realm.deleteAll();
          resolve('DONE');
        });
        realm.close();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
export const deletecardData = (id, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [cardSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          const cardSelect = realm.objects('Card').filtered('id = ' + id);
          realm.delete(cardSelect);
          // realm.close();
          resolve('DONE');
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const deleteData = (id, key) => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
 
        realm.write(() => {
 
          const passwordSelect = realm
            .objects('Passwords')
            .filtered('id = ' + id);
           realm.delete(passwordSelect);
          resolve('DONE');
        });
       // realm.close();
      })
      .catch((error) => {
        reject(error);
      });
  });
};
