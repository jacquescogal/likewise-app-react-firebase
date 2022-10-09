import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, upload, db } from '../../firebase-config';
import { auth } from "../../firebase-config";

export default function ProfilePic() {
  const currentUser = useAuth();
  const user=auth.currentUser
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }

  useEffect(() => {
    if (user) {
      const docRef=doc(db,'users',user.email)
      const docSnap=getDoc(docRef).then(doc=>{
        console.log('hello')
        console.log(doc.data())
        setPhotoURL(doc.data().imageURL)
      })
    }
  }, [loading])


  return (
    <div className="fields">
      <img src={photoURL} alt="Avatar" className="avatar" />
      <br></br><br></br>
      <input type="file" onChange={handleChange} />
      <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
      
    </div>
  );
}