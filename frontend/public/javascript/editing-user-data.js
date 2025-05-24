document.addEventListener("DOMContentLoaded", function () {
    const spinnerContainer = document.querySelector(".container-spinner");
    const errorMessage = document.querySelector(".error_message");
    function showSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "flex";
    }
    function hideSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "none";
    }

    getUserData();
    document.querySelector("#btn-editing-data").addEventListener("click", async function (event) {
        event.preventDefault();
        showSpinner();
        const name = document.querySelector(".name-user").value;
        const birthday = document.querySelector(".bithday-user").value;
        const email = document.querySelector(".email-user").value;
        const phone = document.querySelector(".phone-user").value;
        const height = document.querySelector(".height-user").value;
        const weight = document.querySelector(".weight-user").value;
        const oldPassword = document.querySelector(".old-password").value;
        const newPassword = document.querySelector(".new-password").value;
        const confirmPassword = document.querySelector(".conf-new-password").value;


        if( !name || !birthday || !email || !phone || !height || !weight) {
            hideSpinner();
            errorMessage.style.display = "block";
            errorMessage.textContent = "Por favor, preencha todos os campos obrigatórios.";
            return;
        }
        if( oldPassword && (!newPassword || !confirmPassword)) {
            hideSpinner();
            errorMessage.style.display = "block";
            errorMessage.textContent = "Por favor, preencha os campos de nova senha e confirmação de senha.";
            return;
        }
        if( newPassword !== confirmPassword) {
            hideSpinner();
            errorMessage.style.display = "block";
            errorMessage.textContent = "As senhas não coincidem. Por favor, tente novamente.";
            return;
        }

        showSpinner();
        try {
            const data = {
                name: name,
                //birthday_day: birthday,
                email: email,
                number: phone,
                height: height,
                weight: weight,
                currentPassword: oldPassword,
                newPassword: newPassword,
            }
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("ID do usuário não encontrado.");
            }
            if (!token) {
                throw new Error("Token não encontrado.");
            }

            const response = await fetch(`http://localhost:10000/api/user/update-by/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erro ao atualizar dados do usuário:", response.status, errorText); 
                throw new Error("Erro ao atualizar dados do usuário.");
                
            }
            const responseData = await response.json();
            console.log(responseData);

            alert("Dados atualizados com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar dados do usuário. Tente novamente mais tarde.");
        } finally {
            hideSpinner();
        }
    });
    async function getUserData() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token não encontrado.");
            return;
        }

        showSpinner();
        try {
            const response = await fetch(`http://localhost:10000/api/data_user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao obter dados do usuário.");
            }

            const data = await response.json();
            console.log(data);
            document.querySelector(".name-user").value = data.user.name;
            document.querySelector(".bithday-user").value = new Date(data.user.birthday_day).toISOString().split("T")[0];
            document.querySelector(".email-user").value = data.user.email;
            document.querySelector(".phone-user").value = data.user.number;
            document.querySelector(".height-user").value = data.user.height;
            document.querySelector(".weight-user").value = data.user.weight;
        } catch (error) {
            console.error(error);
        } finally {
            hideSpinner();
        }
    }
});