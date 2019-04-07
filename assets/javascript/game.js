$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyCq7Y5QgjS7-psjlZh37ycLCe5O86Ul4yE",
        authDomain: "rps-game-da651.firebaseapp.com",
        databaseURL: "https://rps-game-da651.firebaseio.com",
        projectId: "rps-game-da651",
        storageBucket: "rps-game-da651.appspot.com",
        messagingSenderId: "20382010182"
    };
    firebase.initializeApp(config);
// SET VARIABLES FOR THE GAME
    var database = firebase.database();
    var player = {
        user1: {
            name: '',
            assigned: false,
            choice: 'none',
            wins: 0,
            user: 1
        },
        user2: {
            name: '',
            assigned: false,
            choice: 'none',
            wins: 0,
            user: 2
        }
    };
    var inGame = false;
// SET CONNECTION REFERANCE VARIABLES
    var connectionsRef = database.ref('/connections');

    var connectedRef = database.ref('.info/connected');

    connectedRef.on("value", function (snap) {

        if (snap.val()) {

            var connection = connectionsRef.push(true);

            connection.onDisconnect().remove();
        }
    });
// SHOW HOW MANY PEOPLES ARE WATCHING THE GAME BEING PLAYED
    connectionsRef.on('value', function (snapshot) {
        $('#veiwers').text('You have ' + snapshot.numChildren() + ' veiwers watching you play now!');
    });
// SET FUNCTION TO JOIN THE GAME ON THE JOIN GAME BUTTON CLICK
    $('.joinGame').on('click', function (event) {
        event.preventDefault();
// CHECK TO MAKE SURE A NAME WAS ENTERED
        if ($('.playerName').val().trim() !== '') {
// CHECK TO MAKE SURE THERE IS AN AVAILABLE SPOT OPEN IN THE GAME AND ASSIGN TO OPEN SPOT
            var username = $('#playerInput').val();
            var battleCry = $('#quote').val();

            if (player.user1.assigned === false) {
                player.user1.name = $('.playerName').val().trim();
                player.user1.assigned = true;
                database.ref().child('/players/player1').set(player.user1);
                database.ref('/players/player1').onDisconnect().remove();
                $('.usernamePlayerOne').text(username);
                $('.battleCryOne').text(battleCry);
            } else if (player.user2.assigned === false) {
                player.user2.assigned = true;
                player.user2.name = $('.playerName').val().trim();
                database.ref().child('/players/player2').set(player.user2);
                database.ref('/players/player2').onDisconnect().remove();
                $('.usernamePlayerTwo').text(username);
                $('.battleCryTwo').text(battleCry);
            } else {
                alert('The Game is already at full capacity');
            }
        }

    });
// WHEN A PLAYER LEAVES THE GAME RESET THE ASSIGNED VALUE OF THAT PLAYER TO FALSE 
    database.ref("/players/").on("child_removed", function (snap) {
        if (snap.val().user === 1) {
            player.user1.assigned = false;
            player.user1.name = '';
            player.user1.choice = 'none';
            player.user1.wins = 0;
        } else if (snap.val().user === 2) {
            player.user2.assigned = false;
            player.user2.name = '';
            player.user2.choice = 'none';
            player.user2.wins = 0;
        }
    });
// SET FUNCTION TO SET CHOICES IN THE DATABASE PER PLAYER AS LONG AS A CHOICE HASNT ALREADY BEEN MADE THIS TURN
    var firstPlayerChoice = database.ref().child('/players/player1/choice');
    var secondPlayerChoice = database.ref().child('/players/player2/choice');

    
    firstPlayerChoice.on('value', function (snapshot) {
        $('.playerOneChoice').on('click', function () {
            if (snapshot.val() === ('rock' || 'paper' || 'scissors')) {
                alert('You have already made a choice.')
            } else{
                firstPlayerChoice.set($(this).attr('data-value'));    
            }
        });       
    });

    secondPlayerChoice.on('value', function (snapshot) {
        $('.playerTwoChoice').on('click', function () {
            if (snapshot.val() === ('rock' || 'paper' || 'scissors')) {
                alert('You have already made a choice.')
            } else{
                secondPlayerChoice.set($(this).attr('data-value'));    
            }
        });       
    });

})