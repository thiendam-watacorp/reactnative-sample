import React from 'react';
import { View, TouchableOpacity,Image,Button,Switch,ScrollView,Dimensions,ImageBackground,Platform,FlatList,Animated,Easing } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage'
import AppString from '@String'
import ThemeColor from '@ThemeColor'
import ButtonView from '@Compontent/ButtonView'
import PickerSelect from 'react-native-picker-select';
import Slider from "react-native-slider";
import dealerLists from '@Database/Dealers.json';
import CommonUtils from '@CommonUtils'
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const Device = require('react-native-device-detection');
import { getInset } from 'react-native-safe-area-view';
import { isIphoneX } from '@Store/is-iphone-x'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {createResponder} from 'react-native-gesture-responder';

const defaultValueHeight = 340;
let placeholder = {
     label: 'ALL',
     value: null,
     color: '#97999B'
   }

const MAXDISTANCEVALUE = 250;

export default class FilterView extends React.PureComponent {
  constructor(props) {
    super(props);
    switchDefaultValue = false,
    typeServicesDefault = 0,
    distanceLocationDefault = 0,
    locationDefault = '',
    this.state = {
      switchValue:false,
      value: 0,
      selectedIndex:0,
      location:'',
      selectFilter:0,
      listCity:[]
    }
    this.springValue = new Animated.Value(0)
    this.startMoveValue = new Animated.Value(4000);

  }

