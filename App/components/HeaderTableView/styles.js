import { StyleSheet,Dimensions} from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({
  containerView: {
    width:'100%',
    flexDirection: 'column',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: ThemeColor.BorderColor,
  },
  containerTopView: {
    marginTop:28,
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
  rowBorder:{
    backgroundColor:ThemeColor.BorderColor,
    height:1,
    width:'100%',
    marginTop:8
  }
});
module.exports = styles
