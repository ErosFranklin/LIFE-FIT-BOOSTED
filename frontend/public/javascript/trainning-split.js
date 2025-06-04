document.addEventListener("DOMContentLoaded", async function () {
    const modal = document.querySelector(".modal-content");
    const overlay = document.querySelector(".modal-split-trainning");
    const closeModal = document.getElementById("close-modal");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const splitTrainning = localStorage.getItem("trainning-split");
    const split = document.querySelector("#split");
    const errorMessage = document.querySelector(".error_message");
    const btnSplit = document.querySelector("#btn-split");
    const spinnerContainer = document.querySelector(".container-spinner");

    function showSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "flex";
    }
    function hideSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "none";
    }

    console.log(splitTrainning)

    if (!splitTrainning || splitTrainning === "null") {
        modal.style.display = "flex";
        overlay.style.display = "flex";
    }

    btnSplit.addEventListener("click", async function (event) {
        event.preventDefault();
        const trainingSplit = split.value;
        console.log("Valor do split:", trainingSplit);

        showSpinner();
        try {
            const responseSplit = await fetch(`http://localhost:10000/api/${userId}/create/training/split`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ training_split: trainingSplit })
            });

            if (!responseSplit.ok) {
                throw new Error("Erro ao criar split de treino.");
            }

            const dataSplit = await responseSplit.json();
            console.log("Split criado com sucesso:", dataSplit);
            localStorage.setItem("trainning-split", trainingSplit);

        } catch (error) {
            console.error("Erro ao criar split:", error);
            errorMessage.textContent = "Erro ao criar split de treino. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
            hideSpinner();
            return; 
        }

        const checkboxes = document.querySelectorAll('input[name="training_day"]:checked');
        const selectedDays = Array.from(checkboxes).map(cb => cb.value);

        console.log("Dias selecionados:", selectedDays);

        const splitLimits = { ABC: 3, ABCD: 4, ABCDE: 5 };

        if (!splitLimits[trainingSplit]) {
            alert("Split não definido ou inválido.");
            hideSpinner();
            return;
        }

        if (selectedDays.length !== splitLimits[trainingSplit]) {
            errorMessage.textContent = `Você precisa selecionar exatamente ${splitLimits[trainingSplit]} dias para o split ${trainingSplit}.`;
            errorMessage.style.display = "block";
            hideSpinner();
            return;
        }

        try {
            const responseDays = await fetch(`http://localhost:10000/api/${userId}/create/training/days`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ training_days: selectedDays })
            });

            if (!responseDays.ok) {
                const errorData = await responseDays.json();
                throw new Error(errorData.error || "Erro ao definir dias de treino.");
            }

            const dataDays = await responseDays.json();
            console.log("Dias de treino definidos com sucesso:", dataDays);
            alert("Split e dias de treino definidos com sucesso!");

            modal.style.display = "none";
            overlay.style.display = "none";

        } catch (error) {
            console.error("Erro ao definir dias:", error);
            alert("Erro ao definir dias de treino. Tente novamente mais tarde.");
        } finally {
            hideSpinner();
        }
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });
});