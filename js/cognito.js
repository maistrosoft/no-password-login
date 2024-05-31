document.querySelector('#form').addEventListener('submit', (e) => {
    // Prevent the submit event
    e.preventDefault()

    const phone_number = document.querySelector('#number')

    if(validateMobileNumber(phone_number.value)){
        // Calling the signIN function
        signIn(phone_number.value)
    }
    else {
        alert('Invalid mobile number format')
    }
})

 // Define the event listener function
 function handleBeforeUnload(e) {
    // Prevent the default action of the event
    e.preventDefault();
    
    // For some browsers, e.returnValue needs to be set
    e.returnValue = '';

    // Return a value for older browsers
    return '';
}


function signIn(phone_number) {
    // Displaying loading screen
    document.querySelector('#loading-wrapper').classList.remove('d-none')
    
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
        "phone_number": phone_number
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    }

    fetch("https://xo6m7i8hlg.execute-api.ap-south-1.amazonaws.com/dev/cognito-custom-auth/initiate-auth", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            // Removing loading screen after getting result
            document.querySelector('#loading-wrapper').classList.add('d-none')

            if(result.statusCode == 200){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'OTP successfully sent to your mobile number.'
                })

                parsedBody = JSON.parse(result.body)
                sessionStorage.setItem('session',parsedBody.Session)
                sessionStorage.setItem('username', phone_number)
                // Hiding the mobile number form and reveal otp form
                document.getElementById('sign-in').classList.add('d-none')
                document.getElementById('verify-otp').classList.remove('d-none')
                document.querySelector('#mobile_number_placeholder').innerHTML = phone_number

                // Add the event listener
                window.addEventListener('beforeunload', handleBeforeUnload)
                
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong',
                    footer: `<div class="alert alert-danger">${result.body}</div>`
                })
            }
        })
        .catch((error) => console.error(error))
}

// For OTP form
document.querySelector('#otpBtn').addEventListener('click', (e) => {

    const inputs = document.querySelectorAll('.otp-field input')
    let otp = ''
    inputs.forEach(input => {
        otp += input.value
    })
    console.log(`Entered OTP: ${otp}`)
    // Displaying loading screen
    document.querySelector('#loading-wrapper').classList.remove('d-none')
    verifyOTP(otp)
})

function verifyOTP(OTP){
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
        "username": sessionStorage.getItem('username'),
        "answer": OTP,
        "session": sessionStorage.getItem('session')    
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    }

    fetch("https://xo6m7i8hlg.execute-api.ap-south-1.amazonaws.com/dev/cognito-custom-auth/respond-to-auth-challenge", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            // Remove loading screen
            document.querySelector('#loading-wrapper').classList.add('d-none')
            if(result.statusCode == 200){
                try {
                    parsedBody = JSON.parse(result.body)
                    sessionStorage.setItem('id_token', parsedBody.AuthenticationResult.IdToken)
                    sessionStorage.setItem('access_token', parsedBody.AuthenticationResult.AccessToken)
                    
                    // Removing the eventListener
                    window.removeEventListener('beforeunload', handleBeforeUnload)
                    location.href = `https://dailykural.in/searchblogs.html#id_token=${parsedBody.AuthenticationResult.IdToken}&access_token=${parsedBody.AuthenticationResult.AccessToken}`
                }
                catch(error){
                    console.log(error)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: 'Invalid OTP!',
                        footer: `<div class="alert alert-danger">You entered invalid OTP request again for OTP!</div>`
                    })
                }
            }
        })
        .catch((error) => console.error(error))
}

function resendOTP(){
   let number = document.querySelector('#mobile_number_placeholder').innerHTML
   signIn(number)
}