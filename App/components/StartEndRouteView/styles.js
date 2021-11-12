import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 88,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: '#C8C9C7',
    shadowOffset: { height: 2, width: 0 },
  },
  containerLeftButtonViewStyle: {
    width: 44,
    height: '100%',
  },
  containerDeleteButtonViewStyleRevert: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 51,
    position: 'absolute',
    right:0,
  },
  containerDeleteButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 11,
    position: 'absolute',
    right:0,
  },
  containerRightButtonViewStyle: {
    width: 44,
    height: '100%',
  },
  containerOtherView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLeftOtherView: {
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  containerTextOtherView: {
    flexDirection: 'column',
    flex: 1,
    height: '100%',
  },
  ImageIconStyle: {
    marginLeft: 8,
    marginTop: 10,
    height: 24,
    width: 24,
    resizeMode: 'stretch',
  },
  ImageLocationIconStyle: {
    marginTop: 17,
    height: 55,
    width: 12,
    resizeMode: 'stretch',
    marginRight: -6,
  },
  ImageDeleteIconStyle: {
    height: 16,
    width: 16,
  },
  containerTextViewStyle: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  TextStyle: {
    width: '100%',
    fontSize: 16,
    alignItems: 'center',
    textAlignVertical: "center",
    textAlign: "center",
    color: '#53565A',
    fontFamily: Fonts.regular,
  },
  TextInputStyle: {
    fontSize: 16,
    textAlign: 'left',
    color: '#53565A',
    fontFamily: Fonts.regular,
    marginLeft: 12, 
    marginTop: 14,
    width: '85%',
    position: 'absolute', 
    backgroundColor: 'white'
  },
  TextInputAndroidStyle: {
    fontSize: 16,
    textAlign: 'left',
    color: '#53565A',
    fontFamily: Fonts.regular,
    marginLeft: 8, 
    marginTop: 0,
    width: '85%',
    position: 'absolute', 
    backgroundColor: 'white'
  },
  TextInputStyleRevert: {
    width: '85%',
    fontSize: 16,
    textAlign: 'left',
    color: '#53565A',
    fontFamily: Fonts.regular,
    marginLeft: 12, 
    marginTop: 54, 
    position: 'absolute', 
    backgroundColor: 'white'
  },
  TextInputAndroidStyleRevert: {
    width: '85%',
    fontSize: 16,
    textAlign: 'left',
    color: '#53565A',
    fontFamily: Fonts.regular,
    marginLeft: 8, 
    marginTop: 40, 
    position: 'absolute', 
    backgroundColor: 'white'
  },
  DeleteIconStyle: {
    height: 24,
    width: 24,
  },
  containerViewParent: {
    top:0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  parentViewAuto: {
    left: 0, right: 0, height: 150, backgroundColor: 'white', top: -3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
module.exports = styles;