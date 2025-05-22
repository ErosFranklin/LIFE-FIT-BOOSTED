document.addEventListener("DOMContentLoaded", function () {
    const spinnerContainer = document.querySelector(".container-spinner");

    function showSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "flex";
    }
    function hideSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "none";
    }

    getUserData();

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