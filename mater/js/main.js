// Initialize Firebase
var config = {
apiKey: "AIzaSyDMf01t2L2QUmMeIowNabetjkYKoAKCVgw",
authDomain: "quan-test-eff9b.firebaseapp.com",
databaseURL: "https://quan-test-eff9b.firebaseio.com",
projectId: "quan-test-eff9b",
storageBucket: "quan-test-eff9b.appspot.com",
messagingSenderId: "681978952324"
};
firebase.initializeApp(config);


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);

}

var auth, database, storage;


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


	$("#frmregister #btn_register").click(function() {
		//alert("submitted!");
		if (!$("#frmregister").valid())
			return;
		var username = $("#frmregister #username").val();
		var email = $("#frmregister #email").val();
		var pass = $("#frmregister #password").val();
		var repass = $("#frmregister #repassword").val();
		var role = $("#frmregister #slc_role").val();
		if (role == null || role == "")
		{
			Materialize.toast("Chọn 'Quyền hạn' của người dùng!", 2000, "red");
			return false;
		}
		var dateString = $("#frmregister #dateexpire").val().split("/");
		var dateyDate = new Date(dateString[2], dateString[1] - 1, dateString[0]);
		var ms = dateyDate.valueOf();
		var date = ms / 1000;
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
			  Materialize.toast("Tạo tài khoản thành công", 2000);
			  
			}.bind(this)).catch(function(error) {
			  console.error('Lưu dữ liệu thất bại', error);
			});
			
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			//alert(errorMessage);
			if (errorCode == 'auth/weak-password') {
				Materialize.toast("Mật khẩu phải ít nhất 6 ký tự!", 2000, "red");
				location.reload(); 
			}
			else if (errorCode == "auth/email-already-in-use") {
				Materialize.toast("Email đã tồn tại trên hệ thống!", 2000, "red");
			}
			else
			{
				Materialize.toast("Tạo tài khoản không thành công!", 2000, "red");
			}
		});
		return false;
	});
	
	
	$("#frmcreateproject #btn_create_project").click(function() {
		if (!$("#frmcreateproject").valid())
			return;
		// File or Blob named mountains.jpg
		var file = $("#frmcreateproject #name_hostlogo")[0].files[0];

		if (!file.type.match('image.*')) {
			Materialize.toast("File upload không phải là hình ảnh!", 2000, "red");
			return;
		}
		var name = $("#frmcreateproject #name_name").val();
		var host = $("#frmcreateproject #name_host").val();
		var addr = $("#frmcreateproject #name_addr").val();
		var rpTime = $("#frmcreateproject #name_reportime").val();
		var emails = $("#frmcreateproject #name_emails").val();
		var hLogo = "";
		var id = "";


		var duanRef = database.ref('duan');
		duanRef.push({
			name: name,
			host: host,
			addr: addr,
			rpTime: rpTime,
			hLogo: hLogo,
			id: id
	    }).then(function(data) {

		      // Upload the image to Cloud Storage.
		      var filePath = "images" + '/' +  Math.round(Math.random()*1234567890, 0.5) + "_" + file.name;
		      return storage.ref(filePath).put(file).then(function(snapshot) {

		        // Get the file's Storage URI and update the chat message placeholder.
		        var fullPath = snapshot.metadata.fullPath;
		        return data.update({hLogo: storage.ref(fullPath).toString()});
		      }.bind(this));

	    }.bind(this)).catch(function(error) {
		      console.error('There was an error uploading a file to Cloud Storage:', error);
		      Materialize.toast("There was an error uploading a file to Cloud Storage!" + error, 2000, "red");
		});


	});

});
