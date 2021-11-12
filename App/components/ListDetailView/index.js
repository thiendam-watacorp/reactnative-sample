import React from 'react';
import { Text, View, Image,TouchableOpacity } from 'react-native';
import styles from './styles';
import AppImage from '@ThemeImage'
import AppString from '@String'
import ButtonView from '@Compontent/ButtonView'
import ThemeColor from '@ThemeColor'
import PropTypes from 'prop-types';
import CommonUtils from '@CommonUtils'
import { connect } from 'react-redux';
import {directionsClient} from '@MapboxClient';
import {multiLineString, lineString as makeLineString} from '@turf/helpers';

class ListDetailView extends React.PureComponent {
  constructor(props, context) {
      super(props, context);
      this.state = {
        timeRemaining: "Calculating ...",
      };
      this.doCallActionClicked = this.doCallActionClicked.bind(this);
      this.doRouteActionClicked = this.doRouteActionClicked.bind(this);
      this.doEmailActionClicked = this.doEmailActionClicked.bind(this);
  }
  componentDidMount()
  {
    const responseData = this.props.appDataReducer.responseData;
    const dealerItem = responseData[this.props.index];
    this.getDirection(dealerItem,this.props.index)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps && this.props.appDataReducer.responseData.length != nextProps.appDataReducer.responseData.length){
      const responseData = nextProps.appDataReducer.responseData;
      const dealerItem = responseData[nextProps.index];
      this.getDirection(dealerItem,nextProps.index)
    }
  }
  styleForContainer () {

    if (this.props.isDetailScreen) {
      return [this.props.numberButton == 2 ? styles.containerView : styles.containerViewMore, styles.noPadingContainerView];
    }
    else {
      return this.props.numberButton == 2 ? styles.containerViewMoreMap : styles.containerViewMoreMap;
    }

  }
  async getDirection(nextProps) {
    if ( this.props.appDataReducer.currentCordinate['longitude'] && this.props.appDataReducer.currentCordinate['latitude'] )
    {
      const dealerItem = nextProps ? nextProps : this.props.item
      const latitude = dealerItem['Latitude'];
      const longitude = dealerItem['Longitude'];
  
      const reqOptions = {
        waypoints: [
          {coordinates: [this.props.appDataReducer.currentCordinate['longitude'], this.props.appDataReducer.currentCordinate['latitude']]},
          {coordinates: [longitude, latitude]},
        ],
        profile: 'driving',
        geometries: 'geojson',
        steps: true
      };
      const res = await directionsClient.getDirections(reqOptions).send();
      const routeData = res.body.routes[0];
      if (routeData) {
        const timeValue = this.props.isDetailScreen ? CommonUtils.secondsToDhms(routeData.duration) + " " + "(" + (CommonUtils.getMiles(routeData.distance)).toFixed() + " miles)" : (CommonUtils.getMiles(routeData.distance)).toFixed() + " miles";
        this.setState({
          timeRemaining: timeValue
        });
      }
    }
    
  }

  doCallActionClicked = (item) =>
  {
    CommonUtils.actionCallAssistance(item['PhoneNumber'] ? item['PhoneNumber'] :"" )
  }
  doRouteActionClicked = (item) =>
  {
    if (this.props.doRouteClicked) {
      this.props.doRouteClicked(item)
    }
  }
  doEmailActionClicked = (item) =>
  {
    CommonUtils.actionSendEmail(item['Email'] ? item['Email'] : "")
  }
  renderButtonItem = (item) =>
  {
    if ( this.props.numberButton == 2 )
    {
        return (
          <View style = {{flexDirection:'row',flex:1}}>
            <View style = {{flex:1,marginRight: 10}}>
              <ButtonView iconName = {AppImage.icon_Call}
              buttonTitle = { AppString.call_string.toUpperCase()}
              backgroundButton = {ThemeColor.CallColor}
              doActionClicked={() => this.doCallActionClicked(item)}
              isDetailButton={this.props.isDetailScreen}
              />
            </View>
            <View style = {{flex:1}}>
              <ButtonView iconName = {AppImage.icon_Dealer_Route}
               buttonTitle = {AppString.route_string.toUpperCase()}
               backgroundButton = {ThemeColor.RouteColor}
               doActionClicked={() => this.doRouteActionClicked(item)}
               isDetailButton={this.props.isDetailScreen}
              />
            </View>
          </View>
        )
    }
    else {
      return (
        <View style = {{flexDirection:'row',flex:1}}>
                <View style = {{flex:1,marginRight: 10}}>
                  <ButtonView iconName = {AppImage.icon_Call}
                  buttonTitle = { AppString.call_string.toUpperCase()}
                  backgroundButton = {ThemeColor.CallColor}
                  doActionClicked={() => this.doCallActionClicked(item)}
                  isDetailButton={this.props.isDetailScreen}
                  />
                </View>

                <View style = {{flex:1,marginRight: 10}}>
                  <ButtonView iconName = {AppImage.icon_Email}
                   buttonTitle = {AppString.email_string.toUpperCase()}
                   backgroundButton = {ThemeColor.EmailColor}
                   doActionClicked={() => this.doEmailActionClicked(item)}
                   isDetailButton={this.props.isDetailScreen}
                  />
                  </View>
                <View style = {{flex:1}}>
                  <ButtonView iconName = {AppImage.icon_Dealer_Route}
                   buttonTitle = {AppString.route_string.toUpperCase()}
                   backgroundButton = {ThemeColor.RouteColor}
                   doActionClicked={() => this.doRouteActionClicked(item)}
                   isDetailButton={this.props.isDetailScreen}
                  />
                </View>
        </View>
      )
    }
  }
  render() {

    const item = this.props.item;
    const selectedIdDealer = this.props.selectedIdDealer;
    let isSelected = item['id'] == selectedIdDealer;
    
    const countryAdd =  this.props.item ? CommonUtils.getTwoCharacterRegion(this.props.item['Region'] ? this.props.item['Region'] : '',this.props.item['Country']) : "";
    
    return (
      <View style = { this.styleForContainer() }>
          {
            this.props.item && 

            <TouchableOpacity  onPress={() => this.props.onPressItem(item)} disabled={this.props.isDetailScreen} >
            <View style = {styles.containerItemView}>
            <View style = {styles.containerTopView}>
              <View style = {styles.containerLeftView}>
                    {
                      this.renderCompanyName(isSelected)
                    }
              </View>
              <View style = {styles.containerRightView}>
                <Image style = {[styles.listIconDetail,{marginRight:15}]} source = {this.props.item["MarineService"] == true ? AppImage.icon_Marine_highlight : AppImage.icon_Marine} />
                <Image style = {[styles.listIconDetail]} source = {this.props.item["IndustrialService"] == true ? AppImage.icon_Industrial_highlight : AppImage.icon_Industrial} />
              </View>
            </View>
            <View style = {styles.containerItemView}>
              <Text style = {[styles.detailItem,{marginTop:3}]}>{this.props.item ? this.props.item['StreetAddress'] + ', ' + this.props.item['City'].trim() + ", " + countryAdd:""}</Text>
              <Text style = {styles.detailItem}>{this.props.item ? this.props.item['PhoneNumber'] :""}</Text>
              <Text style = {styles.distanceItem}>{this.state.timeRemaining}</Text>
            </View>

            <View style = {styles.containerBottomView}>
              {
                this.renderButtonItem(item)
              }
            </View>
        </View>

        </TouchableOpacity>
          }        
         
      </View>

    );
  }

  renderCompanyName(isSlected) {
    if (!this.props.isDetailScreen) {
      return isSlected ?
        <Text style={styles.headerTitleHighlight}>{this.props.item ? this.props.item['CompanyName'] : ""}</Text> :
        <Text style={styles.headerTitle}>{this.props.item ? this.props.item['CompanyName'] : ""}</Text>
    } else {
      return isSlected ?
        <Text style={styles.headerTitleHighlightDetailScreen}>{this.props.item ? this.props.item['CompanyName'] : ""}</Text> :
        <Text style={styles.headerTitleDetailScreen}>{this.props.item ? this.props.item['CompanyName'] : ""}</Text>
    }
  }
}


function mapStateToProps(state) {
  return {
    appDataReducer: state.searchReducer,
    selectedIdDealer: state.searchReducer.selectedIdDealer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    searchingData: (params) => dispatch(searchActions.onSearchFetching(params)),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListDetailView);

ListDetailView.propTypes = {
  numberButton: PropTypes.number,
  isDetailScreen: PropTypes.bool,
  doRouteClicked: PropTypes.func,
  isMapScreen: PropTypes.bool,
  routeString: PropTypes.string,
};
ListDetailView.defaultProps = {
  isDetailScreen: false,
  routeString: 'Calculating ...',
}
