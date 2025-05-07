document.addEventListener("DOMContentLoaded", async function () {
    const btnLogin = document.getElementById("btn-login");
    const spinner = document.querySelector(".container-spinner");
    const errorMessage = document.getElementById("error_message");

    btnLogin.addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if(!email || !password) {
            errorMessage.textContent = "Por favor, preencha todos os campos.";
            errorMessage.style.display = "block";
            return;
        }      
        spinner.style.display = "block";
        errorMessage.style.display = "none";
        btnLogin.disabled = true;

        const loginData = {
            email,password
        }

        try {
            const response = await fetch("https://life-fit-boosted.onrender.com/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao fazer login.");
            }
            const data = await response.json();
            console.log("Login bem-sucedido:", data);
            if(data && data.token){
                localStorage.setItem("token", data.token);
                const decode = jwt_decode(data.token);
                const userId = decode.id;
                localStorage.setItem("userId", userId);
                localStorage.setItem("email", email);
                localStorage.setItem("token-decode", decode);
                localStorage.setItem("trainning-split", decode.training_split);
            }
            window.location.href = "/views/trainning.html"; 

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            errorMessage.textContent = error.message || "Erro ao fazer login. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
            
        }finally {
            spinner.style.display = "none";
            btnLogin.disabled = false;
        }
    });

});