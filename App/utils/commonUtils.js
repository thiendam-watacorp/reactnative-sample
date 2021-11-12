import { Alert,Linking,Platform,Dimensions  } from 'react-native';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import AppString from '@String';
import {point as makePoint} from '@turf/helpers';
import turfBuffer from '@turf/buffer';
import turfBbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {lineString as makeLineString} from '@turf/helpers';
import bboxPolygon from '@turf/bbox-polygon';

import dealerList from '@Database/Dealers.json';
const {height, width} = Dimensions.get('window');
const aspectRatio = height/width;
const Device = require('react-native-device-detection');
import getDistance from 'geolib/es/getDistance';
import RNLocation from 'react-native-location';
import regionList from '@Database/Region.json';
import AsyncStorage from '@react-native-community/async-storage';

const CommonUtils = {
  alertMsg(msg) {
    Alert.alert('Scania', msg,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false });
  },

  alertMsgWithNext(msg, nextAcction) {
    Alert.alert('Scania', msg,
      [
        { text: 'OK', onPress: () => nextAcction && nextAcction() },
      ],
      { cancelable: false });
  },

  validateEmail(emailAdress) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(emailAdress) === true) {
      return true;
    }
    else {
      return false;
    }
  },
  showLoadingDialog() {
    Alert.alert('Scania',
      'Internet connection is error',
      [
        { text: 'Ok', },
      ],
      { cancelable: false }
    );
  },
  getFormatDate(datetime) {
    return moment.utc(datetime).local().format('DD/MM/YYYY');
  },
  getFormatDateParserServer(datetime) {
    return moment.utc(datetime).local().format('YYYY-MM-DD[T]hh:mm:ss');
  },
  getFormatDateParserServerToView(datetime) {
    return moment.utc(datetime).local().format('YYYY-MM-DD');
  },
  getFormatVNDate(datetime) {
    return moment.utc(datetime).local().format('DD-MM-YYYY HH:mm:ss');
  },
  getFormatDateTraining(datetime) {
    return moment.utc(datetime).local().format('DD/MM/YYYY');
  },
  getFormatDateViewer(date) {
    return moment.utc(date).local().format('DD/MM/YYYY');
  },
  getDateView0041(datetimeString) {
    // return moment.utc(datetime).local().format('HH:MM - DD/MM/YYYY');
    let output = moment(datetimeString).format('HH:mm - DD/MM/YYYY');
    return output;
  },
  actionCallAssistance(number)
  {
    const phone = number;
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
    }
    else  {
    phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber).then(supported => {
    if (!supported) {

      CommonUtils.alertMsg("Services is not available")

      } else {
        return Linking.openURL(phoneNumber);
    }
    })
    .catch(err => console.log(err));
  },
  getSizeAddMore(numFontPhone,addMore)
  {
    if(Device.isPhone) {

        return numFontPhone;
    }
    else {

      return numFontPhone + addMore;
     }
  },
  isTabletAndroid()
  {
      if(aspectRatio <= 1.6 && Platform.OS !== 'ios') {
        return true;
      }
    return false
  },
  isiPadPro() {
    console.log(height);
    if ((height == 1194.0 || height == 1366 || width == 1194.0 || width == 1366 ) && Platform.OS == 'ios' && Platform.isPad) {
      return true;
    }
    return false;
  },
  actionSendEmail(emailAddress) {
    Linking.openURL('mailto:' + emailAddress);
  },
  getlistArrayByKeySearch(originData,strSearch)
  {
    if (strSearch === '') {
      return originData;
    }
    var data = [];
    for (let i = 0; i < originData.length; i++) {

      const item= originData[i];
      const Country = item['Country'];
      const City = item['City'];
      const Region = item['Region'] ? item['Region'] : '';
      const StreetAddress = item['StreetAddress'];
      const CompanyName = item['CompanyName'];

      if(CompanyName.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(item)
      }
      else if(Country.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(item)
      }
      else if(City.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(item)
      }
      else if(Region.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(item)
      }
      else if(StreetAddress.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(item)
      }

    }
    if ( data.length == 0 )
    {
      let arrResult = strSearch.split(",");
      if (arrResult.length == 5)
      {
        let address = arrResult[1];
        let city = arrResult[2];
        let region = arrResult[3];
        let country = arrResult[4];
        var arrCountry = [];
        var arrRegion = [];
        var arrCity = [];
        var arrAddress = [];
        arrCountry = this.getListArrByKeySearchCheckAtleast(originData,country,true,false,false,false);
        if (  arrCountry.length > 0  )
        {
          arrRegion = this.getListArrByKeySearchCheckAtleast(arrCountry,region,false,true,false,false);
          if ( arrRegion.length > 0 )
          {
            arrCity = this.getListArrByKeySearchCheckAtleast(arrRegion,city,false,false,true,false);
            if ( arrCity.length > 0 )
            {
              arrAddress = this.getListArrByKeySearchCheckAtleast(arrRegion,address,false,false,false,true);
              if (arrAddress.length > 0 )
              {
                data = arrAddress;
              }
            }
          }
        }
        else
        {
          return data;
        }
        
      }
      else if (arrResult.length == 4)
      {
        let address = arrResult[0];
        let city = arrResult[1];
        let region = arrResult[2];
        let country = arrResult[3];
        var arrCountry = [];
        var arrRegion = [];
        var arrCity = [];
        var arrAddress = [];
        arrCountry = this.getListArrByKeySearchCheckAtleast(originData,country,true,false,false,false);
        if (  arrCountry.length > 0  )
        {
          arrRegion = this.getListArrByKeySearchCheckAtleast(arrCountry,region,false,true,false,false);
          if ( arrRegion.length > 0 )
          {
            arrCity = this.getListArrByKeySearchCheckAtleast(arrRegion,city,false,false,true,false);
            if ( arrCity.length > 0 )
            {
              arrAddress = this.getListArrByKeySearchCheckAtleast(arrRegion,address,false,false,false,true);
              if (arrAddress.length > 0 )
              {
                data = arrAddress;
              }
            }
          }
        }
        else
        {
          return data;
        }
        
      }
      else if (arrResult.length == 3)
      {
        let city = arrResult[0];
        let region = arrResult[1];
        let country = arrResult[2];
        var arrCountry = [];
        var arrRegion = [];
        var arrCity = [];
        arrCountry = this.getListArrByKeySearchCheckAtleast(originData,country,true,false,false,false);
        if (  arrCountry.length > 0  )
        {
          arrRegion = this.getListArrByKeySearchCheckAtleast(arrCountry,region,false,true,false,false);
          if ( arrRegion.length > 0 )
          {
            arrCity = this.getListArrByKeySearchCheckAtleast(arrRegion,city,false,false,true,false);
            if ( arrCity.length > 0 )
            {
              data = arrCity;
            }
          }
        }
        else
        {
          return data;
        }
        
      }
      else if (arrResult.length == 2)
      {
        let region = arrResult[0];
        let country = arrResult[1];
        var arrCountry = [];
        var arrRegion = [];
        arrCountry = this.getListArrByKeySearchCheckAtleast(originData,country,true,false,false,false);
        if (  arrCountry.length > 0  )
        {
          arrRegion = this.getListArrByKeySearchCheckAtleast(arrCountry,region,false,true,false,false);
          if ( arrRegion.length > 0 )
          {
            data = arrRegion;
          }
        }
        else
        {
          return data;
        }
        
      }
      else if (arrResult.length == 1)
      {
        let country = arrResult[0];
        var arrCountry = [];
        arrCountry = this.getListArrByKeySearchCheckAtleast(originData,country,true,false,false,false);
        if (  arrCountry.length > 0  )
        {
          data = arrCountry;
        }
        else
        {
          return data;
        }
      }
    }
    return data;
  },
  getlistArrayByKeySearchWithArr(originData,strSearch,arrResult,isSuggest,dataSearch, defaultDistance)
  {
    if (strSearch === '') {
      return originData;
    }
    var data = [];
    
    var isExits = false;
    var centerCoordinate = null;
    for (var j = 0; j < arrResult.length; j++) {
      const itemResult  = arrResult[j];
      if( itemResult.trim().toUpperCase() == strSearch.trim().toUpperCase() ) {
          isExits = true;
          centerCoordinate = { latitude: dataSearch[j].center[1], longitude: dataSearch[j].center[0] }
          break;
      }
    }
    if ( isExits)
    {
      data = this.filterBydistanceWithExpand(originData,centerCoordinate,defaultDistance);
    }
    else
    {
      for (var j = 0; j < dataSearch.length; j++) {
        const itemResult  = dataSearch[j];
        const centerCoordinate = { latitude: itemResult.center[1], longitude: itemResult.center[0] }
        data = this.filterBydistanceWithExpand(originData,centerCoordinate,defaultDistance);
        if ( data.length > 0 )
        {
          break;
        }
      }
    }
    return data;
  },
  getListArrByKeySearchCheckAtleast(originData,keySearch,isCountry,isRegion,isCity,isAddress)
  {
    var data = [];
    for (let i = 0; i < originData.length; i++)
    {

      const item= originData[i];
      const Address = item['StreetAddress'];
      const City = item['City'];
      const Region = item['Region'] ? item['Region'] : '';
      const Country = item['Country'];
      var placeSearch = "";
      if ( isCountry )
      {
        placeSearch = Country;
        if( placeSearch != "" && (keySearch.trim().toUpperCase() === placeSearch.trim().toUpperCase()) ) {
          data.push(item)
        }
      }
      else if ( isRegion )
      {
        placeSearch = Region;
        if( placeSearch != "" && (keySearch.trim().toUpperCase() === placeSearch.trim().toUpperCase()) ) {
          data.push(item)
        }
      }
      else if ( isCity )
      {
        placeSearch = City;
        if( placeSearch != "" && (keySearch.trim().toUpperCase() === placeSearch.trim().toUpperCase()) ) {
          data.push(item)
        }
      }
      else if (isAddress)
      {
        placeSearch = Address;
        if( placeSearch != "" && (keySearch.toUpperCase().indexOf(placeSearch.toUpperCase()) > -1 ||
        placeSearch.toUpperCase().indexOf(keySearch.toUpperCase()) > -1)) {
          data.push(item)
        }
      }
    }
    return data;

  },
  getlistArrayByTypeServices(originData,typeSearvices){

      var data = [];
      if (typeSearvices == 0 || typeSearvices == -1) {
        return originData;
      }
      else if ( typeSearvices == 1)
      {
        for (let i = 0; i < originData.length; i++) {
          const item= originData[i];
          const marineService = item['MarineService'];
          if (marineService) {
            data.push(item)
          }
        }
          return data;
      }
      else
      {
        for (let i = 0; i < originData.length; i++) {
          const item= originData[i];
          const industrialService = item['IndustrialService'];
          if (industrialService) {
            data.push(item)
          }
        }
          return data;
      }
  },
  getlistArrayByLocation(originData,location){
    var data = [];
    if (location === '' || location === null) {
      return originData;
    }

    for (let i = 0; i < originData.length; i++) {
      const item= originData[i];
      const city = item['City'];
      if (city === location) {
        data.push(item)

      }

    }
    return data;

  },

  filterBydistance(originData,coordinate1, cmpDistance) {
    var data = [];
    if (coordinate1 !== null) {
      for (let i = 0; i < originData.length; i++) {

        const item= originData[i];
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];

        const dist = getDistance(
            coordinate1,
            { latitude: latitude, longitude:longitude });
        const disMiles = dist * 0.000621371192;
        if (disMiles <= cmpDistance) {
          data.push(item);
        }
      }
    }
    return data;

  },
  filterBydistanceWithExpand(originData,coordinate1, cmpDistance) {
    var data = [];
    if (coordinate1 !== null) {
      if (!Array.isArray(coordinate1)) {
        for (let i = 0; i < originData.length; i++) {

          const item = originData[i];
          const latitude = item['Latitude'];
          const longitude = item['Longitude'];

          const dist = getDistance(
            coordinate1,
            { latitude: latitude, longitude: longitude });
          const disMiles = dist * 0.000621371192;
          if (disMiles <= cmpDistance) {
            data.push(item);
          }
        }

        if (!data.length && cmpDistance >= 250 && cmpDistance <= 1000) {
          console.log("Expand");

          return this.filterBydistanceWithExpand(originData, coordinate1, cmpDistance + 100)
        } else {
          return data;
        }
      } else {
        return data;
      }
    } else {
      return data;
    }
  },
  getNearByDealers(originData,stringService ,coordinate1, cmpDistance) {
    var dataResponse = [];
    dataResponse = CommonUtils.getlistArrayByKeySearch(originData,"");

    const filterServices = CommonUtils.getlistArrayByTypeServices(dataResponse,stringService);

    const filterLocation = filterServices;

    return this.filterBydistanceWithExpand(filterLocation,coordinate1,cmpDistance);

  },
  sortDealerByCondition(originData,currentCoordinate)
  {
    if (currentCoordinate) {
          originData.sort((firstItem,secondItem) => {
            const latitude = firstItem['Latitude'];
            const longitude = firstItem['Longitude'];

            const latitudeS = secondItem['Latitude'];
            const longitudeS = secondItem['Longitude'];

        const distF =  getDistance(
                currentCoordinate,
                { latitude: latitude, longitude:longitude })
        const distS =  getDistance(
              currentCoordinate,
              { latitude: latitudeS, longitude:longitudeS });
                return distS < distF ? 1 : -1;
           });
      }
      else {
        originData.sort((firstItem,secondItem) => {
            const itemNameF = firstItem['CompanyName'];
            const itemNameS = firstItem['CompanyName'];
            return itemNameS > itemNameF ? 1 : -1 ;
         });
      }
      return originData;
  },

  filterBydistanceForBounding(originData,coordinate1, cmpDistance) {
    var data = [];
    if (coordinate1 !== null) {
      for (let i = 0; i < originData.length; i++) {

        const item= originData[i];
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];

        const dist = getDistance(
            coordinate1,
            { latitude: latitude, longitude:longitude });
        const disMiles = dist * 0.000621371192;
        if (disMiles <= cmpDistance) {
          data.push({
            lat: latitude,
            lng:longitude,
          });
        }
      }
    }
    return data;
  },

  getDataInsideBoundingBox(originData, currentBBox) {
    var data = [];
    var line = makeLineString(currentBBox);
    var bbox = turfBbox(line);
    var newbboxPolygon = bboxPolygon(bbox);
    if (currentBBox !== null) {
      for (let i = 0; i < originData.length; i++) {
        const item= originData[i];
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];
        const isInside = booleanPointInPolygon([longitude, latitude], newbboxPolygon);
        if (isInside) {
          data.push(item);
        }
      }
    }
    return data;
  },

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";

    m = s > 0 ? m + 1 : m;
    var mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";
    return dDisplay + hDisplay + mDisplay;
  },
  openMap(startCoordinate, endCoordinate) {
    const url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&origin=" + startCoordinate + "&destination=" + endCoordinate;
    const iosUrl = "http://maps.apple.com/?saddr=" + startCoordinate + "&daddr=" + endCoordinate;
    if (Platform.OS == 'android') {
      this.openLink(url);
    }
    else {
      this.openLink(iosUrl);
    }
  },

  openLink (currentURL) {
    Linking.canOpenURL(currentURL).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + currentURL);
      } else {
        return Linking.openURL(currentURL);
      }
    }).catch(err => console.log('An error occurred', err));
  },

  getMiles(i) {
    return i * 0.000621371192;
  },
  getMeters(i) {
    return i * 1609.344;
  },
  capitalizeString(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  },
  getBBox(centerCoordinate) {
    var point = makePoint(centerCoordinate);
    var buffered = turfBuffer(point, 100, {
      units: 'miles'
    });
    var bbox = turfBbox(buffered);
    return bbox;
  },
  getTwoCharacterRegion(region, country) {
    var characterRegion = "";
    var countryItem = "CAN";
    if (country == "United States") {
       countryItem = "US";
    }
    if (region) {

      var isExits = false;
      for (var i = 0; i < regionList.length; i++) {
        const regionItem = regionList[i];
        if(regionItem.toUpperCase().indexOf(region.toUpperCase()) > -1) {
              // Get two short name of Region from Region List
              let arrRegion = regionItem.split("-");
              if (arrRegion.length > 0) {
                characterRegion = arrRegion[1].trim();
                stringRegion = arrRegion[0].trim();
                if (stringRegion.toUpperCase() === region.toUpperCase()) {
                  characterRegion += ", " + countryItem
                  isExits = true;
                  break;
                }
              }
              else {
                characterRegion = countryItem;
                isExits = true;
                break;
              }
         }
      }
      if ( !isExits)
      {
        characterRegion = region + ', ' + countryItem;
      }

    }
    return characterRegion
  },

  checkPermission() {
    RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'fine', // or 'fine'
      }
    }).then(granted => {
      if (!granted) {
        this.requestPermision();
      }
      return granted;
    })
  },

  requestPermision () {
    if (Platform.OS == 'android') {
      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "fine",
          rationale: {
            title: "Scania",
            message: "Turn on location services to find dealers near you.",
            buttonPositive: "OK",
            buttonNegative: "Cancel"
          }
        }
      });
    }
    else {
      this.showPermissionAlert();
    }
  },

  showPermissionAlert() {
    Alert.alert(
      'Scania',
      'Turn on location services to find dealers near you.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Go to Settings', onPress: () => this.openLink('app-settings:')},
      ],
      {cancelable: false},
    );
  },
  getlistAutoSuggestionKeySearch(arrResult,originData,strSearch)
  {
    var data = [];
    for (let i = 0; i < originData.length; i++) {

      const item= originData[i];
      const Address = item['StreetAddress'];
      const City = item['City'];
      const Country = item['Country'];
      const Region = item['Region'] ? item['Region'] : '';
      const CompanyName = item['CompanyName'];

      if(CompanyName.toUpperCase().indexOf(strSearch.toUpperCase()) > -1) {
        data.push(CompanyName + ', ' + Address + ', ' + City +', ' + Region + ', ' + Country);
     }
    }
    for (var i = 0; i < arrResult.length; i++) {
      data.push(arrResult[i]);
    }
    return data;
  },
  getCenterCoordinate(originData,strSearch,arrResult,isSuggest,dataSearch, defaultDistance)
  {
    var isExits = false;
    var centerCoordinate = null;
    for (var j = 0; j < arrResult.length; j++) {
      const itemResult  = arrResult[j];
      if( itemResult.trim().toUpperCase() == strSearch.trim().toUpperCase() ) {
          isExits = true;
          centerCoordinate = { latitude: dataSearch[j].center[1], longitude: dataSearch[j].center[0] }
          break;
      }
    }
    if ( isExits)
    {
      data = this.filterBydistanceWithExpand(originData,centerCoordinate,defaultDistance);
    }
    else
    {
      for (var j = 0; j < dataSearch.length; j++) {
        const itemResult  = dataSearch[j];
        const cmpCoordinate = { latitude: itemResult.center[1], longitude: itemResult.center[0] }
        data = this.filterBydistanceWithExpand(originData,cmpCoordinate,defaultDistance);
        if ( data.length > 0 )
        {
          centerCoordinate = cmpCoordinate;
          break;
        }
      }
    }
    return centerCoordinate;
  },
  getIndexSelectByKeySearch(itemResult,arrResult)
  {
    let arrRegion = itemResult.split(",");
    var indexSelected = 1000;
    if (arrRegion.length > 4) {
      nameDealler = arrRegion[0];
      for (var i = 0; i < arrResult.length; i++) {
        const CompanyName = arrResult[i]['CompanyName'];
        if(arrRegion[0].toUpperCase().indexOf(CompanyName.toUpperCase()) > -1 || 
        CompanyName.toUpperCase().indexOf(arrRegion[0].toUpperCase()) > -1) {
          indexSelected = arrResult[i]['id'];
          break;
        }
      }
    }
    return indexSelected;
  },
  setDealersList(currentJSON) {
    console.warn('Hi',currentJSON);
    this.storeData('@DealerList',JSON.stringify(currentJSON));
  },

  setLastModifiedDealersListTime(currentTime) {
    this.storeData('@DateDealerList',currentTime.getTime()+ '' );
  },

  async storeData (key, value) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  },
  async getDealersList() {
    return await this.getData();
  },

  async getData (key) {
    try {
      const value = await AsyncStorage.getItem(key ? key : '@DealerList')
      if(value !== null) {
        return JSON.parse(value).data;
      }
    } catch(e) {
      // error reading value
    }
  },
  getDealerFromAsync()
  {
    return new Promise((resolve, reject) => {
      this.getData('@DealerList').then((data) => {
          if (data != null) {
            resolve(data);
          }
          else 
          {
            resolve(dealerList);
          }
        })
      });
  },

  async getLastModifiedDealerListTimeFromAsync()
  {
    try {
      const value = await AsyncStorage.getItem('@DateDealerList')
      console.warn('HELLO:', value);
      if(value !== null) {
        return new Date(parseInt(value));
      }
    } catch(e) {
      console.log('error: ',e);
    }
  }
};


export default CommonUtils;