import Api from 'App/api';
import ApiConstants from '../ApiConstants';

export default function loginUser(userID, password) {
  let params = { userID: userID, password: password};
  return Api(
    ApiConstants.LOGIN,
    params,
    'POST',
    null
  );
}
