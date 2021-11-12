import { AsyncStorage } from 'react-native';

export function * getStorage(key) {
  return new Promise((resolve, reject) => {
    return AsyncStorage.getItem(key)
    .then((response) => {
      return response;
    })
    .then((responseJson) => {
      if (responseJson) {
        resolve(responseJson);
      }
    else {
      reject('error');
    }

    })
    .catch((error) => {
        reject('error');
     });
    });
}

export function addToStorage(obj) {
  Object.assign({}, getStorage(), obj);
}
export function * setStorage(key,item) {
  try {
    return AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error.message);
  }
}