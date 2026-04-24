// CHECK LOGIN
if (localStorage.getItem("isAdmin") !== "true") {
    window.location.href = "login.html";
}
// SIMPLE ADMIN CREDENTIALS
const ADMIN_USER = "admin";
const ADMIN_PASS = "munezero45";

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        // SAVE SESSION
        localStorage.setItem("isAdmin", "true");

        // GO TO DASHBOARD
        window.location.href = "admin.html";
    } else {
        document.getElementById("error").innerText =
            "Invalid username or password";
    }
}