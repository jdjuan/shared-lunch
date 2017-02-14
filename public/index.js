$(function () {
	$('#addUser').click(function () {
		var skype = $('#skype').val();
		var email = $('#email').val();
		var primerNombre = $('#primerNombre').val();
		var apellido = $('#apellido').val();
		var lugar = $('#lugar').val();
		pushUserData(skype, email, primerNombre, apellido, lugar);
	});
});

var config = {
	apiKey: "AIzaSyBqKAZkqej4_iVBTmPof7_3CwivOpskQW8",
	authDomain: "shared-lunch.firebaseapp.com",
	databaseURL: "https://shared-lunch.firebaseio.com",
	storageBucket: "shared-lunch.appspot.com",
	messagingSenderId: "44211415855"
};
var app = firebase.initializeApp(config);

var database = firebase.database();

var userRef = firebase.database().ref('users/');

function writeUserData(userId, name) {
	firebase.database().ref('users/' + userId).set({
		username: name
	});
}

function pushUserData(skype, email, primerNombre, apellido, lugar) {
	var newUser = userRef.push();
	newUser.set({
		skype: skype,
		email: email,
		primerNombre: primerNombre,
		apellido: apellido,
		lugar: lugar,
		matches: [],
		active: true
	});
}