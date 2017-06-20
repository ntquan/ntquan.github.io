
$(document).ready(function(){
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
    $("#btn_create_user").click(function () { 
        $("#frame").attr("src", "create_user.html");
    });
    $("#btn_manage_user").click(function () { 
        $("#frame").attr("src", "manage_user.html");
    });
});

