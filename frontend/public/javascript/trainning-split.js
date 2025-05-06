document.addEventListener("DOMContentLoaded", async function () {
    const modal = document.querySelector(".modal-content");
    const overlay = document.querySelector(".modal-split-trainning");
    const closeModal = document.getElementById("close-modal");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const split = document.querySelector("#split");
    const errorMessage = document.querySelector("#error_message");
    
    if(localStorage.getItem("trainning-split") == null){
        modalSplit(split);
        
    }
    async function modalSplit(split){
        modal.style.display = "flex";
        overlay.style.display = "flex";
        
        try{
            const training_split = split.value;
            const response = fetch(`http://localhost:10000/api/${userId}/create/trainng/split`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(training_split)
            })
            if(!response.ok){
                throw new Error("Erro ao criar split de treino.");
            }
            const data = await response.json();
            console.log(data);
        }
        catch(error){
            console.error("Error:", error);
            errorMessage.textContent = "Erro ao criar split de treino. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
        }finally{
            errorMessage.style.display = "none";
            spinner.style.display = "none";
        }
        

    }
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

});