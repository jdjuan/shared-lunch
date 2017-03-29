function fetchCurrentMatches() {
	var matchesElement = $("#currentMatches");
	var userIds = Object.keys(usersStream);
	matchesElement.children().remove();
	for (var leftId in usersStream) {
		if (userIds.indexOf(leftId) !== -1) {
			var matchLeft = usersStream[leftId];
			//delete this
			userIds = userIds.removeItem(leftId);
			var rightId = matchLeft.currentMatch;
			if (rightId !== 'NO_MATCH_SET') {
				var matchRight = usersStream[rightId];
				var disableConfirm = '';
				var disableUnConfirm = 'disabled="true"';
				if (matchRight.matchConfirmed) {
					disableConfirm = 'disabled="true"';
					disableUnConfirm = '';
				}
				userIds = userIds.removeItem(rightId);
				var names = matchLeft.firstName + ' - ' + matchRight.firstName;
				var templateButton = '<button data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="showTemplate">Show Template</button>';
				var confirmButton = ' <button id="confirm-' + leftId + rightId + '" data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="confirmMatch" ' + disableConfirm + '>Confirm</button> ';
				var unConfirmButton = ' <button id="unconfirm-' + leftId + rightId + '" data-left-id="' + leftId + '" data-right-id="' + rightId + '" class="unConfirmMatch" ' + disableUnConfirm + '>Unconfirm</button>';
				matchesElement.append('<li>' + names + ' ' + templateButton + ' ' + confirmButton + ' ' + unConfirmButton + '</li>');
			} else {
				matchesElement.append('<li>' + matchLeft.firstName + ' - NO MATCH</li>');
			}
		}
	}
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
	var usersForThisRound = filterOddUser(getActiveUsers());
	return usersForThisRound;
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