import React, { Component } from 'react';
import { View, Image,StatusBar, ScrollView, Text, TouchableOpacity, Share,Animated } from 'react-native';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import AppImage from '@ThemeImage'
import ThemeColor from '@ThemeColor'
import ItemView from '@Compontent/ListDetailView'
import DetailItemView from '@Compontent/DetailItemView'
import HeaderDetailView from '@Compontent/HeaderDetailView'
import StartEndRouteView from '@Compontent/StartEndRouteView'
import TimeRouteView from '@Compontent/TimeRouteView'
import CommonUtils from '@CommonUtils'
import { SafeAreaView } from 'react-navigation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNLocation from 'react-native-location';
import {directionsClient} from '@MapboxClient';
import {multiLineString, lineString as makeLineString} from '@turf/helpers';
const Device = require('react-native-device-detection');
import {createResponder} from 'react-native-gesture-responder';
import * as searchActions from '@Actions/searchActions';

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
  currentLocationIcon: {
    iconImage: AppImage.ic_My_Map_Location,
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
class DetailItemScreen extends Component {
  constructor() {
    super();
    this.state = {
      isShowing: true,
      centerCoordinate: [49.047397, -122.358337],
      location: null,
      route: null,
      timeRemaining: "0 Minutes",
      distance: "(0 Miles)",
      startLocation: null,
      destinationLocation: null,
      spinner: false,
      renderRoute: false,
      isRender:false,
      isRenderLocation: false,
      customLocation: false,
    };
    this.springValue = new Animated.Value(CommonUtils.getSizeAddMore(150,40))
    this.startMoveValue = CommonUtils.getSizeAddMore(150,40);
    this._onPressItem = this._onPressItem.bind(this);
    this.onBackItem = this.onBackItem.bind(this)
    this.onShareItem = this.onShareItem.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
    this.backActionClicked = this.backActionClicked.bind(this);
    this.selectedExchangeLocationsClicked = this.selectedExchangeLocationsClicked.bind(this);
    this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);
    this.onSourceLayerPress = this.onSourceLayerPress.bind(this);
    this.suggestingDataComponent = this.suggestingDataComponent.bind(this);
    this.selectedSuggestionActionClick = this.selectedSuggestionActionClick.bind(this);
  }
  _onPressItem() {

  }
  componentDidMount() {

  }

  onBackItem() {
    this.props.navigation.goBack()
  }
  onShareItem(item) {
    let contentMsg = item['CompanyName'] + "\n" + item['StreetAddress'] + "\n" + item['City'] + " , " + (item['Region'] ? item['Region'] : '') + "\n" + item['PhoneNumber']
    this.onShare(contentMsg)
  }

  onShare = async (msg) => {
    try {
      const result = await Share.share({
        message: msg
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  onDismiss() {
    this.animateMoveDown();
  }
  
  onSourceLayerPress(e) {
    const feature = e.nativeEvent.payload;
    var selectedIndex = 0;
    this.onAnnotationSelected(selectedIndex, feature);
  }

  onAnnotationSelected(activeIndex, feature)
  {
    this.animateMoveUp();
  }

  onAnnotationDeselected(deselectedIndex) {
    this.animateMoveUp();
  }

  onUserLocationUpdate(location) {
    const updatedLocation = {
      longitude: location.coords['longitude'],
      latitude: location.coords['latitude'],
    };

    if (!this.state.location || (this.state.location.longitude != updatedLocation.longitude && this.state.location.latitude != updatedLocation.latitude)) {
      this.setState({
        location: updatedLocation,
      });

      const item = this.props.navigation.state.params.item;
      // if (!this.state.route) {
      //   this.creatingRouteClicked(this.state.location, item, false)
      // }
    }
  }

  backActionClicked() {
    if (this.state.renderRoute) {
      this.onBackItem();
    } else {
      this.setState({
        route: null,
      });
    }
  }

  selectedExchangeLocationsClicked() {
    const startL = this.state.startLocation;
    const endL = this.state.destinationLocation;
    this.setState({
      startLocation: endL,
      destinationLocation: startL,
    });

    setTimeout(() => {
      this.getDirection(true).catch(err => {
        this.setState({
          spinner: false
        });
        setTimeout(() => {
        //CommonUtils.alertMsg("Can not find the Route");
      }, 200);
      })
    }, 200);
  }

  selectedSuggestionActionClick(item, isReverted) {

    if (item) {
      const updatedLocation = {
        longitude: item.coordinate[0],
        latitude: item.coordinate[1],
      };

      this.setState({
        location: updatedLocation,
        customLocation: true,
      });

      const dealer = this.props.navigation.state.params.item;
      setTimeout(() => {
        if (isReverted) {
          this.creatingRouteClicked(dealer, this.state.location, true);
        } else {
          this.creatingRouteClicked(this.state.location, dealer, true);
        }
      }, 200);
    } else {
      this.setState({
        customLocation: false,
      });

      //reset to userlocation
      // this.creatingEditableLocation(this.props.location);
  
      // const dealer = this.props.navigation.state.params.item
      // setTimeout(() => {
      //   this.creatingRouteClicked(this.state.location, dealer);
      // }, 200);

    }
  }

  suggestingDataComponent(textSearch,isSuggest)
  {
    this.isSearchingAndFiltering = true;
    this.setState({isShowing:true});
    this.props.suggestingData({strSearch:textSearch,
      isTyping: true,
    });
  }

  checkSameSelectedName(currentItem) {
    if ('CompanyName' in currentItem) {
      return currentItem['id'] == this.props.selectedIdDealer;
    }
    return false;
  }

  creatingRouteClicked(fristItem, secondItem, willrenderRoute) {
    if (fristItem && secondItem) {

      const isFirstItemSelected = this.checkSameSelectedName(fristItem);
      const isSecondItemSelected = this.checkSameSelectedName(secondItem);

      this.setState({
        startLocation: {
          longitude: fristItem['longitude'] ? fristItem['longitude'] : fristItem['Longitude'],
          latitude: fristItem['latitude'] ? fristItem['latitude'] : fristItem['Latitude'],
          isCurrentLocation: fristItem['longitude'] != null,
          name: fristItem['longitude'] != null ? "Current location" : fristItem.CompanyName,
          isSelected: isFirstItemSelected,
        },
        destinationLocation: {
          longitude: secondItem['Longitude'] ? secondItem['Longitude'] : secondItem['longitude'],
          latitude: secondItem['Latitude'] ? secondItem['Latitude'] : secondItem['latitude'],
          isCurrentLocation: secondItem['longitude'] != null,
          name: secondItem['longitude'] != null ? "Current location" : secondItem.CompanyName,
          isSelected: isSecondItemSelected,
        },
        spinner: true,
      });

      setTimeout(() => {
        this.getDirection(willrenderRoute).catch(err => {
          this.setState({
            spinner: false,
            renderRoute: false,
            route: null,
            timeRemaining: "0 Minutes",
            distance: "(0 Miles)",
          });
          setTimeout(() => {
          //CommonUtils.alertMsg("Can not find the Route");
        }, 200);
        })
      }, 200);
    }

  }

  onDidFinishLoadingMap()
  {
    const willRenderRoute = false
    const item = this.props.navigation.state.params.item
    const latitude = item['Latitude'];
    const longitude = item['Longitude'];
    const coordinate = [longitude, latitude];

    RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse' // or 'fine'
      }
    }).then(granted => {
      if (!granted ) {
      }
    });

    this.camera.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: 14,
      animationDuration: 100,
    })

    this.setState({
      renderRoute: willRenderRoute,
      isRender:true
    })
  }

  getCoordinateItem() {
    const item = this.props.navigation.state.params.item
    if (item) {
      const latitude = item['Latitude'];
      const longitude = item['Longitude'];
      const coordinate = [longitude, latitude];
      return coordinate;
    }
    return [-95.665, 37.6];
  }
  
  async getDirection(willrenderRoute) {

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
        spinner: false,
        renderRoute: willrenderRoute,
      });

      // zoom and move Map to show all route
      this.camera.fitBounds(
        [Math.max(this.state.startLocation.longitude, this.state.destinationLocation.longitude), Math.max(this.state.startLocation.latitude, this.state.destinationLocation.latitude)],
        [Math.min(this.state.startLocation.longitude, this.state.destinationLocation.longitude), Math.min(this.state.startLocation.latitude, this.state.destinationLocation.latitude)],
        [175, 44, 220, 44],
        300,
      );

    } else {
      this.setState({
        spinner: false,
        renderRoute: false,
        route: null,
        timeRemaining: "0 Minutes",
        distance: "(0 Miles)",
      });
      setTimeout(() => {
        //CommonUtils.alertMsg("Can not find the Route");
      }, 200);
    }
  }

  renderUIAnnotation() {
    if (!this.state.isRender) {
      return;
    }

    const featureCollection = { type: 'FeatureCollection', features: [] };

    const item = this.props.navigation.state.params.item

    if (item) {
      const latitude = item['Latitude'];
      const longitude = item['Longitude'];
      const id = item['id'];

      const coordinate = [longitude, latitude];
      
      featureCollection.features.push({
        type: 'Feature',
        properties: {
          icon: 'airport-15',
          indexPlace: 0,
          idStrong: id,
          isSelected: id == this.props.selectedIdDealer,
        },
        geometry: {
          type: 'Point',
          coordinates: coordinate,
        },
      });
    }

    return (
    <MapboxGL.ShapeSource
      id="exampleShapeSource"
      cluster
      hitbox={{ width: 20, height: 20 }}
      clusterRadius={40}
      clusterMaxZoom={14}
      onPress={this.onSourceLayerPress}
      shape={featureCollection}>
      <MapboxGL.SymbolLayer id="pointCountLayer" style={mapStyles.clusterCount} />
      <MapboxGL.SymbolLayer id="clusterIconLayer" belowLayerID="pointCountLayer" filter={['has', 'point_count']} style={mapStyles.countIcon} />
      <MapboxGL.SymbolLayer id="pointerIconLayer" filter={['!', ['has', 'point_count']]} style={mapStyles.icon} />
      <MapboxGL.SymbolLayer id="selectedIconLayer" filter={['all', ['==', 'isSelected', true]]} style={mapStyles.selectedIcon} />
    </MapboxGL.ShapeSource>);
   }

  renderDialogItem() {
    if (this.state.route && this.state.renderRoute) {
      return null;
    }

    const element = this.props.navigation.state.params.item
      return (
        <Animated.View style={[styles.contentScroolViewParent,{ top:this.springValue}]}>
          <ScrollView style={[styles.contentScroolView]}>
          <View style = {styles.contentOriginView}>
            <View style={CommonUtils.isTabletAndroid() ? styles.containerViewTabletAndroid : styles.containerView}>
                <View style = {{width:'100%',backgroundColor:'white',height: 60,  justifyContent:'center',alignItems:'center' }}
                {...this.Responder}
               >
                <Image
                  style={styles.appIcon}
                  source={AppImage.icon_tabbar_horizontal_filter} />
              </View>

              <ItemView item={element} onPressItem={this._onPressItem} numberButton={3} isDetailScreen={true} isMapScreen = {false} doRouteClicked = {item => this.creatingRouteClicked(this.props.location ? this.props.location: this.state.location,item, true)} />
              <DetailItemView key = {'workshow'} iconName={AppImage.icon_Services} buttonTitle={'Workshop Services'} styleFont={1} />
              {this.renderWorkshopItem(element)}
              <DetailItemView key = {'sale services'} iconName={AppImage.icon_Sales_Services} buttonTitle={'Sales Services'} styleFont={1} />

              <DetailItemView key = {'sale-open'} iconName={AppImage.icon_Sales_Open} buttonTitle={this.textOpenOrClose(element)} styleFont={2} />
              <DetailItemView key = {'website'} iconName={AppImage.icon_Web} buttonTitle={element['Website']} styleFont={3}
              />
              <DetailItemView key = {'hour'} iconName={AppImage.icon_Hours} buttonTitle={'Hours'}
                styleFont={1}
              />
              <View style={styles.containerBottomView}>
                <Text style={styles.headerTitleNone}>{CommonUtils.capitalizeString(element['OpeningDayFrom'])} - {CommonUtils.capitalizeString(element['OpeningDayTo'])}{'\n'}{element['OpeningTimeFrom']} - {element['OpeningTimeTo']} </Text>
              </View>

              <DetailItemView key = {'contact'} iconName={AppImage.icon_Detail_Contact} buttonTitle={'Contact'}
                styleFont={1}
              />
              <View style={styles.containerBottomView}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.headerTitleNone}>Phone General{'\n'}{element['PhoneNumber']}</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.headerTitleNone}>Fax General{'\n'}{element['FaxNumber']}</Text>
                </View>
              </View>

              <DetailItemView key = {'credit'} iconName={AppImage.icon_Credit_Cards} buttonTitle={'Accepts Credit Cards'}
                styleFont={2}
              />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      );
  }

  animateMoveDown()
  {
    const valueAnimated = 6000;
    this.startMoveValue = valueAnimated;
     Animated.spring(
       this.springValue,
       {
         toValue: valueAnimated,
         friction: 7,
         tension: 7,
       }
     ).start()
  }
  animateMoveUp()
  {
    const valueAnimated = CommonUtils.getSizeAddMore(150,40);
    this.startMoveValue = valueAnimated;
     Animated.spring(
       this.springValue,
       {
         toValue: valueAnimated,
         friction: 7,
         tension: 7,
       }
     ).start()
  }
  componentWillMount()
  {
    this.Responder = createResponder({
          onStartShouldSetResponder: () => true,
          onStartShouldSetResponderCapture: () => true,
          onMoveShouldSetResponder: () => true,
          onMoveShouldSetResponderCapture: () => true,
          onResponderMove: (evt, gestureState) => {
            this.pan(gestureState)
          },
          onResponderRelease: (evt, gestureState) => {
            this.panStop(gestureState)
          },
          onPanResponderTerminationRequest: () => true,
        })
  }
  pan = (gestureState) => {

   const maxY = this.springValue.value
   const minY = 0
   const yDiff = gestureState.moveY - gestureState.previousMoveY
   let newY = this.springValue._value + yDiff
   if (newY < minY) {
     newY = minY
   } else if (newY > maxY) {
     newY = maxY
   }
   this.springValue.setValue(newY)
 }
 panStop = (gestureState) => {
   // move up
   if (this.springValue._value < this.startMoveValue) {
         const distanceMove =  this.startMoveValue - this.springValue._value ;
          this.animateMoveUp();
   }
   else {

     const distanceMove = this.springValue._value - this.startMoveValue ;
     if ( distanceMove  < 80   ) {
          this.animateMoveUp();
     }
     else {
        this.animateMoveDown();
      }
   }

}

  render() {
    const element = this.props.navigation.state.params.item;
    return (
      <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
      <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content"/>
      <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
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
            showsUserLocation={true}
            ref={c => (this._map = c)}
            onPress={this.onDismiss}
            style={styles.map}
            styleURL='mapbox://styles/mapbox/light-v10'
            showsUserLocation={true}
            onDidFinishRenderingMapFully = {this.onDidFinishLoadingMap}
          >
            <MapboxGL.Camera
              ref={c => (this.camera = c)}
              animationDuration={1} zoomLevel={this.getCoordinateItem() == [-95.665, 37.6] ? (Device.isTablet ? 3 : 4) : 14}
              minZoomLevel={Device.isTablet ? 2 : 1}
              centerCoordinate={this.getCoordinateItem()} />
            {this.renderUIAnnotation()}
            {this.renderUIMyLocation()}
            {this.renderCurrentLocation()}
            {this.renderRoute()}
          </MapboxGL.MapView>
          {this.renderHeader(element)}
          {this.renderDialogItem()}
          {this.renderRouteViews()}
          {this.renderTimeRouteView()}
        </View>
      </SafeAreaView>
    );
  }

  renderHeader(currentElement) {
    if (this.state.renderRoute) {
      return null;
    } else {
      return (
        <HeaderDetailView onBackItem={this.onBackItem} onShareItem={this.onShareItem} item={currentElement} />
      );
    }
  }

  renderRoute() {
    if (!this.state.route || !this.state.renderRoute) {
      return null;
    }

    return (
      this.state.isRender &&
      <MapboxGL.ShapeSource id="routeSource" shape={this.state.route}>
        <MapboxGL.LineLayer
          id="routeFill"
          style={layerStyles.route}

        />
      </MapboxGL.ShapeSource>
    );
  }

  renderRouteViews() {
    if (!this.state.route || !this.state.renderRoute || !this.state.isRender) {
      return null;
    }
    return (
      <View style={(Device.isTablet && this.state.orientation === 'landscape') ? styles.topRouteViewPortraitTabletContainer : styles.topRouteViewContainer}>
        <StartEndRouteView
          backActionClicked={this.backActionClicked}
          selectedExchangeLocationsClicked={this.selectedExchangeLocationsClicked}
          startLocation= {this.state.startLocation}
          endLocation= {this.state.destinationLocation}
          suggestingDataComponent={this.suggestingDataComponent}
          selectedSuggestionActionClick={this.selectedSuggestionActionClick}
          hasRoute={this.state.route != null}
        />
      </View>
    );
  }

  renderTimeRouteView() {
    if (!this.state.route || !this.state.renderRoute) {
      return null;
    }
    return (
      this.state.isRender &&
      <View style={[styles.contentViewParent]}>
        <View style={CommonUtils.isTabletAndroid() ? styles.containerRouteViewTabletAndroid : styles.containerRouteView}>
          <TimeRouteView DurationTime={this.state.timeRemaining} Distance={this.state.distance} startLocation={this.state.startLocation}
          endLocation={this.state.destinationLocation} ></TimeRouteView>
        </View>
      </View>
    );
  }

  renderCurrentLocation() {
    if (this.state.customLocation) {

      const featureCollection = { type: 'FeatureCollection', features: [] };

      const item = this.state.location;
      if (item) {
        const latitude = item['latitude'];
        const longitude = item['longitude'];

        const coordinate = [longitude, latitude];

        featureCollection.features.push({
          type: 'Feature',
          properties: {
            icon: 'airport-15',
          },
          geometry: {
            type: 'Point',
            coordinates: coordinate,
          },
        });
      }

      return (
        <MapboxGL.ShapeSource
          id="currentUserShapeSource"
          cluster={false}
          hitbox={{ width: 20, height: 20 }}
          shape={featureCollection}>
          <MapboxGL.SymbolLayer id="curentLocationLayer" filter={['!', ['has', 'point_count']]} style={mapStyles.currentLocationIcon} />
        </MapboxGL.ShapeSource>
      );
    }
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

    if (this.state.isRenderLocation && !this.state.customLocation) {
    return (
      this.state.isRender &&
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

  textOpenOrClose(ele) {
    var date = new Date();
    var hour = date.getHours();
    var mins = date.getMinutes();
    var day = date.getDay();

    var startDay = this.dayFromString(ele["OpeningDayFrom"]);
    var endDay = this.dayFromString(ele["OpeningDayTo"]);
    var startHour = parseInt(ele["OpeningTimeFrom"].split(":")[0]);
    var startMin = parseInt(ele["OpeningTimeFrom"].split(":")[1]);
    var endHour = parseInt(ele["OpeningTimeTo"].split(":")[0]);
    var endMin = parseInt(ele["OpeningTimeTo"].split(":")[1]);

    if (day >= startDay && day <= endDay) {

      if (hour > startHour && hour < endHour) {
        return "Open Now";
      } else if (hour == startHour || hour == endHour) {
        return (mins >= startMin && mins <= endMin) ? "Open Now" : "Closed";
      }
      return "Closed";
    }
    return "Closed";
  }

  dayFromString(str) {
    switch (str) {
      case "monday": return 1; break;
      case "tuesday": return 2; break;
      case "wednesday": return 3; break;
      case "thursday": return 4; break;
      case "friday": return 5; break;
      case "saturday": return 6; break;
      default: return 0;
    }
  }

  /*
  *
  ---- WORKSHOP
  "IndustrialService": true,
   "IndustrialServicePower": false,
   "MarineService": true,
   ---- SALES
   "IndustrialPowerSale": false,
   "MarineSales": true,
   "ScaniaPartsSales": true
  * */
  renderWorkshopItem(ele) {
    var workshop = [];
    if (ele["IndustrialService"] == true) {
      workshop.push(<DetailItemView key = {'IndustrialService'} iconName={AppImage.icon_Industrial_Power} buttonTitle={'Industrial Power Generation Engine Service'} />);
    }

    if (ele["IndustrialServicePower" == true]) {
      workshop.push(<DetailItemView key = {'IndustrialServicePower'} iconName={AppImage.icon_Industrial_Power} buttonTitle={'Industrial Power Generation Engine Service Power Generation'} />);
    }

    if (ele["MarineService"] == true) {
      workshop.push(<DetailItemView key = {'MarineService'} iconName={AppImage.icon_Industrial_Power} buttonTitle={'Marine Engine Service'}/>);
    }

    return workshop;
  }

  renderSaleItem(ele) {
    var sales = [];
    if (ele["IndustrialPowerSale"] == true) {
      sales.push(<DetailItemView  key = {'IndustrialPowerSale'} iconName={AppImage.icon_Sales_Open} buttonTitle={'Industrial Power Generation Engine Service'} />)
    }

    if (ele["MarineSales" == true]) {
      sales.push(<DetailItemView  key = {'MarineSales'} iconName={AppImage.icon_Sales_Open} buttonTitle={'Marine Engine Sales'} />)
    }

    if (ele["ScaniaPartsSales"] == true) {
      sales.push(<DetailItemView key = {'ScaniaPartsSales'} iconName={AppImage.icon_Sales_Open} buttonTitle={'Scania Parts Sales'} />)
    }

    return sales;
  }

}

function mapStateToProps(state) {
  return {
    selectedIdDealer: state.searchReducer.selectedIdDealer,
    location: state.searchReducer.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    suggestingData: (params) => dispatch(searchActions.onSuggestFetching(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailItemScreen);

