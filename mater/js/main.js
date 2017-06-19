function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

var auth, database, storage;
$.validator.setDefaults({
	submitHandler: function() {
		//alert("submitted!");
		var username = $("#frmregister #username").val();
		var email = $("#frmregister #email").val();
		var pass = $("#frmregister #password").val();
		var repass = $("#frmregister #repassword").val();
		var role = $("#frmregister #slc_role").val();
		if (role == null || role == "")
		{
			Materialize.toast("Chọn 'Quyền hạn' của người dùng!", 2000);
			return false;
		}
		var date = $("#frmregister #dateexpire").val();
		var active = "false";
		if ($('#frmregister #chk_active').prop('checked') == true)
			active = "true";
		auth.createUserWithEmailAndPassword(email, pass).then(function(){
			var user = firebase.auth().currentUser;
			// Reference to the /messages/ database path.
			
			database.ref('user/' + user.uid).set({
			  name: username,
			  email: email,
			  pass: pass,
			  role: role,
			  uid: user.uid,
			  exp: date,
			  active: active
			}).then(function() {
			  // Clear message text field and SEND button state.
			  
			}.bind(this)).catch(function(error) {
			  console.error('Lưu dữ liệu thật bại', error);
			});
			
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			//alert(errorMessage);
			if (errorCode == 'auth/weak-password') {
				Materialize.toast("Mật khẩu phải ít nhất 6 ký tự!", 2000);
			}
			else if (errorCode == "auth/email-already-in-use") {
				Materialize.toast("Email đã tồn tại trên hệ thống!", 2000);
			}
			else
			{
				Materialize.toast("Tạo tài khoản không thành công!", 2000);
			}
		});
		return false;
	}
});


$(document).ready(function(){
	$('select').material_select();
	$('.datepicker').pickadate({
		format: 'dd/mm/yyyy',
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15 // Creates a dropdown of 15 years to control year
	});
	
	auth = firebase.auth();
	database = firebase.database();
	storage = firebase.storage();
	
	
	$("#frmregister").validate({
		rules: {
			username: "required",
			email: {
				required: true,
				email:true
			},
			password: {
				required: true,
				minlength: 6
			},
			repassword: {
				required: true,
				minlength: 6,
				equalTo: "#password"
			},
			slc_role: "required",
			dateexpire: "required",
		},
		//For custom messages
		messages: {
			username: "Nhập Họ tên",
			email: "Email không hợp lệ",
			password: "Mật khẩu phải ít nhất 6 ký tự!",
			repassword: {
				required: "Mật khẩu phải ít nhất 6 ký tự!",
				minlength: "Mật khẩu phải ít nhất 6 ký tự!",
				equalTo: "Vui lòng nhập mật khẩu giống ở trên"
			},
			slc_role: "Chọn 'Quyền hạn' của người dùng!",
			dateexpire: " Chọn 'Ngày hết hạn' của người dùng!",
		},
		errorElement : 'div',
		errorPlacement: function(error, element) {
		  var placement = $(element).data('error');
		  if (placement) {
			$(placement).append(error)
		  } else {
			error.insertAfter(element);
		  }
		}
	});


	// Initiates Firebase auth and listen to auth state changes.
	//auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	
	/*
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
	});
	*/
	
	$("#btn-logout").click(function() {
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
