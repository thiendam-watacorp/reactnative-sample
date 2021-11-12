
import { StyleSheet } from 'react-native';
import ThemeColor from '@ThemeColor'
import CommonUtils from '@CommonUtils'
const borderValue = 5;

const styles = StyleSheet.create({
  container_safe_area: {
    flex: 1,
    backgroundColor: ThemeColor.PrimaryColor,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection:'column'
  },
  contentScroolView:{
    flex:1,
    backgroundColor:'white',
    paddingLeft:10,
    paddingRight:3,
    borderTopLeftRadius: borderValue,
    borderTopRightRadius: borderValue,
  },
  contentFlatlist:{
    marginTop:0,
    marginBottom:30,
  },
  noneflatlistBorder:
  {
    borderLeftColor: ThemeColor.BorderColor,
    borderRightColor: ThemeColor.BorderColor,
    borderLeftWidth:0,
    borderRightWidth:0
  },
  flatlistBorder:{
    borderLeftColor: ThemeColor.BorderColor,
    borderRightColor: ThemeColor.BorderColor,
    borderLeftWidth:1,
    borderRightWidth:1
  },
  contentViewParent:{
    paddingLeft:0,
    paddingRight:0,
    width:'100%',
    bottom:0,
    borderTopLeftRadius: borderValue,
    borderTopRightRadius: borderValue,
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    zIndex: 4
  },
  appIcon: {
    width: 54,
    height: 5
  },
});

module.exports = styles;
