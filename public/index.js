$(function () {
	var userRef;
	var availableUsers;
	bootstrapFirebase();
	bootstrapEvents();
	fetchUsers();
});


function bootstrapFirebase() {
	var config = {
		apiKey: "AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8",
		authDomain: "shared-lunch.firebaseapp.com",
		databaseURL: "https://shared-lunch.firebaseio.com",
		storageBucket: "shared-lunch.appspot.com",
		messagingSenderId: "44211415855"
	};
	var app = firebase.initializeApp(config);
	var database = firebase.database();
	userRef = firebase.database().ref('users/');
}

function bootstrapEvents() {
	$('#addUser').click(clickAddUser);
	$('#addMatch').click(clickAddMatch);
	$('#showMatches').click(fetchMatches);
	$('#generateMatches').click(generateMatches);
}

function fetchUsers() {
	userRef.on('value', function (snapshot) {
		var options = $(".user-list");
		options.children().remove();
		var users = snapshot.val();
		availableUsers = {};
		for (var userId in users) {
			var currentUser = users[userId];
			if (currentUser.active) {
				availableUsers[userId] = currentUser;
			}
			options.append($("<option />").val(userId).text(currentUser.primerNombre));
		}
	});
}

function clickAddUser() {
	var email = $('#email').val();
	var primerNombre = $('#primerNombre').val();
	var apellido = $('#apellido').val();
	var lugarPreferido = $('#lugarPreferido').val();
	addUser(email, primerNombre, apellido, lugarPreferido);
}

function clickAddMatch() {
	var matchLeft = $("#matchLeft").val();
	var matchRight = $("#matchRight").val();
	if (matchLeft !== matchRight) {
		var matchRef = userRef.child(matchLeft).child('matches').child(matchRight);
		matchRef.transaction(function (matches) {
			return matches ? matches + 1 : 1;
		});
	} else {
		alert('No puede seleccionar la misma persona');
	}
}

function addUser(email, primerNombre, apellido, lugarPreferido) {
	var newUserKey = userRef.push();
	newUserKey.set({
		email: email,
		primerNombre: primerNombre,
		apellido: apellido,
		lugarPreferido: lugarPreferido,
		active: true,
		currentMatch: ''
	});
}

function fetchMatches() {
	var userId = $('#fetchMatches').val();
	userRef.child(userId).child('matches').once('value').then(function (snapshot) {
		var matchesElement = $("#userMatches");
		matchesElement.children().remove();
		var matches = snapshot.val();
		for (var match in matches) {
			userRef.child(match).once('value').then(function (snapshot) {
				var user = snapshot.val();
				matchesElement.append('<li>' + user.primerNombre + '</li>');
			});
		}
	});
}

function generateMatches() {
	// var availableUsers = getAvailableUsers();
	console.log(availableUsers);
	var generatedMatchesElement = $('#generatedMatches');
	var userIds = Object.keys(availableUsers);
	excludeOddUser(userIds);
	for (var currentUserId in availableUsers) {
		if (availableUsers[currentUserId].currentMatch) {
			console.log("Entro Continue");
			continue;
		}
		var selectedUserId;
		do {
			selectedUserId = userIds[getRandomNumber(userIds.length)];
			console.log("Entro while");
		} while (availableUsers[selectedUserId].currentMatch || selectedUserId === currentUserId);
		userRef.child(currentUserId).child('currentMatch').set(selectedUserId);
		userRef.child(selectedUserId).child('currentMatch').set(currentUserId);
	}
}

function excludeOddUser(userIds) {
	if (userIds.length % 2 !== 0) {
		var excludedUserId = userIds[getRandomNumber(userIds.length)];
		userRef.child(excludedUserId).child('currentMatch').set('no match this round');
	}
}

function getRandomNumber(limit) {
	return parseInt(Math.random() * limit);
}