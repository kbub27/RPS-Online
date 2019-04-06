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

    var database = firebase.database();
    var player = {
        user1: {
            name: '',
            assigned: false,
            choice: '',
            wins: 0,
            user: 1
        },
        user2: {
            name: '',
            assigned: false,
            choice: '',
            wins: 0,
            user: 2
        }
    };
    var inGame = false;

    var connectionsRef = database.ref('/connections');

    var connectedRef = database.ref('.info/connected');

    connectedRef.on("value", function (snap) {

        if (snap.val()) {

            var connection = connectionsRef.push(true);

            connection.onDisconnect().remove();
        }
    });

    connectionsRef.on('value', function (snapshot) {
        $('#veiwers').text('You have ' + snapshot.numChildren() + ' veiwers watching you play now!');
    });

    $('.joinGame').on('click', function (event) {
        event.preventDefault();

        if ($('.playerName').val().trim() !== '' && !(player.user1.assigned && player.user2.assigned)) {
            if (player.user1.assigned === false) {
                player.user1.name = $('.playerName').val().trim();
                player.user1.assigned = true;
                database.ref().child('/players/player1').set(player.user1);
                database.ref().child('/playerTurn').set(1);
                database.ref('/players/player1').onDisconnect().remove();
            } else if (player.user2.assigned === false) {
                player.user2.assigned = true;
                player.user2.name = $('.playerName').val().trim();
                database.ref().child('/players/player2').set(player.user2);
                database.ref('/players/player2').onDisconnect().remove();
            } else {
                alert('The Game is already at full capacity');
            }
        }
    });

    database.ref("/players/").on("child_removed", function (snap) {
        if (snap.val().user === 1) {
            player.user1.assigned = false;
        } else if (snap.val().user === 2) {
            player.user2.assigned = false;
        }
    })
})