  toggleSwitch(value){
      this.setState({switchValue: value})
      this.checkChangeValueApplyFilter(this.state.selectedIndex,this.state.location,value,this.state.value)
   }
  slideChange(value) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
    if (!this.state.switchValue) {
      this.setState({switchValue: true})
    }
    this.checkChangeValueApplyFilter(this.state.selectedIndex,this.state.location,this.state.switchValue,value)
  }
  changeLocation(location)
  {
    this.setState({location:location});
    this.checkChangeValueApplyFilter(this.state.selectedIndex,location,this.state.switchValue,this.state.value)
  }
  doCallActionClicked ()
  {
    this.setState({selectedIndex:1});
    this.checkChangeValueApplyFilter(1,this.state.location,this.state.switchValue,this.state.value)
  }
  doRouteActionClicked()
  {
    this.setState({selectedIndex:2});
   this.checkChangeValueApplyFilter(2,this.state.location,this.state.switchValue,this.state.value)
  }
  applyAction()
  {
    this.setState({
      selectFilter:1
    })
    const sliderValue = this.state.value
    this.props.filterChangeItemAction(this.state.switchValue,sliderValue,this.state.selectedIndex,this.state.location,true,1,false)
  }
  clearActionFromSearchBar()
  {
    this.setState({
      switchValue:false,value: 0,selectedIndex:0,location:'',selectFilter:2
    })
    this.props.filterChangeItemAction(false,0,0,'',false,0,true)
  }
  clearAction()
  {
    this.setState({
      switchValue:false,value: 0,selectedIndex:0,location:'',selectFilter:2
    })
    this.props.filterChangeItemAction(false,0,0,'',true,0,false)

  }
  checkChangeValueApplyFilter(typeServices,locationValue,isSwitchEnable,distanceValue)
  {
    var cmpLocation = locationValue;
    if ( locationValue == null ) {
      cmpLocation = '';
    }
    if ( this.typeServicesDefault !== typeServices || cmpLocation !== this.locationDefault )
    {
       this.setState({
        selectFilter:1
      })
    }
    else if ( isSwitchEnable === true ) {
      if (this.distanceLocationDefault !== distanceValue) {
        this.setState({
          selectFilter:1
        })
      }
    }
    else
    {
      this.setState({
        selectFilter:0
      })
    }

  }
  componentDidMount()
  {
    const { childRef } = this.props;
    childRef(this);
    var newData = dealerLists;

    CommonUtils.getData().then((data) => {
      if (data != null) {
        newData = data;
      }
      this.runInit(newData);
    });
  }

  runInit(newData) {
    var listCity = [];
    let dealerList = newData && newData.length ? newData : dealerLists;
    for (let i = 0; i < dealerList.length; i++) {
      const CityLabel = dealerList[i]['City'];
      const CityValue = dealerList[i]['City'];
      let item = { label: CityLabel, value: CityValue };

      var isExits = false;
      for (var j = 0; j < listCity.length; j++) {
        const listItem = listCity[j];
        const valuesItem = listItem.value;
        if (valuesItem.indexOf(CityValue) > -1) {
          isExits = true;
          break;
        }
      }
      if (!isExits) {
        listCity.push(item)
      }
    }

    const defaultValue = this.props.isFilter ? parseInt(this.props.distanceLocation) : 0;
    // save the first value
    this.switchDefaultValue = this.props.isCheckLocation;
    this.locationDefault = this.props.location;
    this.distanceLocationDefault = defaultValue;
    this.typeServicesDefault = this.props.type_services;

    this.setState({
      listCity: listCity,
      switchValue: this.props.isCheckLocation,
      value: defaultValue,
      selectedIndex: this.props.type_services,
      location: this.props.location,
      placeholder: {
        label: this.props.location ? this.props.location : 'City/State',
        value: null,
        color: '#97999B'
      }
    })

    if (this.props.isFilterView) {
      const valueAnimated = this.loadDefaultAnimated(this.props);
      this.springValue = new Animated.Value(valueAnimated)
      this.startMoveValue = valueAnimated;
    }
    else {
      this.springValue = new Animated.Value(0)
      this.startMoveValue = 0;
    }
  }

  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }

  onSwipeUp(gestureState) {
    this.props.doActionFilterMove();
  }

  onSwipeDown(gestureState) {
    this.props.doActionFilterMove();
  }
  moveSwipeUpAction()
  {
    const valueAnimated = this.loadDefaultAnimated(this.props);
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
  moveSwipeDownAction()
  {
    this.startMoveValue = 0;
     Animated.spring(
       this.springValue,
       {
         toValue: 0,
         friction: 7,
         tension: 7,
       }
     ).start()
  }

  loadDefaultAnimated(currentProps)
  {
    if (currentProps.orientation === 'portrait') {
        return CommonUtils.getSizeAddMore(defaultValueHeight,15);
    }
    else {
        dist = screenWidth > screenHeight ? screenHeight : screenWidth
        const heightMain = dist;
        const bottomPadding = getInset('bottom', dist);
        dist = dist - bottomPadding;
        if (Platform.OS !== 'ios') {
          let deviceHeight = Dimensions.get('screen').height;
          let windowHeight = Dimensions.get('window').height;
          let bottomNavBarHeight = deviceHeight - windowHeight;
          if (bottomNavBarHeight > 0) {
              dist = dist - bottomNavBarHeight;
          }
        }
        dist = dist - 80; // include bottom bar and status bar
        dist = dist - CommonUtils.getSizeAddMore(60,0); // include top padding
        return dist > CommonUtils.getSizeAddMore(defaultValueHeight,15) ? CommonUtils.getSizeAddMore(defaultValueHeight,15) : dist;
    }

    return dist;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps){
      if (this.props.orientation !== nextProps.orientation && this.props.isFilterView === true) {
        const valueAnimated = this.loadDefaultAnimated(nextProps);
        this.springValue = new Animated.Value(valueAnimated)
        this.startMoveValue = valueAnimated;
      }
    }
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if (gestureName !== null) {
      switch (gestureName) {
        case SWIPE_UP:
        {
          this.props.doActionFilterMove();
          break
        }
        case SWIPE_DOWN:
        {
          this.props.doActionFilterMove();
          break
        }
      }
    }
    else
    {
      if (this.props.isFilterView) {
        this.moveSwipeDownAction()
      }
      else
      {
        this.moveSwipeUpAction()
      }
    }
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
   let newY = this.springValue._value - yDiff
   if (newY < minY) {
     newY = minY
   } else if (newY > maxY) {
     newY = maxY
   }
   this.springValue.setValue(newY)
 }
 panStop = (gestureState) => {
   // move up
     if (this.springValue._value > this.startMoveValue) {
       this.moveSwipeUpAction()
     }
     else {
       const distanceMove = this.startMoveValue - this.springValue._value;
       // const moveValue =  parseInt(this.heightOrtherValue/2) - distanceMove;
       if ( distanceMove  < 80   ) {
               this.moveSwipeUpAction()
       }
       else {
         this.props.doActionFilterMove();
       }
     }
  }


  render() {
    const config = {
       velocityThreshold: 0.3,
       directionalOffsetThreshold: 80
     };
    var dist = 0;
    var left = 0;
    const paddingLeftRight = 84;
    if (this.props.orientation === 'portrait') {
      dist = screenWidth > screenHeight ? screenHeight : screenWidth
      if ( CommonUtils.isTabletAndroid() ) {
         dist = dist * 70/MAXDISTANCEVALUE;
      }
      left = this.state.value*(dist - paddingLeftRight)/MAXDISTANCEVALUE - 18
    }
    else {
      dist = screenWidth > screenHeight ? screenWidth: screenHeight
      const leftPadding = getInset('left', dist);
      if ( CommonUtils.isTabletAndroid() ) {
         dist = dist * 70/MAXDISTANCEVALUE;
         left = this.state.value*(dist - paddingLeftRight)/MAXDISTANCEVALUE - 18
      }
      else if ( isIphoneX() )
      {
        left = this.state.value*(dist - paddingLeftRight - 2*leftPadding)/MAXDISTANCEVALUE - 18
      }
      else
      {
        left = this.state.value*(dist - paddingLeftRight)/MAXDISTANCEVALUE - 18
      }
    }
    const defaultColor = this.state.switchValue ? '#E35205' : '#97999B'
    return (
        <Animated.View style = {[ this.props.isMapShowing ? styles.contentViewParentFilterMap : styles.contentViewParentFilterList,
        {height:this.springValue}]}>
               <View style={CommonUtils.isTabletAndroid() ? styles.containerViewOriginAndroid : styles.containerViewOrigin}>
                <View style = {{width:'100%',height:30,justifyContent:'center',alignItems:'center' }}
                     {...this.Responder}>
                       <Image
                         style={styles.appIcon}
                         source={AppImage.icon_tabbar_horizontal_filter} />
                     </View>
                <ScrollView style={[styles.contentScroolView]}>
                  <View style = {styles.contentOriginView}>
                   <View style={CommonUtils.isTabletAndroid() ? styles.containerViewTabletAndroid : styles.containerView}>
                     <View style = {styles.containerViewStyle}>
                         <View style = {[styles.containParrentTopView,{paddingTop:0}]}>
                             <View style = {styles.containTopView}>
                                 <Text style = {styles.TextStyle}>{AppString.Filters_string}</Text>
                                  <View style = {[styles.rightTopView,{top:16+2}]}>
                                   <TouchableOpacity style = {[this.state.selectFilter == 1 ? styles.ButtonStyleContainerSelected : styles.ButtonApplyStyleContainer,{marginRight:8}]} onPress={() => this.applyAction()} >
                                     <Text style = {this.state.selectFilter == 1 ? styles.TextStyleActionFilter : styles.TextStyleAction}>{AppString.Apply_string}</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style = {styles.ButtonStyleContainer} onPress={() => this.clearAction()} >
                                     <Text style = {styles.TextStyleAction}>{AppString.Clear_string}</Text>
                                   </TouchableOpacity>
                                  </View>
                             </View>
                         </View>
                         <View style = {styles.containParrentTopView}>
                             <View style = {{flexDirection:'column',width:'100%',marginTop:10}}>

                                  <View style = {styles.containTopViewNoneBorder}>
                                     <Text style = {styles.TextStyleSwitch}>{AppString.how_far_string}</Text>
                                     <View style = {styles.rightTopView} >
                                       <Switch ios_backgroundColor={'#D0D0D0'}  trackColor={{true: '#60B269', false: '#D0D0D0'}} value = {this.state.switchValue} onValueChange = {this.toggleSwitch.bind(this)}/>
                                     </View>
                                  </View>

                                  <View style = {{flexDirection:'column',flex:1, marginLeft: 12, marginRight: 12}}>
                                     {
                                       this.state.switchValue &&
                                       <ImageBackground style = {[styles.ImageIconStyle,{left:left,top: -60,position:'absolute'}]}
                                        source = {AppImage.icon_Slider} >
                                         <Text style = {[styles.TextStyleFilter,{marginTop:15,height:'100%'}]}>{this.state.value}{"\n"}mi</Text>
                                      </ImageBackground>
                                     }
                                     <Slider
                                       thumbImage={AppImage.icon_Filter_Control}
                                       thumbTintColor='#C8C9C7'
                                       minimumTrackTintColor= {defaultColor}
                                       thumbStyle={[styles.thumb,{backgroundColor:defaultColor}]}
                                       maximumValue={MAXDISTANCEVALUE}
                                       onValueChange={this.slideChange.bind(this)}
                                       value={this.state.value}
                                       step={1}
                                     />
                                 </View>

                           </View>
                         </View>

                          <View style = {styles.containTopViewNoneBorder}>
                             <Text style = {styles.TextStyleSwitch}>{AppString.type_services_string}</Text>
                         </View>

                           <View style = {styles.containtViewChildNoneBorder}>
                             <View style = {{flex:1,marginRight:15}}>
                               <ButtonView
                               iconName = { this.state.selectedIndex == 1 ? AppImage.Marine_Button_Filter_Selected : AppImage.Marine_Button_Filter }
                               buttonTitle = { AppString.marine_string.toUpperCase()}
                               backgroundButton = { this.state.selectedIndex == 1 ? ThemeColor.HightLightFilterColor : ThemeColor.BorderColor }
                               buttonColor = { this.state.selectedIndex == 1 ? ThemeColor.WHITE : ThemeColor.ContentItemDetailColor }
                               doActionClicked={() => this.doCallActionClicked()}
                               />
                             </View>
                             <View style = {{flex:1}}>
                               <ButtonView iconName = { this.state.selectedIndex == 2 ? AppImage.Industrial_Button_Filter_Selected : AppImage.Industrial_Button_Filter}
                                buttonTitle = {AppString.industrial_string.toUpperCase()}
                                buttonColor = { this.state.selectedIndex == 2 ? ThemeColor.WHITE : ThemeColor.ContentItemDetailColor }
                                backgroundButton = { this.state.selectedIndex == 2 ? ThemeColor.HightLightFilterColor : ThemeColor.BorderColor }
                                doActionClicked={() => this.doRouteActionClicked()}
                               />
                             </View>
                           </View>

                     </View>
                     </View>
                  </View>
                </ScrollView>
                </View>
        </Animated.View>
    );
  }

}

FilterView.propTypes = {
  doActionClicked: PropTypes.func,
  iconName: PropTypes.number,
  buttonTitle: PropTypes.string,
  backgroundButton: PropTypes.string
};
