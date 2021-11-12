import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'

const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'column',
    width: '100%',
    borderRadius: 5
  },
  containTopViewNoneBorder: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  containParrentTopView: {
    flexDirection: 'column',
    height: 56,
    alignItems: 'center',
    marginRight: 24,
    marginLeft: 24,
    borderBottomWidth: 1,
    marginBottom: 16,
    borderColor: ThemeColor.BorderColor,
  },
  containParrentTopViewNoneBorder: {
    flexDirection: 'column',
    height: 50,
    marginLeft: 24,
    marginRight: 24
  },
  containTopView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
  },
  rightTopView: {
    marginTop: 6,
    marginLeft: 8
  },
  containerOtherView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  ImageIconStyle: {
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  containerRightButtonViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 152,
    borderRadius: 5,
    backgroundColor: ThemeColor.CallColor
  },
  TextStyle: {
    fontFamily: Fonts.roboto_bold,
    fontSize: CommonUtils.getSizeAddMore(24, 0),
    fontWeight: "bold",
    color: ThemeColor.PrimaryColor,
    marginLeft: 8,
    flexShrink: 2
  },
  TextStyleDistance: {
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(13, 0),
    color: ThemeColor.DistanceItemColor,
  },
  TextStyleStartAction: {
    fontFamily: Fonts.roboto_regular,
    fontSize: CommonUtils.getSizeAddMore(13, 0),
    color: 'white'
  }
});
module.exports = styles;