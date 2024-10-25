import React from 'react';

// import Slideshow to display ColorRecords
import SlideshowAgeRecords from './Slideshow-AgeRecords/Slideshow-AgeRecords';
import "../records.scss";

// Parent component
// src/App.js
// Child component
// src/components/Records/AgeRecords/Slideshow-AgeRecords/Slideshow-AgeRecords.jsx
const AgeRecords = ( {
    user,
    isSignedIn,
    dimensions,
    userAgeRecords
} ) => {
    
    return (
        <React.Fragment>
            {/* <CheckRecordsPanel /> */}
            <div className="container frosted">
            <h1 className="recordsHeading frosted__children">Age Records</h1>
            <SlideshowAgeRecords 
                user={user} 
                isSignedIn={isSignedIn} 
                dimensions={dimensions}
                // User's Age Records
                userAgeRecords={userAgeRecords}
            />
            </div>
        </React.Fragment>
    )
};

export default AgeRecords;