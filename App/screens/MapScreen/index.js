import React, { Component } from 'react';
import { Alert, View, ScrollView, SafeAreaView, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback,Image,FlatList, Dimensions,Animated, Platform } from 'react-native';
import SearchView from '@Compontent/SearchView';
import StartEndRouteView from '@Compontent/StartEndRouteView';
import TimeRouteView from '@Compontent/TimeRouteView';
import styles from './styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppString from '@String'
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNLocation from 'react-native-location';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';
import * as searchActions from '@Actions/searchActions';
const Device = require('react-native-device-detection');
MapboxGL.setAccessToken(AppString.map_token_string);
import ItemView from '@Compontent/ListDetailView'
import CommonUtils from '@CommonUtils';
import {directionsClient} from '@MapboxClient';
import {multiLineString, lineString as makeLineString} from '@turf/helpers';
import FilterView from '@Compontent/FilterView';
import ListScreen from '@Screen/ListScreen';
import Spinner from 'react-native-loading-spinner-overlay';
import { Amplify, Auth, Storage } from 'aws-amplify';
import Papa from 'papaparse';

import _ from 'lodash';
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const layerStyles = {
  normal: {
    pluse: {
      circleRadius: 32,
      circleColor: '#E1A93E',
      circleOpacity: 0.2,
      circlePitchAlignment: 'map',
      circleStrokeWidth: 1,
      circleStrokeColor: '#E1A93E',
    },
    background: {
      circleRadius: 24,
      circleColor: '#E1A93E',
      circleOpacity: 0.2,
      circlePitchAlignment: 'map',
    },
    foreground: {
      circleRadius: 6,
      circleColor: '#E1A93E',
      circlePitchAlignment: 'map',
      circleStrokeWidth: 2,
      circleStrokeColor: '#fff',
    },
  },
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 5,
    circleColor: 'white',
  },
  route: {
    lineColor: '#E35205',
    lineCap: MapboxGL.LineJoin.Round,
    lineJoin: MapboxGL.LineJoin.Round,
    lineWidth: 4,
    lineOpacity: 1,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 3,
  },
};

const mapStyles = {
  icon: {
    iconImage: AppImage.icon_GPS,
    iconSize:0.75,
  },
  selectedIcon: {
    iconImage: AppImage.icon_GPS_Active,
    iconSize:0.75,
  },
  countIcon: {
    iconImage: AppImage.icon_Group,
    iconSize:['step', ['get', 'point_count'], 0.72, 25, 0.8, 50, 0.9, 75, 1, 100, 1.1, 125, 1.25],
    iconAllowOverlap:true,
  },
  clusterCount: {
    textField: '{point_count}',
    textSize: 16,
    textColor: '#FAFAFA',
  },
};

const OUTSIDE_AMERICAN_COORDINATES = [[94.1407, 32.103], [104.809926, 39.974184]];
const CENTER_COORDINATE = [-95.665, 37.6];
class MapScreen extends Component {


  constructor(props) {
    super(props);

    this.state = {
      activeAnnotationIndex: -1,
      previousActiveAnnotationIndex: -1,
      isShowing:false,
      orientation: isPortrait() ? 'portrait' : 'landscape',
      zoom: 18,
      location: null,
      route: null,
      timeRemaining: "unknown",
      distance: "unknown",
      startLocation: null,
      destinationLocation: null,
      isRenderLocation: false,
      isFilterView:false,
      isShowDialogAppear:false,
      keyboardState:false,
      showingList: false,
      initState: true,
      showSpinner: false,
    };
    this.alertPresent = false;
    this.isSearchingAndFiltering = false;
    this.onDismiss = this.onDismiss.bind(this);
    this.searchingDataComponent = this.searchingDataComponent.bind(this);
    this.suggestingDataComponent = this.suggestingDataComponent.bind(this);
    this.keyboardAction = this.keyboardAction.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.doActionFilter = this.doActionFilter.bind(this);
    this.doActionFilterMove = this.doActionFilterMove.bind(this);
    this.filterChangeItemAction = this.filterChangeItemAction.bind(this);
    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
    this.backActionClicked = this.backActionClicked.bind(this);
    this.selectedExchangeLocationsClicked = this.selectedExchangeLocationsClicked.bind(this);
    this.actionMoveList = this.actionMoveList.bind(this);
    this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);
    this.bottomActionAppear = this.bottomActionAppear.bind(this);

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }
  bottomActionAppear(isEnable)
  {
    this.setState({
      isShowDialogAppear:isEnable,
    })
  }

