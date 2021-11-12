/*
 * Reducer actions related with login
 */
import * as types from './types';

export function onSearchFetching(params) {
  return {
    type: types.FETCHING_DATA,
    payload: params
  };
}

export function onSuggestFetching(params) {
  return {
    type: types.FETCHING_SUGGESTING_DATA,
    payload: params
  };
}

export function onFetchSuggestionSuccess(dataSearch, arrResult, data, strSearch, isTyping) {
  return {
    type: types.FETCHING_SUGGESTING_DATA_SUCCESS, dataSearch, arrResult, data, strSearch, isTyping
  };
}

export function onFetchSearchFailed() {
  return {
    type: types.FETCHING_FAILURE
  };
}

export function onFetchSearchSuccess(dataSearch, arrResult,data,strSearch,isSuggest,isCheckLocation,distanceLocation,type_services,location, isTyping) {
  return {
    type: types.FETCHING_SUCCESS, dataSearch, arrResult,data,strSearch,isSuggest,isCheckLocation,distanceLocation,type_services,location, isTyping
  };
}

export function onFilterFetching(params) {
  return {
    type: types.FETCHING_DATA_FILTER,
    payload: params
  };
}

export function onFetchFilterFailed() {
  return {
    type: types.FETCHING_FAILURE_FILTER
  };
}

export function onFetchFilterSuccess(dataSearch, arrResult,data,isCheckLocation,distanceLocation,type_services,location,strSearch,typeAction) {
  return {
    type: types.FETCHING_SUCCESS_FILTER,dataSearch, arrResult, data,isCheckLocation,distanceLocation,type_services,location,strSearch,typeAction
  };
}


export function onUpdateCoordinateFetching(params) {
  return {
    type: types.FETCHING_DATA_UPDATE_COORDINATE,
    payload: params
  };
}


export function onFetchCoordinateSuccess(data) {
  return {
    type: types.FETCHING_DATA_SUCCESS_COORDINATE, data
  };
}

export function onUpdateInitFetching(params) {
  return {
    type: types.FETCHING_DATA_INITIAL,
    payload: params
  };
}


export function onFetchInitSuccess(data) {
  return {
    type: types.FETCHING_DATA_SUCCESS_INITIAL, data
  };
}

export function onUpdateSelectedFetching(params) {
  return {
    type: types.FETCHING_DATA_SELECTED,
    payload: params
  };
}

export function onUpdateSelectedIdDealerFetching(params) {
  return {
    type: types.FETCHING_DATA_SELECTEDID,
    payload: params
  };
}


export function onFetchSelectedSuccess(selectedIndex) {
  return {
    type: types.FETCHING_DATA_SUCCESS_SELECTED, selectedIndex
  };
}

export function onFetchSelectedIdDealerSuccess(selectedIdDealer) {
  return {
    type: types.FETCHING_DATA_SUCCESS_SELECTEDID, selectedIdDealer
  };
}

export function onUpdateDataBounding(params) {
  return {
    type: types.UPDATED_DATA_BOUNDING,
    payload: params
  };
}


export function onUpdateDataBoundingSuccess(data) {
  return {
    type: types.UPDATED_DATA_BOUNDING_SUCCESS,data
  };
}
