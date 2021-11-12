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
    width: 30,
    height: '100%',
  },
  containerRightButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: '100%',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: ThemeColor.PrimaryColor
  },
  containerBackgroundSearchViewStyle: {
    backgroundColor:ThemeColor.WhiteColor,
    position:'absolute',
    left: 40,
    right:44,
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
    height: 24,
    width: 24,
    resizeMode: 'stretch',
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
    color: ThemeColor.ContentItemDetailColor,
    fontFamily: Fonts.regular,
    fontSize: CommonUtils.getSizeAddMore(12,0),
    paddingLeft:8,
    paddingRight:8
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
  },
  itemParentView:{height:56,borderBottomWidth: 1,borderColor: ThemeColor.BorderColor,justifyContent:'center',marginLeft:16,marginRight:16,
  flexDirection:'row'},
  parentViewAuto:{ left:0,right:0,height:168,borderWidth: 0.5, borderColor: ThemeColor.BorderColor,backgroundColor:'white'},
  itemParentViewLastItem:{height:56,borderBottomWidth: 0,borderColor: ThemeColor.BorderColor,justifyContent:'center',marginLeft:16,marginRight:16,
  flexDirection:'row'},
  parentViewAutoLastItem:{ left:0,right:0,height:168,borderWidth: 0, borderColor: ThemeColor.BorderColor,backgroundColor:'white'},
  leftView:{width:'90%',justifyContent:'center'},
  rightView:{width:'10%',justifyContent:'center',alignItems:'center'},
  iconStyles:{width:12,height:14},
  

});
module.exports = styles;
