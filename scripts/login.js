const form = document.querySelector('#login-form')

const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const loginLink = document.querySelector('nav ul li a.active');


form.addEventListener('submit', async function(event) {
    event.preventDefault()
    console.log('password', password.value)
    // recuperer les infos des inputs

    const data = {
        email: emailInput.value,
        password: passwordInput.value
    }

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    
    if (!response.ok) {
        document.querySelector('.error').textContent = 'Mauvais identifiants'
        setTimeout(function() {
            document.querySelector('.error').textContent = ''
        }, 5000)
        return
    }

    const user = await response.json()

    sessionStorage.setItem('token', user.token)
    window.location.replace('index.html')
    

})