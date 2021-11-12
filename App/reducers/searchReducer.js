/**
 * Loading reducer made seperate for easy blacklisting
 * Avoid data persist
 */
import createReducer from 'App/lib/createReducer';
import * as types from 'App/actions/types';
import CommonUtils from '@CommonUtils'

const initialState = {
  action: '',
  isFetching: false,
  isRefreshing: false,
  error: false,
  responseData: [],
  originData:[],
  autoSuggestionData:[],
  isCheckLocation:false,
  distanceLocation:250, // default 250 miles
  type_services:0,
  location:'',
  strSearch:'',
  isFilter:false,
  currentCordinate: null,
  centerCoordinate:null,
  selectedIndex: - 1,
  selectedIdDealer: - 1,
  autoSuggestionRoutingData:[],
  arrDataBounding:[],
  nameSelected:'',
  typeFilterAction:0
};

export const searchReducer = createReducer(initialState, {

  [types.FETCHING_FAILURE](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: false,
      error: true,
      responseData : [],

    };
  },
  [types.FETCHING_DATA](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
    };
  },
  [types.FETCHING_SUGGESTING_DATA](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
    };
  },
  [types.FETCHING_SUGGESTING_DATA_SUCCESS](state, action) {
    var autoSuggestionData = action.arrResult;

    // This type is for suggesting only, no changing list
    if (action.isTyping) {
      return {
        ...state,
        action: action.type,
        isFetching: true,
        error: false,
        autoSuggestionRoutingData:autoSuggestionData,
      };
    }
  },
  [types.FETCHING_SUCCESS](state, action) {

    var dataResponse = [];
    dataResponse = CommonUtils.getlistArrayByKeySearch(action.data,action.strSearch);
    var dist = action.distanceLocation;
    if (dataResponse.length == 0 ) {
      dataResponse = action.isCheckLocation ? CommonUtils.getlistArrayByKeySearchWithArr(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch,dist) : CommonUtils.getlistArrayByKeySearchWithArr(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch,50);
    }
    
    var dataFilter = [];
    const filterServices = CommonUtils.getlistArrayByTypeServices(dataResponse,action.type_services);
    const filterLocation = filterServices;
    var dist = action.distanceLocation;
    const centerCoordinate = action.isCheckLocation ? CommonUtils.getCenterCoordinate(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, dist) : CommonUtils.getCenterCoordinate(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, 50);
    if (action.isCheckLocation) {
      dataFilter = CommonUtils.filterBydistance(filterLocation,centerCoordinate,dist);
    }
    else
    {
      dataFilter = filterServices;
    }

    if (!dataFilter.length) {
      //dataFilter = CommonUtils.getNearByDealers(action.data, filterLocation,centerCoordinate, 250);
    }

    dataFilter = CommonUtils.sortDealerByCondition(dataFilter,state.currentCordinate)

    var autoSuggestionData = action.arrResult;
    if ( action.arrResult.length > 0 )
    {
      autoSuggestionData = CommonUtils.getlistAutoSuggestionKeySearch(action.arrResult,dataResponse,action.strSearch);
    }

    // This type is for suggesting only, no changing list
    if (action.isTyping) {
      return {
        ...state,
        action: action.type,
        isFetching: false,
        error: false,
        strSearch: action.strSearch,
        isFilter:true,
        selectedIndex:-1,
        autoSuggestionData:autoSuggestionData,
      };
    }

    if ( !action.isSuggest )
    {
      return {
        ...state,
        action: action.type,
        isFetching: false,
        error: false,
        responseData : dataFilter,
        strSearch: action.strSearch,
        isFilter:true,
        selectedIndex:-1,
        autoSuggestionData:autoSuggestionData,
        centerCoordinate:centerCoordinate,
        originData:dataFilter
      };
    }
    else
    {
      return {
        ...state,
        action: action.type,
        isFetching: true,
        error: false,
        strSearch: action.strSearch,
        isFilter:true,
        selectedIndex:-1,
        autoSuggestionData:autoSuggestionData,
      };
    }
  },

  [types.FETCHING_FAILURE_FILTER](state, action) {
    return {
      ...state,
      action: action.type,
      error: true,
    };
  },
  [types.FETCHING_DATA_FILTER](state, action) {
    return {
      ...state,
      action: action.type,
      error: false,
    };
  },
  [types.FETCHING_SUCCESS_FILTER](state, action) {

    var dataResponse = [];
    dataResponse = CommonUtils.getlistArrayByKeySearch(action.data,action.strSearch);
    var dist = action.distanceLocation;
    if (dataResponse.length == 0 ) {
      dataResponse = action.isCheckLocation ? CommonUtils.getlistArrayByKeySearchWithArr(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, dist) : CommonUtils.getlistArrayByKeySearchWithArr(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, 50);
    }
    
    var dataFilter = [];

    const filterServices = CommonUtils.getlistArrayByTypeServices(dataResponse,action.type_services);
    const filterLocation = filterServices;
    var dist = action.distanceLocation;
    const centerCoordinate = action.isCheckLocation ? CommonUtils.getCenterCoordinate(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, dist) : CommonUtils.getCenterCoordinate(action.data,action.strSearch,action.arrResult,action.isSuggest,action.dataSearch, 50);
    if (action.isCheckLocation) {
      dataFilter = CommonUtils.filterBydistance(filterLocation,centerCoordinate,dist);
    }
    else
    {
      dataFilter = filterServices;
    }

    if (!dataFilter.length) {
      //dataFilter = CommonUtils.getNearByDealers(action.data, filterLocation,centerCoordinate, dist);
    }

    dataFilter = CommonUtils.sortDealerByCondition(dataFilter,state.currentCordinate)

    var autoSuggestionData = action.arrResult;
    if ( action.arrResult.length > 0 )
    {
      autoSuggestionData = CommonUtils.getlistAutoSuggestionKeySearch(action.arrResult,dataResponse,action.strSearch);
    }

    return {
      ...state,
      action: action.type,
      error: false,
      isCheckLocation:action.isCheckLocation,
      distanceLocation:action.distanceLocation,
      type_services:action.type_services,
      location:action.location,
      responseData : dataFilter,
      isFilter:true,
      selectedIndex:-1,
      autoSuggestionData:autoSuggestionData,
      centerCoordinate:centerCoordinate,
      originData:dataFilter,
      typeFilterAction: action.typeAction

    };
  },
  [types.FETCHING_DATA_SUCCESS_COORDINATE](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: false,
      error: true,
      currentCordinate:action.data
    };
  },
  [types.FETCHING_DATA_UPDATE_COORDINATE](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
    };
  },
  [types.FETCHING_DATA_INITIAL](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
      responseData: [],
      autoSuggestionData:[],
      isCheckLocation:false,
      distanceLocation:0, // default 250 miles
      type_services: -1,
      location:'',
      strSearch:'',
      isFilter:false,
      selectedIndex: - 1,
      autoSuggestionData:[],
      autoSuggestionRoutingData:[],
      selectedIdDealer:-1,
      nameSelected:''
    };
  },
  [types.FETCHING_DATA_SUCCESS_SELECTED](state, action) {
    var dataResponse = state.originData;
    var modifyData = [];
    var itemSelected = null;
    var selectedIndexID = action.selectedIndex;
    for (let i = 0; i < dataResponse.length; i++)
      {
        if ( dataResponse[i]["id"] !== selectedIndexID)
        {
          modifyData.push(dataResponse[i]);
        }
        else 
        {
          itemSelected = dataResponse[i];
        }
    }
    modifyData.splice(0, 0, itemSelected);
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
      selectedIndex: 0,
      responseData:modifyData,
      nameSelected:modifyData[0]['CompanyName']
    };
  
  },
  [types.FETCHING_DATA_SELECTED](state, action) {
    return {
      ...state,
      action: action.type,
      isFetching: true,
      error: false,
      selectedIndex: - 1
    };
  },
  [types.FETCHING_DATA_SELECTEDID](state, action) {
    var selectedIdDealer = action.selectedIdDealer;
    return {
      ...state,
      selectedIdDealer: selectedIdDealer
    };
  },
  [types.FETCHING_DATA_SUCCESS_SELECTEDID](state, action) {
    var selectedIdDealer = action.selectedIdDealer;
    return {
      ...state,
      selectedIdDealer: selectedIdDealer
    };
  },
  [types.UPDATED_DATA_BOUNDING](state, action) {
    return {
      ...state,
      action: action.type,
      error: false,
    };
  },
  [types.UPDATED_DATA_BOUNDING_SUCCESS](state, action) {

    var isExits  = false;
    for (let i = 0; i < action.data.length; i++)
    {
      const itemData = action.data[i]['CompanyName'];
      if ( itemData === state.nameSelected  && i === 0)
      {
        isExits = true;
      }
    }
    return {
      ...state,
      action: action.type,
      error: false,
      arrDataBounding:action.data,
      selectedIndex: isExits ? 0 : -1
    };
  }


});
