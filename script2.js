

let form = document.getElementById("playerForm");

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Retrieve the values of the input fields
     player1 = document.getElementById("player1").value; // Use .value to get input
     player2 = document.getElementById("player2").value; // Use .value to get input
    
    // Log the player names to the console
    console.log(player1 + " " + player2);

    window.location.href = 'index.html';
    
});