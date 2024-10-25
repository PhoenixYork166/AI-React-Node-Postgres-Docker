import React, { Component } from 'react';
import './App.css';

// Top Navigation panel
import Navigation from './components/Navigation/Navigation';

// Routes
import Home from './routes/Home/Home';
import Signin from './routes/Signin/Signin';
import Register from './routes/Register/container/Register';

// User Records
import CheckRecordsPanel from './components/CheckRecords/CheckRecordsPanel';
import ColorRecords from './routes/Records/ColorRecords/ColorRecords';
import CelebrityRecords from './routes/Records/CelebrityRecords/CelebrityRecords';
import AgeRecords from './routes/Records/AgeRecords/AgeRecords';

// Utility helper functions
// import loadUserFromLocalStorage from './util/loadUserFromLocalStorage';
import findCelebrity from './util/ai-detection/findCelebrity';
import findColor from './util/ai-detection/findColor';
import findAge from './util/ai-detection/findAge';
import calculateFaceLocation from './util/ai-detection/calculateFaceLocation';
import { returnDateTime } from './util/returnDateTime';

import Cookies from 'js-cookie';

import axios from 'axios';

// const localStorage = window.localStorage;

class App extends Component {
  constructor() {
    super();
    // const lastRoute = localStorage.getItem('lastRoute') || 'signin';
        
    this.state = {
      input: '', // this.state.input => Users' input imageUrl => Can be used for onClick events
      imageUrl: '', // this.state.imageUrl should NOT be used for onClick => React circular references
      box: {},
      celebrity: {},
      celebrityName: '',
      colors: [],
      dimensions: { width: window.innerWidth }, // Initialize dimensions state
      age: [],
      face_hidden: true,
      color_hidden: true,
      age_hidden: true,
      responseStatusCode: Number(''),
      // route: defaultRoute,
      route: 'signin',
      // route: lastRoute,
      isSignedIn: false,
      // isSignedIn: userData ? true : false,

      user: {},
      userCelebrityRecords: [],
      userColorRecords: [],
      userAgeRecords: [],

      // user: userData ? JSON.parse(userData) : {},      
    };
    /* this.state.dimensions => Bind methods for handleResize regarding this.handleResize */
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();

    /* Adding EventListener to window 'resize' events */
    window.addEventListener('resize', this.handleResize);
    
    setInterval(() => {
      this.setState({ dimensions: { width: window.innerWidth } });
    }, 10000);
  }

  /* Session cookie */
  fetchUserData = () => {
    const devUserDataUrl = `http://localhost:3001/api/get-user-data`;
    const prodUserDataUrl = `https://ai-recognition-backend.onrender.com/api/get-user-data`;

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodUserDataUrl : devUserDataUrl;

    axios.get(fetchUrl, { withCredentials: true })
    .then((response) => {
      if (response.data) {
        this.setState({ 
          user: response.data, 
          isSignedIn: true, 
          // route: 'home'
        }, () => {
          this.onRouteChange('home');
        });
      } 
    })
    .catch((err) => {
      console.error(`\nFailed to fetch user data: `, err, `\n`);
    })
  }

  saveUser = (user) => {
    this.setState({ user: user });
  }

  resetUser = () => {
    this.setState({ user: {}, isSignedIn: false, route: 'signin' }, () => {
      // this.removeUserFromLocalStorage();
      console.log(`\nthis.state.isSignedIn after resetUser:\n`,this.state.isSignedIn, `\n`);//true
    })
  }

  /* Keep tracking for user state variables */
  // useEffect() hook combining componentDidUpdate & componentWillUnmount
  // Validate users whenever there's a change
  componentDidUpdate(prevProps, prevState) {
    if (this.state.user !== prevState.user) { 
      this.validateUsers();
      // this.updateLocalStorage('user', this.state.user, prevState.user);
    }

    /* Storing User's latest route */
    // if (this.state.lastRoute !== prevState.lastRoute) {
    //   localStorage.setItem('lastRoute', this.state.lastRoute);
    // }
  }
  
  componentWillUnmount() {
    // clearTimeout(this.inactivityTimer);
    window.removeEventListener('resize', this.handleResize);
    /* this.state.dimensions => Clear the interval on unmount to avoid memory leak on browser */
    // clearInterval(this.dimensionsCleanupTimer);
  }

