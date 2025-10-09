import React, { useState, useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";

export const CameraComponent = () => {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="h-[200px] w-[300px]">
      {/*<Camera ref={camera} aspectRatio={"cover"} />
      <button
        onClick={() => {
          if (camera.current) {
            const photo = camera.current.takePhoto();
            console.log(photo);
            setImage(photo);
          }
        }}
      >
        Take photo
      </button>
      <img src={image} alt="Taken photo" />*/}
    </div>
  );
};
