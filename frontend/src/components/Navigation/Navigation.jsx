import classes from './Navigation.module.css';
import React from 'react';

// Parent component
// src/App.js
const Navigation = ( { 
    isSignedIn, 
    removeUserFromLocalStorage,
    onRouteChange,
    resetUser,
    resetState,
    onSignout
     }) => {
    
        return (
            isSignedIn ? 
            <React.Fragment>
            <div className={`${classes.navContainer}`} id="navigation">
                <nav 
                    className={`${classes.navSignedIn}`}
                    // style={{display: 'flex', justifyContent: 'flex-end', width: '95%', position: 'absolute' }}
                >
                    {/* If 'Sign Out' is clicked, nav to 'signin' page */}
                    <p 
                        className={`${classes.navPara}`}
                        onClick={onSignout} 
                    >
                        Sign Out
                    </p>
                </nav>
            </div>
            </React.Fragment> 
            :
            <React.Fragment>
                <div className={`${classes.navBoxSignedOut}`}>
                    {/* If 'Signin' is clicked, nav to 'signin' page */}
                    <nav
                        className={`${classes.navSignedOut}`} 
                        // style={{display: 'flex', justifyContent: 'flex-end'}}
                    >
                        <p 
                            className={`${classes.navPara}`}
                            onClick={() => onRouteChange('signin')} 
                        >
                            Sign In
                        </p>
                        {/* If 'Register' is clicked, nav to 'register' page */}
                        <p 
                            className={`${classes.navPara}`}
                            onClick={() => onRouteChange('register')} 
                        >
                            Register
                        </p>
                    </nav>
                </div>
            </React.Fragment>
        );

    //     if (isSignedIn) {
    //         return (
    //         <React.Fragment>
    //         <div className={`${classes.navContainer}`} id="navigation">
    //             <nav 
    //                 className={`${classes.navSignedIn}`}
    //                 // style={{display: 'flex', justifyContent: 'flex-end', width: '95%', position: 'absolute' }}
    //             >
    //                 {/* If 'Sign Out' is clicked, nav to 'signin' page */}
    //                 <p 
    //                     className={`${classes.navPara}`}
    //                     onClick={() => {
    //                         resetUser();
    //                         removeUserFromLocalStorage();
    //                         onRouteChange('signin');
    //                     }} 
    //                 >
    //                     Sign Out
    //                 </p>
    //             </nav>
    //         </div>
    //         </React.Fragment>
    //         )
    //     } else {
    //         return (
    //         <div className={`${classes.navBoxSignedOut}`}>
    //             {/* If 'Signin' is clicked, nav to 'signin' page */}
    //             <nav
    //                 className={`${classes.navSignedOut}`} 
    //                 // style={{display: 'flex', justifyContent: 'flex-end'}}
    //             >
    //                 <p 
    //                     className={`${classes.navPara}`}
    //                     onClick={() => onRouteChange('signin')} 
    //                 >
    //                     Sign In
    //                 </p>
    //                 {/* If 'Register' is clicked, nav to 'register' page */}
    //                 <p 
    //                     className={`${classes.navPara}`}
    //                     onClick={() => onRouteChange('register')} 
    //                 >
    //                     Register
    //                 </p>
    //             </nav>
    //         </div>
    //         )
    // }
    
}

export default Navigation