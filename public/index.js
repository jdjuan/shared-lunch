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
	$('#addUser').click(addUser);
	$('#addMatch').click(addMatch);
	$('#fetchMatchesPerUser').click(fetchMatchesPerUser);
	$('#generateMatches').click(generateMatches);
}

function fetchUsers() {
	userRef.on('value', function (snapshot) {
		var options = $(".user-list");
		options.children().remove();
		fetchedUsers = snapshot.val();
		users = {};
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

function addUser() {
	var email = $('#email').val();
	var primerNombre = $('#primerNombre').val();
	var apellido = $('#apellido').val();
	var lugarPreferido = $('#lugarPreferido').val();
	var newUserKey = userRef.push();
	newUserKey.set({
		email: email,
		primerNombre: primerNombre,
		apellido: apellido,
		lugarPreferido: lugarPreferido,
		active: true,
		currentMatch: 'NO_MATCH_SET'
	});
}

function addMatch() {
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
			//delete this
			userIds = userIds.removeItem(leftId);
			var rightId = matchLeft.currentMatch;
			if (rightId !== 'NO_MATCH_SET') {
				var matchRight = users[rightId];
				var disableConfirm = '';
				var disableUnConfirm = 'disabled="true"';
				if (matchRight.matchConfirmed) {
					disableConfirm = 'disabled="true"';
					disableUnConfirm = '';
				}
				userIds = userIds.removeItem(rightId);
				var names = matchLeft.primerNombre + ' - ' + matchRight.primerNombre;
				var templateButton = '<button data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="showTemplate">Show Template</button>';
				var confirmButton = ' <button id="confirm-' + leftId + rightId + '" data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="confirmMatch" ' + disableConfirm + '>Confirm</button> ';
				var unConfirmButton = ' <button id="unconfirm-' + leftId + rightId + '" data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="unConfirmMatch" ' + disableUnConfirm + '>Unconfirm</button>';
				matchesElement.append('<li>' + names + ' ' + templateButton + ' ' + confirmButton + ' ' + unConfirmButton + '</li>');
			} else {
				matchesElement.append('<li>' + matchLeft.primerNombre + ' - NO MATCH</li>');
			}
		}
	}
	$('.showTemplate').click(function() {
		showTemplate(this);
	});
	$('.confirmMatch').click(function () {
		confirmMatch(true, this);
	});
	$('.unConfirmMatch').click(function () {
		confirmMatch(false, this);
	});
}

function showTemplate(element) {
	var leftId = $(element).data('left-id');
	var rightId = $(element).data('right-id');
	$('#mailTemplate').val(leftId + ' ' + rightId);
}

function confirmMatch(confirmed, element) {
	var leftId = $(element).data('leftId');
	var rightId = $(element).data('rightId');
	$('#confirm-' + leftId + rightId).prop('disabled', confirmed);
	$('#unconfirm-' + leftId + rightId).prop('disabled', !confirmed);
	userRef.child(leftId).child('matchConfirmed').set(confirmed);
	userRef.child(rightId).child('matchConfirmed').set(confirmed);
	fetchCurrentMatches();
}

function generateMatches() {
	restartMatches();
	var generatedMatchesElement = $('#generatedMatches');
	var usersForThisRound = getUsersForThisRound();
	usersForThisRound = excludeOddUser(usersForThisRound);
	var remainingUsers = Object.keys(usersForThisRound);
	for (var user in usersForThisRound) {
		if (remainingUsers.length && remainingUsers.indexOf(user) !== -1) {
			remainingUsers = remainingUsers.removeItem(user);
			var selectedMatch = remainingUsers[getRandomNumber(remainingUsers.length)];
			remainingUsers = remainingUsers.removeItem(selectedMatch);
			usersForThisRound[user].currentMatch = selectedMatch;
			userRef.child(user).child('currentMatch').set(selectedMatch);
			usersForThisRound[selectedMatch].currentMatch = user;
			userRef.child(selectedMatch).child('currentMatch').set(user);
		}
	}
	fetchCurrentMatches();
}

function restartMatches() {
	for (userId in users) {
		if (!users[userId].matchConfirmed) {
			userRef.child(userId).child('currentMatch').set('NO_MATCH_SET');
		}
	}
}

function getUsersForThisRound() {
	var usersForThisRound = {};
	for (var userId in users) {
		var currentUser = users[userId];
		if (!currentUser.matchConfirmed) {
			usersForThisRound[userId] = currentUser;
		}
	}
	return usersForThisRound;
}

function excludeOddUser(usersForThisRound) {
	if (Object.keys(usersForThisRound).length % 2 !== 0) {
		var userIds = Object.keys(usersForThisRound);
		var excludedUserId = userIds[getRandomNumber(userIds.length)];
		delete usersForThisRound[excludedUserId];
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