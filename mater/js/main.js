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





var debug_value;
var __temp = "";





function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);

}

function save_DB_HanMuc(key_duan, name_hanmuc, name_bophan, email_user)
{
	//alert("vao ham nay");
	var hangmucRef = database.ref('hangmuc');
	
	var hangmuc_key = "";
	hangmucRef.push({
		keyDuAn: key_duan,
		name: name_hanmuc,
		bophan: name_bophan,
		emailuser: email_user,
    }).then(function(data) {
		  hangmuc_key = data.key;
		  $("#frmcreatehanmuc input[name=name_hanmuc_key]:first").val(hangmuc_key);
		  console.log("key hang muc: " + hangmuc_key);
		  return hangmuc_key;
    }.bind(this)).catch(function(error) {
	      hangmuc_key = "";
	      return hangmuc_key;
	});
	//while(hangmuc_key == "");
	//alert(hangmuc_key);
}

function save_HanMuc(obj) {

	//alert($(obj).html());
	debug_value = obj;
	var name_hanmuc = $(obj).parent().parent().find("input[name=name_hanmuc]:first").val();
	var name_bophan = $(obj).parent().parent().find("select[name=select_bophan]:first").val();
	var email_user = $(obj).parent().parent().find("select[name=select_kysu]:first").val();

	var key_duan = $("#frmcreatehanmuc #name_duan_key").val();
	var result = save_DB_HanMuc(key_duan, name_hanmuc, name_bophan, email_user);
	$(obj).parent().find("a").removeClass("hide");
	$(obj).fadeOut();
	//alert(result);
}
function edit_HanMuc(obj) {
	alert($(obj).html());
}
function delete_HanMuc(obj) {
	alert($(obj).html());
}
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
var auth, database, storage;

function setImageUrl (imageUri, imgElement) {
  // If the image is a Cloud Storage URI we fetch the URL.
	if (imageUri.startsWith('gs://')) {
		imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
		storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
			imgElement.src = metadata.downloadURLs[0];
		});
	} else {
		imgElement.src = imageUri;
	}
};

$(document).ready(function(){
	$('select#slc_role').material_select();
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
	
	var key_duan = "";
	$("#frmcreateproject #btn_create_project").click(function() {
		if (!$("#frmcreateproject").valid())
			return;
		// File or Blob named mountains.jpg
		var file = $("#frmcreateproject #name_hostlogo")[0].files[0];
		if (file == null)
		{
			Materialize.toast("File upload không phải là hình ảnh!", 2000, "red");
			return;
		}
		else if (!file.type.match('image.*')) {
			Materialize.toast("File upload không phải là hình ảnh!", 2000, "red");
			return;
		}
		var name = $("#frmcreateproject #name_name").val();
		var host = $("#frmcreateproject #name_host").val();
		var addr = $("#frmcreateproject #name_addr").val();
		var rpTime = $("#frmcreateproject #name_reportime").val();
		var emails = $("#frmcreateproject #name_emails").val();
		var hLogo = "";


		var duanRef = database.ref('duan');
		
		duanRef.push({
			name: name,
			host: host,
			addr: addr,
			rpTime: rpTime,
			hLogo: hLogo,
	    }).then(function(data) {
			  key_duan = data.key;
		      // Upload the image to Cloud Storage.
		      var filePath = "images" + '/' +  Math.round(Math.random()*1234567890, 0.5) + "_" + file.name;
		      return storage.ref(filePath).put(file).then(function(snapshot) {

		        // Get the file's Storage URI and update the chat message placeholder.
		        var fullPath = snapshot.metadata.fullPath;
		        return data.update({hLogo: storage.ref(fullPath).toString()});
		      }.bind(this));

	    }.bind(this)).catch(function(error) {
		      console.error('There was an error uploading a file to Cloud Storage:', error);
		      Materialize.toast("There was an error uploading a file to Cloud Storage!", 2000, "red");
		      return;
		});

		if (key_duan == "")
			return;

		//Write key_duan into hidden field
		$("#frmcreatehanmuc #name_duan_key").val(key_duan);
	    //Prepare next tab
	    $("#frmcreatehanmuc #h4_hangmuc_ducan").html("Them han muc cho du an " + '"' + name + '"');
		//Next tab
		$('#tab_createproject.tabs').children().eq(1).removeClass("disabled");
		$('#tab_createproject.tabs').tabs('select_tab', 'frmcreatehanmuc');

		//Remove button on tab 1
		$("#frmcreateproject #btn_reset").fadeOut();
		$("#frmcreateproject #btn_create_project").fadeOut();

		//Get list user, insert into List
		var ref = firebase.database().ref("user");

		var ref_select_kysu = $("#frmcreatehanmuc select[name=select_kysu]");
		var query = ref.orderByChild("name");
		query.on('child_added', function (snapshot) {
			if(snapshot.val().role == "eng")
			{
				$("<option />", {value: snapshot.val().email, text: snapshot.val().name}).appendTo(ref_select_kysu);
				//ref_select_kysu.material_select();
			}
		});
	});

	$("#frmcreatehanmuc #bt_add_hanmuc").click(function() {
		key_duan = "test 0111111";
		if(key_duan == "")
		{
			Materialize.toast("Ko tim thay key_duan!", 2000, "red");
			setTimeout(location.reload.bind(location), 2000);
			return;
		}

		var row_hangmuc = $(this).parent().find("div:first");
		var clone_row_hangmuc = $("#frmcreatehanmuc #hanmuc_template").clone();
		clone_row_hangmuc.removeClass("hide").prop('id', "" );
		//clone_row_hangmuc.find("select:first").prop("name", "select_bophan_" + $.now())
		//clone_row_hangmuc.find("select:last").prop("name", "select_kysu_" + $.now())
		//clone_row_hangmuc.find("select").material_select();

		clone_row_hangmuc.appendTo(row_hangmuc).find("select").material_select();


	});

});
