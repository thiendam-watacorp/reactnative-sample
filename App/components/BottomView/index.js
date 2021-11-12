import React from 'react';
import { View, TouchableOpacity,Image,Text } from 'react-native';
import styles from './styles';
import { Footer, FooterTab} from 'native-base';
import PropTypes from 'prop-types';
import ThemeColor from '@ThemeColor'
import AppImage from '@ThemeImage'
import AppString from '@String'

export default class BottomView extends React.PureComponent {

  renderMapIcon = () =>
  {
      return(
        <View style={styles.viewButtonGroup}>
          <Image style = {styles.iconTabbar} source = { this.props.currentIndex == 1 ? AppImage.ic_Map_Active : AppImage.ic_Map} />
          <Text style={ this.props.currentIndex == 1 ? styles.textButtonSel : styles.textButton}>{AppString.map_string}</Text>
        </View>
      )

  }
  renderListIcon = () =>
  {
    return (
      <View style={styles.viewButtonGroup}>
          <Image style = {styles.iconTabbar} source = { this.props.currentIndex == 2 ? AppImage.ic_List_Active : AppImage.ic_List} />
          <Text style={ this.props.currentIndex == 2 ? styles.textButtonSel : styles.textButton}>{AppString.list_string}</Text>
      </View>
    )
  }
  renderAssitance =() =>
  {
    return (
      <View style={styles.viewButtonGroup}>
          <Image style = {styles.iconTabbar} source = { this.props.currentIndex == 3 ? AppImage.ic_Assitance : AppImage.ic_Assitance} />
          <Text style={this.props.currentIndex == 3 ? styles.textButton : styles.textButton}>{AppString.assitance_string}</Text>
      </View>
    )
  }
  render() {

    return (
      <Footer style={this.props.isIpadPro ? styles.containViewIpadPro : styles.containView}>
        <FooterTab style={{backgroundColor:"#FFF"}}>
          <TouchableOpacity style={styles.viewButtonArea} onPress={() => this.props.bottomActionMap()} disabled={!this.props.bottomActionMap}>
            {this.renderMapIcon()}
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButtonArea} onPress={() => this.props.bottomActionList()} disabled={!this.props.bottomActionList}>
            {
              this.renderListIcon()
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewButtonArea} onPress={() => this.props.bottomActionAssit()} disabled={!this.props.bottomActionAssit}>
            {
              this.renderAssitance()
            }
          </TouchableOpacity>
        </FooterTab>
      </Footer>
    );
  }
}

BottomView.propTypes = {
  currentIndex: PropTypes.number,
  bottomActionMap: PropTypes.func,
  bottomActionList: PropTypes.func,
  bottomActionAssit: PropTypes.func
};
