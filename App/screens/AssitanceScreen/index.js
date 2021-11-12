import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, FlatList,StatusBar, Platform } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppImage from '@ThemeImage';
import StartButtonView from '@Compontent/StartButtonView';
import AppString from '@String';
import ThemeColor from '@ThemeColor';
import CommonUtils from '@CommonUtils';
import RNLocation from "react-native-location";
const Device = require('react-native-device-detection');
import { SafeAreaView } from 'react-navigation';

class AssitanceScreen extends Component {
  constructor(props) {
    super(props);
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
      lastKnownLog: 'Unknown',
      lastKnownLat: 'Unknown',
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape'
      });
    });
    this.onBackHomeAction = this.onBackHomeAction.bind(this);

  }

  componentDidMount() {
    RNLocation.configure({ distanceFilter: 5 });
    RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'fine', // or 'fine'
      }
    }).then(granted => {
      if (granted) {
        RNLocation.getLatestLocation({ timeout: 60000 })
          .then(latestLocation => {
            if (latestLocation) {
              const currentCoordinate = { latitude: latestLocation.latitude, longitude: latestLocation.longitude }
              this.setState({
                lastKnownLog: currentCoordinate['longitude'], 
                lastKnownLat: currentCoordinate['latitude'],
              });
            }
          })
      }
    })

    if (this.props.appDataReducer.currentCordinate) {
      this.setState({
        lastKnownLog: this.props.appDataReducer.currentCordinate['longitude'], 
        lastKnownLat: this.props.appDataReducer.currentCordinate['latitude'],
      });
    }
  }

  onBackHomeAction()
  {
    this.props.navigation.goBack()
  }

  renderLayoutIphoneX() {
    return (
      <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
        <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
        <ScrollView backgroundColor={'#FFFFFF'} contentContainerStyle={{ backgroundColor: '#FFFFFF' }}>
          <View style={styles.backgroundImage} >
            <TouchableOpacity style={styles.appIconView} onPress={this.onBackHomeAction}>
              <Image
                style={styles.appIcon}
                source={AppImage.icon_arrow_back} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Image source={AppImage.icon_Wrench} style={styles.centerImage} />
            </View>
            <Text style={styles.bottomText}>Make sure you have the following:</Text>
            <View style={styles.bottomList}>
              <FlatList
                data={[
                  { key: 'Customer name' },
                  { key: 'Engine / Serial Number' },
                  { key: 'Complaint' },
                  { key: 'Location' },
                  { key: 'Phone Number' },
                ]}
                scrollEnabled={false}
                renderItem={({ item }) => <Text style={styles.listItem}>• {item.key}</Text>}
              />
            </View>
            <View style={styles.lastLocationView}>
              <Text style={styles.locationTitleText}>{('Lastest Known Position:').toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={styles.coordinatesTitle}>Longitude: </Text>
                <Text style={styles.coordinatesValue}>{this.state.lastKnownLog}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={styles.coordinatesTitle}>Latitude: </Text>
                <Text style={styles.coordinatesValue}>{this.state.lastKnownLat}</Text>
              </View>
            </View>
            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
              <View style={styles.callButtonContainer}>
                <View style={styles.callButton}>
                  <StartButtonView iconName={AppImage.icon_Call}
                    buttonTitle={AppString.to_call_string.toUpperCase()}
                    backgroundButton={ThemeColor.PrimaryColor}
                    doActionClicked={() => CommonUtils.actionCallAssistance(AppString.assitance_phone_number)}
                    buttonTitleColor={ThemeColor.WhiteColor}
                  />
                </View>
                <Text style={styles.phoneNumberValue}>1-800-2-Scania</Text>
              </View>
              <Image source={AppImage.ic_WordMark_Inverted} style={styles.bottomImage} />
            </View>
            <View style={{ height: 30 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  renderLayoutWithSpace() {
    return (
      <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
        <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFFFFF',}}>
            <View style={{ alignItems: 'center' }}>
              <Image source={AppImage.icon_Wrench} style={styles.centerImageWithSpace} />
            </View>
            
            <View style={styles.bottomListWithSpace}>
            <Text style={styles.bottomTextWithSpace}>Make sure you have the following:</Text>
              <FlatList
                data={[
                  { key: 'Customer name' },
                  { key: 'Engine / Serial Number' },
                  { key: 'Complaint' },
                  { key: 'Location' },
                  { key: 'Phone Number' },
                ]}
                scrollEnabled={false}
                renderItem={({ item }) => <Text style={styles.listItem}>• {item.key}</Text>}
              />
            </View>
            <View style={styles.lastLocationViewWithSpace}>
              <Text style={styles.locationTitleTextWithSpace}>{('Lastest Known Position:').toUpperCase()}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <Text style={styles.coordinatesTitle}>Longitude: </Text>
                <Text style={styles.coordinatesValue}>{this.state.lastKnownLog}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Text style={styles.coordinatesTitle}>Latitude: </Text>
                <Text style={styles.coordinatesValue}>{this.state.lastKnownLat}</Text>
              </View>
            </View>
            <View style={{ alignSelf: 'center', alignItems: 'center' }}>
              <View style={styles.callButtonContainerWithSpace}>
                <View style={styles.callButton}>
                  <StartButtonView iconName={AppImage.icon_Call}
                    buttonTitle={AppString.to_call_string.toUpperCase()}
                    backgroundButton={ThemeColor.PrimaryColor}
                    doActionClicked={() => CommonUtils.actionCallAssistance(AppString.assitance_phone_number)}
                    buttonTitleColor={ThemeColor.WhiteColor}
                  />
                </View>
                <Text style={styles.phoneNumberValue}>1-800-2-Scania</Text>
              </View>
              <Image source={AppImage.ic_WordMark_Inverted} style={styles.bottomImage} />
            </View>
            <View style={{ height: 1 }} />   
            <TouchableOpacity style={styles.appIconView} onPress={this.onBackHomeAction}>
              <Image
                style={styles.appIcon}
                source={AppImage.icon_arrow_back} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  renderBackButton() {
    return (
    <TouchableOpacity style={styles.appIconView} onPress={this.onBackHomeAction}>
      <Image
        style={styles.appIcon}
        source={ Platform.OS == 'android' ? AppImage.icon_arrow_back_android: AppImage.icon_arrow_back} />
    </TouchableOpacity>);
  }

  render() {
    if (this.state.orientation === 'portrait') {
      if (Device.isTablet) {
        if (Platform.OS == 'android') {
          return this.renderTabletAnroidVersion();
        } else {
          return this.renderNormalTabletVersion();
        }
      } else {
        if (Device.isIphoneX) {
          return this.renderLayoutIphoneX();
        } else {
          return this.renderLayoutWithSpace();
        }
      }
    } else {
      return (
        <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never', left: 'never', right: 'never' }}>
          <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
          <ScrollView backgroundColor={'white'} contentContainerStyle={{backgroundColor:'white'}}>
            <View style={{ alignSelf: 'center', width: '100%' }}>
              
              <View style={{ alignItems: 'center' }}>
                <Image source={AppImage.icon_Wrench} style={Device.isTablet ? styles.centerImageTabletLandscape : styles.centerImage} />
              </View>
              <View style={styles.bottomListLandscapeTablet}>
                <Text style={styles.bottomTextLandscape}>Make sure you have the following:</Text>
                <View style={{ flex: 1, top: 8, marginLeft: 30}}>
                <FlatList
                  data={[
                    { key: 'Customer name' },
                    { key: 'Location' },
                    { key: 'Engine / Serial Number' },
                    { key: 'Phone Number' },
                    { key: 'Complaint' },
                  ]}
                  numColumns={2}
                  scrollEnabled={false}
                  renderItem={({ item }) => <Text style={styles.listItemTabletLandscape}>• {item.key}</Text>}
                />
                </View>
              </View>
              <View style={styles.lastLocationViewTabletLandscape}>
                <Text style={styles.locationTitleTextTabletLandscape}>{('Lastest Known Position:').toUpperCase()}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={styles.coordinatesTitle}>Longitude: </Text>
                  <Text style={styles.coordinatesValue}>{this.state.lastKnownLog}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <Text style={styles.coordinatesTitle}>Latitude: </Text>
                  <Text style={styles.coordinatesValue}>{this.state.lastKnownLat}</Text>
                </View>
              </View>
              <View style={styles.callButtonContainerLandscape}>
                <View style={styles.callButtonLandscape}>
                  <StartButtonView iconName={AppImage.icon_Call}
                    buttonTitle={AppString.to_call_string.toUpperCase()}
                    backgroundButton={ThemeColor.PrimaryColor}
                    doActionClicked={() => CommonUtils.actionCallAssistance(AppString.assitance_phone_number)}
                    buttonTitleColor={ThemeColor.WhiteColor}
                  />
                </View>
                <Text style={styles.phoneNumberValueTabletLandscape}>1-800-2-Scania</Text>
              </View>
              <View style={{ height: 40 }} />
              <View style={{ alignSelf: 'center' }}>
                <Image source={AppImage.ic_WordMark_Inverted} style={styles.bottomImage} />
              </View>
              <View style={{ height: 52 }} />
              {this.renderBackButton()}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  renderTabletAnroidVersion() {
    return (
      <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
        <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
        <View style={styles.backgroundImage} >
          <TouchableOpacity style={styles.appIconView} onPress={this.onBackHomeAction}>
            <Image
              style={styles.appIcon}
              source={AppImage.icon_arrow_back} />
          </TouchableOpacity>
          <Image source={AppImage.icon_Wrench} style={styles.centerImageTabletAndroid} />
          <Text style={styles.bottomTextPortraitTablet}>Make sure you have the following:</Text>
          <View style={styles.bottomListPortraitTablet}>
            <FlatList
              data={[
                { key: 'Customer name' },
                { key: 'Engine / Serial Number' },
                { key: 'Complaint' },
                { key: 'Location' },
                { key: 'Phone Number' },
              ]}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item.key}</Text>}
            />
          </View>
          <View style={styles.lastLocationViewTabletAndroid}>
            <Text style={styles.locationTitleText}>{('Lastest Known Position:').toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <Text style={styles.coordinatesTitle}>Longitude: </Text>
              <Text style={styles.coordinatesValue}>{this.state.lastKnownLog}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <Text style={styles.coordinatesTitle}>Latitude: </Text>
              <Text style={styles.coordinatesValue}>{this.state.lastKnownLat}</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'center', alignItems: 'center', bottom: 30 }}>
            <View style={styles.callButtonContainer}>
              <View style={styles.callButton}>
                <StartButtonView iconName={AppImage.icon_Call}
                  buttonTitle={AppString.to_call_string.toUpperCase()}
                  backgroundButton={ThemeColor.PrimaryColor}
                  doActionClicked={() => CommonUtils.actionCallAssistance(AppString.assitance_phone_number)}
                  buttonTitleColor={ThemeColor.WhiteColor}
                />
              </View>
              <Text style={styles.phoneNumberValue}>1-800-2-Scania</Text>
            </View>
            <Image source={AppImage.ic_WordMark_Inverted} style={styles.bottomImage} />
          </View>
          <View style={{ height: 30 }} />
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    );
  }

  renderNormalTabletVersion() {
    return (
      <SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
        <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
        <View style={styles.backgroundImage} >
          <TouchableOpacity style={styles.appIconView} onPress={this.onBackHomeAction}>
            <Image
              style={styles.appIcon}
              source={AppImage.icon_arrow_back} />
          </TouchableOpacity>
          <Image source={AppImage.icon_Wrench} style={Device.isTablet ? styles.centerImageTablet : styles.centerImage} />
          <Text style={styles.bottomTextPortraitTablet}>Make sure you have the following:</Text>
          <View style={styles.bottomListPortraitTablet}>
            <FlatList
              data={[
                { key: 'Customer name' },
                { key: 'Engine / Serial Number' },
                { key: 'Complaint' },
                { key: 'Location' },
                { key: 'Phone Number' },
              ]}
              scrollEnabled={false}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item.key}</Text>}
            />
          </View>
          <View style={styles.lastLocationView}>
            <Text style={styles.locationTitleText}>{('Lastest Known Position:').toUpperCase()}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <Text style={styles.coordinatesTitle}>Longitude: </Text>
              <Text style={styles.coordinatesValue}>{this.state.lastKnownLog}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <Text style={styles.coordinatesTitle}>Latitude: </Text>
              <Text style={styles.coordinatesValue}>{this.state.lastKnownLat}</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'center', alignItems: 'center', bottom: 30, position: 'absolute', }}>
            <View style={styles.callButtonContainer}>
              <View style={styles.callButton}>
                <StartButtonView iconName={AppImage.icon_Call}
                  buttonTitle={AppString.to_call_string.toUpperCase()}
                  backgroundButton={ThemeColor.PrimaryColor}
                  doActionClicked={() => CommonUtils.actionCallAssistance(AppString.assitance_phone_number)}
                  buttonTitleColor={ThemeColor.WhiteColor}
                />
              </View>
              <Text style={styles.phoneNumberValue}>1-800-2-Scania</Text>
            </View>
            <Image source={AppImage.ic_WordMark_Inverted} style={styles.bottomImage} />
          </View>
          <View style={{ height: 30 }} />
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    appDataReducer: state.searchReducer,
  };
}
export default connect(
  mapStateToProps,
)(AssitanceScreen);

