import React, { Component } from "react";
import './Register.scss';
import Name from '../components/name/Name';
import Email from '../components/email/Email';
import Password from '../components/password/Password';
import PasswordConfirm from '../components/passwordConfirm/PasswordConfirm';

// Parent component
// src/App.js
// Make Register a smart component to process states
class Register extends Component {
  // class Register to inherit React class Component
  constructor(props) {
    super(props); // Inheriting all React class Components attributes & methods()
    this.state = {
      name: '',
      nameValid: false,
      email: '',
      emailValid: false,
      password: '',
      passwordConfirm: '',
      lockRegister: true,
      password12Char: false,
      password1SpecialChar: false,
      passwordMatch: false,
      passwordNotEmpty: false,
      emailRegistered: false
    }
  }
  
  //////// Smart component functions 
  // Listens to onChange events of name <input>
  // Trigger this.validateInputs() whenever there's any changes
  onNameChange = (event) => {
    this.setState({ name: event.target.value }, () => {
      this.validateInputs();
      // console.log('this.state.signInEmail: \n', this.state.signInEmail);
    })
  }
  
  // Listens to onChange events of email && password <input>
  onEmailChange = (event) => {
    this.setState({ email: event.target.value }, () => {
      this.validateInputs();
      // console.log('this.state.email: \n', this.state.email);
    })
  }

  onPasswordChange = (event) => {
    const newPassword = event.target.value;
    this.setState({ password: newPassword }, () => {
      this.validateInputs();
      // console.log('this.state.password: \n', this.state.password);
    })
  }

  onPasswordConfirmChange = (event) => {
    const newPasswordConfirm = event.target.value;
    this.setState({ passwordConfirm: newPasswordConfirm }, () => {
      this.validateInputs();
      // console.log('this.state.passwordConfirm: \n', this.state.passwordConfirm);
    })
  }

  // If users fail to register => Clear inputs
  resetInputs = () => {
    this.setState({
      name: '',
      nameValid: false,
      email: '',
      emailValid: false,
      password: '',
      passwordConfirm: '',
      lockRegister: true,
      password12Char: false,
      password1SpecialChar: false,
      passwordMatch: false,
      passwordNotEmpty: false
    })
  }

