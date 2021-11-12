import React, { Component, Fragment } from 'react';
import { View, ScrollView,Linking,Platform,StatusBar } from 'react-native';
import BottomView from '@Compontent/BottomView';
import styles from './styles';
import { ENV } from '@Utils/constants';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MapScreen from '@Screen/MapScreen';
import ListScreen from '@Screen/ListScreen';
import AssitanceScreen from '@Screen/AssitanceScreen';
import CommonUtils from '@CommonUtils'
import AppString from '@String'
import ThemeColor from '@ThemeColor'
import { SafeAreaView } from 'react-navigation';

class HomeContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
     screenIndex: 1
   };
   this.bottomAction = this.bottomAction.bind(this);
  }

  bottomAction = (index) => {
      if (index === 3) {
        this.props.navigation.navigate("AssitanceScreen")
      }
      else
      {
        if (index == 1) {
          this.childMap.onMoveActionListView(false)
        }
        else {
            this.childMap.onDismiss()
            this.childMap.onMoveActionListView(true)
        }
        this.setState({ screenIndex: index});
      }
  }
  renderItemView()
  {

      if ( this.state.screenIndex == 1  )
      {
        return(<View style = {styles.container}></View>)
      }
      else
      {
        return(<View style = {styles.mainContainScroll}></View>)
      }
  }
  render() {
    return (<SafeAreaView style={styles.container_safe_area} forceInset={{ bottom: 'never' }}>
      <StatusBar backgroundColor={ThemeColor.PrimaryColor} barStyle="light-content" />
      <View style={styles.container_safe_area}>
        <MapScreen navigation={this.props.navigation} isListShowing={this.state.screenIndex == 2 ? true : false}
          bottomActionList={() => this.bottomAction(2)}
          bottomActionMap={() => this.bottomAction(1)}
          isMapShowing={this.state.screenIndex == 1 ? true : false}
          childRef={ref => (this.childMap = ref)}
        />
        {this.renderItemView()}
      </View>

      <BottomView
        currentIndex={this.state.screenIndex}
        bottomActionMap={() => this.bottomAction(1)}
        bottomActionList={() => this.bottomAction(2)}
        bottomActionAssit={() => this.bottomAction(3)}
        isIpadPro={CommonUtils.isiPadPro()}
      />
    </SafeAreaView>);
  }
}
function mapStateToProps(state) {
  return {
    appData: state.loginReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer);

HomeContainer.propTypes = {
  navigation: PropTypes.object,
  appData: PropTypes.object
};
