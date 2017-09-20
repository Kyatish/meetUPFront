
function validateForm() {
	console.log("inside the validateform");
    var x = document.forms["loginForm"]["username"].value;
    if (x == null || x == "") {
    	
        alert("Name must be filled out");
        return false;
    }
}
