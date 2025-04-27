document.addEventListener("DOMContentLoaded", async function () {
    const btnLogin = document.getElementById("btn-login");
    const spinner = document.getElementById("container-spinner");
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
            const response = await fetch("/api/login", {
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

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            errorMessage.textContent = error.message || "Erro ao fazer login.";
            errorMessage.style.display = "block";
            
        }finally {
            spinner.style.display = "none";
            btnLogin.disabled = false;
        }
    });

});