import React from 'react';
import { TouchableOpacity,
    Text,
    View,
    AsyncStorage,
    KeyboardAvoidingView,ScrollView, Dimensions, Image, Picker, Platform
    } from 'react-native';
import { LinearGradient, MapView,  Location, Permissions } from 'expo';
import {Input, FullModal} from './common';
import {colors} from './../utils/colors';
import CameraExample from './CameraComponent';
import firebase from 'firebase'
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class MainComponent extends React.Component {
    state = {
        region: null,
        selectedIndex: null,
        height: 100,
        hasLocationPermissions: false,
        locationResult: null,
        imageURI:'https://images.unsplash.com/photo-1497704009475-24f74754c24e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        showCamera: false,
        saveEnabled: true,
        customerName:'',
        companyName:'',
        contactNumber1:'',
        contactNumber2:'',
        details:'',
        usingProduct: 'Java',
        neededProduct: 'Java'
    };

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            locationResult: 'Permission to access location was denied',
          });
          return;
        } else {
          this.setState({ hasLocationPermissions: true });
        }
        navigator.geolocation.getCurrentPosition((position) =>{
            if(position){
                console.log(position);
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                })
            }});
        };
     
    componentDidMount() {
        this._getLocationAsync();
    };
    handleScrollEnd(event: Object){
        event.persist();
    }
    _setImage = (imageURI)=>{
        this.setState({imageURI, showCamera: false})
    }
    _saveData = () => {
        const {customerName,
            companyName, 
            contactNumber1, 
            contactNumber2, 
            details, 
            usingProduct, 
            neededProduct, region, imageURI } = this.state;
        firebase
            .database()
            .ref('/find_location')
            .push({customerName,
                companyName, 
                contactNumber1, 
                contactNumber2, 
                details, 
                usingProduct, 
                neededProduct, 
                region, 
                imageURI })
            .then(_=>console.log('save successfully'))
            .catch(err=>console.log(err));
    }

    _setTextValue = (prop, value) => {
        this.setState({[prop]: value});
    }
    _renderContent = () => {
        if(this.state.showCamera){
            return  <CameraExample setImage={this._setImage}/>
        }
        return (
            <KeyboardAvoidingView 
                behavior="padding" 
                style={[styles.container,{paddingTop: 0}]}
                keyboardVerticalOffset= {
                Platform.select({
                   ios: () => 25,
                   android: () => 200
                })()} >
            <ScrollView 
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={true}
                snapToInterval={CARD_WIDTH}
                onScrollEndDrag={this.handleScrollEnd}
                style={styles.scrollView}
                contentContainerStyle={styles.endPadding}
                style={[{width: '100%'}]}>
                
                <View style={styles.brandName}>
                    <Text style={styles.brandHeading}>
                    Find Location
                    </Text>
                </View>
                    <Text style={styles.textStyle}>Let's take a picture</Text>
                    {/* <Image style={{height: "30%", width: "80%" }}  source={{uri: this.state.imageURI}}/> */}
                    <TouchableOpacity
                        onPress= {() => {this.setState({showCamera: true})}}
                        style={{height: "50%", width: "80%" }} 
                    >
                    <Image style={{height: "100%", width: "100%" }}  source={{uri: this.state.imageURI}}/>
                    </TouchableOpacity>
                    <Input
                        placeholder="Enter your name"
                        placeholderTextColor={colors.placeholderColor}
                        onChangeText={value => this._setTextValue('customerName', value)}
                        style={styles.input}
                        value={this.state.customerName}
                    />
                    <Input
                        placeholder="Enter company name"
                        onChangeText={value => this._setTextValue('companyName', value)}
                        value={this.state.companyName}
                        placeholderTextColor={colors.placeholderColor}
                    />
                    <Input
                        placeholder="Enter your contact number"
                        onChangeText={value => this._setTextValue('contactNumber1', value)}
                        value={this.state.contactNumber1}
                        placeholderTextColor={colors.placeholderColor}
                    />
                    <Input
                        placeholder="Enter your contact number  2"
                        onChangeText={value => this._setTextValue('contactNumber2', value)}
                        value={this.state.contactNumber2}
                        placeholderTextColor={colors.placeholderColor}
                    />
                    <Input
                        placeholder="Enter Details"
                        onChangeText={value => this._setTextValue('details', value)}
                        placeholderTextColor={colors.placeholderColor}
                        value={this.state.details}
                    />
                    <View style={{ marginTop: 10, height: "40%", width: "80%"}}>
                        <Text style={styles.textStyle}>Using products</Text>
                        <Picker
                            selectedValue={this.state.usingProduct}
                            itemStyle={{color:colors.inputBorderColor}}
                            style={{ borderWidth: 1,color:'red', borderColor:colors.inputBorderColor, height: 2, width: "100%", flex: 1 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({usingProduct: itemValue})}>
                            <Picker.Item style={{color:colors.inputBorderColor,}} label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker>
                    </View>
                    <View style={{ marginTop: 10, marginBottom: 10,height: "40%", width: "80%"}}>
                        <Text style={styles.textStyle}>Needed products</Text>
                        <Picker
                            selectedValue={this.state.neededProduct}
                            style={{ borderWidth: 1,color:'red', borderColor:colors.inputBorderColor, height: 2, width: "100%", flex: 1 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({neededProduct: itemValue})}
                            itemStyle={{color:colors.inputBorderColor}}
                            >
                            <Picker.Item  label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker>
                    </View>
                    <Text style={styles.textStyle}>Location</Text>
                    <MapView
                        initialRegion={this.state.region}
                        showsUserLocation={true}
                        style={{ height: "30%", width: "80%", marginBottom: 5}}
                    >
                    <MapView.Marker key={'default'} coordinate={this.state.region} /> 
                    </MapView>
                    
                </ScrollView>
                </KeyboardAvoidingView>
        );
    }
    render() {
        let screenHeight = Dimensions.get('window').height;
        return(
            <LinearGradient
            colors={colors.gradientColor}
            style={styles.container}>
            <View style={{ width: '100%', height: (screenHeight - this.state.height)}}>
                {this._renderContent()}
            </View>
           
            <TouchableOpacity
                onPress= {this._saveData}
                style= {[styles.buttonStyle]}
                // disabled={this.state.saveEnabled}

            >
                <Text style={styles.textStyle}>
                    Save Record
                </Text>
            </TouchableOpacity>
            <FullModal visible={false}>
            </FullModal>
            </LinearGradient>
        )
    }


}


const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column',
    }, buttonStyle : {
        width: "80%",
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.inputBorderColor,
        marginTop: 20,
        fontSize: 18,
        backgroundColor: colors.inputTextColor
    },
    textStyle: {
        alignSelf: 'center',
        color: '#396358',
        fontSize: 18,
        fontWeight: '600',
    },
    endPadding: {
        paddingBottom: height+100,
        paddingTop: 20,
        alignItems: 'center'
    },
    brandHeading: {fontSize: 20, color: colors.inputBorderColor},
    brandName: {
        width: "80%",
        height: 50,
        alignItems: 'center',
        borderWidth: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 10,
        borderColor: colors.inputBorderColor,
        justifyContent: 'center',
        padding: 2,
        marginBottom: 5
    }
}
export default MainComponent;