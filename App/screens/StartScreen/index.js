import React, { Component } from 'react';
import { View, Text, StatusBar, ScrollView, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppImage from '@ThemeImage';
import StartButtonView from '@Compontent/StartButtonView';
import AppString from '@String';
import ThemeColor from '@ThemeColor';
import CommonUtils from '@CommonUtils';
const Device = require('react-native-device-detection');
import RNLocation from "react-native-location";
import * as searchActions from '@Actions/searchActions';

class StartScreenContainer extends Component {
  constructor(props) {
    super(props);

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape'
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
  }

  componentDidMount() {
    RNLocation.configure({ distanceFilter: 5 });
    RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'fine', // or 'fine'
      }
    }).then(granted => {
      if (!granted) {
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
      } else {
        RNLocation.getLatestLocation({ timeout: 60000 })
          .then(latestLocation => {
            if (latestLocation) {
              const currentCoordinate = { latitude: latestLocation.latitude, longitude: latestLocation.longitude }
              this.props.updatingCoordinate({ coordinate: currentCoordinate })
            }
          })
      }
    })
  }

  gotoHomeScreen() {
    this.props.navigation.navigate('HomeScreen');
  }

  gotoAssistanceScreen() {
    this.props.navigation.navigate('AssitanceScreen');
  }

  chooseStyleForLogo() {
    if (this.state.orientation == 'landscape') {
      if (!Device.isTablet) {
        return styles.appLogoViewLanscapePhone;
      } else {
        return styles.appLogoViewLanscapeTablet;
      }
    } else if (this.state.orientation == 'portrait') {
      return styles.appLogoView;
    }
    return styles.appLogoView;
  }

  renderBackground() {
    var backgroundImage = AppImage.bg_Map_Phone;
    if (this.state.orientation == 'landscape') {
      backgroundImage = AppImage.bg_Map_Tablet;
    } else if (this.state.orientation == 'portrait' && Device.isTablet) {
      backgroundImage = AppImage.bg_Map_Tablet_Portrait;
    }
    return <Image source={backgroundImage} style={styles.MapImage} />;
  }

  renderLogoView() {
    return (
    <View style={this.chooseStyleForLogo()}>
     <Image
       style={ (!Device.isTablet && this.state.orientation == 'landscape') ? styles.appLogoPhoneLanscape : styles.appLogo} source={AppImage.ic_AppIcon} />
   </View>);
  }

  render() {
    return (
      <View style={styles.backgroundImage} >
        {/* {this.renderBackground()} */}
        <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
          <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
          {this.renderLogoView()}
          <View style={styles.containerBottomView}>
            <View >
              <StartButtonView iconName={AppImage.ic_Assitance_Blue}
                buttonTitle={AppString.immediate_assist_string.toUpperCase()}
                backgroundButton={ThemeColor.WhiteColor}
                doActionClicked={() => this.gotoAssistanceScreen()}
                buttonTitleColor={ThemeColor.PrimaryColor}
              />
            </View>
            <View >
              <StartButtonView iconName={AppImage.icon_Dealer_Route}
                buttonTitle={AppString.find_closest_dealer_string.toUpperCase()}
                backgroundButton={ThemeColor.RouteColor}
                doActionClicked={() => this.gotoHomeScreen()}
                borderColor={ThemeColor.WhiteColor}
                borderWidth={1}
              />
            </View>
          </View>
          <View style={styles.wordMarkIconView}>
            <Image
              style={styles.wordMarkIcon}
              source={AppImage.ic_WordMark} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    appData: state.loginReducer,
    appDataReducer: state.searchReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userAuth: (params) => dispatch(loginActions.userAuth(params)),
    updatingCoordinate : (params) => dispatch(searchActions.onUpdateCoordinateFetching(params)),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartScreenContainer);
