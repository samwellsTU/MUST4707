const mySiteInteraction = function() {

  // Select the button and input box by their IDs
  const displayBtn = document.getElementById('displayBtn');
  const userInput = document.getElementById('userInput');
  const messageDisplay = document.getElementById('messageDisplay');

  // Add an event listener to the button for the 'click' event
  displayBtn.addEventListener('click', function() {
    // Get the value from the input box
    const userMessage = userInput.value;
    
    // Display the message in the <span> element
    messageDisplay.textContent = userMessage;
    
    // Optional: Clear the input box after displaying the message
    userInput.value = '';
  });
};


document.addEventListener('DOMContentLoaded', mySiteInteraction());
