import React from 'react';
// import Rank from '../../components/Rank/Rank';
import CheckRecordsPanel from '../../components/CheckRecords/CheckRecordsPanel';
import ImageLinkForm from '../../components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from '../../components/AIRecognition/FaceRecognition/FaceRecognition';
import ColorRecognition from '../../components/AIRecognition/ColorRecognition/ColorRecognition';
import AgeRecognition from '../../components/AIRecognition/AgeRecognition/AgeRecognition';

// Parent component
// src/App.js
const Home = ( {
    isSignedIn,
    user,
    name,
    entries,
    input,
    imageUrl,
    celebrityName,
    face_hidden,
    onInputChange,
    onCelebrityButton,
    onColorButton,
    onSaveColorButton,
    onAgeButton,
    color_props,
    color_hidden,
    age,
    age_hidden,
    box,
    // 1. 'Home' page
    onHomeButton,
    // 2. 'Celebrity records' page
    onCelebrityRecordsButton,
    userCelebrityRecords,
    // 3. 'Color records' page
    onColorRecordsButton,
    userColorRecords,
    // 4. 'Age records' page
    onAgeRecordsButton,    
    userAgeRecords,
    // Callback function passed from src/App.js to allow custom onClick routing methods
    onRouteChange,
    resetUser,
    resetState 
} ) => {

    return (
        <React.Fragment>
            {/* <Logo /> */}
            {/* <Rank 
            name={name}
            entries={entries}
            /> */}
            <CheckRecordsPanel 
                user={user} 
                isSignedIn={isSignedIn} 
                onRouteChange={onRouteChange}
                resetState={resetState}
                // 1. 'Home' page
                onHomeButton={onHomeButton}
                // 2. 'Celebrity records' page
                userCelebrityRecords={userCelebrityRecords}
                onCelebrityRecordsButton={onCelebrityRecordsButton}
                // 3. 'Color records' page
                userColorRecords={userColorRecords}
                onColorRecordsButton={onColorRecordsButton}
                // 4. 'Age records' page
                userAgeRecords={userAgeRecords}
                onAgeRecordsButton={onAgeRecordsButton}
            />
            <ImageLinkForm
                onInputChange={onInputChange}
                onCelebrityButton={onCelebrityButton}
                onColorButton={onColorButton}
                onAgeButton={onAgeButton}
                face_hidden={face_hidden}
                color_hidden={color_hidden}
                age_hidden={age_hidden}
            />
            <FaceRecognition
                user={user}
                box={box}
                input={input}
                imageUrl={imageUrl}
                celebrityName={celebrityName}
                face_hidden={face_hidden}
                onRouteChange={onRouteChange}
            />
            <ColorRecognition
                user={user}
                input={input}
                imageUrl={imageUrl}
                color_props={color_props}
                color_hidden={color_hidden}
                name={name}
                // onSaveColorButton={onSaveColorButton}
                onRouteChange={onRouteChange}
            />
            <AgeRecognition
                user={user}
                age={age}
                input={input}
                imageUrl={imageUrl}
                age_hidden={age_hidden}
                onRouteChange={onRouteChange}
            />
        </React.Fragment>
    )
};

export default Home;