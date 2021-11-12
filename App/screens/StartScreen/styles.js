import { StyleSheet, Dimensions } from 'react-native';
import Colors from 'App/themes/colors';
import CommonUtils from '@CommonUtils';
import AppImage from '@ThemeImage';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 1, shadowRadius: 3 },
  main: { paddingLeft: 3 }
};
const height = Dimensions.get('window').height
const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PrimaryColor,
    alignItems: 'center',
  },
  transparentBackgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PrimaryColor,
    alignItems: 'center',
    position: 'absolute',
  },
  MapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 1,
  },
  appLogoView: {
    marginBottom: CommonUtils.getSizeAddMore(215, 96),
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  appLogoViewLanscapePhone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogoViewLanscapeTablet: {
    marginTop: CommonUtils.getSizeAddMore(140, 0),
    alignItems: 'center',
    flex: 1,
  },
  appLogo: {
    width: CommonUtils.getSizeAddMore(112, 15),
    height: CommonUtils.getSizeAddMore(105, 15),
  },
  appLogoPhoneLanscape: {
    width: CommonUtils.getSizeAddMore(70, 15),
    height: CommonUtils.getSizeAddMore(70, 15),
    resizeMode: "stretch"
  },
  containerOtherView: {
    height: CommonUtils.getSizeAddMore(146,9)
  },
  containerBottomView: {
    justifyContent: 'flex-end',
    marginBottom: 56,
    width: CommonUtils.getSizeAddMore(256, 32),
    height: CommonUtils.getSizeAddMore(112, 16),
    flexDirection: 'column'
  },
  wordMarkIconView: {
    alignItems: 'center',
    marginBottom: CommonUtils.getSizeAddMore(24, 8)
  },
  wordMarkIcon: {
    height: CommonUtils.getSizeAddMore(24, 8),
    width: CommonUtils.getSizeAddMore(145, 49)
  },
  container_safe_area: {
    flex: 1,
  },
  mainContainScroll: {
    flex: 1
  },
  mainContain: {
    flex: 1
  }
});

module.exports = styles;
