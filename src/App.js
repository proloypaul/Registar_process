import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializetion from "./Firebase/firebase.initialize";


initializetion()
const googleProvider = new GoogleAuthProvider()
const auth = getAuth()
function App() {
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
    .then(result => {
      const user = result.user
      console.log(user)
    }).catch((error) => {
      console.log(error.message)
    })
  }

  const [name, setName] = useState('');
  const handleName = event => {
    setName(event.target.value)

  }
  const [email, setEmail] = useState('');
  const handleEmail = event => {
    // console.log(event.target.value)
    setEmail(event.target.value)
  }

  const [password, setPassword] = useState('');
  const handlePassword = event => {
    // console.log(event.target.value)
    setPassword(event.target.value);
  }

  const [isLogin, setIsLogin] = useState(false)
  const toggleLogin = event => {
    // console.log(event.target.checked)
    setIsLogin(event.target.checked)
  }

  const [error, setError] = useState('');
  const handleRegistar = event => {
    // console.log("Register will be add")
    console.log(email, password);
    event.preventDefault();

    // using password regular expresion 
    if(!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)){
      setError('password wrong please read our roule and mentain')
      return
    }

    // isLogin? userLogin(email, password) : userSignUp(email, password)
    if(isLogin){
      userLogin(email, password);
    }else{
      userSignUp(email, password);
    }
  }

  const userSignUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user
      console.log(user)
      setError('')

      // when user register successful than verify user email 
      verifyEmail()

      // set user name 
      setUserName()
    }).catch(error => {
      // console.log(error.message)
      setError(error.message)
    });
  };

  const userLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user
      console.log(user)
      setError('')
    }).catch(error => {
      setError(error.message)
    });
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
      // console.log(result)
    })
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: name})
    .then(() => {})
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {})
  };
  return (
    <div>

      <div>
        <h1>Please {isLogin?"Login":"Register Your Form"}</h1>
        <form className="m-5" onSubmit={handleRegistar}>
          {!isLogin && <div className="mb-3">
            <label htmlFor="exampleInputName1" className="form-label">Name</label>
            <input onBlur={handleName} type="name" placeholder="Enter Your Name" className="form-control" id="exampleInputName1" required/>
          </div>}
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input onBlur={handleEmail} type="email" placeholder="Enter Your Email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input onBlur={handlePassword} type="password" placeholder="Enter Your Password" className="form-control" id="exampleInputPassword1" required/>
          </div>
          <div className="mb-3 form-check">
            <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1"/>
            <label className="form-check-label" htmlFor="exampleCheck1">Log in</label>
          </div>
          <p className="text-danger">{error}</p>
          <button type="submit" className="btn btn-primary mx-2">{isLogin?"Login": "Register"}</button>
          {isLogin && <button onClick={handleResetPassword} type="button" className="btn btn-danger">Reset Password</button>}
        </form>
      </div>
      <br/>
      <div>-------------------------------------------</div>
      <div>
        <button onClick={handleGoogleSignIn}>Google Sign In</button>
      </div>
    </div>
  );
}

export default App;
