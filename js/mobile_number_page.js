document.getElementById('verify-otp').style.display = 'none';

// document.getElementById('request-otp').addEventListener('click', function() {
//   document.getElementById('sign-in').style.display = 'none';
//   document.getElementById('verify-otp').style.display = 'block';
// });

document.querySelector('.fa-chevron-left').addEventListener('click', function() {
  document.getElementById('sign-in').style.display = 'block';
  document.getElementById('verify-otp').style.display = 'none';
});
