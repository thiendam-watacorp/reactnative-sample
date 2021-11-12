import { StyleSheet, Dimensions } from 'react-native';
import Fonts from '@ThemeFont';


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%'
  },
  all_item: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#bcbcbc',
    justifyContent: 'center',
    alignItems: 'center'

  },
  sub_row: {
    flexDirection: 'row'
  },
  group_info: {
    flexDirection: 'column',
    flex: 1,
    marginRight:8
 },
  title: {
    fontFamily: Fonts.roboto_bold,
    fontSize: 15,
    color: "#000000",
    fontWeight: "bold",
    paddingBottom:5,
    paddingTop:5
  },
  category: {
    fontFamily: Fonts.roboto_regular,
    fontSize: 14,
    color: "red",
    flex: 1,
    paddingBottom:5,
    paddingTop:5
  },
  created: {
    fontFamily: Fonts.roboto_regular,
    fontSize: 11,
    color: "black",
    paddingBottom:5,
    paddingTop:5
  },
  bottom_bar: {
    alignSelf: 'center',
  },
  icon_item: {
    alignSelf: 'center',
    marginRight: 10,
  }
});
module.exports = styles
