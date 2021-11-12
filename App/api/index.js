// General api to access data
import ApiConstants from './ApiConstants';
export default function api(path, params, method, token, authorization) {
    let options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: method,
        ...(params && { body: JSON.stringify(params) })
    };
    return new Promise((resolve, reject) => {
      return fetch(ApiConstants.BASE_URL + path, options)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson['features']) {
          resolve(responseJson['features']);
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
