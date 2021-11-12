import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView,Text,FlatList,Dimensions,Image,Animated,Easing,Platform } from 'react-native';
import styles from './styles';
import ItemView from '@Compontent/ListDetailView'
import HeaderTableView from '@Compontent/HeaderTableView'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CommonUtils from '@CommonUtils';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const moreHeighValue = 100 // a half
const defaultValue = 205
const Device = require('react-native-device-detection');
import { getInset } from 'react-native-safe-area-view';
import { isIphoneX } from '@Store/is-iphone-x'
import AppImage from '@ThemeImage';
import {directionsClient} from '@MapboxClient';
import {createResponder} from 'react-native-gesture-responder';

class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95
  }
    this.state = {
      isScrolling: true,
    };

    this.isMoveUp = false;
    this.springValue = new Animated.Value(4000)
    this.startMoveValue = new Animated.Value(4000);
    this.heightOrtherValue = 0;
    this.screenHeight = 0;
    this._onPressItem = this._onPressItem.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.isMoving = false;
  }
  _onPressItem = (item) =>
  {
    this.props._onPressItem(item,false);
  }

  creatingRouteClicked(item) {
    this.props._onPressItem(item,true);
  }
  componentDidMount()
  {
    const { childRef } = this.props;
    childRef(this);
    if (this.props.isListShowing) {
      this.setState({
        isatBottom:true
      })
    }

    this.timeOutLoadingView();
  }

  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }

  loadDefaultAnimatedDisAppear(currentProps)
  {
    if (currentProps.orientation === 'portrait') {
      dist = screenWidth > screenHeight ? screenWidth : screenHeight
    }
    else {
        dist = screenWidth > screenHeight ? screenHeight : screenWidth
    }
    dist += defaultValue;
    return dist;
  }

  loadDefaultAnimated(currentProps)
  {
    if (currentProps.orientation === 'portrait') {
      dist = screenWidth > screenHeight ? screenWidth : screenHeight
      this.screenHeight = screenWidth > screenHeight ? screenWidth : screenHeight;

      // Removing status bar and bottom bar on Tablet and iPhoneX
      if ( isIphoneX() || Device.isTablet)
      {
        const topPadding = getInset('top', dist);
        const bottomPadding = getInset('bottom', dist);
        dist = dist - topPadding;
        dist = dist - bottomPadding;
        dist = dist - 32;
      }
      // detect have soft nav android
      if (Platform.OS !== 'ios') {
        let deviceHeight = Dimensions.get('screen').height;
        let windowHeight = Dimensions.get('window').height;
        let bottomNavBarHeight = deviceHeight - windowHeight;
        if (bottomNavBarHeight > 0) {
            dist = dist - bottomNavBarHeight;
            this.screenHeight = this.screenHeight -  bottomNavBarHeight;
        }
      }
      dist = dist - 80; // include bottom bar and status bar
      dist = dist - CommonUtils.getSizeAddMore(30,0); // include top padding
      dist = dist - CommonUtils.getSizeAddMore(185,15);
      if (currentProps.appDataReducer.arrDataBounding.length > 1) {
        dist = dist - CommonUtils.getSizeAddMore(moreHeighValue,15);
      }
      this.heightOrtherValue = this.screenHeight - dist;
    }
    else {
        dist = screenWidth > screenHeight ? screenHeight : screenWidth
        this.screenHeight = dist;
        const heightMain = dist;
        const bottomPadding = getInset('bottom', dist);
        dist = dist - bottomPadding;
        if (Platform.OS !== 'ios') {
          let deviceHeight = Dimensions.get('screen').height;
          let windowHeight = Dimensions.get('window').height;
          let bottomNavBarHeight = deviceHeight - windowHeight;
          if (bottomNavBarHeight > 0) {
              dist = dist - bottomNavBarHeight;
              this.screenHeight = this.screenHeight -  bottomNavBarHeight;
          }
        }
        dist = dist - 80; // include bottom bar and status bar
        dist = dist - CommonUtils.getSizeAddMore(30,0); // include top padding
        dist = dist - CommonUtils.getSizeAddMore(185,15);
        if (currentProps.appDataReducer.arrDataBounding.length > 1) {
          const removeMore = CommonUtils.getSizeAddMore(moreHeighValue,15);
          if (dist - removeMore > 50) {
            dist = dist - CommonUtils.getSizeAddMore(moreHeighValue,15);
          }
        }

      // Removing status bar and bottom bar on Tablet (on iPhone X is Okay without this)
      if (Device.isTablet) {
        const topPadding = getInset('top', dist);
        const bottomPadding = getInset('bottom', dist);
        dist = dist - topPadding;
        dist = dist - bottomPadding;
        dist = dist - 32;
      }

        this.heightOrtherValue = this.screenHeight - dist;
    }


    return dist;
  }
  scrollToIndex()
  {
    this.setState ({
      isScrolling : true,
    })
    this.forceUpdate();
    this.flatListRef.scrollToIndex({animated: false,index: this.props.selectedIndex});

    this.timeOutLoadingView();
  }
  scrollToIndex(indexSelected)
  {
    this.setState ({
      isScrolling : true,
    })
    this.forceUpdate();
    setTimeout(() => {
      if ( this.flatListRef )
      {
        this.flatListRef.scrollToIndex({animated: true,index: indexSelected});
      }
    }, 500);
    
    this.timeOutLoadingView();
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (this.props.appDataReducer.arrDataBounding.length != prevProps.appDataReducer.arrDataBounding.length) {
      this.scrollToIndex(0);
    }
  }

  onMomentumScrollEnd() {
    this.setState ({
      isScrolling : false,
    })
    this.forceUpdate();
  }

  timeOutLoadingView() {
    setTimeout(() => {
      if (this.state.isScrolling) {
        this.setState ({
          isScrolling : false,
        })
        this.forceUpdate();
      }
    }, 300);
  }

  _keyExtractor = (item, index) => index + ''

  _renderItem = ({ item,index }) => (
   <ItemView
     item={item}
     index = {index}
     numberButton = {2}
     onPressItem={this._onPressItem}
     selectedIndex = {this.props.selectedIndex}
     doRouteClicked = {item => this.creatingRouteClicked(item)} 
   />
 );
 getItemLayout = (data, index) => (
  {
    length: CommonUtils.getSizeAddMore(185,40), offset: CommonUtils.getSizeAddMore(185,40) * index, index
  });
  animateMoveUp()
  {
    this.isMoveUp = true;
    var dist = 0;
    this.startMoveValue = 0;
     Animated.spring(
       this.springValue,
       {
         toValue: 0,
         friction: 7,
         tension: 7,
       }
     ).start()

     this.timeOutLoadingView()
  }
  moveSwipeUpAction(isReload)
  {
    this.props.bottomActionList();
  }
  animateMoveDown()
  {
    this.isMoveUp = false;
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
     this.timeOutLoadingView();
  }
  animateMoveDownDisAppear()
  {
    this.isMoveUp = false;
    const valueAnimated = this.loadDefaultAnimatedDisAppear(this.props);
     this.startMoveValue = valueAnimated;
     Animated.spring(
       this.springValue,
       {
         toValue: valueAnimated,
         friction: 7,
         tension: 7,
       }
     ).start()
     this.props.bottomActionAppear(false);
  }

  animateMoveDownAppear(selectedIndex)
  {
    this.isMoveUp = false;
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
     setTimeout(() => {
          this.scrollToIndex(0)
    }, 500);


  }
  moveSwipeDownAction()
  {
      this.props.bottomActionMap();
  }
  onSwipeUp(gestureState) {
    this.moveSwipeUpAction()
  }

  onSwipeDown(gestureState) {
    this.moveSwipeDownAction()
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if (gestureName !== null) {
      switch (gestureName) {
        case SWIPE_UP:
        {
          if (this.props.isMapShowing) {
            this.moveSwipeUpAction();
          }
          break
        }
        case SWIPE_DOWN:
        {
          if ( this.props.isMapShowing  ) {
            this.animateMoveDownDisAppear();
          }
          else {
            this.moveSwipeDownAction();
          }
          break
        }
      }
    }
  }

  renderDialogItem() {
    const responseData = this.props.appDataReducer.arrDataBounding;
    if (responseData.length > 0) {
      return (<View >
        <FlatList
          ref={(ref) => { this.flatListRef = ref; }}
          style={[styles.contentFlatlist, CommonUtils.isTabletAndroid() && !this.props.isMapShowing ? styles.flatlistBorder : styles.noneflatlistBorder]} 
          data={this.props.appDataReducer.arrDataBounding}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onScrollToIndexFailed={() => { }}
          getItemLayout={this.getItemLayout}
          onMomentumScrollEnd={() => this.onMomentumScrollEnd()}
          viewabilityConfig={this.viewabilityConfig}
          initialNumToRender={10} // Vary According to your screen size take a lumsum according to your item height
          removeClippedSubviews={true}
        />
        {this.renderLoadingView()}
      </View>
      )
    }
    else {
      return (
        <View />
      )
    }
  }

  renderLoadingView() {
    return (this.props.isShowingList && this.state.isScrolling) ? (<View style={{ opacity: 1, position: 'absolute', width: '100%', height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', alignContent: 'center', bottom: 30 }}>Loading...</Text>
    </View>) : null;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps){
      if (this.props.orientation !== nextProps.orientation && this.isMoveUp === false) {
        if ( this.props.isListShowing && nextProps.appDataReducer.responseData.length !== 0 )
        {
          this.animateMoveUp();
        }
        else
        {
          const valueAnimated = this.loadDefaultAnimated(nextProps);
          this.springValue = new Animated.Value(valueAnimated)
          this.startMoveValue = valueAnimated;
        }
      }
      else if ( (this.props.appDataReducer.responseData.length !== nextProps.appDataReducer.responseData.length) )
      {
        if ( this.props.isListShowing && nextProps.appDataReducer.responseData.length !== 0 )
        {
          this.animateMoveUp();
        }
        else
        {
          const valueAnimated = this.loadDefaultAnimated(nextProps);
          this.springValue = new Animated.Value(valueAnimated)
          this.startMoveValue = valueAnimated;
  
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){

      // if ( this.props.orientation !== nextProps.orientation )
      // {
      //   return true;
      // }
      // else if ( this.props.isShowDialog !== nextProps.isShowDialog )
      // {
      //   return true;
      // }
      // else if ( (this.props.appDataReducer.responseData.length !== nextProps.appDataReducer.responseData.length))
      // {
      //   return true;

      // }
      // else if (this.props.appDataReducer.responseData.length > 0  ) 
      // {
      //   if (  this.props.appDataReducer.responseData[0] && this.props.appDataReducer.responseData[0]['CompanyName'] !== nextProps.appDataReducer.responseData[0]['CompanyName'] 
      //   )
      //   {
      //     return true;
      //   }
      // }
      // else if ( this.props.appDataReducer.arrDataBounding.length !== 0 || nextProps.appDataReducer.arrDataBounding.length !== 0 )
      // {
      //   return true;

      // } 
      return true
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
          // const moveValue =  parseInt(this.heightOrtherValue/2) - distanceMove;
          // prefer move up
          if ( distanceMove < 100  ) {
                this.moveSwipeDownAction()
          }
          else {
            this.moveSwipeUpAction()
          }
    }
    else {
      console.log('action move down');
      const distanceMove = this.springValue._value - this.startMoveValue ;
      console.log(distanceMove);
      // const moveValue =  parseInt(this.heightOrtherValue/2) - distanceMove;
      if ( distanceMove  < 80   ) {
            // check dissmiss
            if (this.startMoveValue == 0) {
              this.moveSwipeUpAction()
            }
            else if (this.startMoveValue != 0) {
              this.moveSwipeDownAction()
            }
      }
      else {
        // check dissmiss
        if (this.startMoveValue == 0) {
          this.moveSwipeDownAction()
        }
        else if (this.startMoveValue != 0) {
          this.animateMoveDownDisAppear();
        }
      }
    }

 }

  render() {
  const config = {
     velocityThreshold: 0.3,
     directionalOffsetThreshold: 80
   };
   const arrDataBounding = this.props.appDataReducer.arrDataBounding;
   if (( arrDataBounding.length > 0 )) {
     return (

        <Animated.View style={[styles.contentViewParent,{ top:this.springValue}, this.props.isShowingList ? {flex: 1} : {height:0} , CommonUtils.isTabletAndroid() && !this.props.isMapShowing ? {backgroundColor:'white'} : {backgroundColor:'transparent'} ] }>
             <View style = {[styles.contentScroolView,CommonUtils.isTabletAndroid() ? {width:'70%'} : {width:'100%'} ]}>

                   <View style = {[{width:'100%',borderRadius:8, backgroundColor:'white', justifyContent:'center',alignItems:'center' }, this.props.isShowingList ? {height: 30}: {height: 0}]}
                   {...this.Responder}
                    >
                     <Image
                       style={[styles.appIcon, this.props.isShowingList ? {height:5} : {height: 0} ]}
                       source={AppImage.icon_tabbar_horizontal_filter} />
                   </View>

              {this.renderDialogItem()}
             </View>
         </Animated.View>
     );
   }
   else {
     return (<View/>)
   }
  }
}

function mapStateToProps(state) {
  return {
    appDataReducer: state.searchReducer,
    selectedIndex: state.searchReducer.selectedIndex
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
)(ListScreen);

ListScreen.propTypes = {
  navigation: PropTypes.object,
  responseData: PropTypes.object,
};