  // Keep tracking window.innerWidth px
  handleResize() {
    this.setState({ dimensions: { width: window.innerWidth } });
  }
  
  // resetInactivityTimer = () => {
  //   clearTimeout(this.inactivityTimer);
  //   // Force users to sign out after 15 minutes (900000 milli-seconds)
  //   this.inactivityTimer = setTimeout(this.resetUser, 900000); 
  // }

  // For Celebrity detection model
  displayCelebrity = (celebrity) => {
    this.setState({ celebrity: celebrity }, () =>
      console.log('Celebrity object: \n', celebrity)
    );
  };

  // For Color detection model
  displayColor = (colorInput) => {
    this.setState({ colors: colorInput }, () =>
      console.log('Colors obj locally stored: \n', colorInput)
    );
  };

  // For Age detection model
  displayAge = (ageInput) => {
    this.setState({ age: ageInput }, () =>
      console.log('Age group objs locally stored: \n', ageInput)
    );
  };

  displayFaceBox = (box) => {
    this.setState({ box: box }, () => console.log('box object: \n', box));
  };

  // For <ImageLinkForm />
  onInputChange = (event) => {
    this.setState({ input: event.target.value }, () =>
      console.log('ImageLinkForm Input value:\n', event.target.value)
    );
  };

  // Everytime any of Detection Models is clicked
  // reset all state variables to allow proper rendering of DOM elements
  resetState = () => {
    this.setState({
      box: {},
      celebrity: {},
      celebrityName: '',
      colors: [],
      age: [],
      face_hidden: true,
      color_hidden: true,
      age_hidden: true,
      responseStatusCode: Number(''),
    })
  };

  // reset all User's color & celebrity & age detection records in Frontend
  resetUserRecords = () => {
    this.setState({
      userColorRecords: [],
      userCelebrityRecords: [],
      userAgeRecords: []
    });
  }

  // Everytime any of the Detection Models is activated
  // update this.state.user.entries by 1 through
  // sending data to server-side
  
