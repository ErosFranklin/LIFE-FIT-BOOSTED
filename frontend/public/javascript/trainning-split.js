document.addEventListener("DOMContentLoaded", async function () {
    const modal = document.querySelector(".modal-content");
    const overlay = document.querySelector(".modal-split-trainning");
    const closeModal = document.getElementById("close-modal");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const splitTrainning = localStorage.getItem("trainning-split");
    const split = document.querySelector("#split");
    const errorMessage = document.querySelector("#error_message");
    const btnSplit = document.querySelector("#btn-split");

    if (!splitTrainning) {
        modalSplit(split);
    }

    async function modalSplit(split) {
        modal.style.display = "flex";
        overlay.style.display = "flex";

        btnSplit.addEventListener("click", async function (event) {
            event.preventDefault();
            try {
                const trainingSplit = split.value;
                console.log("Valor do split:", trainingSplit);

                const response = await fetch(`http://localhost:10000/api/${userId}/create/training/split`, {
                    method: "POST",  
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, 
                    },
                    body: JSON.stringify({ training_split: trainingSplit })
                });

                if (!response.ok) {
                    throw new Error("Erro ao criar split de treino.");
                }

                const data = await response.json();
                console.log(data);

                modal.style.display = "none";
                overlay.style.display = "none";

            } catch (error) {
                console.error("Error:", error);
                errorMessage.textContent = "Erro ao criar split de treino. Tente novamente mais tarde.";
                errorMessage.style.display = "block";
            } finally {
                errorMessage.style.display = "none";  
            }
        });
    }

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });
});
