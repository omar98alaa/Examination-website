// Add interactivity to question items
document.querySelectorAll('.question-item').forEach(item => {
    item.addEventListener('click', () => {
        // Simulate question selection
        console.log(`Question ${item.textContent.trim()} clicked`);
    });
});

var qContainer = document.querySelector(".qContainer")
var burgerMenu = document.querySelector(".burger-menu")

//hide questionMarks on small screen and replace with burger button
window.addEventListener('resize', () => {
    if (window.innerWidth <= 1000){
        qContainer.classList.add('hidden')
        burgerMenu.classList.remove('hidden')
    }else{
        qContainer.classList.remove('hidden')
        burgerMenu.classList.add('hidden')
    }
})

burgerMenu.addEventListener('click',()=>{
    if(qContainer.classList.contains('hidden'))
        qContainer.classList.remove('hidden')
    else
    qContainer.classList.add('hidden') 
})

