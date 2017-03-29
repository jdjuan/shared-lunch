$(function () {
	bootstrapFirebase();
	bootstrapEvents();
	fetchUsers();
});

var userRef;
var usersStream = {};

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
	$('#restartMatches').click(restartMatches);
	$('#activateUser').click(activateUser);
	$('#inactivateUser').click(inactivateUser);
}

function fetchUsers() {
	userRef.on('value', function (snapshot) {
		var options = $(".user-list");
		var optionsActive = $("#usersToActivate");
		var optionsInactive = $("#usersToInactivate");
		options.children().remove();
		optionsActive.children().remove();
		optionsInactive.children().remove();
		fetchedUsers = snapshot.val();
		usersStream = {};
		for (var userId in fetchedUsers) {
			var currentUser = fetchedUsers[userId];
			if (currentUser.active) {
				optionsInactive.append($("<option />").val(userId).text(currentUser.lastName + ' ' + currentUser.firstName));
				usersStream[userId] = currentUser;
			} else {
				optionsActive.append($("<option />").val(userId).text(currentUser.lastName + ' ' + currentUser.firstName));
			}
			options.append($("<option />").val(userId).text(currentUser.lastName + ' ' + currentUser.firstName));
		}
		fetchCurrentMatches();
	});
}

function addUser() {
	var email = $('#email').val();
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var location = parseInt($('#location').val());
	var newUserKey = userRef.push();
	newUserKey.set({
		email: email,
		firstName: firstName,
		lastName: lastName,
		//location => 0: Adentro, 1: Afuera, 2: Cualquiera
		location: location,
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
		matchRef = userRef.child(matchRight).child('matches').child(matchLeft);
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
	var matches = usersStream[userId].matches;
	for (var match in matches) {
		matchesElement.append('<li>' + usersStream[match].firstName + '</li>');
	}
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

function showTemplate(element) {
	var leftUser = getUserById($(element).data('left-id'));
	var rightUser = getUserById($(element).data('right-id'));
	$('#mailTemplate').val('¡Almuerzo Compartido!\n\n'+
	'Hola ' + leftUser.firstName + ' y ' + rightUser.firstName + ',\n\n' +
	'¡Ustedes tendrán un almuerzo compartido!. Esta iniciativa busca romper la rutina al conectarte con alguien aleatoriamente. Pregúntale sobre su vida, sus pasiones y sus metas. Pueden hablar de la música que les gusta y compartir sus canciones favoritas. Mercado del Río es una excelente opción, Mr. Sanchez también, o pueden traer su propio almuerzo y disfrutrarlo en la terraza. Toma la iniciativa y saluda primero:\n\n' +
		leftUser.email + ' \n' +
		rightUser.email + '\n\n' +
		'A partir de este momento quedan en contacto para ir a almorzar juntos.\n\n' +
		'PD: Recuerda que si llegaste a Yuxi en el último mes, tú y tu pareja tendrán un almuerzo gratuito!. Si aplicas déjanoslo saber para explicarte las condiciones.\n\n' +
		'¡Un saludo!\n' +
		'Juan Herrera\n' +
		'Con el Apoyo de Yuxi Global\n');
}

function activateUser() {
	var userId = $('#usersToActivate').val();
	userRef.child(userId).child('active').set(true);
}

function inactivateUser() {
	var userId = $('#usersToInactivate').val();
	userRef.child(userId).child('active').set(false);
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