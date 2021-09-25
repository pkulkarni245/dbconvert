// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8FkKNfXk4iyeP3xGcpYHJr0PIXWhz0ag",
    authDomain: "db-convert.firebaseapp.com",
    databaseURL: "https://db-convert-default-rtdb.firebaseio.com",
    projectId: "db-convert",
    storageBucket: "db-convert.appspot.com",
    messagingSenderId: "859949906740",
    appId: "1:859949906740:web:806526149c6d98582e8361",
    measurementId: "G-HBGR50J4SN"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();