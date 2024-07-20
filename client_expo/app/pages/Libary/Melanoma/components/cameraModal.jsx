
import { Modal } from "react-native";
import CameraScreenView from "./cameraView";

export const CameraViewModal = ({
    isCameraOverlayVisible,
    toggleCameraOverlay,
    setUploadedSpotPicture
}) => {
    return(
        <Modal visible={isCameraOverlayVisible} animationType="slide">
            <CameraScreenView
                onClose={() => toggleCameraOverlay("back")}
                onPictureTaken={(pictureUri) => {
                    setUploadedSpotPicture(pictureUri);
                    toggleCameraOverlay("finish");
                }}
            />
        </Modal>
    )
}