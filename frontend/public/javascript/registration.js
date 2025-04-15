document.addEventListener("DOMContentLoaded", function () {
    const btnForm = document.querySelector("#btn-register");

    btnForm.addEventListener("click", async function (event){
        event.preventDefault();
        const name = document.querySelector("#name").value;
        const dateBith = document.querySelector("#date_bith").value;
        const number = document.querySelector("#user_number").value;
        const height = document.querySelector("#user_height").value;
        const weight = document.querySelector("#user_weight").value;
        const email = document.querySelector("#email").value;
        const confirmEmail = document.querySelector("#conf_email").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#conf_password").value;
        const errorMessage = document.querySelector("#error_message");

        const spinner = document.querySelector(".container-spinner");
        

        if(name === "" || dateBith === "" || number === "" || height === "" || weight === "" || email === "" || confirmEmail === "" || password === "" || confirmPassword === ""){
            errorMessage.textContent = "Por favor, preencha todos os campos.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }
        if(dateBith !== ""){
            const today = new Date();
            const birthDate = new Date(dateBith);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 15) {
                errorMessage.textContent = "Você precisa ter pelo menos 10 anos para se registrar.";
                errorMessage.style.display = "block";
                spinner.style.display = "none";
                return;
            }
        }
        if(number.length < 11){
            errorMessage.textContent = "O número de telefone deve ter pelo menos 11 dígitos.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return
        }
        if(email.includes("@") === false || email.includes(".com") === false){
            errorMessage.textContent = "O email deve conter '@' e '.com'.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }    
        if(email !== confirmEmail){
            errorMessage.textContent = "Os emails não coincidem.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }

        if(password !== confirmPassword){
            errorMessage.textContent = "As senhas não coincidem.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }
        spinner.style.display = "block";

        try {
            const data={
                name,
                email,
                password,
                dateBith,
                number,
                weight,
                height,
                
            }
            const response = await fetch("/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({data})
            })
            if(!response.ok){
                throw new Error("Erro ao registrar usuário.");
            }

        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "Erro ao registrar. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
        } finally{
            errorMessage.style.display = "none";
            spinner.style.display = "none";
        }
    })
});