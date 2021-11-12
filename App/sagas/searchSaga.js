import { put, call, select } from 'redux-saga/effects';
import { getStorage, setStorage } from './storage';
import * as searchActions from 'App/actions/searchActions';
import * as searchAPI from 'App/api/methods/searchAPI';
import dealerList from '@Database/Dealers.json';
import CommonUtils from '@CommonUtils'

export function* searchingData(action) {
  let strSearch = action.payload.strSearch;
  let isSuggestion = action.payload.isSuggest;
  const isCheckLocation = action.payload.isCheckLocation;
  const distanceLocation = action.payload.distanceLocation;
  const type_services = action.payload.type_services;
  const location = action.payload.location;
  var newData = [];

  newData = yield CommonUtils.getDealerFromAsync();
  let originData = newData && newData.length > 0 ? newData : dealerList;
  var data = originData;

  var arrResult = [];
  var dataSearch = [];
  var filterDataSearch = [];
  if (strSearch != '') {
    dataSearch = yield call(searchAPI.fetchSearchByKeyName, strSearch);
    if (dataSearch.length > 0) {
      for (var i = 0; i < dataSearch.length; i++) {
        const item = dataSearch[i]
        if (item['place_name'].toUpperCase().indexOf("United States".toUpperCase()) > -1 ||
          item['place_name'].toUpperCase().indexOf("Canada".toUpperCase()) > -1) {
          arrResult.push(item['place_name'])
          filterDataSearch.push(dataSearch[i])
        }
      }
    }
  }
  if (arrResult) {
    yield put(searchActions.onFetchSearchSuccess(filterDataSearch, arrResult, data, strSearch, isSuggestion, isCheckLocation, distanceLocation, type_services, location));
  } else {
    yield put(searchActions.onFetchSearchFailed());
  }
  
}
export function* filterActionChange(action) {
  let strSearch = action.payload.strSearch;
  const isCheckLocation = action.payload.isCheckLocation;
  const distanceLocation = action.payload.distanceLocation;
  const type_services = action.payload.type_services;
  const location = action.payload.location;
  const typeAction = action.payload.typeAction;
  
  var newData = [];
  newData = yield CommonUtils.getDealerFromAsync();
  let originData = newData && newData.length > 0 ? newData : dealerList;
  let data = originData;
  var arrResult = [];
  var dataSearch = [];
  if (strSearch != '') {
    dataSearch = yield call(searchAPI.fetchSearchByKeyName,strSearch);
    if ( dataSearch.length > 0 ) {
      for (var i = 0; i < dataSearch.length; i++) {
          const item = dataSearch[i]
           arrResult.push(item['place_name'])
      }
    }
  }
  yield put(searchActions.onFetchFilterSuccess(dataSearch,arrResult,data,isCheckLocation,distanceLocation,type_services,location,strSearch,typeAction));

}

export function* suggestingData(action) {
  let isTyping = action.payload.isTyping;
  let strSearch = action.payload.strSearch;

  var newData = [];
  newData = yield CommonUtils.getDealerFromAsync();
  let originData = newData && newData.length > 0 ? newData : dealerList;
  var data = originData;

  var arrResult = [];
  var dataSearch = [];
  var filterDataSearch = [];
  if (strSearch != '') {
    dataSearch = yield call(searchAPI.fetchSearchByKeyName, strSearch);
    if (dataSearch.length > 0) {
      for (var i = 0; i < dataSearch.length; i++) {
        const item = dataSearch[i]
        if (item['place_name'].toUpperCase().indexOf("United States".toUpperCase()) > -1 ||
          item['place_name'].toUpperCase().indexOf("Canada".toUpperCase()) > -1) {
            const itemPlace = ({
              'place_name': item['place_name'],
              'coordinate': item.geometry.coordinates, //[longitude,latitude]
            });
          arrResult.push(itemPlace)
          filterDataSearch.push(dataSearch[i])
        }
      }
    }
  }
  if (arrResult) {
    yield put(searchActions.onFetchSuggestionSuccess(filterDataSearch, arrResult, data, strSearch, isTyping));
  }
}

export function* updateCoordinateChange(action) {
  const coordinate = action.payload.coordinate;
  let data = coordinate;
  yield put(searchActions.onFetchCoordinateSuccess(data));

}

export function* initDefaultApplication(action) {
  yield put(searchActions.onFetchInitSuccess(null));
}

export function* selectedIndexAction(action) {
  const selectedIndex = action.payload.selectedIndex;
  yield put(searchActions.onFetchSelectedSuccess(selectedIndex));
}
export function* selectedIdDealerAction(action) {
  const selectedIdDealer = action.payload.selectedIdDealer;
  yield put(searchActions.onFetchSelectedIdDealerSuccess(selectedIdDealer));
}

export function* updateDataBounding(action) {
  const data = action.payload.dataList;
  yield put(searchActions.onUpdateDataBoundingSuccess(data));
}
