function viewModal(){
    const btn = document.getElementById("btn-security");
    if(btn.innerText === "Alterar"){
        btn.innerText = "Cancelar";
        const modal = document.getElementById("infos-security");
        modal.style.display = "flex";
    }
    else{
        btn.innerText = "Alterar";
        const modal = document.getElementById("infos-security");
        modal.style.display = "none";
    }
    
}