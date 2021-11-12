import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'
const borderValue = 8;
const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'column',
    width:'100%',
    borderRadius: borderValue
  },
  containTopViewNoneBorder:{
    flexDirection: 'row',
    width:'100%',
    alignItems:'center',
    paddingTop:16,
    paddingBottom: 16,
  },
  containParrentTopView:{
    flexDirection: 'column',
    width:'100%',
    alignItems:'center',
    paddingTop:16,
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderColor: ThemeColor.BorderColor,
  },
  containParrentTopViewNoneBorder:{
    flexDirection: 'column',
    width:'100%',
    alignItems:'center',
    paddingBottom: 16,
  },
  containTopView:{
    flexDirection: 'row',
    width:'100%',
    alignItems:'center',
    paddingTop:16,
  },
  rightTopView:{
      flexDirection: 'row',
      position:'absolute',
      right:0
  },
  ImageIconStyle: {
     height: 70,
     width: 62,
  },
  containerOtherView:{
      width:'25%',
      justifyContent:'center',
      alignItems:'center'
  },
  TextStyle :{
    fontFamily: Fonts.bold,
    fontSize: CommonUtils.getSizeAddMore(24,0),
    fontWeight: "bold",
    color:ThemeColor.PrimaryColor
  },
  TextStyleSwitch :{
    fontFamily: Fonts.medium,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    color:ThemeColor.ContentItemDetailColor
  },
  TextStyleActionFilter :{
    fontFamily: Fonts.medium,
    fontSize: CommonUtils.getSizeAddMore(12,2),
    color:ThemeColor.WHITE,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  ButtonStyleContainerSelected :{
    borderRadius:5,
    borderWidth: 1,
    borderColor: ThemeColor.CallColor,
    backgroundColor: ThemeColor.CallColor,
    width:56,
    height:24,
    justifyContent:'center',
  },
  ButtonApplyStyleContainer :{
    borderRadius:5,
    borderWidth: 1,
    borderColor: ThemeColor.BorderColor,
    width:56,
    height:24,
    backgroundColor:ThemeColor.WhiteColor,
    justifyContent:'center',
  },
  ButtonStyleContainer :{
    borderRadius:5,
    borderWidth: 1,
    borderColor: ThemeColor.BorderColor,
    width:56,
    height:24,
    justifyContent:'center',
  },
  TextStyleAction :{
    fontFamily: Fonts.medium,
    fontSize: CommonUtils.getSizeAddMore(12,2),
    color:ThemeColor.BorderColor,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  containtViewChild:{
    flexDirection:'row',
    borderBottomWidth: 1,
    paddingBottom: 16,
    borderColor: ThemeColor.BorderColor
  },
  containtViewChildNoneBorder:{
    flexDirection:'row',
  },
  stylePicker:{flexDirection:'column',width:'100%',backgroundColor:'#FAFAFA',paddingLeft:10,height:40,justifyContent:'center'},
  contentScroolView:{
    width:'100%',
    height:'100%',
  },
  contentScroolViewParent:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    height:'100%',
  },
  containerViewOriginAndroid:{
    width:'70%',
    backgroundColor:'white',
    borderRadius: borderValue,
    height:'100%',
    backgroundColor:'white',
  },

  containerViewOrigin:{
    width:'100%',
    backgroundColor:'white',
    borderRadius: borderValue,
    height:'100%',
    backgroundColor:'white',
    marginLeft:CommonUtils.getSizeAddMore(0,16),
    marginRight:CommonUtils.getSizeAddMore(0,16),
  },

  containerViewTabletAndroid:{
    backgroundColor:'white',
    borderRadius: borderValue,
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:16,
    paddingRight:16,

  },
  containerView:{
    width:'100%',
    backgroundColor:'white',
    borderRadius: borderValue,
    height:'100%',
    backgroundColor:'white',
    paddingLeft:16,
    paddingRight:16,
  },
    contentOriginView:{
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  TextStyleFilter :{
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(13,0),
    color:ThemeColor.WHITE,
    justifyContent:'center',
    textAlign:'center',
    height:'100%'
  },
  thumb: {
    width: 30,
    height: 30,
    justifyContent:'center',
    alignItems:'center',
  },
  contentViewParentFilterMap:{
    width:'100%',
    bottom:0,
    flex:1,
    borderRadius: borderValue,
    backgroundColor:'transparent',
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 5
  },
  contentViewParentFilterList:{
    width:'100%',
    bottom:0,
    flex:1,
    borderRadius: borderValue,
    backgroundColor:'transparent',
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
  },
  styleLandScape:{
    top:80,
    paddingLeft:0,
    paddingRight:0
  },
  styleNonLandscape:{
    paddingLeft:0,
    paddingRight:0
  }
});
module.exports = styles;
