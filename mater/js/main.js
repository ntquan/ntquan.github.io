var auth, database, storage;
$(document).ready(function(){
	auth = firebase.auth();
	database = firebase.database();
	storage = firebase.storage();
	// Initiates Firebase auth and listen to auth state changes.
	//auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	
	$("#sign-up").click(function(){
		var email = $("#username").val();
		var password = $("#userpass").val();
		auth.createUserWithEmailAndPassword(email, password).then(function(){
			
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			//alert(errorMessage);
			var data = {
			  message: errorMessage,
			  timeout: 2000
			};
			var snackbarContainer = document.getElementById("must-signin-snackbar");
			snackbarContainer.MaterialSnackbar.showSnackbar(data);
			//$("#must-signin-snackbar").MaterialSnackbar.showSnackbar(data);
		});
		firebase.auth().signOut().then(function(data) {
		  // Sign-out successful.
		}).catch(function(data) {
		  // An error happened.
		});
		/*
		var database = firebase.database();
		messagesRef = database.ref('DuAn');
		messagesRef.push({
		  id: "111",
		  name: "Nha to",
		  host: "Novaland",
		  addr: "Hoang Van Thu"
		})
		*/
	});
	
	$("#btn-logout").click(function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  Materialize.toast('Đăng xuất thành công!', 2000);
		  window.location.href = "login.html";
		}).catch(function(error) {
		  // An error happened.
		  Materialize.toast('Đăng xuất thất bại!', 2000);
		});
	});
});
