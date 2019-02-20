import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };
  constructor(props){
    super(props);
    cameraRef = React.createRef();
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  handlePhoto = async () => {
    try{  
    if(this.cameraRef){
      const options = { quality: 1, base64: true, fixOrientation: true, 
        exif: true};
      await this.cameraRef.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1;            
         console.log(photo);          
         this.props.setImage(photo.uri);    
         }); 
    }}
    catch(err){
      console.log(err);
    }  
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ (ref) => {this.cameraRef = ref} } style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ position: 'absolute', bottom: 10, left:"40%", width:60, height:60, borderRadius:30, backgroundColor:"#fff"}} 
                onPress={this.handlePhoto} />
            </View>
          </Camera>
        </View>
      );
    }
  }
}