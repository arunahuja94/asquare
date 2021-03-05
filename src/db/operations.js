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

// export const TokenSchema = {
//   name: 'usertoken',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     token: 'string',
//     added_date: 'int',
//   },
//   schemaVersion: 1,
//   deleteRealmIfMigrationNeeded: 1,
//   encryptionKey: key,
// };

// export const getTokenData = () => {
//   return new Promise(function(resolve, reject) {
//     Realm.open({
//       schema: [TokenSchema],
//       encryptionKey: key,
//     })
//       .then(realm => {
//         // pupulate with a secure key
//         const singletoken = realm.objects('usertoken').sorted('token');
//         let sToken = Array.from(singletoken);
//         console.log(JSON.stringify(sToken));
//         resolve(JSON.parse(JSON.stringify(sToken)));
//         realm.close();
//       })
//       .catch(error => {
//         console.log(error);
//         reject(error);
//       });
//   });
// };

// export const createToken = token => {
//   return new Promise((resolve, reject) => {
//     Realm.open({
//       schema: [TokenSchema],
//       encryptionKey: key,
//     })
//       .then(realm => {
//         realm.write(() => {
//           let data = realm.create(
//             'usertoken',
//             {
//               id: moment.utc().valueOf(),
//               token: token,
//               added_date: moment.utc().valueOf(),
//             },
//             true,
//           );
//           // console.log('data 1', data);
//          //realm.close();
//           resolve('DONE');
//           // }
//           console.log('CREATE token');
//         });
//         // resolve('DONE');
//       })
//       .catch(error => {
//         console.log('error', error);
//         reject(error);
//       });
//   });
// };

// export const deleteAllTokenData = () => {
//   return new Promise((resolve, reject) => {
//     Realm.open({
//       schema: [TokenSchema],
//       encryptionKey: key,
//     })
//       .then(realm => {
//         realm.write(() => {
//           realm.deleteAll();
//           realm.close();
//           resolve('DONE');
//         });
//       })
//       .catch(error => {
//         console.log(error);
//         reject(error);
//       });
//   });
// };

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
        //console.log(JSON.parse(JSON.stringify(pass)));
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
        //let allPData = Array.from(allExportpdata);
        //let allCData = Array.from(allExportcdata);
        //.slice(0, 5)
        console.log(allExportpdata.length, 'checklen');
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
        //console.log(JSON.parse(JSON.stringify(pass)));
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
          // console.log('data 1', data);

          // realm.close();
          resolve('DONE');
          // }
          console.log('CREATE createDataNew data', data);
        });
        // resolve('DONE');
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
          // console.log('data 1', data);

          // realm.close();
          resolve('DONE');
          // }
          console.log('CREATE cardDataNew data', data);
        });
        // resolve('DONE');
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
        console.log('itemitemitemitemitem', item);
        console.log('itemitemitemitemitem', id);
        realm.write(() => {
          const passwordEdit = realm
            .objects('Passwords')
            .filtered('id = ' + id);
          console.log('itemitemitemitemitem 3', passwordEdit[0]);
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

export const deleteAllData = () => {
  return new Promise((resolve, reject) => {
    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        realm.write(() => {
          realm.deleteAll();
          realm.close();
          resolve('DONE');
        });
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
          console.log('cardSelect', cardSelect);
          realm.delete(cardSelect);
          // realm.close();
          resolve('DONE');
        });
      })
      .catch((error) => {
        console.log('error=====', error);
        reject(error);
      });
  });
};
export const deleteData = (id, key) => {
  console.log('1o11919=====');
  return new Promise((resolve, reject) => {
    console.log('1o11919=1====');

    Realm.open({
      schema: [PasswordSchema],
      encryptionKey: key,
    })
      .then((realm) => {
        console.log('1o11919=13====');

        realm.write(() => {
          console.log('1o11919=133====');

          const passwordSelect = realm
            .objects('Passwords')
            .filtered('id = ' + id);
          console.log('passwordSelectpasswordSelect', passwordSelect);
          realm.delete(passwordSelect);
          // realm.close();
          resolve('DONE');
        });
      })
      .catch((error) => {
        console.log('error=====', error);
        reject(error);
      });
  });
};
