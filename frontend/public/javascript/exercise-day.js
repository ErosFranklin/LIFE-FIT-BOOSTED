document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const trainningContainer = document.querySelector(".trainning-container");
    //const errorMessage = document.querySelector(".error_message");
    //const spinner = document.querySelector(".container-spinner");
    //const trainningsDays = await getDaysTrainninhg(userId);
   
    /*
    async function getTrainning(userId, trainningContainer, trainningsDays) {
        //spinner.style.display = "block";
        try{
            const response = await fetch(`https://life-fit-boosted.vercel.app/api/${userId}/training/week`, {
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
            //errorMessage.style.display = "none";
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
                    data[day].forEach(group => {
                        const muscleArea = group.muscleArea.join(', ');
                        const groupContainer = document.createElement('div');
                        groupContainer.classList.add('exercise-group');

                        let exercisesHTML = '';
                        group.exercise.forEach(ex => {
                            exercisesHTML += `
                            <li>Exercício: <span>${ex.name}</span></li>
                            <li>Quantidade de Séries: <span>${ex.series}</span></li>
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
            //spinner.style.display = "none";
            //errorMessage.textContent = "Erro ao buscar treinos. Tente novamente mais tarde.";
            //errorMessage.style.display = "block";
        }finally {
            //spinner.style.display = "none";
        }

    }
        */

    (async function() {
  const PAGE_SIZE = 1; 
  const userId = localStorage.getItem('userId');
  const day    = getDay(); 

  // 1) busca os treinamentos do dia...
  const res = await fetch(`https://life-fit-boosted.vercel.app/api/${userId}/training/${day}`, { headers: {'Content-Type':'application/json'} });
  if (res.status === 404) {
    document.getElementById('title').innerText = `Treino de ${capitalizeFirstLetter(day)}`;
    document.getElementById('exercise-container').innerHTML = `
    <h2>Dia de descanso <i class="emoji-descanso fa-solid fa-moon"></i></h2>
    <p>Hoje é dia de descanso, não há treinos cadastrados para este dia.</p>
    <span>Você pode editar os dias de treinos <a href="../views/user-data.html">aqui.</a></sapn>
    `;
    document.querySelector('.paginacao-global').innerHTML = '';
    return;
  }
  const { trainings } = await res.json();

  // 2) flatMap em todos os exercícios
  const flatExercises = trainings.flatMap(block =>
    block.exercise.map(ex => ({
      muscleArea: block.muscleArea[0],
      name: ex.name,
      series: ex.series
    }))
  );

  // 3) setup de paginação
  let currentPage = 1;
  const totalPages = Math.ceil(flatExercises.length / PAGE_SIZE);

  const labelEl     = document.getElementById('exercise-label');
  const infoGlobal  = document.getElementById('page-info-global');
  const prevGlobal  = document.getElementById('prev-global');
  const nextGlobal  = document.getElementById('next-global');

function renderPage() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const item  = flatExercises[start]; // só um por página

    labelEl.innerHTML = `
        <span class="muscle-area">Grupo Muscular: <strong>${item.muscleArea}</strong></span>
        <span class="exercise-name">Exercicio: <strong>${item.name}</strong></span>
        <span class="exercise-repeat">Series: <strong>${item.series}</strong></span>
        <span class="exercise-equipment">Equipamento: <strong>${item.equipment || 'Nenhum'}</strong></span>
    `;

    infoGlobal.textContent = `${currentPage} / ${totalPages}`;
    prevGlobal.disabled = currentPage === 1;
    nextGlobal.disabled = currentPage === totalPages;

    // Muda as cores dos ícones com base no estado disabled
    const prevIcon = document.querySelector('.icon-global.prev');
    const nextIcon = document.querySelector('.icon-global.next');
    if (prevIcon) prevIcon.style.color = prevGlobal.disabled ? 'var(--important-color-2)' : 'var(--important-color)';
    if (nextIcon) nextIcon.style.color = nextGlobal.disabled ? 'var(--important-color-2)' : 'var(--important-color)';
}

  prevGlobal.addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    renderPage();
  });
  nextGlobal.addEventListener('click', () => {
    if (currentPage < totalPages) currentPage++;
    renderPage();
  });

  // título
  document.getElementById('title').innerText = `Treino de ${capitalizeFirstLetter(day)}`;

  // primeira render
  renderPage();
})();


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function getDay(){
        const week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const day = new Date();
        const today = week[day.getDay()];

        return today;
    }


})




