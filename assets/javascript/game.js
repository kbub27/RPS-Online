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
            name: 'Waiting on Player!',
            assigned: false,
            choice: 'none',
            wins: 0,
            losses: 0,
            user: 1,
            battlecry: ''
        },
        user2: {
            name: 'Waiting on Player!',
            assigned: false,
            choice: 'none',
            wins: 0,
            losses: 0,
            user: 2,
            battlecry: ''
        }
    };

    var firstPlayerCry = database.ref().child('/players/player1/battlecry');
    var secondPlayerCry = database.ref().child('/players/player2/battlecry');
    var firstPlayerName = database.ref().child('/players/player1/name');
    var secondPlayerName = database.ref().child('/players/player2/name');
    var firstPlayerChoice = database.ref().child('/players/player1/choice');
    var secondPlayerChoice = database.ref().child('/players/player2/choice');
    var firstPlayerWins = database.ref().child('/players/player1/wins');
    var secondPlayerWins = database.ref().child('/players/player2/wins');
    var firstPlayerLosses = database.ref().child('/players/player1/losses');
    var secondPlayerLosses = database.ref().child('/players/player2/losses');
    var pOneVal = '';
    firstPlayerChoice.on('value', function (snap) {
        pOneVal = snap.val();
        checkChoices();
    })
    var pTwoVal = '';
    secondPlayerChoice.on('value', function (snap) {
        pTwoVal = snap.val();
        checkChoices();
    })
    var pOneAssigned = database.ref().child('/players/pOneAssigned');
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
    database.ref().child('/players/player1').set(player.user1);
    database.ref('/players/player1').onDisconnect().remove();
    database.ref().child('/players/player2').set(player.user2);
    database.ref('/players/player2').onDisconnect().remove();
    pOneAssigned.set(2);
    var assigned;
    pOneAssigned.on('value', function (snap) {
        assigned = snap.val();
    });
    
    $('.joinGame').on('click', function (event) {
        event.preventDefault();
        // CHECK TO MAKE SURE A NAME WAS ENTERED
        if ($('.playerName').val().trim() !== '') {
            // CHECK TO MAKE SURE THERE IS AN AVAILABLE SPOT OPEN IN THE GAME AND ASSIGN TO OPEN SPOT
            var username = $('#playerInput').val();
            var battleCry = $('#quote').val();
            database.ref('/players/player1/assigned').on('value', function (snapshot) {
                if (snapshot.val() === false && assigned === 2) {
                    database.ref().child('/players/player1/assigned').set(true);
                    firstPlayerName.set(username);
                    firstPlayerCry.set(battleCry);
                    firstPlayerLosses.set(player.user1.losses);
                    firstPlayerWins.set(player.user1.wins);
                    $('.pOneWins').text('Wins: ' + player.user1.wins);
                    $('.pOneLosses').text('Losses: ' + player.user1.losses);
                } 
            });
            database.ref('/players/player2/assigned').on('value', function (snapshot) {
                if (snapshot.val() === false && assigned === 5) {
                    pOneAssigned.set(6);
                    database.ref().child('/players/player2/assigned').set(true);
                    secondPlayerName.set(username);
                    secondPlayerCry.set(battleCry);
                    secondPlayerLosses.set(player.user2.losses);
                    secondPlayerWins.set(player.user2.wins);
                    $('.pTwoWins').text('Wins: ' + player.user2.wins);
                    $('.pTwoLosses').text('Losses: ' + player.user2.losses);
                } 
            });
        };
        
        
        $('#playerInput').val('');
        $('#quote').val('');
        hideJumbo();
        pOneAssigned.set(5)
        
    });
    firstPlayerName.on('value', function (snap) {
        $('.usernamePlayerOne').text(snap.val()); 
    });
    firstPlayerCry.on('value', function (snap) {
        $('.battleCryOne').text(snap.val());
    });
    secondPlayerName.on('value', function (snap) {
        $('.usernamePlayerTwo').text(snap.val()); 
    });
    secondPlayerCry.on('value', function (snap) {
        $('.battleCryTwo').text(snap.val());
    });
    // WHEN A PLAYER LEAVES THE GAME RESET THE ASSIGNED VALUE OF THAT PLAYER TO FALSE 
    database.ref("/players/").on("child_removed", function (snap) {
            if (snap.val().user === 1) {
                player.user1.assigned = false;
                player.user1.name = '';
                player.user1.choice = 'none';
                player.user1.wins = 0;
                player.user1.losses = 0;
                pOneAssigned.set(2);
                $('.pOneWins').text('Wins: ' + player.user1.wins);
                $('.pOneLosses').text('Losses: ' + player.user1.losses);
                $('.usernamePlayerOne').text('Waiting on Player!');
                $('.battleCryOne').text('');
                database.ref().child('/players/player1').set(player.user1);
            } else if (snap.val().user === 2) {
                player.user2.assigned = false;
                player.user2.name = '';
                player.user2.choice = 'none';
                player.user2.wins = 0;
                player.user2.losses = 0;
                pOneAssigned.set(5);
                $('.pTwoWins').text('Wins: ' + player.user2.wins);
                $('.pTwoLosses').text('Losses: ' + player.user2.losses);
                $('.usernamePlayerTwo').text('Waiting on Player!');
                $('.battleCryTwo').text('');
                database.ref().child('/players/player2').set(player.user2);
            };
            hideJumbo();
        });
    // SET FUNCTION TO SET CHOICES IN THE DATABASE PER PLAYER AS LONG AS A CHOICE HASNT ALREADY BEEN MADE THIS TURN


        $('.playerOneChoice').on('click', function () {
            pOneVal = $(this).attr('data-value');
            firstPlayerChoice.on('value', function (snapshot) {
                if ((snapshot.val() === 'rock') || (snapshot.val() === 'paper') || (snapshot.val() === 'scissors')) {
                    $('.madeChoice').text('You have made a choice.')
                } else {
                    firstPlayerChoice.set(pOneVal);
                    console.log(pOneVal);
                    checkChoices();
                };

            });
        });

        $('.playerTwoChoice').on('click', function () {
            pTwoVal = $(this).attr('data-value');
            secondPlayerChoice.on('value', function (snapshot) {
                if ((snapshot.val() === 'rock') || (snapshot.val() === 'paper') || (snapshot.val() === 'scissors')) {
                    $('.madeChoiceTwo').text('You have made a choice.')
                } else {
                    secondPlayerChoice.set(pTwoVal);
                    console.log(pTwoVal);
                    checkChoices();
                };

            });
        });

    // SET FUNCTION TO CHECK PLAYER ONE CHOICE AGAINST PLAYER TWO CHOICE THEN DETERMINE A WINNER BASED ON ROCK PAPER SCISSOR RULES
    function checkChoices() {
        if ((pOneVal === 'rock' && pTwoVal === 'rock') || (pOneVal === 'paper' && pTwoVal === 'paper') || (pOneVal === 'scissors' && pTwoVal === 'scissors')) {
            $('.gameResults').text('You both picked the same choice! Pick Again!');
            $('.madeChoice').text('Pick Again!');
            $('.madeChoiceTwo').text('Pick Again!');
            firstPlayerChoice.set('none');
            secondPlayerChoice.set('none');
        } else if ((pOneVal === 'rock' && pTwoVal === 'scissors') || (pOneVal === 'paper' && pTwoVal === 'rock') || (pOneVal === 'scissors' && pTwoVal === 'paper')) {
            player.user1.wins++;
            player.user2.losses++;
            firstPlayerWins.set(player.user1.wins);
            secondPlayerLosses.set(player.user2.losses);
            $('.gameResults').text($('.usernamePlayerOne').text() + ' Has Won this round!');
            $('.madeChoice').text('');
            $('.madeChoiceTwo').text('');
            $('.pOneWins').text('Wins: ' + player.user1.wins);
            $('.pTwoLosses').text('Losses: ' + player.user2.losses);
            firstPlayerChoice.set('none');
            secondPlayerChoice.set('none');
        } else if ((pTwoVal === 'rock' && pOneVal === 'scissors') || (pTwoVal === 'paper' && pOneVal === 'rock') || (pTwoVal === 'scissors' && pOneVal === 'paper')) {
            player.user2.wins++;
            player.user1.losses++;
            secondPlayerWins.set(player.user2.wins);
            firstPlayerLosses.set(player.user1.losses);
            $('.gameResults').text($('.usernamePlayerTwo').text() + ' Has Won this round!');
            $('.madeChoice').text('');
            $('.madeChoiceTwo').text('');
            $('.pTwoWins').text('Wins: ' + player.user2.wins);
            $('.pOneLosses').text('Losses: ' + player.user1.losses);
            firstPlayerChoice.set('none');
            secondPlayerChoice.set('none');
        }
    };

    function hideJumbo() {
        if (pOneAssigned === 6) {
            $('.jumbotron').hide();
        } else {
            $('.jumbotron').show();
        }
    };

    var storedmsg;
    var chatEntry = $("<div>").html(storedmsg);
    $('#chat-send').on('click', function (event) {
        event.preventDefault();
        var msg = $('#chat-input').val();
        database.ref('/players/chat').child(msg);
        database.ref('/players/chat').on('value', function (snap) {
            storedmsg = snap.val();
            console.log(storedmsg);
        })

        $('#chat-input').val('');
    });

    $("#chatDisplay").append(chatEntry);
    $("#chatDisplay").scrollTop($("#chatDisplay")[0].scrollHeight);

    checkChoices();
});