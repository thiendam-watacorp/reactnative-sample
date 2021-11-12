import { StyleSheet,Dimensions} from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewMore: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
    flexDirection: 'column',
    paddingTop:8,
    paddingBottom: 15,
    alignItems: 'center'
  },
  containerView: {
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
    flexDirection: 'column',
    paddingTop:8,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: ThemeColor.BorderColor,
    alignItems: 'center'
  },

  containerViewMoreMap: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
    height:CommonUtils.getSizeAddMore(185,40),
    borderBottomWidth: 1,
    borderColor: ThemeColor.BorderColor,
    alignItems: 'center',
    justifyContent:'center'
  },
  containerViewMap: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
    height: CommonUtils.getSizeAddMore(185,40),
    borderBottomWidth: 1,
    borderColor: ThemeColor.BorderColor,
    alignItems: 'center'
  },

  noPadingContainerView: {
    marginLeft: 0,
    marginRight: 0,
  },
  containerTopView: {
    width:'100%',
    flexDirection: 'row',
    justifyContent:'center',
  },
  containerItemView: {
    width:'100%',
    flexDirection: 'column',
    justifyContent:'center',
  },
  containerRightView: {
    width:'20%',
    flexDirection: 'row',
    justifyContent:'flex-end',
  },
  containerLeftView: {
    width:'80%',
    flexDirection: 'column'
  },
  containerBottomView: {
    marginTop:16,
    width:'100%',
    flexDirection: 'row'
  },
  listIconDetail:{
    width:CommonUtils.getSizeAddMore(24,16),
    height:CommonUtils.getSizeAddMore(24,16)
  },
  headerTitle: {
    color:ThemeColor.PrimaryColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,4),
    fontWeight: "bold"
  },
  headerTitleHighlight: {
    color:ThemeColor.HighLightTitleColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,4),
    fontWeight: "bold"
  },
  headerTitleDetailScreen: {
    color:ThemeColor.PrimaryColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,8),
    fontWeight: "bold"
  },
  headerTitleHighlightDetailScreen: {
    color:ThemeColor.HighLightTitleColor,
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(16,8),
    fontWeight: "bold"
  },
  detailItem: {
    color:ThemeColor.ContentItemDetailColor,
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(14,2),
    marginTop:8
  },
  distanceItem: {
    color:ThemeColor.DistanceItemColor,
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(12,2),
    marginTop:8
  },
  distanceItemList: {
    color:ThemeColor.DistanceItemColor,
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(12,2),
    height: 0,
  },
  rowBorder:{
    backgroundColor:ThemeColor.BorderColor,
    height:1,
    width:'100%',
    marginTop:8
  }
});
module.exports = styles
