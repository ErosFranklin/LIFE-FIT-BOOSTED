const logout = document.querySelector('#logout')

logout.addEventListener('click' , ()=>{
    localStorage.clear()
    setTimeout(()=>{
        window.location.href = '../index.html'
    }, 1000)
})