  // To validate users' inputs in <Register />
  validateInputs = () => {    
        
        // Validate name input 
        const nameRegExp = new RegExp(/^[a-zA-Z]+$/, 'gm');
        const nameValidation = nameRegExp.test(this.state.name);
        if (nameValidation && this.state.name.length >= 3) {
          this.setState({
            nameValid: true
          });
        } else {
          this.setState({
            nameValid: false,
            lockRegister: true
          }, () => {
            // console.log(`this.state.nameValid:\n${this.state.nameValid}`);
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }

        // Validate email input
        const emailRegExp = new RegExp(/^\w+@[A-Za-z]+[A-Za-z]+(\.com|\.gov|\.tw|\.cn|\.hk|\.edu|\.au|\.uk|\.net|\.io|\.gov\.hk|\.com\.hk|\.com\.tw|\.edu\.tw|\.gov\.uk|\.edu\.hk|\.edu\.uk|\.edu\.au)$/, 'gm')
        const emailValidation = emailRegExp.test(this.state.email);
        if (emailValidation) {
          this.setState({
            emailValid: true
          }, () => {
            // console.log(`this.state.emailValid:\n${this.state.emailValid}`)
          })
        } else {
          this.setState({
            emailValid: false,
            lockRegister: true
          }, () => {
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }

        // Validate whether password && passwordConfirm match up
        if (this.state.password && this.state.passwordConfirm && this.state.password === this.state.passwordConfirm) {
          this.setState({ 
            passwordMatch: true
          }, () => {
            // console.log(`this.state.passwordMatch: \n${this.state.passwordMatch}`);
          });
        } else {
          this.setState({
            passwordMatch: false,
            lockRegister: true
          }, () => {
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }
        
        // Validate whether both password && passwordConfirm length >= 12
        if (this.state.password.length >=12) {
          this.setState({
            password12Char: true
          }, () => {
            // console.log(`this.state.password12Char: ${this.state.password12Char}`);
          });
        } else {
          this.setState({
            password12Char: false,
            lockRegister: true
          }, () => {
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }

        // Validate whether both password && passwordConfirm include at least 1 special character
        const specialChar = ['!', '@', '#' , '$' , '%' , '^' , '&' , '*' , '(' , ')' , '-' , '=' , '{' , '}' , '{' , '}' , '|' , '\\' , ';' , ':' , "'" , '"' , ',' , '<' , '.' , '>' , '`' , '~' ];
        const anySpecialChar = specialChar.map(element => {
          if (this.state.password.includes(element)) {
            return true;
          } else {
            return this.setState({
              password1SpecialChar: false,
              lockRegister: true
            }, () => {
              console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
            })
          }
        }) 

        if (anySpecialChar.includes(true) ) {
          this.setState({
            password1SpecialChar: true
          }, () => {
            // console.log(`this.state.password1SpecialChar: ${this.state.password1SpecialChar}`);
          })
        } else {
          this.setState({
            password1SpecialChar: false,
            lockRegister: true
          }, () => {
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }

        // Validate whehter all criterion are satisfied for user registraton
        // 1. name
        // 2. email
        // 3. password && passwordConfirm match up
        // 4. password && passwordConfirm consist of at least 12 characters
        // 5. password && passwordConfirm consist of at least 1 special character
        if (this.state.nameValid && this.state.emailValid && this.state.passwordMatch && this.state.password12Char && this.state.password1SpecialChar) {
          this.setState({
            lockRegister: false // If all criterion are met => unlock 'Register' button
          }, () => {
            // console.log(`this.state.lockRegister: ${this.state.lockRegister}`);
          })
        } else {
          this.setState({
            lockRegister: true
          }, () => {
            // console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
          })
        }

        // Validate both password && passwordConfirm are not empty
        if (this.state.password !== "" && this.state.passwordConfirm !== "") {
          this.setState({
            passwordNotEmpty: true
          })
        } else {
          this.setState({
            passwordNotEmpty: false
          })
        }
  };
   
  componentDidUpdate(prevProps, prevState) {
      // To keep tracking real-time users' input validations
      if (
        this.state.name !== prevState.name ||
        this.state.nameValid !== prevState.nameValid ||
        this.state.email !== prevState.email ||
        this.state.emailValid !== prevState.emailValid ||
        this.state.password !== prevState.password || 
        this.state.passwordConfirm !== prevState.passwordConfirm ||
        this.state.passwordMatch !== prevState.passwordMatch || 
        this.state.password.length !== prevState.password.length ||
        this.state.password12Char !== prevState.password12Char ||
        this.state.password1SpecialChar !== prevState.password1SpecialChar ||
        this.state.passwordNotEmpty !== prevState.passwordNotEmpty
      ) {
        this.validateInputs();
      }
  }


  // App 'Sign In' button onClick event handler
  onSubmitRegister = (event) => {
    // Destructuring this.state variables for Registration
    const { name, email, password } = this.state;

    // Stop page from refreshing on Signin form submission
    // To allow users re-enter inputs should registration fail
    event.preventDefault();

    /* Send Register info via HTTP POST request to server localhost:3001
    To avoid Query Strings
    by fetching our server - localhost:3001/register
    fetch(url, {method: '', headers: '', body: JSON.stringify({ name: '', email: '', password: ''}) }) */

    // Fetching local web server or on Render
    this.devRegisterUrl = 'http://localhost:3001/register';
    this.prodRegisterUrl = 'https://ai-recognition-backend.onrender.com/register';

    const fetchUrl = process.env.NODE_ENV === 'production' ? this.prodRegisterUrl : this.devRegisterUrl;

    fetch(fetchUrl, {
      method: 'post', // to create
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // stringifying this.state variables before fetching
        name: name,
        email: email,
        password: password
      })
    })
    .then(response => response.json()) // res.json() to parse data
    .then(user => { // data passing in as user with props
      console.log('onRegisterSignIn - user: \n', user);
      if (user.id) { /* If we get a user with props => route to 'home'; this.props coming from App.js; Parent App.js front-end will handle user features */

        // Invoke App.js saveUserToLocalStorage() passed to this child component as props
        // this.props.saveUserToLocalStorage(user);

        // Invoke App.js loadUserFromLocalStorage() passed to this child component as props
        // this.props.loadUserFromLocalStorage();

        this.props.onRouteChange('home');

      } else if (!user.id) {
        this.props.onRouteChange('register');
        
        // If users registered with existed emails
        this.setState({
          emailRegistered: true,
          email: '',
          password: '',
          passwordConfirm: ''
        })

        this.resetInputs();

        // Clear off previous user inputs
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        const passwordConfirmInput = document.querySelector('#passwordConfirm');
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        passwordConfirmInput.value = '';
        
      }
    })
  }

  render() {

    // Destructuring props from this.state
    const { 
      nameValid,
      email,
      emailValid,
      password,
      passwordConfirm,
      lockRegister,
      password12Char,
      password1SpecialChar,
      passwordMatch,
      passwordNotEmpty,
      emailRegistered
      } = this.state;

    // tachyons styling for register button

    return (
      <div>
        <article className="article"> 
        <main className="article__main">
          <form className="measure" >
            <fieldset id="sign_up" className="fieldset">
              <legend className="register" >Register</legend>
              <div className="inputs" >
                <Name 
                  onNameChange={this.onNameChange}
                  nameValid={nameValid}
                />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                      nameValid === true ?
                      `Name is valid` : `Enter a valid name`
                    }
                  </p>
                </div>
                <Email 
                  onEmailChange={this.onEmailChange}
                  emailValid={emailValid}
                />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                    emailValid === true ? 
                    `Email is valid` : `Enter a valid email`
                    }
                  </p>
                </div>
                <Password
                  onPasswordChange={this.onPasswordChange}
                  password12Char={password12Char}
                />
                <p className="hint" style={{ opacity: 0 }}>Balancing line-height</p>
                <PasswordConfirm
                  onPasswordConfirmChange={this.onPasswordConfirmChange}
                  password1SpecialChar={password1SpecialChar}
                />      
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                    passwordNotEmpty === false ?
                    `Pw cannot be empty` 
                    :
                    password === passwordConfirm ? 
                    `Password MATCH!` : `Password must MATCH`
                    }
                  </p>     
                  <br/>
                  <p
                    className="hint"
                  >
                    {
                    emailRegistered === true ?
                    `Try using another email!` : ``
                    }
                  </p>
                </div>
              </div>
                   
              {/* <label className="pa0 ma0 lh-copy f6 pointer">
                <input type="checkbox" /> Remember me
              </label> */}
            </fieldset>

            <div className="registerBtnBox">
              <input
                onClick={this.onSubmitRegister}
                disabled={lockRegister}
                className={lockRegister === true ? 
                  "registerBtn" :
                  "registerBtn registerBtnOK"}
                type="submit"
                value="Register"
              />
            </div>
          </form>
        </main>
        </article>
      </div>
    );
  }
}
export default Register;
