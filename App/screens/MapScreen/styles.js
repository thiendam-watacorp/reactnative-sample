import { StyleSheet } from 'react-native';
import CommonUtils from '@CommonUtils'
import Fonts from '@ThemeFont';

const ANNOTATION_SIZE = 45;
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 1, shadowRadius: 3 },
  main: { paddingLeft: 3 }
};

const styles = StyleSheet.create({
  container_safe_area: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainScroll: {
    flex: 1
  },
  mainContain: {
    flex: 1
  },
  searchBarContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarPortraitTabletContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    width: 328,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRouteViewContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRouteViewPortraitTabletContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 88,
    width: 345,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  map: {
    flex: 1
  },
  wordMarkIcon:
  {
    width:25,
    height:36,
    resizeMode: 'contain'},

  contentViewParent:{
    paddingLeft:0,
    paddingRight:0,
    width:'100%',
    bottom:0,
    height:CommonUtils.getSizeAddMore(185,40),
    borderRadius: 5,
    backgroundColor:'white',
    position:'absolute',
    justifyContent:'center'
  },


  containerViewTabletAndroid:{
    marginLeft:CommonUtils.getSizeAddMore(0,0),
    marginRight:CommonUtils.getSizeAddMore(0,0),
    flex:1,
    marginBottom:5,
  },
  containerView:{
    flex:1,
    marginLeft:0,
    marginRight:0,
    marginBottom:5,
  },
  icon: {
    //iconAllowOverlap: true,
  },
  view: {
    width: 60,
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationContainerButtonView: {
    width: CommonUtils.getSizeAddMore(56,8),
    height: CommonUtils.getSizeAddMore(56,8),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  topListlocationContainerButtonView: {
    width: CommonUtils.getSizeAddMore(56,8),
    height: CommonUtils.getSizeAddMore(56,8),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  locationButtonIcon: {
    resizeMode:'contain',
    width: CommonUtils.getSizeAddMore(75,8),
    height: CommonUtils.getSizeAddMore(75,8),
    marginBottom: -7,
  },
  text: {
    fontSize: 50
  },
  spinnerTextStyle: {
    color: '#FFF',
    fontFamily: Fonts.medium,
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 0 },
    textShadowRadius: 5
  },
});

module.exports = styles;
