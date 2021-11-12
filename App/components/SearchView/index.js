import React from 'react';
import { View ,TouchableOpacity, Image, Button, TextInput,FlatList,Keyboard } from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import { Text } from 'native-base';
import AppImage from '@ThemeImage';
import ThemeColor from '@ThemeColor';
import AppString from '@String';
import CommonUtils from '@CommonUtils';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import AutoSuggestView from '@Compontent/AutoSuggestView';
import LinearGradient from 'react-native-linear-gradient';

class SearchView extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      filterButtonbackgoundColor: ThemeColor.WhiteColor,
      filterButtonTextColor: ThemeColor.SelectedColor,
      filterButtonImage: AppImage.ic_Filter_Inactive,
      textInput1Status: 'untouched',
      textInput1Value: '',
      isShowing:true
    };
    this._onPressItem = this._onPressItem.bind(this);
  }
  onTextInput1Change(text) {
    this.setState({
      textInput1Status: 'touched',
      textInput1Value: text,
      isShowing:true
    });

    this.props.suggestingDataComponent(text,true);
  }

  clearText() {
    this.setState({
      textInput1Status: 'untouched',
      textInput1Value: '',
    });
    this.props.searchingDataComponent('',false,false,this.state.isShowing);
  }

  selectedFilterButton() {
    this.setState({ filterButtonbackgoundColor: this.state.filterButtonbackgoundColor === ThemeColor.WhiteColor ? ThemeColor.PrimaryColor : ThemeColor.WhiteColor });
    this.setState({ filterButtonTextColor: this.state.filterButtonTextColor === ThemeColor.SelectedColor ? ThemeColor.WHITE : ThemeColor.SelectedColor });
    this.setState({ filterButtonImage: this.state.filterButtonImage === AppImage.ic_Filter_Inactive ? AppImage.ic_Filter_Active : AppImage.ic_Filter_Inactive });
    this.props.doActionFilter();
    this.dismissDialog();
  }

  renderClearButton() {
    if (this.state.textInput1Status == 'touched' && this.state.textInput1Value != '') {
      return (
            <Image style={styles.DeleteIconStyle} source={AppImage.ic_Delete} />
      );
    } else {
      return <View></View>;
    }
  }
  componentDidMount()
  {
    const { childRef } = this.props;
    childRef(this);
  }

  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  searchResultWithActionDone()
  {
    console.log('searchResultWithActionDone Text')

    this.props.searchingDataComponent(this.state.textInput1Value,false,false,true);
  }
  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  _keyboardDidShow = () => {
    this.props.keyboardAction(true);
  }

  _keyboardDidHide = () => {
    this.props.keyboardAction(false);
  }
  
  dismissDialog()
  {
    if (this.state.isShowing) {
      this.setState({
        isShowing:false
      });
    }

  }
  onSubmitEdit = () => {
    console.log('onSubmitEdit')
    this.dismissDialog();
    Keyboard.dismiss();
    this.props.searchingDataComponent(this.state.textInput1Value,false,true,true);
    
  }
  _onPressItem = (item) =>
  {
    Keyboard.dismiss();
    this.setState({
      textInput1Status: 'touched',
      textInput1Value: item,
      isShowing:false
    });
    this.props.searchingDataComponent(item,false,false,true);
  }
  _keyExtractor = (item, index) => index + ''
  _renderItem = ({ item,index }) => (
   <AutoSuggestView
     item={item}
     onPressItem={this._onPressItem}
     islastItem = {index == (this.props.appDataReducer.autoSuggestionData.length - 1)}
   />
 );

 calculatingHeightSuggestionView(data) {
   contentHeight = data.length * 56;
   return data.length >= 3 ? 150 : contentHeight;
 }

  render() {
    const data = ( this.props.appDataReducer.autoSuggestionData && this.props.appDataReducer.autoSuggestionData.length > 0) ? this.props.appDataReducer.autoSuggestionData : [];
    return (
      <View style = {styles.containerViewParent}>
        <View style={styles.containerViewStyle} >

        <TouchableOpacity style={styles.containerLeftButtonViewStyle} >
          <View style={styles.containerOtherView} >
            <Image style={styles.ImageSearchIconStyle} source={AppImage.ic_Search} />
          </View>
        </TouchableOpacity>
        <View style={styles.containerBackgroundSearchViewStyle} ></View>
          <View style={styles.containerLeftOtherView} >
            <Image style={styles.ImageLocationIconStyle} source={AppImage.ic_My_Location} />
          </View>
          <TextInput
            onFocus={() => this.setState({isShowing:true})}
            value={this.state.textInput1Value}
            onChangeText={(text) => this.onTextInput1Change(text)}
            placeholder="Enter location"
            placeholderTextColor= {ThemeColor.DistanceItemColor}
            style={styles.TextInputStyle}
            onSubmitEditing={this.onSubmitEdit}
          />

          <TouchableOpacity onPress={() => this.clearText()} style={styles.containerDeleteButtonViewStyle} >
            <View style={styles.containerLeftOtherView} >
            {this.renderClearButton()}
            </View>
            </TouchableOpacity>

        <TouchableOpacity onPress={() => this.selectedFilterButton()} style={[styles.containerRightButtonViewStyle, { backgroundColor: this.state.filterButtonbackgoundColor }]} >
          <View>
            <Image style={styles.ImageIconStyle} source={this.state.filterButtonImage} />
          </View>
          <Text style={[styles.filterTextInput,{color: this.state.filterButtonTextColor}]}>{AppString.Filter_Button_string}</Text>
        </TouchableOpacity>
        <View style={{backgroundColor:'black', position:'absolute', right:44, left: 44}}></View>
        </View>
        {
          ( data.length > 0 && this.state.isShowing ) &&
          <View style = {[styles.parentViewAuto,{height:this.calculatingHeightSuggestionView(data)}]}>
            <LinearGradient colors={['#ededed', '#ffffff']} style={{width:'100%',height:14}}></LinearGradient>
            <FlatList
              keyboardShouldPersistTaps='always'
              style = {{width:'100%',height:'100%',zIndex:2,top:0,position:'absolute'}}
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
    selectedIndex: state.searchReducer.selectedIndex
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
)(SearchView);
SearchView.propTypes = {
  doActionClicked: PropTypes.func,
};
