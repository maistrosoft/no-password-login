document.querySelector('#form').addEventListener('submit', (e) => {
    // Prevent the submit event
    e.preventDefault()

    const phone_number = document.querySelector('#number')

    // Calling the signIN function
    // Displaying loading screen
    document.querySelector('#loading-wrapper').classList.remove('d-none')

    signIn(phone_number.value)
})

function signIn(phone_number) {
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

            console.log(result.body)
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
                document.getElementById('sign-in').style.display = 'none'
                document.getElementById('verify-otp').style.display = 'block'
                document.querySelector('#mobile_number_placeholder').innerHTML = phone_number
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
document.querySelector('#otpForm').addEventListener('submit', (e) => {
    // preventing the submit event
    e.preventDefault()

    const OTP = document.querySelector('#OTPnumber')

    // Displaying loading screen
    document.querySelector('#loading-wrapper').classList.remove('d-none')
    verifyOTP(OTP.value)
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
            // Remove loading screen
            document.querySelector('#loading-wrapper').classList.add('d-none')
            console.log(result)
            if(result.statusCode == 200){
                parsedBody = JSON.parse(result.body)
                console.log(parsedBody.AuthenticationResult)
                sessionStorage.setItem('id_token', parsedBody.AuthenticationResult.IdToken)
                sessionStorage.setItem('access_token', parsedBody.AuthenticationResult.AccessToken)
                location.href = `https://dailykural.in/searchblogs.html#id_token=${parsedBody.AuthenticationResult.IdToken}&access_token=${parsedBody.AuthenticationResult.AccessToken}`
            }
        })
        .catch((error) => console.error(error))
}