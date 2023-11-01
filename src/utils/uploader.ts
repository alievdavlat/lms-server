import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { giveCurrentDateTime } from "./dateTime"; 
import config from '../config/firebase.config'
import { ErrorHandler } from "./ErrorHandler";

initializeApp(config.firebaseConfig);

const storage = getStorage();



const uploadToCloud = async (file, dist : string) => {
       const dateTime = giveCurrentDateTime();

      const storageRef = ref(storage, `${dist}/${file.originalname + "   " + dateTime}`);


      const metadata = {
        contentType: file.mimetype,
      };


      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

      const downloadURL = await getDownloadURL(snapshot.ref);
     
      return  downloadURL
  
      
        


 
}

const removeFromCLoud = (filename:string) => {
 


    const desertRef = ref(storage, filename);

    deleteObject(desertRef).then(() => {

      

    }).catch((error) => {
  
     console.log('somthingwent wrong try again', 400)
    
    });

    return 'removed'
}


export {
  removeFromCLoud,
  uploadToCloud
}