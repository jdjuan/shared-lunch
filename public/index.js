$(function () {
	bootstrapFirebase();
	bootstrapEvents();
	fetchUsers();
});

var userRef;
var users = {};

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
	$('#fetchMatchesPerUser').click(fetchMatchesPerUser);
	$('#generateMatches').click(generateMatches);
	$('#fetchCurrentMatches').click(fetchCurrentMatches);
}

function fetchUsers() {
	userRef.on('value', function (snapshot) {
		var options = $(".user-list");
		options.children().remove();
		fetchedUsers = snapshot.val();
		for (var userId in fetchedUsers) {
			var currentUser = fetchedUsers[userId];
			if (currentUser.active) {
				users[userId] = currentUser;
			}
			options.append($("<option />").val(userId).text(currentUser.primerNombre));
		}
		fetchCurrentMatches();
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

function fetchMatchesPerUser() {
	var userId = $('#userToFetchMatchesFrom').val();
	var matchesElement = $("#userMatches");
	matchesElement.children().remove();
	var matches = users[userId].matches;
	for (var match in matches) {
		matchesElement.append('<li>' + users[match].primerNombre + '</li>');
	}
}

function fetchCurrentMatches() {
	var matchesElement = $("#currentMatches");
	var userIds = Object.keys(users);
	matchesElement.children().remove();
	for (var leftId in users) {
		if (userIds.indexOf(leftId) !== -1) {
			var matchLeft = users[leftId];
			userIds = userIds.removeItem(leftId);
			var rightId = users[leftId].currentMatch;
			if (rightId !== 'no match this round') {
				var matchRight = users[rightId];
				userIds = userIds.removeItem(rightId);
				var names = matchLeft.primerNombre + ' - ' + matchRight.primerNombre;
				var templateButton = '<button data-leftId="' + leftId + '" data-rigthId="' + rightId + '" class="showTemplate">Show Template</button>';
				var confirmButton = ' <button id="confirm-' + leftId + rightId + '" data-leftId="' + leftId + '" data-rigthId="' + rightId + '" class="confirmMatch" disabled=' + disable +'>Confirm</button> ';
				var unConfirmButton = ' <button id="unconfirm-' + leftId + rightId + '" data-leftId="' + leftId + '" data-rigthId="' + rightId + '" class="unConfirmMatch"' + disable +'>Unconfirm</button>';
				matchesElement.append('<li>' + names + ' ' + templateButton + ' ' + confirmButton + ' ' + unConfirmButton + '</li>');
			} else {
				matchesElement.append('<li>' + matchLeft.primerNombre + ' - NO MATCH</li>');
			}
		}
	}
	$('.showTemplate').click(showTemplate);
	$('.confirmMatch').click(function () {
		confirmMatch(true, this);
	});
	$('.unConfirmMatch').click(function () {
		confirmMatch(false, this);
	});
}

function showTemplate() {
	var leftId = $(element).data('leftId');
	var rightId = $(element).data('rightId');
	$('#mailTemplate').val(leftId + ' ' + rightId);
}

function confirmMatch(confirmed, element) {
	var leftId = $(element).data('leftId');
	var rightId = $(element).data('rightId');
	$('#confirm-' + leftId + rightId).prop('disabled', confirmed);
	$('#unconfirm-' + leftId + rightId).prop('disabled', !confirmed);
	userRef.child(leftId).child('matchConfirmed').set(confirmed);
	userRef.child(rightId).child('matchConfirmed').set(confirmed);
}

function generateMatches() {
	var generatedMatchesElement = $('#generatedMatches');
	var usersForThisRound = getUsersForThisRound();
	usersForThisRound = excludeOddUser(usersForThisRound);
	var userIds = Object.keys(usersForThisRound);
	for (var currentUserId in usersForThisRound) {
		if (usersForThisRound[currentUserId].currentMatch) {
			continue;
		}
		userIds = userIds.removeItem(currentUserId);
		var selectedUserId = userIds[getRandomNumber(userIds.length)];
		userIds = userIds.removeItem(selectedUserId);
		usersForThisRound[currentUserId].currentMatch = selectedUserId;
		userRef.child(currentUserId).child('currentMatch').set(selectedUserId);
		usersForThisRound[selectedUserId].currentMatch = currentUserId;
		userRef.child(selectedUserId).child('currentMatch').set(currentUserId);
	}
	fetchCurrentMatches();
}

function restartMatches() {
	for (userId in users) {
		userRef.child(userId).child('currentMatch').set('');
	}
}

function getUsersForThisRound() {
	var usersForThisRound = {};
	for (var userId in users) {
		var currentUser = users[userId];
		if (!currentUser.currentMatch && !currentUser.matchConfirmed) {
			usersForThisRound[userId] = currentUser;
		}
	}
	return usersForThisRound;
}

function excludeOddUser(usersForThisRound) {
	if (usersForThisRound.length % 2 !== 0) {
		var userIds = Object.keys(usersForThisRound);
		var excludedUserId = userIds[getRandomNumber(userIds.length)];
		delete usersForThisRound[excludedUserId];
		userRef.child(excludedUserId).child('currentMatch').set('no match this round');
		return usersForThisRound;
	}
	return usersForThisRound;
}

function getRandomNumber(limit) {
	return parseInt(Math.random() * limit);
}

Array.prototype.clone = function () {
	return this.slice(0);
};

Array.prototype.removeItem = function (value) {
	var array = this.clone();
	var indexOfKey = array.indexOf(value);
	array.splice(indexOfKey, 1)
	return array;
};