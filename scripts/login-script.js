function submitForm(e){
    e.preventDefault();
    
    // Get input values from the login form
    const enteredEmail = document.getElementById('email').value;
    const enteredPassword = document.getElementById('password').value;
    
    // Retrieve from localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    
    // Check if entered credentials match stored ones
    if (enteredEmail === storedEmail && enteredPassword === storedPassword) 
        {
        
            location.replace("quiz-interface.html"); 
    } else {
        alert('Invalid email or password. Please try again.');
    }
}