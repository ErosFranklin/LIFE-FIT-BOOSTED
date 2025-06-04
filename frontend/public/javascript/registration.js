document.addEventListener("DOMContentLoaded", function () {
    const btnForm = document.querySelector("#btn-register");

    btnForm.addEventListener("click", async function (event){
        event.preventDefault();
        const name = document.querySelector("#name").value;
        const dateBirth = document.querySelector("#date_bith").value;
        const number = document.querySelector("#user_number").value;
        const height = document.querySelector("#user_height").value;
        const weight = document.querySelector("#user_weight").value;
        const email = document.querySelector("#email").value;
        const confirmEmail = document.querySelector("#conf_email").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#conf_password").value;
        const errorMessage = document.querySelector("#error_message");

        const spinner = document.querySelector(".container-spinner");
        

        if(name === "" || dateBirth === "" || number === "" || height === "" || weight === "" || email === "" || confirmEmail === "" || password === "" || confirmPassword === ""){
            errorMessage.textContent = "Por favor, preencha todos os campos.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }
        if(dateBirth !== ""){
            const today = new Date();
            const birthDate = new Date(dateBirth);
            let age = today.getFullYear() - birthDate.getFullYear();
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
        if(validateHeight(height) === false){
            errorMessage.textContent = "A altura deve estar entre 50 e 250 cm.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }
        if(validateWeight(weight) === false){
            errorMessage.textContent = "O peso precisa estar entre 30 kg e 250 kg.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return false;
        }
        if(!validatePasword(password)){
            errorMessage.textContent = "A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra.";
            errorMessage.style.display = "block";
            spinner.style.display = "none";
            return;
        }  
        if(!validateEmail(email)){
            errorMessage.textContent = "Email inválido!";
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
                birthday_day: dateBirth,
                number,
                weight,
                height,
                
            }
            data.weight = parseFloat(data.weight);
            data.height = parseFloat(data.height);

            console.log(data);
            const response = await fetch("https://life-fit-boosted.vercel.app/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            if(!response.ok){
                throw new Error("Erro ao registrar usuário.");
            }
            const result = await response.json();
            console.log(result);
            alert('cadastro realizado com sucesso!');
            window.location.href = "../index.html";

        } catch (error) {
            console.error("Error:", error);
            errorMessage.textContent = "Erro ao registrar. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
        } finally{
            errorMessage.style.display = "none";
            spinner.style.display = "none";
        }
    })

    function validateHeight(height){
        if (height < 50 || height > 250){
            return false
        } else{
            return true
        }
    }
    function validateWeight(weight){
        if (weight < 20 || weight > 300){
            return false
        } else{
            return true
        }
    }
    function validatePasword(password) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(password);
    }
    function validateEmail(email) {
        var emailRegex =
          /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
        return emailRegex.test(email);
    }
});