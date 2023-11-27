function addMessage(sender, text) {
    var chatbox = document.getElementById('chat-box');
    var messageClass = sender === 'user' ? 'user-message' : 'chatbot-message';
    var name = sender === 'user' ? 'You' : 'Chatbot';

    // Create the message HTML
    var messageHTML = '';
    if (sender == 'user') {
        messageHTML = `
            <div class="message-container ${messageClass}">
                <div class="message">${text}</div>
                <span class="name">${name}</span>
            </div>
        `;
    } else {
        messageHTML = `
            <div class="message-container ${messageClass}">
                <span class="name">${name}</span>
                <div class="message">${text}</div>
            </div>
        `;
    }
    // Append the message to the chatbox
    chatbox.innerHTML += messageHTML;

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop - chatbox.scrollHeight;
}
function sendMessage() {
    var userInput = document.getElementById('user-input');
    var chatBox = document.getElementById('chat-box');
    var message = userInput.value.trim();

    if(message !== "") {
        //Display user's message
        chatBox.innerHTML += '<div>User: ' + message + '</div>';

        // Send message to chatbot API and get response (API integration code will go here)

        // After getting response, display chatbot's message (this is just an example response)
        chatBox.innerHTML += '<div>Chatbot: I am still learning, I am not ready to chat yet. </div>';

        // Clear the input field for the next message
        userInput.value = '';

        // Scroll to the bottom of the chatBox
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
// Listen for input event on the textarea
document.getElementById('user-input').addEventListener('input', function(event) {
    // Reset field height
    event.target.style.height = 'inherit';
    // Get the computed styles for the element
    var computed = window.getComputedStyle(event.target);
    //Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'),10)
    + parseInt(computed.getPropertyValue('padding-top'),10)
    +event.target.scrollHeight
    + parseInt(computed.getPropertyValue('padding-bottom'),10)
    + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    event.target.style.height = height + 'px';
});

// Event handler for the Send button
document.getElementById('send-button').addEventListener('click',function() {
    var userInputField = document.getElementById('user-input');
    var userInput = userInputField.value;

    // Add user's message to the chatbox
    addMessage('user', userInput);

    // Show the typing indicator
    var typingIndicator = document.getElementById('chatbot-typing-indicator');
    typingIndicator.style.display = 'block';

    // Send user input to the python backend
    fetch('http://127.0.0.1:5000/getresponse', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput})
    })
    .then(response => response.json())
    .then(data => {
        // hide the typing indicator
        typingIndicator.style.display = 'none';
        // use the chatbot response from the backend
        addMessage('Chatbot', data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        typingIndicator.style.display = 'none';
    });

    // Clear the user input
    userInputField.value = '';
});