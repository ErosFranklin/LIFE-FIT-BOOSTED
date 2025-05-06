document.addEventListener("DOMContentLoaded", async function () {
    const btnAddExercise = document.getElementById("btn-add-exercise");

    btnAddExercise.addEventListener("click", async function (event) {
        event.precventDefault();
        const trainningSplit = localStorage.getItem("trainning-split");
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
    });



});