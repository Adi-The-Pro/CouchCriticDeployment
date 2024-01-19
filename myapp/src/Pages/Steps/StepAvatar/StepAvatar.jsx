import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../../Componenets/Card/Card";
import Button from "../../../Componenets/Button/Button";
import { setAvatar } from "../../../store/activateSlice";
import styles from './StepAvatar.module.css';
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../Componenets/Loader/Loader";

export default function StepAvatar({ onNext }) {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { name , avatar} = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/Ellipse 5.png");
  const [loading,setLoading] = useState(false);
  function onClick() {
    inputRef.current.click();
  }

  async function captureImage(e) {
    //Reading File In Base-64 Format Which then can directly be on the site
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        setImage(reader.result);
        dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if(!name || !avatar) return;
    setLoading(true);
    try{
      const {data} = await activate({name:name,avatar:avatar});
      if(data.auth){
        dispatch(setAuth(data));
      }
      console.log(data); 
    }
    catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

  if(loading){
    return <Loader message='Activation in progress...'></Loader>
  }
  return (
    <div className="flex justify-center mt-20 ">
      <Card title={`Okay, ${name}`} icon="monkey">
        <p className="text-gray-500 text-sm max-w-sm mb-4">How’s this photo?</p>

        <div className=" flex justify-center mb-3">
          <img
            className={styles.avatarWrapper}
            src={image}
            alt="profile-pic"
          ></img>
        </div>

  {/*Taking the avatar input here after which we using the web features to convert into a format which is acceptable by our frontend */}
        <input
          onChange={captureImage}
          type="file"
          ref={inputRef}
          className="hidden"
        ></input>
        <label onClick={onClick} className="text-blue-300 cursor-pointer">
          Choose a different photo
        </label>

        <div className="mt-5">
          <Button text="Next" onClick={submit}></Button>
        </div>
      </Card>
    </div>
  );
}
