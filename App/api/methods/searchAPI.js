import ApiConstants from '../ApiConstants';
import AppString from '@String'
import Api from 'App/api';

export function fetchSearchByKeyName(strSearch) {
  let url = ApiConstants.SEARCH_PLACE_NAME  + strSearch.trim() + '.json?access_token=' + AppString.map_token_string;
  return Api(url, null, 'GET', null, null);
}
