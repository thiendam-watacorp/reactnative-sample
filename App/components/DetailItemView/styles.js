import { StyleSheet,Dimensions} from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewNone: {
    width:'100%',
    flexDirection: 'column',
    paddingBottom: 10,
  },
  containerView: {
    width:'100%',
    flexDirection: 'column',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: ThemeColor.BorderColor,
  },
  containerTopView: {
    marginTop:20,
    width:'100%',
    flexDirection: 'row',
    alignItems:'center',
  },
  appIcon:{
    width:CommonUtils.getSizeAddMore(24,16),
    height:CommonUtils.getSizeAddMore(24,16)
  },
  headerTitle: {
    color:ThemeColor.PrimaryColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,8),
    fontWeight: "bold",
    marginLeft:16
  },
  headerTitleNone: {
    color:ThemeColor.ContentItemDetailColor,
    fontFamily: Fonts.regular,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    marginLeft:16
  },
  hrefTitle: {
    color: '#E35205',
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    marginLeft:16,
    fontWeight: "bold",
    textDecorationLine: 'underline'
  },
  rowBorder:{
    backgroundColor:ThemeColor.BorderColor,
    height:1,
    width:'100%',
    marginTop:8
  }
});
module.exports = styles
