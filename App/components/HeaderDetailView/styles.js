import { StyleSheet,Dimensions} from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  containerView: {
    marginTop: 16,
    paddingLeft:16,
    paddingRight:16,
    width:'100%',
    backgroundColor:'transparent',
    position:'absolute'
  },
  containerViewTabletAndroid: {
    marginTop: 16,
    marginLeft:16,
    width:330,
    backgroundColor:'transparent',
    position:'absolute'

  },
  container:{
    width:'100%',
    flexDirection:'row',
    backgroundColor:'white',
    height:44,
    justifyContent:'center'
  },
  containerSlide:{
    width: 40,
    justifyContent:'center',
    alignItems:'center',
  },
  centerView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  headerTitle: {
    color:ThemeColor.PrimaryColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,4),
    fontWeight: "bold",
  },
});
module.exports = styles
