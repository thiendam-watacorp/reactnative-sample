import React, { Component } from 'react';
import SwitchNavigation from './SwitchNavigation';
import NavigationService from './NavigationService';

class AppNavigator extends Component {
  render() {
    return (
      <SwitchNavigation
          ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default AppNavigator;
