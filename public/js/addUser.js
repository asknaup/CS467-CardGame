let addUserForm = document.getElementById('addUser');

addUserForm.addEventListener("submit", function (e) {
    e.preventDefault();


    let inputUsername = document.getElementById('usn');
    let inputPassword = document.getElementById('pwd');

    let usn = inputUsername.value;
    let pwd = inputPassword.value;

    let data = {
        username: usn,
        password: pwd
    }

    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("Data sent successfully!");
        }
    }

    xhttp.send(JSON.stringify(data))

    window.location.href = '/user-profile-page/index';
    // addRow(inputUsername, inputPassword);
});

addRow = (data) => {
    let currentTable = document.getElementById("addUser")
}