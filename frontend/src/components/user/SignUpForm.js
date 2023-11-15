import React, { useState } from 'react';

// Signup Page
const SignUpForm = ({ navigate }) => {

  // STATE VARIABLES ==========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("")
  // FORM SUBMISSION FOR NEW USER ====================
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    // Send POST request to '/users' endpoint
    fetch( '/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }) // <===== BODY OF REQUEST: email and password
    })
      .then(async response => {
        
        
        if(response.status === 201) {
          navigate('/login') // If successful, navigate to login page
          
        } else {
          const errorData = await response.json();
          navigate('/signup') // If unsuccessful, stay on the signup page
          setErrorMsg(errorData.message)
          console.log(errorData.message)
        }
      })
  }

  // FUNCTIONS FOR CHANGING STATE VARIABLES ==================
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }


  // JSX FOR THE UI OF THE COMPONENT =====================
    // currently shows two input fields and one button with no styling.
    return (
      <form onSubmit={handleSubmit}>
          <input placeholder="Email" id="email" type='text' value={ email } onChange={handleEmailChange} />
          <input placeholder="Password" id="password" type='password' value={ password } onChange={handlePasswordChange} />
        <input id='submit' type="submit" value="Submit" />
        <h2>{errorMsg}</h2>
      </form>
    );
}

export default SignUpForm;
