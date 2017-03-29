function fetchCurrentMatches() {
	var matchesElement = $("#currentMatches");
	matchesElement.children().remove();
	var allUsers = getAllUsers();
	remainingUsers = allUsers.slice();
	allUsers.map(function (user) {
		if (userListHasUser(remainingUsers, user)) {
			remainingUsers = removeUserFromList(remainingUsers, user);
			if (user.currentMatch !== 'NO_MATCH_SET') {
				var match = findUserById(allUsers, user.currentMatch);
				matchesElement.append(getMatchHTML(user, match));
				remainingUsers = removeUserFromList(remainingUsers, match);
			} else {
				matchesElement.append('<li>' + user.firstName + ' - NO MATCH</li>');
			}
		}
	});
	addMatchesEvents();
}

function addMatchesEvents() {
	$('.showTemplate').click(function () {
		showTemplate(this);
	});
	$('.confirmMatch').click(function () {
		confirmMatch(true, this);
	});
	$('.unConfirmMatch').click(function () {
		confirmMatch(false, this);
	});
}

function getMatchHTML(matchLeft, matchRight) {
	var disableConfirm = '';
	var disableUnConfirm = 'disabled="true"';
	if (matchRight.matchConfirmed) {
		disableConfirm = 'disabled="true"';
		disableUnConfirm = '';
	}
	var names = matchLeft.firstName + ' - ' + matchRight.firstName;
	var templateButton = '<button data-left-id="' + matchLeft.id + '" data-right-id="' + matchRight.id + '" class="showTemplate">Show Template</button>';
	var confirmButton = ' <button id="confirm-' + matchLeft.id + matchRight.id + '" data-left-id="' + matchLeft.id + '" data-right-id="' + matchRight.id + '" class="confirmMatch" ' + disableConfirm + '>Confirm</button> ';
	var unConfirmButton = ' <button id="unconfirm-' + matchLeft.id + matchRight.id + '" data-left-id="' + matchLeft.id + '" data-right-id="' + matchRight.id + '" class="unConfirmMatch" ' + disableUnConfirm + '>Unconfirm</button>';
	return '<li>' + names + ' ' + templateButton + ' ' + confirmButton + ' ' + unConfirmButton + '</li>';
}

function generateMatches() {
	restartMatches();
	selectMatches();
}

function restartMatches() {
	for (userId in usersStream) {
		if (!usersStream[userId].matchConfirmed) {
			userRef.child(userId).child('currentMatch').set('NO_MATCH_SET');
		}
	}
}

function selectMatches() {
	var usersForThisRound = getUsersForThisRound();
	var availableMatches = usersForThisRound.slice();
	usersForThisRound.map(function (user) {
		if (userListHasUser(availableMatches, user)) {
			availableMatches = removeUserFromList(availableMatches, user);
			var filteredUsers = filterRepeatedMatches(availableMatches, user.id);
			filteredUsers = filterUsersByLocation(filteredUsers, user.location);
			var selectedMatch = getRandomUser(filteredUsers);
			availableMatches = removeUserFromList(availableMatches, selectedMatch);
			userRef.child(user.id).child('currentMatch').set(selectedMatch.id);
			userRef.child(selectedMatch.id).child('currentMatch').set(user.id);
		}
	});
}

function findUserById(users, id) {
	return users.find(function (user) {
		return user.id === id;
	});
}

function getRandomUser(users) {
	return users[getRandomNumber(users.length)];
}

function userListHasUser(users, userToFind) {
	return users.find(function (user) {
		return user.id === userToFind.id;
	});
}

function printUserList(text, users) {
	// console.log(text + ':', users.reduce(function (total, user) {
	// 	return total + user.firstName + ' | ';
	// }, ''));
}

function removeSetMatchesFromList(users) {
	return users.filter(function (user) {
		return user.currentMatch === '';
	});
}

function removeUserFromList(users, userToRemove) {
	return users.filter(function (user) {
		return user.id !== userToRemove.id;
	});
}

function filterRepeatedMatches(users, userIdToFilter) {
	var filteredUsers = users.filter(function (user) {
		var matches = jsObjectToArray(user.matches || []);
		return notMatchedBefore(matches, userIdToFilter);
	});
	return filteredUsers.length ? filteredUsers : users;
}

function notMatchedBefore(matches, userId) {
	return matches.every(function (match) {
		return match.id !== userId;
	});
}

function filterUsersByLocation(users, location) {
	if (location === 2) {
		return users;
	}
	var filteredUsers = users.filter(function (user) {
		return user.location === 2 || user.location === location;
	});
	return filteredUsers.length ? filteredUsers : users;
}

function getUsersForThisRound() {
	var usersForThisRound = filterConfirmedMatches(filterOddUser(getActiveUsers()));
	return usersForThisRound;
}

function filterConfirmedMatches(users) {
	return users.filter(function (user) {
		return !user.matchConfirmed;
	});
}

function filterOddUser(users) {
	var filteredUsers = users.slice();
	if (users.length % 2) {
		var excludedUser = filteredUsers.splice(getRandomNumber(filteredUsers.length), 1);
		printUserList('excluded odd user', excludedUser);
	} else {
		return users;
	}
	return filteredUsers;
}

function getActiveUsers() {
	var activeUsers = filterActiveUsers(getAllUsers());
	printUserList('active users', activeUsers);
	return activeUsers;
}

function filterActiveUsers(users) {
	return users.filter(function (user) {
		return user.active;
	});
}

function getAllUsers() {
	var allUsers = jsObjectToArray(usersStream);
	printUserList('all users', allUsers);
	return allUsers;
}

function jsObjectToArray(object) {
	var array = [];
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			var currentObject = {};
			if (typeof object[key] === 'object') {
				currentObject = object[key];
			} else {
				currentObject.value = object[key];
			}
			currentObject.id = key;
			array.push(currentObject);
		}
	}
	return array;
}

function getRandomNumber(limit) {
	return parseInt(Math.random() * limit);
}