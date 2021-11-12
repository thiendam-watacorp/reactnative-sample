import React, { Component } from 'react';
import { View, Image,StatusBar, ScrollView, Text, TouchableOpacity, Share } from 'react-native';
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

import * as searchActions from '@Actions/searchActions';

const Device = require('react-native-device-detection');

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
    iconSize:0.75,
    iconAllowOverlap:true,
  },
  clusterCount: {
    textField: '{point_count}',
    textSize: 16,
    textColor: '#FAFAFA',
  },
};
class RoutingScreen extends Component {
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
      isRenderLocation: false,
      showingHeaderAndTimeView: false,
      customLocation: false,
    };
    this._onPressItem = this._onPressItem.bind(this);
    this.onBackItem = this.onBackItem.bind(this)
    this.onShareItem = this.onShareItem.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
    this.backActionClicked = this.backActionClicked.bind(this);
    this.suggestingDataComponent = this.suggestingDataComponent.bind(this);
    this.selectedSuggestionActionClick = this.selectedSuggestionActionClick.bind(this);
    this.selectedExchangeLocationsClicked = this.selectedExchangeLocationsClicked.bind(this);
  }
  _onPressItem() {

  }
  componentDidMount() {
    const willRenderRoute = true;
    const item = this.props.navigation.state.params.item
    const latitude = item['Latitude'];
    const longitude = item['Longitude'];
    const coordinate = [longitude, latitude];
    this.setState({
      centerCoordinate: coordinate,
      renderRoute: willRenderRoute,
    })

    if (!this.state.location) {
      this.creatingEditableLocation(this.props.location);
    }

    setTimeout(() => {
      this.creatingRouteClicked(this.state.location, item);
    }, 200);
  }
  onBackItem() {
    this.props.navigation.goBack()
  }
  onShareItem(item) {
    let contentMsg = item['CompanyName'] + "\n" + item['StreetAddress'] + "\n" + item['City'] + " , " + item['Region'] ? item['Region'] : '' + "\n" + item['PhoneNumber']
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
    this.setState({ isShowing: false });
  }
  onAnnotationSelected(activeIndex, feature) {
    this.setState({ activeAnnotationIndex: activeIndex, isShowing: true });
  }

  onAnnotationDeselected(deselectedIndex) {
    const nextState = {};
    if (this.state.activeAnnotationIndex === deselectedIndex) {
      nextState.activeAnnotationIndex = -1;
    }
    nextState.previousActiveAnnotationIndex = deselectedIndex;
    this.setState({
      previousActiveAnnotationIndex: deselectedIndex,
      isShowing: false
    });
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
      if (!this.state.route && !this.state.showingHeaderAndTimeView) {
        this.creatingRouteClicked(this.state.location, item)
      }
    }
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
          this.creatingRouteClicked(dealer, this.state.location);
        } else {
          this.creatingRouteClicked(this.state.location, dealer);
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

  backActionClicked() {
      this.onBackItem();
  }

  creatingEditableLocation (currentLocation) {
    if (currentLocation) {
      this.setState({
        location: currentLocation,
      });
    } else {
      const editableCoordinate = {
        latitude: 0,
        longitude: 0,
      };
      this.setState({
        location: editableCoordinate,
      });
    }
  }

  selectedExchangeLocationsClicked() {
    if (!this.state.route) {
      return
    }

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
          //CommonUtils.alertMsgWithNext("Can not find the Route", this.onBackItem());
      }, 200);
      })
    }, 200);
  }

  checkSameSelectedName(currentItem) {
    if ('CompanyName' in currentItem) {
      return currentItem['id'] == this.props.selectedIdDealer;
    }
    return false;
  }

  creatingRouteClicked(fristItem, secondItem) {

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
        this.getDirection().catch(err => {
          this.setState({
            spinner: false,
            renderRoute: false,
            route: null,
            timeRemaining: "0 Minutes",
            distance: "(0 Miles)",
            showingHeaderAndTimeView: true,
          });
          setTimeout(() => {
            //CommonUtils.alertMsgWithNext("Can not find the Route", null);
          }, 200);
        })
      }, 200);
  }

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
        spinner: false,
        renderRoute: true,
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
        showingHeaderAndTimeView: true,
      });
      setTimeout(() => {
        //CommonUtils.alertMsgWithNext("Can not find the Route", this.onBackItem());
      }, 200);
    }
    }

  renderUIAnnotation() {
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
          >
            <MapboxGL.Camera
              ref={c => (this.camera = c)}
              zoomLevel={15}
              centerCoordinate={this.state.centerCoordinate} />
            {this.renderUIAnnotation()}
            {this.renderUIMyLocation()}
            {this.renderCurrentLocation()}
            {this.renderRoute()}
          </MapboxGL.MapView>
          {this.renderHeader(element)}
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
    if (!this.state.route && !this.state.showingHeaderAndTimeView) {
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
    if (!this.state.route && !this.state.showingHeaderAndTimeView) {
      return null;
    }

    return (
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
    suggestingData: (params) => dispatch(searchActions.onSuggestFetching(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoutingScreen);
