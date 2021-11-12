import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CommonUtils.getSizeAddMore(40,16),
    borderRadius: 5,
    margin: 0,
    justifyContent:'center',
    shadowOpacity: 1,
     shadowRadius: 5,
     shadowColor: '#C8C9C7',
     shadowOffset: { height: 2, width: 0 },
  },
  ImageIconStyle: {
     height: 25,
     width: 25,
     resizeMode : 'contain',
  },
  containerOtherView:{
      width:'25%',
      position:'absolute',
      left:2,
      justifyContent:'center',
      alignItems:'center'
  },
  leftcontainerOtherView: {
    flex: 1,
  },
  TextStyle :{
    color: "#fff",
    width:'100%',
    position:'absolute',
    left:5,
    alignItems:'center',
    textAlignVertical: "center",
    textAlign: "center",
    color:ThemeColor.WHITE,
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: "bold",
  },
  DetailTextStyle: {
    position: 'absolute',
    alignItems: 'center',
    textAlignVertical: "center",
    textAlign: "center",
    color:ThemeColor.WHITE,
    fontFamily: Fonts.medium,
    fontSize: 13,
    fontWeight: "500",
  }
});
module.exports = styles;
