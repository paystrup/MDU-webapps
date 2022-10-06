import React, {useState} from 'react'
import {Timestamp, collection, addDoc} from "firebase/firestore"
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage"
import { storage, db} from "./../firebaseConfig"
import { toast } from 'react-toastify'

export default function AddArticle() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  })

  const [progress, setProgress] = useState(0);

  // returns from onChange values below, takes the event and returns
  const handleChange=(e)=> {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleImageChange=(e)=> {
    setFormData({...formData, image:e.target.files[0]});
  }

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image){
      alert("Please fill all the fields")
      return;
    }

    // from firebase, takes into 2 params, 1 = storage, 2 = new folder
    // creating a new name for the img files
    const storageRef = ref(storage, `/images/${Date.now()}${formData.image.name}`);
    const uploadImage = uploadBytesResumable(storageRef, formData.image);
    
    uploadImage.on("state_changed", (snapshot) => {
      const progressPercent = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
      
      setProgress(progressPercent);
    },
    (err)=>{
      console.log(err)
    },
    ()=>{
      setFormData({
        title: "",
        description: "",
        image: "",
      })

      //adddoc is a promise
      getDownloadURL(uploadImage.snapshot.ref)
      .then((url)=> {
        const articleRef = collection(db, "articles")
        addDoc(articleRef, {
          title: formData.title,
          description: formData.description,
          imageUrl: url,
          createdAt: Timestamp.now().toDate(),
        })
        .then(()=>{
          toast("Article added successfully", {type: "success"});
          //reset progress on success
          setProgress(0)
        })
        .catch(err=> {
          toast("Error adding article", {type: "error"});
        })
      })
    }
    );
  } 


  return (
    <div className="border p-3 mt-3 bg-light" style={{position: "fixed"}}>
      <h2>Create article</h2>
      
      {/* title */}
      <label htmlFor="">Title</label>
      <input type="text" name="title" className="form-control" value={formData.title} onChange={(e)=>handleChange(e)}/>
      
      {/* description */}
      <label htmlFor="">Description</label>
      <textarea name="description" className="form-control" value={formData.description} onChange={(e)=>handleChange(e)}/>
      
      {/* image */}
      <label htmlFor="">Image</label>
      <input type="file" name="image" accept="image/*" className="form-control" onChange={(e)=>handleImageChange(e)}/>
      
      {/* progress - if progress is 0 return none */}
      {progress === 0 ? null : (
      <div className="progress">
        <div className="progress-bar progress-bar-striped mt-2" style={{width: `${progress}%`}}>
            {`uploading image ${progress}%`}
        </div>
      </div>
      )}

      <button className="form-control btn-primary mt-2" onClick={handlePublish}>Publish</button>
    </div>
  )
}