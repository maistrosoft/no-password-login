document.getElementById('verify-otp').style.display = 'none'

document.querySelector('.fa-chevron-left').addEventListener('click', function() {
  document.getElementById('sign-in').style.display = 'block'
  document.getElementById('verify-otp').style.display = 'none'
});

// phone number validation
function validateMobileNumber(number) {
  // Define the regular expression for validation
  const regex = /^\+\d{8,14}$/

  // Test the number against the regular expression
  return regex.test(number)
}

function validation(){
  number = document.querySelector('#number')
  flag = validateMobileNumber(number.value)
  if(flag){
    number.style.border = "2px solid green"
  }
  else {
    number.style.border = "2px solid red"
  }
}
                                                                          