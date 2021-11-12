import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Fonts from '@ThemeColor'
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container_safe_area: {
    flex: 1,
    backgroundColor: ThemeColor.PrimaryColor
  },
  contentOriginView:{
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  contentScroolView:{
    width:'100%',
    height:'100%',
  },
  contentScroolViewParent:{
    flex:1,
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    top:CommonUtils.getSizeAddMore(150,40),
  },
  containerViewTabletAndroid:{
    backgroundColor:'white',
    paddingLeft:16,
    paddingRight:16,
    borderRadius: 5,
    width:'70%',
    justifyContent:'center',
    alignItems:'center'
  },
  containerView:{
    backgroundColor:'white',
    paddingLeft:16,
    paddingRight:16,
    borderRadius: 5,
    width:'100%',
    marginLeft:CommonUtils.getSizeAddMore(0,16),
    marginRight:CommonUtils.getSizeAddMore(0,16),
  },
  containerBottomView: {
    marginTop:16,
    width:'100%',
    flexDirection: 'row'
  },
  headerTitleNone: {
    color:ThemeColor.ContentItemDetailColor,
    fontFamily: Fonts.regular,
    fontSize: CommonUtils.getSizeAddMore(14,8),
  },
  ImageIconStyle: {
     height: 25,
     width: 25,
     resizeMode : 'stretch',
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  }, map: {
    flex: 1
  },
  wordMarkIcon:
  {
    width:25,
    height:36,
    resizeMode: 'contain'
  },
  topRouteViewContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  topRouteViewPortraitTabletContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    width: 345,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentViewParent:{
    paddingLeft:0,
    paddingRight: 0,
    width:'100%',
    height:CommonUtils.getSizeAddMore(185,40),
    bottom:0,
    borderRadius: 5,
    backgroundColor:'white',
    position:'absolute',
    justifyContent:'center'
  },
  containerRouteViewTabletAndroid:{
    marginLeft:CommonUtils.getSizeAddMore(0,0),
    marginRight:CommonUtils.getSizeAddMore(0,0),
    marginBottom:5,
    flex:1
  },
  containerRouteView:{
    flex:1,
    marginLeft:0,
    marginRight:0,
    marginBottom:5,
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
module.exports = styles
