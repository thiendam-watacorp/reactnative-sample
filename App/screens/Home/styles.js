
import { StyleSheet } from 'react-native';
import ThemeColor from '@ThemeColor'
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 1, shadowRadius: 3 },
  main: { paddingLeft: 3 }
};

const styles = StyleSheet.create({
  container_safe_area: {
    flex: 1,
    backgroundColor: ThemeColor.PrimaryColor,
  },
  container_safe_area_ipad: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    position:'absolute',
    backgroundColor: 'white',
  },
  mainContainScroll: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    bottom:0,
    top:0,
    },
  mainContain: {
    flex: 1
  }
});

module.exports = styles;
