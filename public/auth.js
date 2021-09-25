$(document).ready(function(){
  firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in successfully");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + ": " + errorMessage);
  });
});