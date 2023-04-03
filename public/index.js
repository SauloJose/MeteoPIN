//Função de animação da seção de login
const inputs = document.querySelectorAll('.login-input')

function focusFunc(){
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

function blurFunc(){
    let parent = this.parentNode.parentNode;
    if(this.value ==""){
        parent.classList.remove('focus')
    }
}

inputs.forEach( input => {
    input.addEventListener('focus',focusFunc);
    input.addEventListener('blur',blurFunc)
})
