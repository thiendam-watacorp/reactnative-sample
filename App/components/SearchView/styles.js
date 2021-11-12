import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CommonUtils.getSizeAddMore(40, 16),
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: '#C8C9C7',
    height: 44,
    shadowOffset: { height: 2, width: 0 },
    elevation: 1,
  },
  containerLeftButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: '100%',
  },
  containerDeleteButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: '100%',
  },
  containerRightButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 57,
    borderRadius: 5,
    margin: 8,
    backgroundColor: ThemeColor.PrimaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    borderColor: ThemeColor.PrimaryColor,
    borderWidth: 1,
  },
  filterTextInput: {
    fontSize:11,
    fontFamily: Fonts.medium,
  },
  containerBackgroundSearchViewStyle: {
    backgroundColor:ThemeColor.WhiteColor,
    position:'absolute',
    left: 40,
    right:57 + 16,
    top: 8,
    bottom: 8,
  },
  containerOtherView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLeftOtherView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageSearchIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  ImageIconStyle: {
    height: 12,
    width: 12,
    marginTop: 8,
    marginBottom: 8,
    marginRight: 4,
  },
  ImageLocationIconStyle: {
    height: 16,
    width: 16,
    resizeMode: 'stretch',
    marginRight: -24,
  },
  ImageDeleteIconStyle: {
    height: 16,
    width: 16,
  },
  DeleteIconStyle: {
    height: 24,
    width: 24,
  },
  containerTextViewStyle: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  TextStyle: {
    color: "#fff",
    width: '50%',
    alignItems: 'center',
    textAlignVertical: "center",
    textAlign: "center",
    color: ThemeColor.WHITE,
    fontFamily: Fonts.roboto_bold,
    fontSize: 13,
    fontWeight: "bold",
  },
TextInputStyle: {
  fontSize: CommonUtils.getSizeAddMore(14, 2),
  paddingLeft: 24,
  flex: 1,
  color: ThemeColor.ContentItemDetailColor,
},
autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  containerViewParent: {
    flexDirection: 'column',
    zIndex: 3
  },
  itemParentView:{width:'100%',height:50,borderBottomWidth: 1,borderColor: ThemeColor.BorderColor,justifyContent:'center',paddingLeft:16,paddingRight:16,},
  parentViewAuto:{ left:0,right:0,height:150,backgroundColor:'white',top:-3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,zIndex:2,},
});
module.exports = styles;
