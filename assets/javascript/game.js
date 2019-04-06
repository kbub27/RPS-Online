$(document).ready(function() {
      
    var config = {
        apiKey: "AIzaSyCq7Y5QgjS7-psjlZh37ycLCe5O86Ul4yE",
        authDomain: "rps-game-da651.firebaseapp.com",
        databaseURL: "https://rps-game-da651.firebaseio.com",
        projectId: "rps-game-da651",
        storageBucket: "rps-game-da651.appspot.com",
        messagingSenderId: "20382010182"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
})