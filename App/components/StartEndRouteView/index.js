import React from 'react';
import { View, TouchableOpacity, Image, Button, TextInput, Keyboard, FlatList } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';
import CommonUtils from '@CommonUtils';
import { Dropdown } from 'react-native-material-dropdown';
import AutoSuggestView from '@Compontent/AutoSuggestView';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

class StartEndRouteView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      filterButtonbackgoundColor: ThemeColor.WhiteColor,
      filterButtonTextColor: ThemeColor.SelectedColor,
      filterButtonImage: AppImage.ic_Filter_Inactive,
      textInputStatus: 'untouched',
      textInputValue: '',
      revertedItem: false,
      isInputLocation: false,
    };
    this._onPressItem = this._onPressItem.bind(this);
  }

  componentDidMount() {
    //const { childRef } = this.props;
    //childRef(this);
  }

  componentWillUnmount() {
    //const { childRef } = this.props;
    //childRef(undefined);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  searchResultWithActionDone() {
    
    this.props.searchingDataComponent(this.state.textInputValue, false,false,true);
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => {
    if (this.props.keyboardAction) {
      this.props.keyboardAction(true);
    }
  }

  _keyboardDidHide = () => {
    if (this.props.keyboardAction) {
      this.props.keyboardAction(false);
    }
  }

  // on Change Functions
  onTextInputChange(text) {
    this.setState({
      textInputStatus: 'touched',
      textInputValue: text,
      isShowing: true
    });

    this.props.suggestingDataComponent(text, true);
  }

  onSubmitEdit = () => {
    this.dismissDialog();
    Keyboard.dismiss();

    if(this.props.appDataReducer.autoSuggestionRoutingData.length) {
      let item = this.props.appDataReducer.autoSuggestionRoutingData[0];
      this.setState({
        textInputStatus: 'touched',
        textInputValue: item['place_name'],
        isShowing: false
      });

      this.props.selectedSuggestionActionClick(item, this.state.revertedItem);
    } else {
      this.setState({
        textInputStatus: 'untouched',
        textInputValue: '',
        isInputLocation: false,
      });

      // Reset Status
      //this.props.selectedSuggestionActionClick(null, this.state.revertedItem);
    }
  }

  _onPressItem = (item) => {
    Keyboard.dismiss();
    this.setState({
      textInputStatus: 'touched',
      textInputValue: item['place_name'],
      isShowing: false
    });

    this.props.selectedSuggestionActionClick(item, this.state.revertedItem);
  }

  selectedFilterButton() {
    this.setState({ filterButtonbackgoundColor: this.state.filterButtonbackgoundColor === ThemeColor.WhiteColor ? ThemeColor.PrimaryColor : ThemeColor.WhiteColor });
    this.setState({ filterButtonTextColor: this.state.filterButtonTextColor === ThemeColor.SelectedColor ? ThemeColor.WHITE : ThemeColor.SelectedColor });
    this.setState({ filterButtonImage: this.state.filterButtonImage === AppImage.ic_Filter_Inactive ? AppImage.ic_Filter_Active : AppImage.ic_Filter_Inactive });
    this.props.doActionFilter();
    this.dismissDialog();
  }

  // Button Action
  clearText() {
    this.setState({
      textInputStatus: 'untouched',
      textInputValue: '',
      isInputLocation: true,
    });
    this.ref.focus();

    this.props.suggestingDataComponent('', false);
    // Reset Status
    //this.props.selectedSuggestionActionClick(null, this.state.revertedItem);
  }

  selectedExchangeLocations() {
    if (this.props.hasRoute) {
      this.setState({
        revertedItem: !this.state.revertedItem,
      });
    }
    this.props.selectedExchangeLocationsClicked();
  }

  backActionClicked() {
    this.props.backActionClicked();
  }

  selectedFilterButton() {
    this.setState({ filterButtonbackgoundColor: this.state.filterButtonbackgoundColor === ThemeColor.WhiteColor ? ThemeColor.PrimaryColor : ThemeColor.WhiteColor });
    this.setState({ filterButtonTextColor: this.state.filterButtonTextColor === ThemeColor.SelectedColor ? ThemeColor.WHITE : ThemeColor.SelectedColor });
    this.setState({ filterButtonImage: this.state.filterButtonImage === AppImage.ic_Filter_Inactive ? AppImage.ic_Filter_Active : AppImage.ic_Filter_Inactive });
    this.props.doActionFilter();
    this.dismissDialog();
  }

  // Private Functions
  dismissDialog() {
    if (this.state.isShowing) {
      this.setState({
        isShowing: false
      });
    }
  }
  
  calculatingHeightSuggestionView(data) {
    contentHeight = data.length * 56;
    return data.length >= 3 ? 150 : contentHeight;
  }

  getTitle(item) {
    return item.name;
  }
  getRouteImage() {
    if (!this.props.startLocation || !this.props.endLocation) {
      return AppImage.ic_Route;
    }

    if (this.props.startLocation.isCurrentLocation) {
      return this.props.endLocation.isSelected ? AppImage.ic_Route : AppImage.ic_Route_NotSelected;
    }
    return this.props.startLocation.isSelected ? AppImage.ic_Route_Invert : AppImage.ic_Route_Invert_NotSelected;
  }

  // Render Functions
  _keyExtractor = (item, index) => index + ''
  _renderItem = ({ item, index }) => (
    <AutoSuggestView
      item={item}
      onPressItem={this._onPressItem}
      islastItem={index == (this.props.appDataReducer.autoSuggestionRoutingData.length - 1)}
    />
  );ß

  renderInputLocation() {
      return (<TextInput
        ref={ref => (this.ref = ref)}
        onFocus={() => this.setState({ isShowing: true })}
        value={this.state.textInputValue}
        onChangeText={(text) => this.onTextInputChange(text)}
        placeholder="Input Location"
        placeholderTextColor={'#53565A'}
        style={[this.state.revertedItem ? ( Platform.OS == 'android' ? styles.TextInputAndroidStyleRevert : styles.TextInputStyleRevert) : ( Platform.OS == 'android' ? styles.TextInputAndroidStyle : styles.TextInputStyle) , !this.state.isInputLocation ? {height: 1, marginTop: -88 } : {flex:1}]}
        onSubmitEditing={this.onSubmitEdit}
      />);
  }

  renderClearButton() {
      return (
        <Image style={styles.DeleteIconStyle} source={AppImage.ic_Delete} />
      );
  }

  render() {
    const data = ( this.props.appDataReducer.autoSuggestionRoutingData && this.props.appDataReducer.autoSuggestionRoutingData.length > 0) ? this.props.appDataReducer.autoSuggestionRoutingData : [];
    return (
      <View style={styles.containerViewParent}>
        <View style={styles.containerViewStyle} >
          <TouchableOpacity onPress={() => this.backActionClicked()} style={styles.containerLeftButtonViewStyle} >
            <View style={styles.containerOtherView} >
              <Image style={styles.ImageIconStyle} source={AppImage.ic_Menu_Back} />
            </View>
          </TouchableOpacity>
          <View style={styles.containerTextViewStyle} >
            <View style={styles.containerLeftOtherView} >
              <Image style={styles.ImageLocationIconStyle} source={this.getRouteImage()} />
            </View>
            <View style={styles.containerTextOtherView} >

              <Text numberOfLines={1} style={[styles.textStyle, { paddingLeft: 12, paddingTop: 14, flex: 1 }]}>{this.getTitle(this.props.startLocation)}</Text>
              <Text numberOfLines={1} style={[styles.textStyle, { paddingLeft: 12, paddingBottom: 12 }]}>{this.getTitle(this.props.endLocation)}</Text>
              {this.renderInputLocation()}

              <TouchableOpacity onPress={() => this.clearText()} style={this.state.revertedItem ? styles.containerDeleteButtonViewStyleRevert : styles.containerDeleteButtonViewStyle} >
                  {this.renderClearButton()}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => this.selectedExchangeLocations()} style={styles.containerRightButtonViewStyle} >
            <View>
              <Image style={styles.ImageIconStyle} source={AppImage.ic_Invert} />
            </View>
          </TouchableOpacity>
        </View>
        {
          (data.length > 0 && this.state.isShowing) &&
          <View style={[styles.parentViewAuto, { height: this.calculatingHeightSuggestionView(data) }]}>
            <LinearGradient colors={['#ededed', '#ffffff']} style={{ width: '100%', height: 14 }}></LinearGradient>
            <FlatList
              keyboardShouldPersistTaps='always'
              style={{ width: '100%', height: '100%', top: 0, position: 'absolute' }}
              data={data}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </View>
        }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    appDataReducer: state.searchReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    searchingData: (params) => dispatch(searchActions.onSearchFetching(params)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartEndRouteView);

StartEndRouteView.propTypes = {
  selectedSuggestionActionClick: PropTypes.func,
  backActionClicked: PropTypes.func,
  selectedExchangeLocationsClicked: PropTypes.func,
  startLocation: PropTypes.any,
  endLocation: PropTypes.any,
  doActionClicked: PropTypes.func,
};