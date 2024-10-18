import { inputEnabled, setDiv } from "./index.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

let loginRegisterDiv = null;

export const handleLoginRegister = () => {
    loginRegisterDiv = document.getElementById("login-register");
    const login = document.getElementById("login");
    const register = document.getElementById("register");

    login.addEventListener("click", () => {
        if (inputEnabled) {
            showLogin();
        }
    });

    register.addEventListener("click", () => {
        if (inputEnabled) {
            showRegister();
        }
    });
};

export const showLoginRegister = () => {
    setDiv(loginRegisterDiv);
};
