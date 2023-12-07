import * as faceapi from "face-api.js";
export const loadModels = async () => {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ])
};
export const startVideo = async (videoRef) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;

        }

        return stream;
    } catch (error) {
        console.error("Lỗi WebCam:", error);

    }
};

export async function getDescripModule(data) {
    for (let j = 0; j < data.length; j++) {
        for (let i = 0; i < data[j].descriptors.length; i++) {
            data[j].descriptors[i] = new Float32Array(data[j].descriptors[i]);
        }
    }
    return Promise.all(
        data.map(async (data) => {
            return new faceapi.LabeledFaceDescriptors(data.label, data.descriptors)
        })
    )

}

export async function convertDataToJsonFaceApi(base64List, label) {
    const descriptions = [];
    await Promise.all(
        base64List.map(async (data) => {
            const img =await faceapi.fetchImage(data);
           
            const detections = await faceapi.detectSingleFace(img)
                .withFaceLandmarks().withFaceDescriptor()
            descriptions.push(detections.descriptor);

        })
    );
    return new faceapi.LabeledFaceDescriptors(label, descriptions)

}