_stopUpdatingLocation = () => {
  this.locationSubscription && this.locationSubscription();
  this.setState({ location: null });
};

  async onRegionDidChange() {
    const zoom = await this._map.getZoom();
    this.setState({zoom});
    let arrVisibleListView = await this.getCurrrentDealers();
    this.props.updateDataBounding({dataList:arrVisibleListView});
  }

  keyboardAction(isOpend)
  {
    this.setState({keyboardState:isOpend});
  }
  searchingDataComponent(textSearch,isSuggest,isDoneKeyboard,isForcusTextField)
  {
    this.isSearchingAndFiltering = true;
    this.setState({isShowing:true});
    if ( textSearch == "" & isDoneKeyboard && isForcusTextField )
    {
      this.childFilterView.clearActionFromSearchBar()
 
    }
    else if ( textSearch == "" && !isDoneKeyboard && !isForcusTextField)
    {
      this.childFilterView.clearActionFromSearchBar()
    }
    else 
    {
      this.props.searchingData({strSearch:textSearch,isSuggest:isSuggest,isCheckLocation: this.props.isCheckLocation,
        distanceLocation: this.props.distanceLocation,
        type_services: this.props.type_services,
        location: this.props.location});
  
       setTimeout(() => {
        if (!isSuggest) {
          const selectedIndex = CommonUtils.getIndexSelectByKeySearch(textSearch,this.props.appDataReducer.responseData);
          
          setTimeout(() => {
            this.props.selectedIdDealerAction({selectedIdDealer:selectedIndex})
          }, 100);
  
          if (selectedIndex !== 1000) {
            this.onMoveAppearDialog(selectedIndex);
          }
        }
      }, 500);
  
      setTimeout(() => {
        if (this.props.appDataReducer.responseData.length > 0) {
          this.childListView.scrollToIndex(0);
        }
      }, 500);
  
      setTimeout(() => {
        this.moveCameraToResultsDealerBounds();
      }, 1000);

    }

  }

  suggestingDataComponent(textSearch,isSuggest)
  {
    this.isSearchingAndFiltering = true;
    this.setState({isShowing:true});
    this.props.searchingData({strSearch:textSearch,isSuggest:isSuggest,isCheckLocation: this.props.isCheckLocation,
      distanceLocation: this.props.distanceLocation,
      type_services: this.props.type_services,
      location: this.props.location,
      isTyping: true,
    });
  }

  componentDidMount() {

    const { childRef } = this.props;
    childRef(this);

    MapboxGL.locationManager.start();
    RNLocation.configure({
      distanceFilter: 5.0
    });
    this._startUpdatingLocation();
    this.props.initApplicationState();

    this.getNewDealerList();
  }

  getNewDealerList () {
    Auth.configure({
      // To get the aws credentials, you need to configure 
      // the Auth module with your Cognito Federated Identity Pool
      identityPoolId: '', //REQUIRED - Amazon Cognito Identity Pool ID
      region: '', // REQUIRED - Amazon Cognito Region
    });

    Storage.configure({
      AWSS3: {
        bucket: '', //REQUIRED -  Amazon S3 bucket
        region: ''//Specify the region your bucket was created in;
      }
    });

    this.checkNewestFile();
  }

  checkNewestFile() {

    this.setState({
      showSpinner: true
    });

    Storage.list('', { level: "" })
    .then(result => this.checkResult(result))
    .catch(err => this.moveToHome());
  }

  checkResult(result) {
    if (result.length >= 2) {
      let item = result[1];
      let modifiedDay = item.lastModified;
      if (modifiedDay) {
        CommonUtils.getLastModifiedDealerListTimeFromAsync().then((localTime) => {
          if (localTime) {
            if (localTime.getTime()) {
              if (localTime.getTime() < modifiedDay.getTime()) {
                this.updateLocalDatabase(modifiedDay);
              } else {
                this.moveToHome();
              }
            } else {
              this.updateLocalDatabase(modifiedDay);
            }
          } else {
            this.updateLocalDatabase(modifiedDay);
          }
        });
      } else {
        this.moveToHome();
      }
    } else {
      this.moveToHome();
    }
  }

  updateLocalDatabase (modifiedDay) {
    this.setState({
      isUpdating: true,
    });
    Storage.get('')
    .then(result => { this.loadAllCSV(result, modifiedDay)})
    .catch(err => this.moveToHome());
  }

  moveToHome() {
    this.setState({
      showSpinner: false,
    });
    
  }

  loadAllCSV(CSVData, modifiedDay) {
    this.moveToHome();
    const urlData = '';
      Papa.parse(( CSVData ? CSVData : urlData) , {
        download: true,
        delimiter: ',',
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: true,
        error: function (err, file, inputElem, reason) {
          console.log('Error: ',reason);
        },
        complete: function (results) {
          console.warn(results);
          if (results) {
            CommonUtils.setDealersList(results);
            CommonUtils.setLastModifiedDealersListTime(modifiedDay);
          }
        }
      });
  }

  initCameraMap() {
    if (this.state.location) {
      this.onFitBounds(CommonUtils.getBBox([this.state.location.longitude, this.state.location.latitude]), false);
    } else {
      this._camera.setCamera({
        centerCoordinate: CENTER_COORDINATE,
        zoomLevel: Device.isTablet ? 3 : 2,
        animationDuration: 1,
      });
    }
  }

  moveCameraToResultsDealerBounds() {

    const currentCoordinatesList = [];

    // Update Logic: 2 locations of china will not be included if list has more than these locations
    // Purpose: Make map not move to center point between America land and China
    const outSideAmericanCoordinatesList = [];
    for (let i = 0; i < this.props.appDataReducer.responseData.length; i++) {

      const item = this.props.appDataReducer.responseData[i];
      const latitude = item['Latitude'];
      const longitude = item['Longitude'];

      const dealerCoodinate = {
        lng: longitude,
        lat: latitude
      };
      if (this.shouldAddDealersToBoundingBox(dealerCoodinate)) {
        currentCoordinatesList.push(dealerCoodinate);
      } else {
        outSideAmericanCoordinatesList.push(dealerCoodinate);
      }
    }

    if (!currentCoordinatesList.length) {
      for (let i = 0; i < outSideAmericanCoordinatesList.length; i++) {
        const item = this.props.appDataReducer.responseData[i];
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];

        const dealerCoodinate = {
          lng: longitude,
          lat: latitude
        };
        currentCoordinatesList.push(dealerCoodinate);
      }
    }

    this.changeBoundsOfCameraToFitResultDealers(currentCoordinatesList);
  }

  shouldAddDealersToBoundingBox(currentDealerCoodinate) {
    for (let i = 0; i < OUTSIDE_AMERICAN_COORDINATES.length; i++) {
      const item = OUTSIDE_AMERICAN_COORDINATES[i];
      if (currentDealerCoodinate.lng === item[0] && currentDealerCoodinate.lat === item[1]) {
        return false;
      }
    }
    return true;
  }

  checkHasItemList () {
    const responseData = this.props.appDataReducer.responseData;
    if ( responseData.length > 0 ) {
      return true;
    }
    return false;
  }

  // getDirection() {
  //   this.getDirections();
  // }

  async getDirection() {

    const reqOptions = {
      waypoints: [
        {coordinates: [this.state.startLocation.longitude, this.state.startLocation.latitude]},
        {coordinates: [this.state.destinationLocation.longitude, this.state.destinationLocation.latitude]},
      ],
      profile: 'driving',
      geometries: 'geojson',
      steps: true
    };

    const res = await directionsClient.getDirections(reqOptions).send();

    const routeData = res.body.routes[0];
    if (routeData) {
      var steps = [];
      for (let i = 0; i < routeData.legs[0].steps.length; i++) {
        const step = routeData.legs[0].steps[i];
        for (let j = 0; j < step.geometry.coordinates.length; j++) {
          const coordinate = step.geometry.coordinates[j];
          steps.push(coordinate);
        }
      }

      this.setState({
        route: makeLineString(steps),
        timeRemaining: CommonUtils.secondsToDhms(routeData.duration),
        distance: "(" + (CommonUtils.getMiles(routeData.distance)).toFixed() + " miles)",
      });

      // zoom and move Map to show all route
      this.camera.fitBounds(
        [Math.max(this.state.startLocation.longitude, this.state.destinationLocation.longitude), Math.max(this.state.startLocation.latitude, this.state.destinationLocation.latitude)],
        [Math.min(this.state.startLocation.longitude, this.state.destinationLocation.longitude), Math.min(this.state.startLocation.latitude, this.state.destinationLocation.latitude)],
        [175, 44, 220, 44],
        300,
      );

    } else {
      this.setState({spinner: false});
      setTimeout(() => {
        //CommonUtils.alertMsg("Can not find the Route");
      }, 200);
    }
  }
  // componentDidUpdate(prevProps, prevState)
  // {
  //   console.log(this.isSearchingAndFiltering)
  //   console.log(this.alertPresent)
  //   if (this.isSearchingAndFiltering && !this.alertPresent && this.props.appDataReducer.responseData.length == 0) {
  //     // Dismiss keyboard for bug can't dismiss when touch mapview
  //     setTimeout(() => {
  //       if (!this.alertPresent && this.props.appDataReducer.responseData.length == 0 && !this.props.appDataReducer.isFetching && !this.state.keyboardState) {
  //         Keyboard.dismiss()
  //       }
  //     }, 100)
  //     setTimeout(() => {
  //       console.log(prevProps.appDataReducer.action)
  //       if (!this.alertPresent && this.props.appDataReducer.responseData.length == 0 && !this.props.appDataReducer.isFetching && !this.state.keyboardState) {
  //         // this.alertPresent = true;
  //         console.log(prevProps.appDataReducer.action)
  //         if ( prevProps.appDataReducer.action == "FETCHING_SUCCESS_FILTER"  )
  //         {
  //           Alert.alert("", AppString.map_No_Dealer_String, [{ text: 'OK', onPress: () => { this.alertPresent = false, this.isSearchingAndFiltering = false } }], { cancelable: false });
  //         }
  //         this.loadingBoundingDealers();
  //       }
  //     }, 200)
  //   }
  // }

  componentWillReceiveProps(nextProps)
  {
    if ( nextProps.appDataReducer.action === "FETCHING_SUCCESS_FILTER" || nextProps.appDataReducer.action === "FETCHING_SUCCESS")
    {
      if ( nextProps.appDataReducer.responseData.length == 0 && nextProps.appDataReducer.action === "FETCHING_SUCCESS_FILTER" && nextProps.appDataReducer.typeFilterAction == 1)
      {

        Alert.alert("", AppString.map_No_Dealer_String, [{ text: 'OK', onPress: () => {  } }], { cancelable: false });
      }
      this.loadingBoundingDealers();      
    }

    // Zoom to dealer when change data list
    if ((nextProps.appDataReducer.action === "FETCHING_SUCCESS_FILTER" || nextProps.appDataReducer.action === "FETCHING_SUCCESS" ) && this.props.appDataReducer.responseData.length != nextProps.appDataReducer.responseData.length)
    {

     
      if (this.state.initState) {
        this.setState({
          initState: false,
        });
      } else {
        setTimeout(() => {
          this.moveCameraToResultsDealerBounds();
        }, 200);  
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    // Check to show message no dealers 1 time only at the first time when encounter
    return true;
 }

   componentWillUnmount() {

     const { childRef } = this.props;
     childRef(undefined);
     MapboxGL.locationManager.dispose();
     this.props.initApplicationState();

   }

   onDismiss() {
     Keyboard.dismiss()
     if (this.state.isFilterView) {
       this.doActionFilterMove()
     }
     this.childSearch.dismissDialog();
     if ( this.state.keyboardState)
     {
      this.childSearch.searchResultWithActionDone();
     }
   }
   onAnnotationDeselected(deselectedIndex) {
     Keyboard.dismiss()
   }

  onAnnotationSelected(activeIndex, feature, selectedIdDealer) {

    this.childSearch.dismissDialog();
    if (activeIndex != null) {
      this.onMoveAppearDialog(selectedIdDealer);
    }

    const coordinates = feature.geometry.coordinates;

    // THIS CODE BELOW IS VERY CUSTOM FOR MAPBOX BEHAVIOR BECAUSE OF LIMIT OF MAPBOX FW AT THE TIME OF IMPLEMENTING
    // If pressing cluster, it will find bouding box of the same number dealers list from the coordinate of the feature user press
    // to 5 miles ~ 200 miles.
    // if has => it will draw and set camera to fit that list
    // if not => it will set camera zoom in to 1 level
    if (coordinates) {
      if (feature.properties.point_count) {
        if (feature.properties.point_count <= 20) {
          for (let i = 200; i >= 5; i--) {
            const dataFilter = CommonUtils.filterBydistanceForBounding(this.props.appDataReducer.responseData, coordinates, i);
            if (dataFilter.length == feature.properties.point_count) {
              this.changeBoundsOfCameraToFitResultDealers(dataFilter);
              break;
            }
            if (i == 5) {
              this._camera.setCamera({
                centerCoordinate: coordinates,
                zoomLevel: this.state.zoom + 2,
                animationDuration: 200,
              });
            }
          }
        } else {
            this._camera.setCamera({
              centerCoordinate: coordinates,
              zoomLevel: this.state.zoom + 2,
              animationDuration: 200,
            });
        }
      } else {
        this._camera.setCamera({
          centerCoordinate: coordinates,
          zoomLevel: this.state.zoom + 1,
          animationDuration: 200,
        });
      }
    }
  }


  async getMarkerPoints (currentFeature, coordinates) {
    const screenCoordinate = await this._map.getPointInView(coordinates);
    var markerPoints = [];
    const featureCollection = await this._map.queryRenderedFeaturesAtPoint(
      screenCoordinate,
      null,
      ['clusterIconLayer'],
    );
    if (featureCollection.features.length) {
      for (let i = 0; i < featureCollection.features.length; i++) {

        const item = featureCollection.features[i];
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];
        const coordinate = {
          longitude,
          latitude
        };

        if (currentFeature.properties.point_count == item.properties.point_count) {
          this.onSourceLayerPressWithFeature(featureCollection.features[i]);
        }
      }
   }
 }
  onMoveAppearDialog(selectedIndex)
  {
    if (this.props.appDataReducer.responseData.length > 0 ) {
       if ( !this.state.isShowDialogAppear ) {
         this.childListView.animateMoveDownAppear(0)
         this.setState({
           isShowDialogAppear:true
         })
       }
       else {
         // alway move to top
          this.childListView.scrollToIndex(0);
       }
       setTimeout(() => {
         this.props.selectedIndexAction({selectedIndex:selectedIndex})
       }, 100);

    }
  }

  onSourceLayerPress(e) {

    const feature = e.nativeEvent.payload;
    var selectedIndex = feature.properties.indexPlace == -1 ? 0 : feature.properties.indexPlace;
    var selectedIdDealer = feature.properties.id == -1 ? 0 : feature.properties.id;
    setTimeout(() => {
      this.props.selectedIdDealerAction({selectedIdDealer:selectedIdDealer})
    }, 100);
    this.onAnnotationSelected(selectedIndex, feature, selectedIdDealer);

  }

  onSourceLayerPressWithFeature(clusterFeature) {

    const feature = clusterFeature;
    this.zoomToCenterCluster(feature);

  }

  zoomToCenterCluster(feature) {
    const coordinates = feature.geometry.coordinates;
    if (coordinates != null) {
      this._camera.setCamera({
        centerCoordinate: coordinates,
        zoomLevel: this.state.zoom + 2,
        animationDuration: 1,
      });

      setTimeout(() => {
        this.getMarkerPoints(feature, coordinates);
      }, 1);
    }
  }

  onMoveActionListView(isMoveUp)
  {
    if (isMoveUp) {
      this.childListView.animateMoveUp()
    }
    else {
      this.childListView.animateMoveDown()
    }
  }
  /* Location Sections
  Example location returned
      {
        speed: -1,
        longitude: -0.1337,
        latitude: 51.50998,
        accuracy: 5,
        heading: -1,
        altitude: 0,
        altitudeAccuracy: -1
        floor: 0
        timestamp: 1446007304457.029
      }
  */
  onUserLocationUpdate(location) {
    const updatedLocation = {
      longitude: location.coords['longitude'],
      latitude: location.coords['latitude'],
    };

    if (!this.state.location || (this.state.location.longitude != updatedLocation.longitude && this.state.location.latitude != updatedLocation.latitude)) {

      if (!this.state.location) {
        this.onFitBounds(CommonUtils.getBBox([updatedLocation.longitude, updatedLocation.latitude]), false);
      }

      this.setState({
        location: updatedLocation,
      });
      const currentCoordinate = { latitude: updatedLocation.latitude, longitude: updatedLocation.longitude }
      this.props.updatingCoordinate({ coordinate: currentCoordinate })
    }
  }
  onDidFinishLoadingMap()
  {
    // Init camera map after loading map view only on android
    // because of set function camera on mapview not work on android
    if (Platform.OS == 'android' ) {
      this.initCameraMap();
    }

    this.setState({isShowing:true});
    this.childListView.animateMoveDownDisAppear();
    this.props.searchingData({strSearch:'',isSuggest:false, isCheckLocation: this.props.isCheckLocation,
    distanceLocation: this.props.distanceLocation,
    type_services: this.props.type_services,
    location: this.props.location});

    setTimeout(() => {
      this.childListView.animateMoveDownDisAppear();
    }, 300);

    setTimeout(() => {
      this.setState({
        showingList: true
      });
    }, 2000);

    this.loadingBoundingDealers();
  }

  async loadingBoundingDealers() {
    let arrVisibleListView = await this.getCurrrentDealers();
    this.props.updateDataBounding({dataList:arrVisibleListView});
  }

  async getCurrrentDealers() {
    const visibleBounds = await this._map.getVisibleBounds();
    return CommonUtils.getDataInsideBoundingBox(this.props.appDataReducer.responseData, visibleBounds);
  }
    

  _startUpdatingLocation = () => {
    this.locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        if (locations.length > 0 && locations[0]) {
          if (!this.state.isRenderLocation) {
            this.setState ({
              isRenderLocation: true,
            })
          }
        }
      }
    );
  };

  onFitBounds (bounds) {
    this._camera.fitBounds(
      [bounds[2],bounds[3]],
      [bounds[0],bounds[1]],
      [175, 44, 220, 44],
        300,
    );
  }

  updatingLocationClicked() {

    CommonUtils.checkPermission();

    if (this.state.location) {
      const feature = {
        type: 'Feature',
        properties: {
          icon: 'airport-15',
          indexPlace: -1,
          id: -1,
          idStrong: -1,
          isSelected: false,
        },
        geometry: {
          type: 'Point',
          coordinates: [this.state.location.longitude, this.state.location.latitude],
        },
      };
      this.onFitBounds(CommonUtils.getBBox(feature.geometry.coordinates))

      //this.onAnnotationSelected(null, feature)
    }
  }

  creatingRouteClicked(fristItem, secondItem) {
    if (fristItem && secondItem) {
      const isFirstItemSelected = this.checkSameSelectedName(fristItem);
      const isSecondItemSelected = this.checkSameSelectedName(secondItem);

      this.setState({
        startLocation: {
          longitude: fristItem['longitude'],
          latitude: fristItem['latitude'],
          isCurrentLocation: fristItem['longitude'] != null,
          name: fristItem['longitude'] != null ? "Current location" : fristItem.CompanyName,
          isSelected: isFirstItemSelected,
        },
        destinationLocation: {
          longitude: secondItem['Longitude'],
          latitude: secondItem['Latitude'],
          isCurrentLocation: secondItem['longitude'] != null,
          name: secondItem['longitude'] != null ? "Current location" : secondItem.CompanyName,
          isSelected: isSecondItemSelected,
        }
      });

      setTimeout(() => {
        this.getDirection().catch(err => {
          this.setState({
            spinner: false
          });
          setTimeout(() => {
          //CommonUtils.alertMsg("Can not find the Route");
        }, 200);
        })
      }, 200);
    }
  }

  checkSameSelectedName(currentItem) {
    if (('id' in currentItem) && (this.props.selectedIndex != -1)) {
      for (let i = 0; i < this.props.appDataReducer.responseData.length; i++) {
        const item = this.props.appDataReducer.responseData[i];
        if (item['id'] == this.props.selectedIndex) {
          return item['id'] == currentItem['id'];
        }
      }
    }
    return false;
  }

  changeBoundsOfCameraToFitResultDealers(currentList) {
    if (currentList.length) {
      if (currentList.length == 1) {
        const currentCenterCoordinate = [currentList[0]['lng'], currentList[0]['lat']];
        this._camera.setCamera({
                centerCoordinate: currentCenterCoordinate,
                zoomLevel: 14,
                animationDuration: 200,
              });
      } else {
        const newBound = this.getBounds(currentList);
        this._camera.fitBounds(
          newBound[1],
          newBound[0],
          [175, 44, 220, 44],
          200,
        );
      }
    }
  }

  getMinOrMax(markersObj, minOrMax, latOrLng) {
    if(minOrMax == "max"){
     return _.maxBy(markersObj, function (value) {
         return value[latOrLng]
     })[latOrLng];
    }else{
     return _.minBy(markersObj, function (value) {
         return value[latOrLng]
     })[latOrLng];
    }
   }

   getBounds(markersObj) {
     var maxLat = this.getMinOrMax(markersObj, "max", "lat");
     var minLat = this.getMinOrMax(markersObj, "min", "lat");
     var maxLng = this.getMinOrMax(markersObj, "max", "lng");
     var minLng = this.getMinOrMax(markersObj, "min", "lng");

     var southWest = [minLng, minLat];
     var northEast = [maxLng, maxLat];
     return [southWest, northEast];
   }

  backActionClicked() {
    this.setState({
      route: null,
    });
  }

  selectedExchangeLocationsClicked() {
    const startL = this.state.startLocation;
    const endL = this.state.destinationLocation;
    this.setState({
      startLocation: endL,
      destinationLocation: startL,
    });

    setTimeout(() => {
      this.getDirection().catch(err => {
        this.setState({
          spinner: false
        });
        setTimeout(() => {
        //CommonUtils.alertMsg("Can not find the Route");
      }, 200);
      })
    }, 200);
  }

  onAnnotationDeselected(deselectedIndex) {
  }

  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    this.setState({ location: null });
  };
   _onPressItem = (item,isShowRoute) =>
   {
     if (isShowRoute) {
       this.props.navigation.navigate('RoutingScreen', { item: item, isShowRoute: true });
     } else {
       this.props.navigation.navigate('DetailItemScreen', { item: item, isShowRoute: isShowRoute });
     }
   }
   getItemLayout = (data, index) => (
    { length: CommonUtils.getSizeAddMore(185,40), offset: CommonUtils.getSizeAddMore(185,40) * index, index }
  );

  actionMoveList()
  {
    this.props.bottomActionList()
  }

  renderDialogItem()
  {
      return(<ListScreen
        childRef={ref => (this.childListView = ref)}
        isListShowing = {this.props.isListShowing}
        bottomActionList = {()=> this.props.bottomActionList() }
        bottomActionMap = {()=> this.props.bottomActionMap()}
        bottomActionAppear = { () => this.bottomActionAppear() }
        orientation = {this.state.orientation}
        selectedIndex = {this.props.selectedIndex}
        isMapShowing = { this.props.isMapShowing}
        _onPressItem = {this._onPressItem}
        isShowingList = {this.state.showingList}
      />
    )
  }

  renderUIAnnotation() {
      if (!this.state.isShowing) {
        return featureCollection;
      }
     const featureCollection = { type: 'FeatureCollection', features: [] };

     for (let i = 0; i < this.props.appDataReducer.responseData.length; i++) {

       const item = this.props.appDataReducer.responseData[i];
       if (item)
       {
        const latitude = item['Latitude'];
        const longitude = item['Longitude'];
        const coordinate = [longitude,latitude];
 
        const id_dealer = item['id'];
        const id = `pointAnnotation${i}`;
        featureCollection.features.push({
         type: 'Feature',
         properties: {
           icon: 'airport-15',
           indexPlace: i,
           id: id_dealer,
           idStrong: id,
           isSelected: id_dealer == this.props.selectedIdDealer,
         },
         geometry: {
           type: 'Point',
           coordinates: coordinate,
         },
       });
       }
     
     }
     currentFeatureCollection = featureCollection;
     return (<MapboxGL.ShapeSource
     id="exampleShapeSource"
     cluster
     hitbox={{width: 20, height: 20}}
     clusterRadius={40}
     clusterMaxZoom={14}
                         onPress={this.onSourceLayerPress}
                         shape={featureCollection}
   >
     <MapboxGL.SymbolLayer id="pointCountLayer" style={mapStyles.clusterCount} />
     <MapboxGL.SymbolLayer id="clusterIconLayer" belowLayerID="pointCountLayer" filter={['has', 'point_count']} style={mapStyles.countIcon} />
     <MapboxGL.SymbolLayer id="pointerIconLayer" filter={['!', ['has', 'point_count']]} style={mapStyles.icon} />
     <MapboxGL.SymbolLayer id="selectedIconLayer" filter={['all', ['==', 'isSelected', true]]} style={mapStyles.selectedIcon} />


     </MapboxGL.ShapeSource>);
   }

  doActionFilter()
  {
    Keyboard.dismiss()
    if ( !this.state.isFilterView ) {
      this.childFilterView.moveSwipeUpAction()
    }
    else
    {
      this.childFilterView.moveSwipeDownAction()
    }
    this.setState({isFilterView: !this.state.isFilterView})
  }
  doActionFilterMove()
  {
      this.childSearch.selectedFilterButton();
  }
  filterChangeItemAction(switchValue, value, selectedIndex, location, isClosed, typeAction, isClearSearchBar) {
    this.isSearchingAndFiltering = true;
    var isSearchKey = this.props.strSearch
    if ( isClearSearchBar )
    {
      isSearchKey = ""
    }
    this.props.onFilterSelected({
      strSearch: isSearchKey,
      isCheckLocation: switchValue,
      distanceLocation: value,
      type_services: selectedIndex,
      location: location,
      typeAction:typeAction
    })
    if (isClosed) {
      setTimeout(() => {
        this.childSearch.selectedFilterButton();
      }, 800);
    }

    setTimeout(() => {
      if (this.props.appDataReducer.responseData.length > 0) {
        this.childListView.scrollToIndex(0);
      }
    }, 300);

    setTimeout(() => {
      this.moveCameraToResultsDealerBounds();
    }, 1000);
  }

  render() {
    return (
        <SafeAreaView forceInset={{ top: 'always',bottom: 'never' }} style={styles.container_safe_area} >
          <Spinner
          visible={this.state.showSpinner}
          textContent={'Checking...'}
          textStyle={styles.spinnerTextStyle}
          overlayColor={'rgba(0, 0, 0, 0)'}
          indicatorStyle = {
            {
              shadowRadius: 5,
              shadowOpacity: 0.7,
              elevation: 5,
              shadowColor: 'rgba(0, 0, 0, 1)',
              backgroundColor: "#0000",
              shadowOffset: {
                height: 2,
                width: 0
              }
            }
          }
        />
              <View style={styles.container}>
                <MapboxGL.MapView
                  ref={(map) => this._map = map}
                  showsUserLocation={true}
                  onUserLocationUpdate={this.onUserLocationUpdate}
                  onStartShouldSetResponder={() => Keyboard.dismiss()}
                  userTrackingMode={1}
                  onPress={this.onDismiss}
                  onRegionDidChange={this.onRegionDidChange}
                  onDidFinishRenderingMapFully = {this.onDidFinishLoadingMap}
                  style={styles.map}
                  styleURL='mapbox://styles/mapbox/light-v10'
                  attributionEnabled = {false}>
              <MapboxGL.Camera animationDuration={1} zoomLevel={Device.isTablet ? 3 : 2} centerCoordinate={CENTER_COORDINATE} minZoomLevel={Device.isTablet ? 2 : 1}
                ref={(c) => this._camera = c}
              />
              {this.renderUIMyLocation()}
              {this.renderUIAnnotation()}
              {this.renderRoute()}
                    </MapboxGL.MapView>
                    {this.renderLocationButton()}
                    {this.renderDialogItem()}
                    {
                      <View style={(Device.isTablet && this.state.orientation === 'landscape') ? styles.searchBarPortraitTabletContainer : styles.searchBarContainer}>
                        <SearchView iconName={AppImage.ic_Delete}
                          buttonTitle={AppString.call_string.toUpperCase()}
                          backgroundButton={ThemeColor.CallColor}
                          searchingDataComponent={this.searchingDataComponent}
                          suggestingDataComponent={this.suggestingDataComponent}
                          keyboardAction = {this.keyboardAction}
                          doActionFilter = {this.doActionFilter}
                          childRef={ref => (this.childSearch = ref)}
                        />
                    </View>
                    }
                  {
                    <FilterView
                      childRef={ref => (this.childFilterView = ref)}
                      filterChangeItemAction = {this.filterChangeItemAction}
                        isCheckLocation = {this.props.isCheckLocation}
                        distanceLocation = {this.props.distanceLocation}
                        type_services = {this.props.type_services}
                        location = {this.props.location}
                        orientation = {this.state.orientation}
                        isFilter = {this.props.isFilter}
                        isMapShowing = {this.props.isMapShowing}
                        doActionFilterMove = {this.doActionFilterMove}
                        isFilterView = {this.state.isFilterView}
                      />
                  }
                {this.renderRouteViews()}
                {this.renderTimeRouteView()}
              </View>
        </SafeAreaView>
    );
  }

  renderRoute() {
    if (!this.state.route) {
      return null;
    }

    return (
      <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}

        />
      </MapboxGL.ShapeSource>
    );
  }

  renderRouteViews() {
    if (!this.state.route) {
      return null;
    }

    return (
      <View style={(Device.isTablet && this.state.orientation === 'landscape') ? styles.topRouteViewPortraitTabletContainer : styles.topRouteViewContainer}>
        <StartEndRouteView
          backActionClicked={this.backActionClicked}
          selectedExchangeLocationsClicked={this.selectedExchangeLocationsClicked}
          startLocation= {this.state.startLocation}
          endLocation= {this.state.destinationLocation}
        />
      </View>
    );
  }

  renderUIMyLocation() {
    RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    }).then(granted => {
      if (granted && !this.state.isRenderLocation) {
        this.setState ({
          isRenderLocation: granted
        })
      }
    });

    if (this.state.isRenderLocation) {
      return (
        <MapboxGL.UserLocation onUpdate={(location) =>this.onUserLocationUpdate(location)} visible={true} children=
          {[
            <MapboxGL.CircleLayer
              key="mapboxUserLocationPluseCircle"
              id="mapboxUserLocationPluseCircle"
              style={layerStyles.normal.pluse}
            />,
            <MapboxGL.CircleLayer
              key="mapboxUserLocationWhiteCircle"
              id="mapboxUserLocationWhiteCircle"
              style={layerStyles.normal.background}
            />,
            <MapboxGL.CircleLayer
              key="mapboxUserLocationBlueCicle"
              id="mapboxUserLocationBlueCicle"
              aboveLayerID="mapboxUserLocationWhiteCircle"
              style={layerStyles.normal.foreground}
            />
          ]}
        />
      );
    }
  }

  renderTimeRouteView() {
    if (!this.state.route) {
      return null;
    }

    return (
      <View style={[styles.contentViewParent]}>
        <View style={CommonUtils.isTabletAndroid() ? styles.containerViewTabletAndroid : styles.containerView}>
          <TimeRouteView DurationTime={this.state.timeRemaining} Distance={this.state.distance} startLocation={this.state.startLocation}
          endLocation={this.state.destinationLocation} ></TimeRouteView>
        </View>
      </View>
    );
  }

  renderLocationButton() {
    return (
      <View style={this.checkHasItemList() ? styles.topListlocationContainerButtonView : styles.locationContainerButtonView}>
        <TouchableOpacity  onPress={() => this.updatingLocationClicked()} >
              <Image style = {styles.locationButtonIcon} source = {AppImage.ic_Location_Button} />
         </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    appDataReducer: state.searchReducer,
    isRefreshing: state.searchReducer.isRefreshing,
    isCheckLocation: state.searchReducer.isCheckLocation,
    distanceLocation:state.searchReducer.distanceLocation,
    type_services:state.searchReducer.type_services,
    location: state.searchReducer.location,
    isFilter: state.searchReducer.isFilter,
    selectedIndex: state.searchReducer.selectedIndex,
    selectedIdDealer: state.searchReducer.selectedIdDealer,
    strSearch: state.searchReducer.strSearch
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchingData: (params) => dispatch(searchActions.onSearchFetching(params)),
    onFilterSelected: (params) => dispatch(searchActions.onFilterFetching(params)),
    updatingCoordinate : (params) => dispatch(searchActions.onUpdateCoordinateFetching(params)),
    initApplicationState:(params) => dispatch(searchActions.onUpdateInitFetching(params)),
    selectedIndexAction:(params) => dispatch(searchActions.onUpdateSelectedFetching(params)),
    selectedIdDealerAction:(params) => dispatch(searchActions.onUpdateSelectedIdDealerFetching(params)),
    updateDataBounding:(params) => dispatch(searchActions.onUpdateDataBounding(params))

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);


MapScreen.propTypes = {
  navigation: PropTypes.object,
  responseData: PropTypes.object,
  isRefreshing: PropTypes.bool
};
