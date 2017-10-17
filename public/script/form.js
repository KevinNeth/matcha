var divsign = document.getElementById('divsign');
var divlog = document.getElementById('divlog');
var divforgot = document.getElementById('divforgot');
var login = document.getElementById('login');
var signup = document.getElementById('signup');
var forgot = document.getElementById('forgot');
var login2 = document.getElementById('login2');
var signup2 = document.getElementById('signup2');

function viewLog() {
    divsign.setAttribute("style","display:none");
    divlog.setAttribute("style","display:block");
    divforgot.setAttribute("style","display:none");
};

function viewSign() {
    divsign.setAttribute("style", "display:block");
    divlog.setAttribute("style","display:none");
    divforgot.setAttribute("style","display:none");
}

function viewForgot() {
    divsign.setAttribute("style","display:none");
    divlog.setAttribute("style","display:none");
    divforgot.setAttribute("style","display:block");
}

login.addEventListener('click', viewLog, false);
signup.addEventListener('click', viewSign, false);
forgot.addEventListener('click', viewForgot, false);
login2.addEventListener('click', viewLog, false);
signup2.addEventListener('click', viewSign, false);
