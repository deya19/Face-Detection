import React, { useState } from "react";
import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
  const { url, width, height } = image;
  const [faces,setFaces] = useState([]);
  const [friends,setFriends] = useState([]);

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions());
       setFaces(detections.map((d) =>Object.values(d.box))) //get the x y width hieght
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle="yellow";
    faces.map(face=>ctx.strokeRect(...face)); // give every dimention
  }

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


  const addFriend = (e) =>{
    setFriends(prev=>({...prev, [e.target.name]:e.target.value}))
  }

  console.log(friends);

  return (
    <div className="container">
      <div className="left" style={{width,height}}>
        <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
        <canvas ref={canvasRef} onMouseEnter={enter} width={width} height={height}/>
        {faces?.map((face, i) => (
          <input
            name={`input${i}`}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            style={{left:face[0],top:face[1]+face[3]+5}}
            onChange={addFriend}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input 
        type="text" 
        placeholder="What's on your mind?"
        className="rightInput"
        />
        {friends && (
          <span className="friends">
            with <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )}
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost;
