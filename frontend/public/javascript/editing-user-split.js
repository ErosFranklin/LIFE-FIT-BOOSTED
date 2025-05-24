document.addEventListener("DOMContentLoaded", function () {
    const btnSplitTrainning = document.querySelector("#editing-split");
    const modal = document.querySelector(".modal-content");
    const overlay = document.querySelector(".modal-split-trainning");
    const closeModal = document.getElementById("close-modal");
    const errorMessage = document.getElementById("error_message");
    const spinnerContainer = document.querySelector(".container-spinner");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const btnPatchSplit = document.querySelector("#btn-split");

    function showSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "flex";
    }
    function hideSpinner() {
        if (spinnerContainer) spinnerContainer.style.display = "none";
    }

    btnSplitTrainning.addEventListener("click", function () {
        modal.style.display = "flex";
        overlay.style.display = "flex";
    });

    btnPatchSplit.addEventListener("click", async function (event) {
        event.preventDefault();

        const trainingSplit = document.querySelector("#split").value;

        showSpinner();
        try {
            const training_split = { training_split: trainingSplit };
            const responseSplit = await fetch(`http://localhost:10000/api/${userId}/update/training/split`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(training_split)
            });

            if (!responseSplit.ok) {
                throw new Error("Erro ao criar split de treino.");
            }
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
            const responseDays = await fetch(`http://localhost:10000/api/${userId}/update/training/days`, {
                method: "PATCH",
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
            location.reload();

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