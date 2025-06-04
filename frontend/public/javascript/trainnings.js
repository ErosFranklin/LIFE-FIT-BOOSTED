document.addEventListener("DOMContentLoaded", async function () {
    const btnAddExercise = document.getElementById("btn-add-exercise");
    const btnAddTrainning = document.getElementById("btn-trainning");
    const trainningContainer = document.querySelector(".trainning-list");
    const errorMessage = document.querySelector(".error_message");
    const errorMessageModal = document.querySelector(".error_message_modal");
    const containerExercises = document.querySelector('.container-sub-exercicies');
    const overlay = document.querySelector(".modal-trainning");
    const modal = document.querySelector(".modal-content-trainning"); 
    const closeModal = document.getElementById("close-modal-trainning");
    const closeModalEdit = document.getElementById("close-edit-modal-trainning");
    const closeModalDelete = document.getElementById("close-delete-modal-trainning");
    const modalEdit = document.querySelector(".modal-edit-trainning");
    const modalEditContent = document.querySelector(".modal-edit-content-trainning");
    const modalDelete = document.querySelector(".modal-delete-trainning");
    const modalDeleteContent = document.querySelector(".modal-delete-content-trainning");
    const btnMoreExercise = document.querySelectorAll(".btn-more-exercise");
    const token = localStorage.getItem("token");
    let dia = null;
    let index = null;
    let indexGroup = null
    let exerciseId = null;
    
    const userId = localStorage.getItem("userId");
    const spinner = document.querySelector(".container-spinner");
    const btnEditExercise = document.querySelector("#btn-edit-exercise");
    const btnDeleteExercise = document.querySelector("#btn-delete-exercise");

    const trainningsDaysData = await getDaysTrainninhg(userId);
    const trainningsDays = trainningsDaysData.training_days
    getTrainning(userId, trainningContainer, trainningsDays)

    document.addEventListener('click', async function (event) {
        const btnEdit = event.target.closest('.btn-edit-exercise');
        const btnDelete = event.target.closest('.btn-delete-exercise');
        if (btnEdit) {
            dia = btnEdit.dataset.id;
            index = parseInt(btnEdit.dataset.index); 
            indexGroup = parseInt(btnEdit.dataset.muscle);
            exerciseId = btnEdit.dataset.idExercise;
            console.log("Dia:", dia, "Index:", index);
            modalEdit.style.display = "flex";
            modalEditContent.style.display = "flex";
            
            try {
                const response = await fetch(`http://localhost:10000/api/${userId}/training/${dia}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Erro ao buscar treino para edição.");
                }
                const data = await response.json();
                const treino = data.trainings[indexGroup];
                console.log("Treino para edição:", treino);
                
                modalEditContent.querySelectorAll('input, select').forEach(el => {
                    if (el.tagName === 'SELECT') {
                        el.selectedIndex = 0;
                    } else {
                        el.value = '';
                    }
                });
                
                modalEditContent.querySelector(".exercise-name").value = treino.exercise[index].name;
                modalEditContent.querySelector(".exercise-muscle-group").value = treino.muscleArea[0];
                modalEditContent.querySelector(".series").value = treino.exercise[index].series;
                modalEditContent.querySelector(".equipment").value = treino.exercise[index].equipment;
            } catch (error) {
                console.error("Erro ao editar treino:", error);
                errorMessageModal.style.display = "block";
                errorMessageModal.textContent = "Erro ao editar treino. Tente novamente mais tarde.";
            }
        }else if (btnDelete) {
            dia = btnDelete.dataset.id;
            index = parseInt(btnDelete.dataset.index); 
            indexGroup = parseInt(btnDelete.dataset.muscle);
            exerciseId = btnDelete.dataset.idExercise;
            console.log("Dia:", dia, "Index:", index, "Index Group:", indexGroup, "Exercise ID:", exerciseId);
            modalDelete.style.display = "flex";
            modalDeleteContent.style.display = "flex";
            
        }
    });
    async function getTrainning(userId, trainningContainer, trainningsDays) {
        spinner.style.display = "block";
        try{
            const response = await fetch(`http://localhost:10000/api/${userId}/training/week`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar treinos.");
            }

            const data = await response.json();
            console.log("Treinos:", data);
            errorMessage.style.display = "none";
            trainningsDays.forEach(day => {
                const dayContainer = document.createElement('div');
                dayContainer.classList.add('day-tranning-day');

                const dayName = capitalizeFirstLetter(day);

                dayContainer.innerHTML = `
                    <h3>${dayName}</h3>
                    <div class="day-tranning">
                        <div class="day-tranning-exercises"></div>
                    </div>
                `;

                const exercisesContainer = dayContainer.querySelector('.day-tranning-exercises');

                if (data[day] && data[day].length > 0) {
                    data[day].forEach((group, indexGroup) => {
                        const muscleArea = group.muscleArea.join(', ');
                        const groupContainer = document.createElement('div');
                        groupContainer.classList.add('exercise-group');
                        
                        let exercisesHTML = '';
                        group.exercise.forEach((ex, index) => {
                            exercisesHTML += `
                            <li>
                                Exercício: <span>${ex.name}</span><br>
                                Quantidade de Séries: <span>${ex.series}</span><br>
                                Equipamento: <span>${ex.equipment || 'Nao informado'}</span><br>
                                <button class="btn-edit-exercise" data-id="${day}" data-index="${index}" data-muscle="${indexGroup}" data-id-exercise="${ex._id}">
                                    <i class="fa-solid fa-pencil"></i>
                                </button>
                                <button class="btn-delete-exercise" data-id="${day}" data-index="${index}" data-muscle="${indexGroup}" data-id-exercise="${ex._id}">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </li>
                            `;
                        });

                        groupContainer.innerHTML = `
                            <h4>Grupo Muscular: ${muscleArea}</h4>
                            <ul>${exercisesHTML}</ul>
                        `;
                        
                        exercisesContainer.appendChild(groupContainer);
                    });
                } else {
                    exercisesContainer.innerHTML = '<p>Sem treinos cadastrados para este dia.</p>';
                }

                trainningContainer.appendChild(dayContainer);
});
            return data;
        }catch (error) {
            console.error("Erro ao buscar treinos:", error);
            spinner.style.display = "none";
            errorMessage.textContent = "Erro ao buscar treinos. Tente novamente mais tarde.";
            errorMessage.style.display = "block";
        }finally {
            spinner.style.display = "none";
        }

    }

    async function getDaysTrainninhg(userId) {
        try {
            const responseData = await fetch(`http://localhost:10000/api/${userId}/training/days`, {
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
        console.log("Adicionar exercício");
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
    spinner.style.display = "block";

    if (!day) {
        errorMessageModal.style.display = "block";
        errorMessageModal.textContent = "Selecione um dia de treino antes de confirmar!";
        spinner.style.display = "none";
        return;
    }

    const exerciseGroups = document.querySelectorAll('.container-exercises, .container-sub-exercicies .exercise-group'); 
    const grouped = {};

    exerciseGroups.forEach(group => {
        const exerciseName = group.querySelector(".exercise-name").value;
        const muscleGroup = group.querySelector(".exercise-muscle-group").value;
        const series = parseInt(group.querySelector("input[name='series']").value);
        const equipment = group.querySelector(".equipment").value;
        console.log(exerciseName, muscleGroup, series, equipment);

        if (exerciseName && muscleGroup && series && equipment) {
            if (!grouped[muscleGroup]) {
                grouped[muscleGroup] = [];
            }
            grouped[muscleGroup].push({
                name: exerciseName,
                series: series,
                equipment: equipment
            });
        }
    });
    const groups = Object.entries(grouped).map(([muscleGroup, exercises]) => ({
        muscleArea: [muscleGroup],
        exercise: exercises
    }));

    if (groups.length === 0) {
        errorMessageModal.style.display = "block";
        errorMessageModal.textContent = "Deve conter de 1 a 5 exercicios do mesmo grupo muscular.";
        spinner.style.display = "none";
        return;
    }
    console.log("Grupos enviados:", JSON.stringify(groups, null, 2));

    try {
        const response = await fetch(`http://localhost:10000/api/${userId}/create/training/${day}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ groups })
        });

        if (response.ok) {
            overlay.style.display = "none";   
            modal.style.display = "none";
            spinner.style.display = "none";
            containerExercises.innerHTML = ""; 
            const data = await response.json();
            console.log("Treino salvo:", data);
           
            location.reload();

        } else {
            errorMessageModal.style.display = "block";
            errorMessageModal.textContent = "Deve conter de 1 a 5 exercicios do mesmo grupo muscular.";
        }
    } catch (error) {
        console.error("Erro ao criar treino:", error);
        
    }
});

    closeModalEdit.addEventListener("click", function () {
        modalEdit.style.display = "none";
        modalEditContent.style.display = "none";
    })
    closeModal.addEventListener("click", function () {
        overlay.style.display = "none";   
        modal.style.display = "none";
       
    });
    closeModalDelete.addEventListener("click", function () {
        modalDelete.style.display = "none";
        modalDeleteContent.style.display = "none";
    })

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
                    <option value="Costas">Costas</option>
                    <option value="Peito">Peito</option>
                    <option value="Quadriceps">Quadriceps</option>
                    <option value="Posterior">Posterior  da Coxa</option>
                    <option value="Glúteos">Glúteos</option>
                    <option value="Panturrilhas">Panturrilhas</option>
                    <option value="Ombros">Ombros</option>
                    <option value="Biceps">Biceps</option>
                    <option value="Triceps">Triceps</option>
                    <option value="Abdomen">Abdomen</option>
                    <option value="Trapézio">Trapézio </option>
                    <option value="Antebraço">Antebraços</option>
                </select>

                <label>Quantidade de Serie:</label>
                <input type="number" class="series" name="series" min="1" value="5">

                <label>Equipamento:</label>
                <input type="text" class="equipment" name="equipment" placeholder="ex: Halteres" required>
            `;

            containerExercises.appendChild(newGroup);
            console.log("Adicionar mais exercícios");
        });
    });
    btnEditExercise.addEventListener("click", async function (event) {
        spinner.style.display = "block";
        event.preventDefault();
        console.log(userId, dia)
        const exerciseName = modalEditContent.querySelector(".exercise-name").value;
        const muscleGroup = modalEditContent.querySelector(".exercise-muscle-group").value;
        const series = parseInt(modalEditContent.querySelector(".series").value);
        const equipment = modalEditContent.querySelector(".equipment").value;

        console.log("Dados do exercício:", exerciseName, muscleGroup, series, equipment);

        const payload = {
            groups: [{
                muscleArea: [muscleGroup],
                exercise: [{
                name: exerciseName,
                series: series,
                equipment: equipment
                }]
            }]
        };

        try{
            const response = await fetch(`http://localhost:10000/api/${userId}/update/training/${dia}?exerciseId=${exerciseId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload )
            })
            if(!response.ok) {
                throw new Error("Erro ao atualizar treino.");
            }
            const data = await response.json();
            console.log("Treino atualizado:", data);
            
            modalEdit.style.display = "none";
            modalEditContent.style.display = "none";
            spinner.style.display = "none";
            location.reload();
        }catch (error) {
            console.error("Erro ao atualizar treino:", error);
            errorMessageModal.style.display = "block";
            errorMessageModal.textContent = "Erro ao atualizar treino. Tente novamente mais tarde.";
            spinner.style.display = "none";
        }




    })
    btnDeleteExercise.addEventListener("click", async function (event) {
        event.preventDefault();
        try{
            const response = await fetch(`http://localhost:10000/api/${userId}/delete/training/${dia}?exerciseId=${exerciseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if(!response.ok) {
                throw new Error("Erro ao deletar treino.");
            }
            const data = await response.json();
            console.log("Treino deletado:", data);
            modalDelete.style.display = "none";
            modalDeleteContent.style.display = "none";
            location.reload();
        }catch (error) {
            console.error("Erro ao deletar treino:", error);
            errorMessageModal.style.display = "block";
            errorMessageModal.textContent = "Erro ao deletar treino. Tente novamente mais tarde.";
        }
    })
   
    
});