  /* Updating Entries - Fetching local web server vs live web server on Render */
  updateEntries = async () => {
    const devUpdateEntriesUrl = 'http://localhost:3001/image';
    const prodUpdateEntriesUrl = 'https://ai-recognition-backend.onrender.com/image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodUpdateEntriesUrl : devUpdateEntriesUrl;
    
    await fetch(fetchUrl, {
        method: 'put', // PUT (Update) 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ // sending stringified this.state variables as JSON objects
        id: this.state.user.id
        })
      })
      .then(response => {
        return response.json()
    })
    .then(fetchedEntries => {
      console.log(`fetched ENTRIES from server: \n ${fetchedEntries}`);
      console.log(`typeof fetched ENTRIES from server: \n ${typeof fetchedEntries}`);

      this.setState(Object.assign(this.state.user, {
          entries: fetchedEntries
      }), () => {
      // console.log(`this.state.user.entries is: ${this.state.user.entries}`); 
        })
      })
      .catch(err => {
        console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
      });
  }

  // To be passed to <CheckRecordsPanel /> in src/components/CheckRecords/CheckRecrodsPanel.jsx
  onHomeButton = () => {
    // Reset all state variables to allow proper rendering from Detection Models
    this.resetState();

    // Reset User's all color & celebrity & age records in Frontend
    this.resetUserRecords();

    // Change Route to 'home' => Checkout App.js onRouteChange()
    this.onRouteChange('home');
  }

  // Retrieve User's Color Records from Node.js => PostgreSQL
  onCelebrityRecordsButton = async () => {
    // Reset all state variables to allow proper rendering of side-effects
    this.resetState();

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    this.onRouteChange('celebrityRecords');

    const devFetchGetUserCelebrityUrl = 'http://localhost:3001/records/get-user-celebrity';
    const prodFetchGetUserCelebrityUrl = 'https://ai-recognition-backend.onrender.com/records/get-user-celebrity';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserCelebrityUrl : devFetchGetUserCelebrityUrl;

    const bodyData = JSON.stringify({
      userId: this.state.user.id
    });

    console.log(`\nonCelebrityRecordsButton is fetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    await fetch(fetchUrl, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Celebrity Records response:\n`, response, `\n`);
      console.log(`\nFetched User's Celebrity Records\nresponse.celebrityData`, response.celebrityData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // this.updateEntries();
        this.setState({
          userCelebrityRecords: response.celebrityData
        });

      };
    })
    .catch((err) => {
      console.log(`\nError fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js this.state.userCelebrityRecords:\n`, this.state.userCelebrityRecords, `\n`);
  }

  // ClarifaiAPI Celebrity Face Detection model
  onCelebrityButton = async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    this.resetState();

    // Whenever clicking Detect button => setState
    this.setState(
      {
        // setState imageUrl: this.state.input from InputChange as event onChange
        // Thus this.state.imageUrl = a React Event => NOT be used as props involving circular references
        imageUrl: this.state.input,
        face_hidden: false
      },
      // Logging state variables right after setState
      () => console.log('this.state.input:\n', this.state.input),
      () => console.log('this.state.face_hidden:\n', this.state.face_hidden)
    );

    /* From Clarifai API documentation, this API can be consumed as below: */

    /* Celebrity Recognition - Fetching local web server for celebrityimage */
    const devFetchCelebrityImageUrl = 'http://localhost:3001/celebrity-image';
    const prodFetchCelebrityImageUrl = 'https://ai-recognition-backend.onrender.com/celebrity-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchCelebrityImageUrl : devFetchCelebrityImageUrl;

    await fetch(fetchUrl, {
        method: 'post', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ // sending stringified this.state variables as JSON objects
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        console.log('HTTP Response: \n', response);
        console.log('HTTP request status code:\n', response.status.code);
        console.log(
          'bounding box',
          response.outputs[0].data.regions[0].region_info.bounding_box
        );
        console.log(
          'Celebrity obj:\n',
          response.outputs[0].data.regions[0].data.concepts[0]
        );

        if (response) { 
          this.updateEntries();
        };

        this.displayFaceBox(calculateFaceLocation(response));
        // this.displayCelebrity(this.findCelebrity(response));
        this.displayCelebrity(findCelebrity(response));
        this.setState({ responseStatusCode: response.status.code });
      })
      .catch(err => {
        console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
      });
  };

  // Retrieve User's Color Records from Node.js => PostgreSQL
  onColorRecordsButton = async () => {
    // Reset all state variables to allow proper rendering of side-effects
    this.resetState();

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    this.onRouteChange('colorRecords');

    const devFetchGetUserColorUrl = 'http://localhost:3001/records/get-user-color';
    const prodFetchGetUserColorUrl = 'https://ai-recognition-backend.onrender.com/records/get-user-color';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserColorUrl : devFetchGetUserColorUrl;

    const bodyData = JSON.stringify({
      userId: this.state.user.id
    });

    console.log(`\nFetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    await fetch(fetchUrl, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Colors Records obj:\n`, response, `\n`);
      console.log(`\nFetched User's Colors Records obj:\n`, response.colorData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // this.updateEntries();
        this.setState({
          userColorRecords: response.colorData
        });

      };
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js this.state.userColorRecords:\n`, this.state.userColorRecords, `\n`);
  }

  // ClarifaiAPI Color Detection model
  onColorButton = async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    this.resetState(); 

    // Whenever clicking Detect button
    this.setState(
      {
        // setState imageUrl: this.state.input from InputChange
        imageUrl: this.state.input,
        // setState color_hidden: false to allow rendering of <ColorRecognition />
        // then passing color_props to <ColorRecognition />
        color_hidden: false
      },
      () => console.log(`this.state.input:\n${this.state.input}\nthis.state.color_hidden:\n${this.state.color_hidden}`)
    );

    /* Color Recognition - Fetching local Web Server vs live Web Server on Render */
    const devFetchColorImageUrl = 'http://localhost:3001/color-image';
    const prodFetchColorImageUrl = 'https://ai-recognition-backend.onrender.com/color-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchColorImageUrl : devFetchColorImageUrl;

    await fetch(fetchUrl, {
      method: 'post', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // sending stringified this.state variables as JSON objects
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log('Fetched Colors obj:\n', response.outputs[0].data);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        this.updateEntries();
      };

      this.displayColor(findColor(response));
    })
    .catch(err => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
    });
  };
  
  // Retrieve User's Color Records from Node.js => PostgreSQL
  onAgeRecordsButton = async () => {
    // Reset all state variables to allow proper rendering of side-effects
    this.resetState();

    // Change Route to 'colorRecords' => Checkout App.js onRouteChange()
    this.onRouteChange('ageRecords');

    const devFetchGetUserColorUrl = 'http://localhost:3001/records/get-user-age';
    const prodFetchGetUserColorUrl = 'https://ai-recognition-backend.onrender.com/records/get-user-age';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchGetUserColorUrl : devFetchGetUserColorUrl;

    const bodyData = JSON.stringify({
      userId: this.state.user.id
    });

    console.log(`\nFetching ${fetchUrl} with bodyData: `, bodyData, `\n`);

    await fetch(fetchUrl, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(`\nFetched User's Age Records response:\n`, response, `\n`);
      console.log(`\nFetched User's Age Records response.ageData:\n`, response.ageData, `\n`);
      // If there's a response upon fetching Clarifai API
      // fetch our server-side to update entries count too
      if (response) { 
        // this.updateEntries();
        this.setState({
          userAgeRecords: response.ageData
        });

      };
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`);
    });

    console.log(`\nsrc/App.js this.state.userAgeRecords:\n`, this.state.userAgeRecords, `\n`);
  }

  // ClarifaiAPI Age Detection model
  onAgeButton = async () => {
    // Reset all state variables to allow proper rendering from Detection Models
    // Before next fetch
    this.resetState();

    // Whenever clicking 'Detect Age' button
    this.setState(
      {
        // setState imageUrl: this.state.input from InputChange
        imageUrl: this.state.input,
        // setState({age_hidden: false}) to allow rendering of <AgeRecognition />
        age_hidden: false
      },
      () => console.log('this.state.input:\n', this.state.input),
      () => console.log('this.state.age_hidden:\n', this.state.age_hidden)
    );

    /* Age Recognition - Fetching local dev server vs live Web Server on Render */
    const devFetchAgeUrl = 'http://localhost:3001/age-image';
    const prodFetchAgeUrl = 'https://ai-recognition-backend.onrender.com/age-image';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodFetchAgeUrl : devFetchAgeUrl;

    await fetch(fetchUrl, {
        method: 'post', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ // sending stringified this.state variables as JSON objects
          input: this.state.input
        })
    })
    .then(response => response.json())
    .then(response => {
      console.log('\nHTTP Response\nAge Detection', response);
      console.log('\nHTTP request status code:\n', response.status.code);
      console.log(
        'Fetched Age grp obj:\n',
        response.outputs[0].data.concepts
    );

    // color-detection
    // this.displayColor adding color hex to this.state.color
    // findColor(response) returns color hex
    if (response) { 
      this.updateEntries();
      };
      this.displayAge(findAge(response));
    })
    .catch((err) => {
      console.log(`\nError Fetching ${fetchUrl}:\n${err}\n`)
    });
  };

  // **
  // To allow SPA Routing without React Router DOM through onClick={() => onRouteChange(routeInput)}
  onRouteChange = (routeInput) => {
    const callbackName = `onRouteChange`;
    switch (routeInput) {
      case 'signout':
        this.setState({ 
          ...this.state,
          route: 'sigin',
          isSignedIn: false
        });
        console.log(`\n${callbackName}(signout)\n`);
        break;
      
      // else if onClick={() => onRouteChange('home')}
      case 'home':
        this.setState({ 
          ...this.state,
          route: routeInput,
          isSignedIn: true
        });
        console.log(`\n${callbackName}(home)\n`);
        return;
      
      case 'ageRecords':
        this.setState({
          route: routeInput,
          isSignedIn: true
        });
        console.log(`\n${callbackName}(ageRecords)\n`);
        return;

      case 'colorRecords':
        this.setState({
          route: routeInput,
          isSignedIn: true
        });
        console.log(`\n${callbackName}(colorRecords)\n`);
        return;

      case 'celebrityRecords':
        this.setState({
          route: routeInput,
          isSignedIn: true
        });
        console.log(`\n${callbackName}(celebrityRecords)\n`);
        return;
      
      // No matter what, still wanna change the route
      default:
        this.setState({ 
          ...this.state, 
          route: routeInput 
        });
        return;
    }
  };

  // src/components/Navigation/Navigation.jsx
  onSignout = async () => {
    // this.setState({
    //   celebrity: {},
    //   colors: [],
    //   age: [],
    //   user: {}
    // }, () => {
    //   // After state reset, remove the specific cookies
    //   // Example: if you know the names of the cookies
    //   Cookies.remove('userData', { path: '/', secure: process.env.NODE_ENV === 'production' });

    //   // Reset any additional user or app state
    //   this.resetUser();
    //   this.resetState();

    //   // Log the updated state for debugging
    //   console.log('this.state.celebrity:', this.state.celebrity);
    //   console.log('this.state.colors:', this.state.colors);
    //   console.log('this.state.age:', this.state.age);

    //   // Change route to 'signin' or any other as necessary
    //   this.setState({ isSignedIn: false });
    //   this.onRouteChange('signin');
    //   }
    // );
    const devSignoutUrl = `http://localhost:3001/signout`;
    const prodSignoutUrl = `https://ai-recognition-backend.onrender.com/signout`;
    const fetchUrl = process.env.NODE_ENV === 'production' ? prodSignoutUrl : devSignoutUrl;

    await fetch(fetchUrl, {
      method: 'post',
      credentials: 'include', // To include credentials for cookies
    })
    .then((response) => {
      this.setState({
        celebrity: {},
        colors: [],
        age: [],
        user: {},
        isSignedIn: false
      }, () => {
        this.onRouteChange('signin')
      });
    })
    .catch((err) => {
      console.error(`Error signing out user: `, err, `\n`);
    })
  }

  // To avoid malicious users from breaking in from <Register />
  // If there's no user.id => route to 'signin' page
  validateUsers = () => {
    if (!this.state.user.id) {
      this.onRouteChange('signin');
    }
  }

  /* Rendering all components */
  render() {
    // destructuring props from this.state
    const {
      age,
      face_hidden,
      color_hidden,
      age_hidden,
      box,
      colors,
      celebrity,
      dimensions,
      imageUrl,
      route,
      input,
      isSignedIn,
      responseStatusCode,
      user,
      userAgeRecords,
      userCelebrityRecords,
      userColorRecords
      // userColorRecords
    } = this.state;

    const colors_array = colors.map(color => color);
    const age_props = age.map((each, i) => each.age.name)[0];

    const dateTime = returnDateTime();
    console.log('\nage_props\n', age_props);
    console.log('\ndateTime:\n', dateTime);

    // // Tracking all state variables in render() {...}
    console.log(`\nthis.state.user: \n`, user, `\n`);
    // console.log(`\nthis.state.user => JSON.parse(user):\n`, JSON.parse(user), `\n`);
    console.log(`\ndefaultRoute:\n${this.defaultRoute}\n`);
    console.log(`\n`);
    console.log('\nthis.state.input: \n', input);
    console.log('\nthis.state.imageUrl: \n', imageUrl);
    console.log('\nthis.state.box: \n', box);
    console.log('\nthis.state.celebrity: \n', celebrity);
    console.log('\nthis.state.celebrity.name: \n', celebrity.name);
    console.log('typeof this.state.celebrity.name: \n', typeof celebrity.name);
    console.log('\nthis.state.colors: \n', colors);
    console.log('\nthis.state.colors[0]: \n', colors[0]);
    console.log('\nthis.state.age: \n', age);
    console.log('\nthis.state.face_hidden', face_hidden);
    console.log('\nthis.state.color_hidden', color_hidden);
    console.log('\nthis.state.age_hidden', age_hidden);
    console.log('\nthis.state.responseStatusCode:\n', responseStatusCode);
    console.log(`\nthis.state.dimensions.width:\n`, dimensions.width, `px\n`);
    console.log(`\nthis.state.user.id:\n`, user.id, `\n`);
    
    // Enhance React Scalability for allowing to add more React routes without React Router DOM
    const routeComponents = {
      'home': (
        <Home
          isSignedIn={isSignedIn}
          user={user}
          name={user.name}
          entries={user.entries}
          input={input}
          imageUrl={imageUrl}
          celebrityName={celebrity.name}
          face_hidden={face_hidden}
          onInputChange={this.onInputChange}
          // AI Recognition buttons
          onCelebrityButton={this.onCelebrityButton}
          onColorButton={this.onColorButton}
          onSaveColorButton={this.onSaveColorButton}
          onAgeButton={this.onAgeButton}
          color_props={colors_array}
          color_hidden={color_hidden}
          age={age_props}
          age_hidden={age_hidden}
          box={box}
          // Callback to allow custom onClick methods in Child components
          onRouteChange={this.onRouteChange}
          // 4 Buttons in <CheckRecordsPanel />
          // 1. 'Home' page
          onHomeButton={this.onHomeButton}
          // 2. 'Celebrity records' page
          onCelebrityRecordsButton={this.onCelebrityRecordsButton}
          // Passing userColorRecords to 'Color records' page
          userCelebrityRecords={userCelebrityRecords}
          // 3. 'Color records' page
          onColorRecordsButton={this.onColorRecordsButton}
          // Passing userColorRecords to 'Color records' page
          userColorRecords={userColorRecords}
          // 4. 'Age records' page
          onAgeRecordsButton={this.onAgeRecordsButton}
          // Passing userColorRecords to 'Color records' page
          userAgeRecords={userAgeRecords}
          resetUser={this.resetUser}
          resetState={this.resetState}
        />
      ),
      'signin': (
        <Signin 
          saveUser={this.saveUser}
          onRouteChange={this.onRouteChange} 
        />
      ),
      'register': (
        <Register 
          onRouteChange={this.onRouteChange} 
        />
      ),
      'ageRecords': (
        <React.Fragment>
          <CheckRecordsPanel 
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            onRouteChange={this.onRouteChange}
            // 4 Buttons in CheckRecordsPanel /> Home, Age records, Celebrity records, Color records
            onHomeButton={this.onHomeButton}
            onCelebrityRecordsButton={this.onCelebrityRecordsButton}
            onColorRecordsButton={this.onColorRecordsButton}
            onAgeRecordsButton={this.onAgeRecordsButton}
          />
          <AgeRecords
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            userAgeRecords={userAgeRecords}
          />
        </React.Fragment>
      ),
      'colorRecords': (
        <React.Fragment>
          <CheckRecordsPanel 
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            onRouteChange={this.onRouteChange}
            // 4 Buttons in CheckRecordsPanel /> Home, Age records, Celebrity records, Color records
            onHomeButton={this.onHomeButton}
            onCelebrityRecordsButton={this.onCelebrityRecordsButton}
            onColorRecordsButton={this.onColorRecordsButton}
            onAgeRecordsButton={this.onAgeRecordsButton}
          />
          <ColorRecords
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            userColorRecords={userColorRecords}
          />
        </React.Fragment>
      ),
      'celebrityRecords': (
        <React.Fragment>
          <CheckRecordsPanel 
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            onRouteChange={this.onRouteChange}
            // 4 Buttons in CheckRecordsPanel /> Home, Age records, Celebrity records, Color records
            onHomeButton={this.onHomeButton}
            onCelebrityRecordsButton={this.onCelebrityRecordsButton}
            onColorRecordsButton={this.onColorRecordsButton}
            onAgeRecordsButton={this.onAgeRecordsButton}
          />
          <CelebrityRecords
            user={user}
            isSignedIn={isSignedIn}
            dimensions={dimensions}
            // this.state.userCelebrityRecords
            userCelebrityRecords={userCelebrityRecords}
            // 4 Buttons in CheckRecordsPanel /> Home, Age records, Celebrity records, Color records
            onHomeButton={this.onHomeButton}
            onCelebrityRecordsButton={this.onCelebrityRecordsButton}
            onColorRecordsButton={this.onColorRecordsButton}
            onAgeRecordsButton={this.onAgeRecordsButton}
          />
        </React.Fragment>
      )
    }

    return (
      <div className="App">
        {/* Conditional rendering */}
        <Navigation
          isSignedIn={isSignedIn}
          // removeUserFromLocalStorage={this.removeUserFromLocalStorage}
          onRouteChange={this.onRouteChange}
          resetUser={this.resetUser}
          resetState={this.resetState}
          onSignout={this.onSignout}
        />

        {routeComponents[route] ?? <div>Page not found</div>}
      </div>
    );
  }
}

export default App;
