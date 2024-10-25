import React, { useState, useEffect } from 'react';
import './FaceRecognition.scss';

import axios from 'axios';
// Utility functions
import blobToBase64 from '../../../util/blobToBase64';
// 'Save to Device' button
import saveToDevice from '../../../util/saveToDevice';

import Loading from '../../Loading/Loading';
import '../../../sass/base/_utilities.scss';

// Parent component
// src/components/Home/Home.jsx
const FaceRecognition = ({ 
  user, 
  input, 
  imageUrl, 
  box, 
  celebrityName, 
  face_hidden,
  onRouteChange
}) => {
    const [imageBlob, setImageBlob] = useState(''); // Blob { size: Number, type: String, userId: undefined }
    const [resData, setResData] = useState('');
    // Keep tracking response.status.code as a number
    // Allow to be passed to other/child components
    // Allow other components to reset latest response.status.code
    const [responseStatusCode, setResponseStatusCode] = useState();

    // Keep monitoring Blob fetched from axios.get(imageUrl, { responseType: 'blob' })
    useEffect(() => {
        const fetchImage = async() => {
          const fetchUrl = input;
          const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    
          try {
            const response = await axios.get(`${proxyUrl}${fetchUrl}`, { responseType: 'blob' });
            console.log(`\nReceived metadata blob response:`, response, `\n`);
    
            const reader = new FileReader();
            reader.onloadend = () => {
              // useState() to store this.state.imageBlob: response.data
              setImageBlob(reader.result);
            };
            reader.readAsDataURL(response.data);
            setResData(response.data);
            console.log(`\nresponse.data:\n$`, response.data, `\n`);
          } catch (err) {
            console.error(`\nFailed to get 'blob' via axios.get(${fetchUrl}\nError: ${err}\n`);
          }
        };
        fetchImage();
    }, [input]); // State management array[] to listen on imageUrl

    /* For saving Celebrity record to User's local machine using Puppeteer */
    const htmlToSave =  document.querySelector('.face-inner') ? document.querySelector('.face-inner').outerHTML : null;

    /* 1. Save to Account button to save Color details into PostgreSQL as blob metadata */
    const saveCelebrity = async () => {
      // Reset latest response.status.code before next action
      // setResponseStatusCode(undefined);

      const callbackName = `src/components/AIRecognition/ColorRecognition/ColorDetails/ColorDetails.jsx\nsaveFace = async () => {...}`;
      
      const devSaveColorUrl = 'http://localhost:3001/records/save-user-celebrity';
      const prodSaveColorUrl = 'https://ai-recognition-backend.onrender.com/records/save-user-celebrity';
      const fetchUrl = process.env.NODE_ENV === 'production' ? prodSaveColorUrl : devSaveColorUrl;

      // Assuming resData is the Blob
      const base64Metadata = await blobToBase64(resData);

      if (!base64Metadata) {
        // If Blob cannot be transformed in base64Metadata => route to 'home' page
        onRouteChange('home');
      }
        
      const bodyData = JSON.stringify({ 
          userId: user.id, 
          celebrityName: celebrityName,
          imageUrl: input,
          imageBlob: imageBlob,
          metadata: base64Metadata,
          dateTime: new Date().toISOString()
      });
      console.log(`\nFaceRecognition saveCelebrity() resData: `, resData, `\n`);
      console.log(`\nFaceRecognition saveCelebrity() user.id: `, user.id, `\n`);
      console.log(`\nFaceRecognition saveCelebrity() input: `, input, `\n`);
      console.log(`\nFetching ${fetchUrl} with bodyData`, bodyData, `\n`);

      await fetch(fetchUrl, {
      method: 'post', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // sending stringified this.state variables as JSON objects
          userId: user.id,
          celebrityName: celebrityName,
          imageUrl: input,
          imageBlob: imageBlob,
          metadata: base64Metadata,
          dateTime: new Date().toISOString()
      })
      })
      .then((response) => response.json())
      .then((response) => {
      console.log(`\nFaceRecognition saveCelebrity() response: `, response, `\n`);
      console.log(`\nFaceRecognition saveCelebrity() response.message: `, response.message, `\n`);
      console.log(`\nFaceRecognition saveCelebrity() response.status.code: `, response.status.code);

      // Keep tracking response.status.code
      setResponseStatusCode(response.status.code);
      console.log(`\n\nsrc/components/FaceRecognition/FaceRecognition.jsx\nLatest action\nresponse.status.code:\n${responseStatusCode}\n`);

      })
      .catch((err) => {
      console.error(`\nError in callbackName:\n`, callbackName, `\n\nError: `, err, `\n`);
      })
      ;
    }

    const showModal = () => {
      // Retrieve DOM element of modal-face pop-up upon users' copy events
      const modal = document.querySelector('.modal-face');
          
      modal.style.opacity = 1;
     
      setTimeout(() => modal.style.opacity=0, 2000)
    }

    // if (!celebrityName) return <Loading />;

    if (face_hidden) return;

    return (
      <React.Fragment>
        <div className="face-recognition u-margin-top-medium">
          <div className="container">
            <div className="face-inner">
              <div className="image-box">
                <img
                // id='face-image' is used for DOM manipulation
                // cannot be edited
                id='face-image'
                // style={{
                //   marginTop: '5vh'
                // }}
                src={imageUrl}
                alt="Ooops...It seems the entered URL is BROKEN...Please enter a working URL starting with 'https' in .jpg format"
                /> 
              </div>
              
              <div 
                className={celebrityName ? "bounding-box" : ""}
                style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
                }}
              >
              {/* Create a button to show Celebrity name && 
                allow users to google search it for comparison 
                on a new browser window*/}
                <div className="celebrity-container">
                  <button 
                    className=
                    {celebrityName ? "celebrity-name": "invisible"}
                    onClick={() => 
                      window.open(`https://www.google.com/search?q=${celebrityName}`, '_blank')}
                  >
                    {celebrityName}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className='modal-face'>
            <h1 class='modal-face--inner'>
              {responseStatusCode === 200 ? 'Processed!' : 'Failed action' }
            </h1>
          </div>

          {/* Save to Account button */}
          <div className="saveBtn u-margin-top-small">
            <button 
              className="saveBtn__p"
              onClick={() => { saveCelebrity(); showModal();} } // ColorDetails.jsx saveColor()
            >
              Save to Account
            </button>
          </div>
          {/* Save to Device button */}
          <div className="saveBtn u-margin-top-tiny  u-margin-bottom-small">
            <button 
              className="saveBtn__p"
              onClick={() => { saveToDevice(htmlToSave); setResponseStatusCode(200); showModal();} } 
            >
              Save to Device
            </button>
          </div>
        </div>
      </React.Fragment>
    )

    // return face_hidden ? (
    // <h2>&nbsp;</h2>
    // ) : ( 
    // <React.Fragment>
    //     <div className="face-recognition">
    //       <div className="container">
    //         <div className="face-inner">
    //           <div className="image-box">
    //             <img
    //             // id='face-image' is used for DOM manipulation
    //             // cannot be edited
    //             id='face-image'
    //             style={{
    //               marginTop: '5vh'
    //             }}
    //             src={imageUrl}
    //             alt="Ooops...It seems the entered URL is BROKEN...Please enter a working URL starting with 'https' in .jpg format"
    //             /> 
    //           </div>
              
    //           <div 
    //             className={celebrityName ? "bounding-box" : ""}
    //             style={{
    //             top: box.topRow,
    //             right: box.rightCol,
    //             bottom: box.bottomRow,
    //             left: box.leftCol,
    //             }}
    //           >
    //           {/* Create a button to show Celebrity name && 
    //             allow users to google search it for comparison 
    //             on a new browser window*/}
    //             <div className="celebrity-container">
    //               <button 
    //                 className=
    //                 {celebrityName ? "celebrity-name": "invisible"}
    //                 onClick={() => 
    //                   window.open(`https://www.google.com/search?q=${celebrityName}`, '_blank')}
    //               >
    //                 {celebrityName}
    //               </button>
    //             </div>
    //           </div>

    //         </div>
    //       </div>

    //       <div className='modal-window'>
    //         <h1 class='modal-window--inner'>
    //           {responseStatusCode === 200 ? 'Processed!' : 'Failed action' }
    //         </h1>
    //       </div>

    //       {/* Save to Account button */}
    //       <div className="saveBtn u-margin-top-small">
    //         <button 
    //           className="saveBtn__p"
    //           onClick={() => { saveCelebrity(); showModal();} } // ColorDetails.jsx saveColor()
    //         >
    //           Save to Account
    //         </button>
    //       </div>
    //       {/* Save to Device button */}
    //       <div className="saveBtn u-margin-top-tiny">
    //         <button 
    //           className="saveBtn__p"
    //           onClick={() => { saveToDevice(htmlToSave); showModal();} } 
    //         >
    //           Save to Device
    //         </button>
    //       </div>
    //     </div>
    // </React.Fragment>
    // )
}
export default FaceRecognition;
