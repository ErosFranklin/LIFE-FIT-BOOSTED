document.addEventListener("DOMContentLoaded", async function () {
    const btnAddExercise = document.getElementById("btn-add-exercise");
    const btnAddTrainning = document.getElementById("btn-trainning");
    const trainningContainer = document.querySelector(".trainning-container");
    
    const containerExercises = document.querySelector('.container-sub-exercicies');
    const overlay = document.querySelector(".modal-trainning");
    const modal = document.querySelector(".modal-content-trainning"); 
    const closeModal = document.getElementById("close-modal-trainning");
    const btnMoreExercise = document.querySelectorAll(".btn-more-exercise");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    async function getDaysTrainninhg(userId) {
        try {
            const responseData = await fetch(`https://life-fit-boosted.onrender.com/api/${userId}/training/days`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await responseData.json();
            console.log("Dias de treino:", data);
            return data;
        } catch (error) {
            console.error("Erro ao buscar dias de treino:", error);
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    btnAddExercise.addEventListener("click", async function (event) {
        event.preventDefault();

        const selectTrainingDay = document.getElementById('select-training-day');
        selectTrainingDay.innerHTML = ""; 
        const response = await getDaysTrainninhg(userId);


        response.training_days.forEach(day => {
            const option = document.createElement('option');
            option.value = day.toLowerCase();  
            option.textContent = capitalizeFirstLetter(day);
            selectTrainingDay.appendChild(option);
        });

        overlay.style.display = "flex";   
        modal.style.display = "flex";
    });

btnAddTrainning.addEventListener("click", async function (event) {
    event.preventDefault();

    const selectTrainingDay = document.getElementById('select-training-day');
    const day = selectTrainingDay.value;

    if (!day) {
        alert('Selecione um dia de treino antes de confirmar!');
        return;
    }

    const exerciseGroups = document.querySelectorAll('.container-exercises'); 

    const rawExercises = [];

    exerciseGroups.forEach(group => {
        const exerciseName = group.querySelector(".exercise-name").value;
        const muscleGroup = group.querySelector(".exercise-muscle-group").value;
        const series = parseInt(group.querySelector("input[name='series']").value);
        console.log(exerciseName, muscleGroup, series);

        if (exerciseName && muscleGroup && series) {
            rawExercises.push({
                name: exerciseName,
                muscle_group: muscleGroup,
                series: series
            });
        }
    });

    if (rawExercises.length === 0) {
        alert('Adicione pelo menos um exercício antes de salvar.');
        return;
    }

    const grouped = {};
    rawExercises.forEach(ex => {
        console.log(ex);
        if (!grouped[ex.muscle_group]) {
            grouped[ex.muscle_group] = [];
        }
        grouped[ex.muscle_group].push({ name: ex.name, series: ex.series });
    });

    const groups = Object.entries(grouped).map(([muscleGroup, exercises]) => ({
        muscleArea: [muscleGroup],
        exercise: exercises
    }));

    if (groups.length === 0) {
        alert('Adicione pelo menos um exercício antes de salvar.');
        return;
    }
    console.log("Grupos enviados:", JSON.stringify(groups, null, 2));

    try {
        const response = await fetch(`https://life-fit-boosted.onrender.com/api/${userId}/create/training/${day}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ groups })
        });

        if (response.ok) {
            alert('Treino salvo com sucesso!');
            overlay.style.display = "none";   
            modal.style.display = "none";
            containerExercises.innerHTML = ""; 
            const data = await response.json();
            console.log("Treino salvo:", data);
        } else {
            alert('Erro ao salvar treino. Verifique os dados.');
        }
    } catch (error) {
        console.error("Erro ao criar treino:", error);
    }
});


    closeModal.addEventListener("click", function () {
        overlay.style.display = "none";   
        modal.style.display = "none";
    });

    btnMoreExercise.forEach(button => {
        button.addEventListener("click", function () {
            const newGroup = document.createElement('div');
            newGroup.classList.add('exercise-group');

            newGroup.innerHTML = `
                <label>Nome do Exercicio:</label>
                <input type="text" class="exercise-name" placeholder="ex: Supino Inclinado" required>

                <label>Grupo Muscular:</label>
                <select name="exercise-muscle-group" class="exercise-muscle-group">
                    <option value="" disabled selected>Selecione um item</option>
                    <option value="Back">Costas</option>
                    <option value="Chest">Peito</option>
                    <option value="Quads">Quadriceps</option>
                    <option value="Hamstrings">Posterior da Coxa</option>
                    <option value="Glutes">Glúteos</option>
                    <option value="Calves">Panturrilhas</option>
                    <option value="Shoulders">Ombros</option>
                    <option value="Biceps">Biceps</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Abs">Abdomen</option>
                    <option value="Traps">Trapézio</option>
                    <option value="Forearms">Antebraços</option>
                </select>

                <label>Quantidade de Serie:</label>
                <input type="number" class="series" name="series" min="1" value="5">
            `;

            containerExercises.appendChild(newGroup);
            console.log("Adicionar mais exercícios");
        });
    });
});
