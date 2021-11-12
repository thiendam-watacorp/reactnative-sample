import { StyleSheet } from 'react-native';
import Fonts from '@ThemeFont';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'
import colors from '../../themes/colors';

const styles = StyleSheet.create({

  containerViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CommonUtils.getSizeAddMore(48,8),
    borderRadius: 0,
    margin: 5,

  },
  ImageIconStyle: {
    marginLeft: 16,
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  TextStyle: {
    color: "#fff",
    width: '100%',
    position:'absolute',
    alignItems: 'center',
    display: 'flex',
    textAlignVertical: "center",
    textAlign: "center",
    color:ThemeColor.WHITE,
    fontFamily: Fonts.regular,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: -0.3,
    lineHeight: 18,
    paddingLeft: 24,
    position:'absolute'
  },

});
module.exports = styles;
