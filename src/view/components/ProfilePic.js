import { useEffect, useState } from "react";
import { db, useAuth, upload } from '../../firebase-config';
import { doc, getDoc, docSnap } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'

export default function ProfilePic(image=null) {
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
  let navigate = useNavigate();
  //const docRef = doc(db, "users", currentUser.email);

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  async function handleClick() {
    await upload(photo, currentUser, setLoading);
  } 

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser])

  /*
  getDoc(docRef).then(docSnap => {
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setimageUrl({...docSnap.data().imageUrl})
      console.log('hello')
    } else {
      console.log("No such document!");
    }
  })*/



  return (
    <div className="fields">
      <img src={photoURL} alt="Avatar" className="avatar" />
      <br></br><br></br>
      <input type="file" onChange={handleChange} />
      <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
      
    </div>
  );
}