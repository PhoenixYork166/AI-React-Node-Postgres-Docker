import React, {useState, useEffect, useRef } from "react";
import "./Slideshow.scss";
import "./ColorTable.scss";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

import Loading from "../../../../components/Loading/Loading";
import base64ToBlob from "../../../../util/base64ToBlob";
import '../../../../sass/base/_utilities.scss';

// Parent component
// 1. src/routes/Records/ColorRecords.jsx
const SlideshowColorRecords = ( { 
    dimensions,
    userColorRecords
    } ) => {
    
    // useState Slideshow Photos' index
    const [activeIndex, setActiveIndex] = useState(0);
    const [blobImages, setBlobImages] = useState([]);
    const indexRef = useRef(activeIndex); // Create a ref to store the current index

    // Monitor resolutions
    //console.log(`dimensions.width * 0.8 * 0.5: ${dimensions.width * 0.8 * 0.5}`)
    // For window.inner.width >= 
    //const slideshowWidthGt = Math.floor(dimensions.width*0.435);

    // Declare Mobile breakpoint
    const desktopBreakpoint = 1280;
    const mobileBreakpoint = 600;

    const slideshowWidthGt = '514px';
    // For window.inner.width < 
    const slideshowWidthLt = Math.floor(dimensions.width*0.879);
    //console.log(`slideshowWidth: ${slideshowWidth}`);
    
    const slideshowHeightGt = Math.floor(dimensions.width * 0.25);
    const slideshowHeightLt = Math.floor(slideshowWidthLt * 2.2);

    const btnParentWidthGt = Math.floor(slideshowWidthGt * 0.12);
    const btnParentWidthLt = Math.floor(slideshowWidthLt * 0.12);

    const indicatorBtnWidthGt = Math.floor(slideshowWidthGt * 0.06);
    const indicatorBtnWidthLt = Math.floor(slideshowWidthLt * 0.05);

    // Flattening userColorRecords[[{}, {}, {}]]
    const userColorRecordsArray = userColorRecords ? userColorRecords.flat() : [];

    // Convert base64 strings to blobs & store them in this.state
    useEffect(() => {
        if (userColorRecords) {
            try {
                const blobs = userColorRecords.flat().map((record) => {
                    if (!record.metadata) {
                        console.error("Missing metadata:", record);
                        return null;
                    }
                    const blob = base64ToBlob(record.metadata, 'image/jpeg');
                    if (!(blob instanceof Blob)) {
                        console.error("base64ToBlob did not return a Blob:", blob);
                        return null;
                    }
                    return URL.createObjectURL(blob);
                }).filter(url => url !== null); // Filter out any nulls due to errors
    
                setBlobImages(blobs);
            } catch (error) {
                console.error("Error creating blob URLs:", error);
            }
        }
        // if (userColorRecords) {
        //     const blobs = userColorRecords.flat().map((record) => {
        //         // Assuming 'image/jpeg' is MIME type
        //         const blob = base64ToBlob(record.metadata, 'image/jpeg');

        //         return URL.createObjectURL(blob); // Create a URL for the blob for rendering
        //     });

        //     setBlobImages(blobs);
        // }
    }, [userColorRecords]); // Depend on userColorRecords to update blobs


    // To update Slideshow Photos' index
    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            // Not to show when officePhotos.length < 0
            newIndex = 0;
        } else if (newIndex >= userColorRecordsArray.length) {
            // When Slideshow hits the last item
            // It will just go back to 1st item => LOOP
            newIndex = 0;
            //newIndex = officePhotos.length -1;
        }
        setActiveIndex(newIndex);
    };

    useEffect(() => {
        indexRef.current = activeIndex;
    }, [activeIndex]);

    // Allow Slideshow Photos to jump every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
          
          // Increment the active index
          updateIndex(activeIndex + 1);
        }, 5000); // Advance every 5 minutes
    
        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [activeIndex]); // Re-run the effect when activeIndex changes
    
    if (!userColorRecordsArray.length) return <Loading />;

    console.log(`\nSlideshowColorRecords:\n`, userColorRecordsArray, `\n`);
    console.log(`\nSlideshowColorRecords blobImages:\n`, blobImages, `\n`);

    return (
    <React.Fragment>
        <div 
            className="slideshow"
            style={{
                width: dimensions.width >= mobileBreakpoint ? slideshowWidthGt : slideshowWidthLt,
                scale: dimensions.width < mobileBreakpoint ? "0.85" : ""
            }}
        >
            <React.Fragment>
                <React.Fragment>
                <div 
                className="slideshow__inner" 
                // style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    <h3 className="slideshow__inner--heading">
                        Datetime of record
                    </h3>
                    <p className="slideshow__inner--p">{userColorRecordsArray[activeIndex].date_time}</p>
                    <br/>
                    <div className="color-page">
                        <img className="color-table-image" src={blobImages[activeIndex]} alt="color-blob" />
                        <div>
                           <table className="color-table">
                            <thead>
                                <tr>
                                    <th>Color</th>
                                    <th>Raw hex</th>
                                    <th>Raw hex val</th>
                                    <th>W3C Color</th>
                                    <th>W3C Color Name</th>
                                    <th>W3C hex</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userColorRecordsArray[activeIndex].raw_hex.map((hex, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input 
                                                type="color" 
                                                value={hex} 
                                                className="color"
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="raw-hex"
                                                value={hex}
                                                readOnly
                                            />
                                        </td>
                                        <td>{userColorRecordsArray[activeIndex].hex_value[index]}</td>
                                        <td>
                                            <input 
                                                className="w3c-color"
                                                type="color" 
                                                value={userColorRecordsArray[activeIndex].w3c_hex[index]} 
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                className="w3c-name"
                                                type="text"
                                                value={userColorRecordsArray[activeIndex].w3c_name[index]}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className='w3c-hex'
                                                type="text"
                                                value={userColorRecordsArray[activeIndex].w3c_hex[index]}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                           </table> 
                        </div>
                        
                    </div>
                </div>
                
                <br />

                <div className="slideshow__btn u-margin-bottom-small" 
                    style={{ width: dimensions.width >= mobileBreakpoint ? slideshowWidthGt : slideshowWidthLt }}
                >
                    <button 
                        // style={{
                        //     width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                        // }}
                        style={{
                            width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                            visibility: dimensions.width < 800 ? "hidden" : "visible"
                        }}
                        className="slideshow__btn--arrow frosted__children"
                        onClick={() => updateIndex(activeIndex - 1)}
                    >
                        <MaterialSymbol 
                            icon="arrow_back_ios" 
                            style={{ width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt }}
                        />
                    </button>

                    <div className="indicators">
                        {userColorRecordsArray.map((record, index) => (
                        <button
                        key={index}
                        className="indicators--btn"
                        style={{
                            width: dimensions.width >= mobileBreakpoint ? Math.floor(slideshowWidthGt * 0.005) : Math.floor(slideshowWidthLt * 0.005)
                        }}
                        onClick={() => updateIndex(index)}
                        >
                        <MaterialSymbol 
                        icon="brightness_1"
                        className={`${index === activeIndex ? "indicator-symbol-active" : "indicator-symbol"}`}
                        style={{ width: dimensions.width >= mobileBreakpoint ? indicatorBtnWidthGt : indicatorBtnWidthLt }}
                        />
                        </button>
                        ))}
                    </div>

                    <button 
                        style={{
                            width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                            visibility: dimensions.width < 800 ? "hidden" : "visible"
                        }}
                        className="slideshow__btn--arrow frosted__children"
                        onClick={() => updateIndex(activeIndex + 1)}
                    >
                        <MaterialSymbol 
                            icon="arrow_forward_ios" 
                            style={{ width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt }}
                        />
                    </button>
                </div>  
                </React.Fragment>                
            </React.Fragment>

        </div>
    </React.Fragment>
    );
};

export default SlideshowColorRecords;