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
    var player = {
        user1: {
            assigned: false
        },
        user2: {
            assigned: false
        }
    };
    var inGame = false;

    var connectionsRef = database.ref('/connections');

    var connectedRef = database.ref('.info/connected');

    connectedRef.on("value", function(snap) {

        // If they are connected..
        if (snap.val()) {
      
          // Add user to the connections list.
          var connection = connectionsRef.push(true);
      
          // Remove user from the connection list when they disconnect.
          connection.onDisconnect().remove();
        }
    });

    connectionsRef.on('value', function (snapshot) {
            $('#veiwers').text('You have ' + snapshot.numChildren() + ' veiwers watching you play now!');
    });

    function joinGame() {
        if (player.user1.assigned && player.user2.assigned) {
            alert('Already two users playing the Game')
        } else if (player.user1.assigned) {
            player.user2.assigned = true;
        } else {
            player.user1.assigned = true;
        }
    };

    function leaveGame() {
        
    }
})