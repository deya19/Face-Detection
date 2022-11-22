import { useEffect, useRef } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

      
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
      faceapi.matchDimensions(canvasRef.current,{
        width:940,
        height:650,
      })
      
      const resized = faceapi.resizeResults(detections,{
        width:940,
        height:650,
      });

       // opreation in face
      faceapi.draw.drawDetections(canvasRef.current,resized) // to put square in face
      faceapi.draw.drawFaceExpressions(canvasRef.current,resized)// to see happy ,.....
      faceapi.draw.drawFaceLandmarks(canvasRef.current,resized) // to put marks in face
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"), //to know who this person
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };
    imgRef.current && loadModels();
  }, []);

  

  return (
    <div className="app">
      <img
        crossOrigin="anonymous"
        ref={imgRef}
        src="https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        alt=""
        width="940"
        height="650"
      />
      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default App;
