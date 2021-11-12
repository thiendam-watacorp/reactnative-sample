import { StyleSheet } from 'react-native';
import Fonts from 'App/themes/fonts';
import Colors from 'App/themes/colors';
import CommonUtils from '@CommonUtils';

const styles = StyleSheet.create({
  containView: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    width: '100%',
    height:60
  },
  containViewIpadPro: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    width: '100%',
    height:60 + 20, // The home screen indicator at the bottom of the screen 
  },
  textButton: {
    alignItems: 'center',
    fontSize: 11,
    width:'100%',
    color:Colors.TintGrayColor,
    fontFamily: Fonts.regular,
  },
  textButtonSel: {
    alignItems: 'center',
    fontSize: 11,
    width:'100%',
    color:Colors.SelectedColor,
    fontFamily: Fonts.regular,
  },
  viewButtonArea: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    paddingTop: CommonUtils.getSizeAddMore(8,2),
  },
  viewButtonGroup: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconTabbar:{
    width:26,
    height:25,
    marginBottom:5,
    resizeMode: 'contain'
  }
});
module.exports = styles;
