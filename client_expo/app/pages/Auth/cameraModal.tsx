import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState,useEffect,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { manipulateAsync } from 'expo-image-manipulator';
import zoomMoleImage from "../../assets/melanoma/1.png"
import molesImage from "../../assets/melanoma/2.png"
import { Overlay_1 } from '../../components/Common/overlay';
import LoadingOverlay from '../../components/Common/Loading/processing';
import { ImageShowcase } from '../Libary/Melanoma/components/cameraView';

export default function ProfileCameraScreenView({onClose,onPictureTaken}) {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
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

    const handlePictureUpload = async () => {      
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

  const handleDone = () => {
    onPictureTaken(uploadedSpotPicture)
  }


  const handleUndoPicture = () => {
    setShow(false)
  }


      return (
        <>
          <View style={styles.container}>
              <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                
                    <TouchableOpacity onPress={() => onClose()} style={{position:"absolute",top:30,left:10,borderWidth:2,borderColor:"white",borderRadius:30,padding:5}}>
                    <MaterialCommunityIcons 
                      name='arrow-left'
                      color={"white"}
                      size={25}                
                    />
                    </TouchableOpacity>
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
              <ImageShowcase show={show} uploadedSpotPicture={uploadedSpotPicture} handleUndoPicture={handleUndoPicture} handleDone={handleDone} />
          </View>
        </>
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
    fontWeight: "700",
    color: 'white',
  },
});

