import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth, upload, db } from '../../firebase-config';
import { auth } from "../../firebase-config";

const ProfilePic=({isEditable=true})=> {
  const currentUser = useAuth();
  const [user,setUser]=useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
      console.log(typeof(photo))
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }

  useEffect(() => {
    if (!user){
      auth.onAuthStateChanged(user=>{
        setUser(user)
      })}
    else if (user) {
      const docRef=doc(db,'users',user.email)
      const docSnap=getDoc(docRef).then(doc=>{
        setPhotoURL(doc.data().imageUrl)
      })
    }
  }, [loading,user])


  return (



<div>
		<div>
    <div class="py-5 flex space-x-2">
					<div class=" flex flex-col items-center w-full">
            <img class="h-24 w-24 md relative avatar flex items-end justify-end min-w-max absolute -top-16 flex row-end-3 " src={(photo)?URL.createObjectURL(photo):photoURL} alt="Avatar" className="avatar" />
							<div class="absolute">
						</div>
						<div class="flex flex-col space-y-10 justify-center items-center -mt-12 w-full">
            <span class=""></span><span class=""></span>
							{(isEditable)?<div class="py-2 flex space-x-2">
								<button class="flex rounded justify-center max-h-max  focus:outline-none  focus:ring  ounded max-w-max text-gray-900 bg-amber-300 hover:bg-amber-400 px-4 py-1 flex items-center"disabled={loading || !photo} onClick={handleClick}>Upload</button>
                <input type="file" class="form-control
                    w-full
                    align-top
                    px-2
                    py-1
                    text-sm
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                    onChange={handleChange} accept=".png,.jpg,.jpeg"/>                   
              </div>:null}
              </div>

				</div>
        </div>

			</div>
		</div>
  );
}

export default ProfilePic