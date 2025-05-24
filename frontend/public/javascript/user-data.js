document.addEventListener("DOMContentLoaded", function () {
    const splitTrainningElements = document.querySelectorAll(".split-treino");
    const splitTrainning = localStorage.getItem("trainning-split");
    const aboutSplit = document.querySelector("#sobre-split");
    const spinnerContainer = document.querySelector(".container-spinner"); // Adicionado para o spinner

    function showSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "flex";
    }
    function hideSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "none";
    }

    if (!splitTrainning || splitTrainning === "null") {
        alert("Você precisa criar um split de treino antes de continuar.");
        window.location.href = "../views/trainning-split.html";
        return;
    }
    splitTrainningElements.forEach(function (element) {
        element.textContent = splitTrainning;
    });

    // Exibe o spinner antes de buscar os dados
    showSpinner();
    const getDataAll = getData();
    getDataAll.then((data) => {
        const nameElements = document.querySelectorAll(".name-user");
        nameElements.forEach((element) => {
            element.textContent = data.user.name;
        });
        const bithDay = document.querySelector(".bithday-user");
        bithDay.textContent = getAgeFromISODate(data.user.birthday_day) + " anos";
        const email = document.querySelectorAll(".email-user");
        email.forEach((element) => {
            element.textContent = data.user.email;
        })
        const phoneUser = document.querySelector(".phone-user");
        phoneUser.textContent = convertPhoneNumber(data.user.number);

        const heightUser = document.querySelector(".height-user");
        heightUser.textContent = data.user.height + " cm";
        const weightUser = document.querySelector(".weight-user");
        weightUser.textContent = data.user.weight + " kg";
    }).catch((error) => {
        console.error("Erro ao obter dados do usuário:", error);
    }).finally(() => {
        // Esconde o spinner após a requisição terminar
        hideSpinner();
    });

    if (splitTrainning === "ABC") {
        aboutSplit.textContent = "O treino ABC é um dos mais populares entre os praticantes de musculação. Ele divide o treino em três partes: A, B e C, cada uma focando em grupos musculares diferentes. Isso permite um foco maior em cada grupo muscular e um tempo adequado para recuperação.";
        return;
    } else if (splitTrainning === "ABCD") {
        aboutSplit.textContent = "O treino ABCD é uma variação do treino ABC, onde o treino é dividido em quatro partes: A, B, C e D. Isso permite um foco ainda maior em cada grupo muscular e mais variedade nos exercícios.";
        return;
    }
    else if (splitTrainning === "ABCDE") {
        aboutSplit.textContent = "O treino ABCDE é uma divisão mais avançada, onde o treino é dividido em cinco partes: A, B, C, D e E. Isso permite um foco ainda maior em cada grupo muscular e mais variedade nos exercícios.";
        return;
    }

    async function getData() {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
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
        console.log("Dados do usuário:", data);
        return data;
    }
    function getAgeFromISODate(isoDateString) {
        const birthDate = new Date(isoDateString);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassedThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassedThisYear) {
            age--;
        }

        return age;
    }

    function convertPhoneNumber(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return null;
    }
});