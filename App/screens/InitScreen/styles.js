import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Fonts from '@ThemeColor'
const height =  Dimensions.get('window').height
const styles = StyleSheet.create({
  backgroundImage: {
    width:'100%',
    height:'100%',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  },
  containView: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
   appIcon:{
     width:100,
     height:95
   }
});
module.exports = styles
