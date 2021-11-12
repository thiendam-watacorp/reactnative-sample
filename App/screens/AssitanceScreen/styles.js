import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'App/themes/colors';
import CommonUtils from '@CommonUtils';
import AppImage from '@ThemeImage';
import Fonts from '@ThemeFont';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 1, shadowRadius: 3 },
  main: { paddingLeft: 3 }
};
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  container_safe_area: {
    flex: 1,
    backgroundColor: Colors.PrimaryColor,
  },
  headerText: {
    textAlign: 'center',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(16,8),
    fontFamily: Fonts.roboto_bold,
    marginTop: CommonUtils.getSizeAddMore(16,0),
    marginLeft: 15,
    marginRight: 15,
    fontWeight: "bold",
  },
  normalText: {
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
    marginTop: 5,
    width: CommonUtils.getSizeAddMore(345,148),
    textAlignVertical:'center',
    letterSpacing: -0.3,
    paddingLeft:30,
    paddingRight:30
  },
  normalTextPortraitTablet: {
    textAlign: 'center',
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    width:CommonUtils.getSizeAddMore(345,148),
    fontFamily: Fonts.medium,
    marginTop: 5
  },
  bottomTextLandscape: {
    //alignSelf: 'center',
    textAlign: 'left',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    left:30
  },
  bottomText: {
    textAlign: 'left',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    marginTop: CommonUtils.getSizeAddMore(60,16),
    marginLeft: CommonUtils.getSizeAddMore(60,25),
    marginRight: CommonUtils.getSizeAddMore(88,25),
    width:'60%'
  },
  bottomTextWithSpace: {
    textAlign: 'left',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    width:'100%',
    marginBottom:24,
  },
  bottomTextPortraitTablet: {
    textAlign: 'left',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    marginTop: CommonUtils.getSizeAddMore(60,16),
    marginLeft: CommonUtils.getSizeAddMore(0,5),
    width: CommonUtils.getSizeAddMore(251,23)
  },
  bottomList: {
    marginTop: CommonUtils.getSizeAddMore(24,25),
    marginLeft: CommonUtils.getSizeAddMore(65,-5),
    marginRight: CommonUtils.getSizeAddMore(88,88),
    width:'60%'
  },
  bottomListWithSpace: {
    alignSelf: 'center',
    width: CommonUtils.getSizeAddMore(256,23),
  },
  bottomListPortraitTablet: {
    marginTop: CommonUtils.getSizeAddMore(24,0),
    marginLeft: CommonUtils.getSizeAddMore(0,5),
    width: CommonUtils.getSizeAddMore(251,23),
    height:125,
  },
  bottomListLandscapeTablet: {
    marginTop: 16,
    alignSelf: 'center',
    height:6*18,
    width: CommonUtils.getSizeAddMore(350,45),
  },
  listItem: {
    textAlign: 'left',
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    paddingLeft:0,
  },
  listItemTabletLandscape: {
    textAlign: 'left',
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
    flex: 0.5,
  },
  lastLocationView: {
    paddingTop: CommonUtils.getSizeAddMore(64,16),
    paddingBottom: CommonUtils.getSizeAddMore(52,16),
  },
  lastLocationViewTabletAndroid: {
    flex: 1,
    justifyContent: 'center',
    top: -10,
  },
  lastLocationViewWithSpace: {
  },
  lastLocationViewTabletLandscape: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  locationTitleText: {
    textAlign: 'center',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
    marginBottom:16,
  },
  locationTitleTextWithSpace: {
    textAlign: 'center',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
    marginBottom:16,
  },
  locationTitleTextTabletLandscape: {
    textAlign: 'center',
    color: Colors.PrimaryColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
    marginBottom:8,
  },
  coordinatesTitle: {
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.bold,
  },
  coordinatesValue: {
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.regular,
  },
  centerImage: {
    width: 320,
    height: 128,
    marginTop: 60,
    resizeMode: 'contain',
  },
  centerImageWithSpace: {
    width: 320,
    height: 128,
    marginTop: 44,
    resizeMode: 'contain',
  },
  centerImageTablet: {
    width: 675,
    height: 208,
    marginTop: 64,
    resizeMode: 'contain'
  },
  centerImageTabletAndroid: {
    width: '90%',
    height: 160,
    marginTop: 64,
    resizeMode:'contain',
  },
  centerImageTabletLandscape: {
    width: 439,
    height: 208,
    marginTop: 64,
    resizeMode: 'contain'
  },
  bottomImage: {
    width: CommonUtils.getSizeAddMore(145,48),
    height: CommonUtils.getSizeAddMore(24,8),
    resizeMode: 'contain',
    top:5
  },
  callButton: {
    width: CommonUtils.getSizeAddMore(256,23),
    height:CommonUtils.getSizeAddMore(48,2)
  },
  callButtonContainer: {
    alignItems: 'center',
    marginBottom: CommonUtils.getSizeAddMore(50,20)
  },
  callButtonContainerWithSpace: {
    alignItems: 'center',
    marginBottom: CommonUtils.getSizeAddMore(25,20)
  },
  callButtonContainerLandscape: {
    alignItems: 'center',
  },
  callButtonLandscape: {
    width: CommonUtils.getSizeAddMore(256,23),
    height: CommonUtils.getSizeAddMore(48,2)
  },
  phoneNumberValue: {
    marginTop: CommonUtils.getSizeAddMore(16,8),
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
  },
  phoneNumberValueTabletLandscape: {
    marginTop: 18,
    color: Colors.ContentItemDetailColor,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    fontFamily: Fonts.medium,
  },
  appIcon: {
    width: CommonUtils.getSizeAddMore(12, 0),
    height: CommonUtils.getSizeAddMore(20, 0),
    
  },
  appIconView: {
    height: 50,
    justifyContent:'center',
    width:'100%',
    position:'absolute',
    left:16,
  },
});

module.exports = styles;
