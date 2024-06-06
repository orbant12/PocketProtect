import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState,useEffect,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import LoadingOverlay  from "../../../../components/Loading/processing"
import { manipulateAsync } from 'expo-image-manipulator';

export default function CameraScreenView({navigation}) {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [ zoomValue, setZoomValue ] = useState(0)
    const [uploadedSpotPicture, setUploadedSpotPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null)
    const [ show, setShow ] = useState(false)

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {        
      requestPermission()
    }


    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handlePictureUpload = async() => {      
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled) {
          setUploadedSpotPicture(result.assets[0].uri);
          setShow(true)
      }
    };

    const takePicture = async () => {
      if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync();
          const editedPhoto = await manipulateAsync(photo.uri, [], { format: 'jpeg', compress: 1, base64: false });
          setUploadedSpotPicture(editedPhoto.uri);
          setShow(true)
      }
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate a network request
  };

  const handleUndoPicture = () => {
    setShow(false)
  }

      return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} zoom={zoomValue} ref={cameraRef}>
              
                  <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute",top:30,left:10,borderWidth:2,borderColor:"white",borderRadius:30,padding:5}}>
                  <MaterialCommunityIcons 
                    name='arrow-left'
                    color={"white"}
                    size={25}                
                  />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute",top:30,right:10,borderWidth:0,borderColor:"white",borderRadius:30,padding:5}}>
                    <MaterialCommunityIcons 
                      name='information'
                      color={"white"}
                      size={30}                
                    />
                  </TouchableOpacity>
                  <View style={{width:300,height:300,borderWidth:5,backgroundColor:"transparent",borderColor:"magenta",borderRadius:20}} />
                  <Slider
                    style={{width: 200, height: 40,marginTop:50}}
                    minimumValue={0}
                    maximumValue={0.5}
                    minimumTrackTintColor="magenta"
                    maximumTrackTintColor="#000000"
                    value={zoomValue}
                    onValueChange={(value) => setZoomValue(value)}
                  />
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={handlePictureUpload}>
                          <MaterialCommunityIcons 
                            name='image'
                            color={"white"}
                            size={25}                
                          />
                      </TouchableOpacity>
                      <TouchableOpacity style={{padding:15,borderWidth:2,borderColor:"white",borderRadius:100}} onPress={takePicture}>
                          <MaterialCommunityIcons
                            name='camera-plus'
                            color={"white"}
                            size={35}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity  style={styles.button} onPress={toggleCameraFacing}>
                          <MaterialCommunityIcons 
                            name='refresh'
                            color={"white"}
                            size={25}                
                          />
                      </TouchableOpacity>
                  </View>
            </CameraView>
            <LoadingOverlay visible={loading} />
            <ImageShowcase show={show} uploadedSpotPicture={uploadedSpotPicture} handleUndoPicture={handleUndoPicture} />
        </View>
      );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center"
  },
  buttonContainer: {
    position:"absolute",
    bottom:50,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 5,    
    justifyContent:"space-between"
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export const ImageShowcase = ({uploadedSpotPicture,show,handleUndoPicture}) => {
  return(
    <>
    {show &&
    <View style={{width:"100%", height:"100%" ,backgroundColor:"rgba(0,0,0,0.95)",position:"absolute",alignItems:"center",justifyContent:"center"}}>

      <Image 
        source={{uri: uploadedSpotPicture}}
        style={{width:300,height:300,borderRadius:50}}
      />
      <TouchableOpacity style={{marginTop:80,width:"80%",justifyContent:"center",alignItems:"center",borderWidth:0,borderColor:"magenta",padding:10,borderRadius:40,flexDirection:"row",backgroundColor:"white"}}>
        <MaterialCommunityIcons 
          name='upload'
          color={"black"}
          size={30}
          style={{position:"absolute",left:10}}
        />
        <Text style={{color:"black",fontSize:20,fontWeight:"700"}}>Done</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUndoPicture} style={{marginTop:20,width:"80%",justifyContent:"center",alignItems:"center",borderWidth:1,borderColor:"white",padding:10,borderRadius:40,flexDirection:"row"}}>
        <MaterialCommunityIcons 
          name='arrow-left'
          color={"white"}
          size={30}
          style={{position:"absolute",left:10}}
        />
        <Text style={{color:"white",fontSize:20,fontWeight:"700"}}>Back</Text>
      </TouchableOpacity>
    </View>
    }
    </>
  )
}