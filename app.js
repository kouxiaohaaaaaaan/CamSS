function addMessage(sender, text) {
    var chatbox = document.getElementById('chat-box');
    var messageClass = sender === 'user' ? 'user-message' : 'chatbot-message';
    var name = sender === 'user' ? 'You' : '小媒';
    let text_updated = text.replace(/\n/g, "<br>");

    // Create the message HTML
    var messageHTML = '';
    if (sender == 'user') {
        messageHTML = `
            <div class="message-container ${messageClass}">
                <div class="message">${text_updated}</div>
                <span class="name">${name}</span>
            </div>
        `;
    } else {
        messageHTML = `
            <div class="message-container ${messageClass}">
                <span class="name">${name}</span>
                <div class="message">${text_updated}</div>
            </div>
        `;
    }
    // Append the message to the chatbox
    chatbox.innerHTML += messageHTML;

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}
function clrMessage() {
    var chatbox = document.getElementById('chat-box');

    // clear the message to the chatbox
    chatbox.innerHTML = `
        <div id="chatbot-typing-indicator" style="display: none;">
            Chatbot is typing...
        </div>
        <div class="message-container user-message">
            <div class="message">clear previous history</div>
            <span class="name">You</span>
        </div>
    `;

    // Send user input to the python backend
    fetch('http://127.0.0.1:5000/clrresponse', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: "clear"})
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        typingIndicator.style.display = 'none';
    });

    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
}
function sendMessage(userInput) {
    // Show the typing indicator
    var typingIndicator = document.getElementById('chatbot-typing-indicator');
    typingIndicator.style.display = 'block';
    typingIndicator.scrollIntoView();
    //console.log('发送到chat的信息:',userInput)

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

document.getElementById('user-input').addEventListener('keydown', function(event) {
    //检查按键是否是回车键
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();

        var userInputField = document.getElementById('user-input');
        var userInput = userInputField.value;
        if  (userInput.trim() !== '') {
            addMessage('user', userInput);
            sendMessage(userInput);
            userInputField.value = '';
        }
    }
});

// Event handler for the Send button
document.getElementById('send-button').addEventListener('click',function() {
    var userInputField = document.getElementById('user-input');
    var userInput = userInputField.value;

    // Add user's message to the chatbox
    addMessage('user', userInput);

    sendMessage(userInput);
    // Clear the user input
    userInputField.value = '';
});

//获取元素
function genInitMessage() {
    var theme = document.getElementById('options-theme');
    var themeInfo = document.getElementById('theme-info');
    var topicInfo = document.getElementById('topic-info');
    var videoForm = document.getElementById('options-video-form');

    var initMessage1 = '你现在是一个专业的精通各类短视频制作的内容创作者，现在用户需要你的帮助来完成一部短视频的创作.';
    var initMessage2 = '该用户想要创作的主题类别是：' + theme.value + ', 想要包含的主题内容有：' + themeInfo.value + '.';
    var initMessage3 = '具体的内容需要包含：';
    if (topicInfo.value.includes("小媒")) {
        initMessage3 += '任何内容都可以.';
    } else {
        initMessage3 += topicInfo.value + '.';
    }
    var initMessage4 = '短视频的形式限定为：' + videoForm.value + '.';
    var initMessage = initMessage1 + initMessage2 + initMessage3 + initMessage4;
    return initMessage;
}
var ideaGenButton = document.getElementById('idea-generation');
var searchButton = document.getElementById('material-search');
var scriptGenButton = document.getElementById('draft-script');
var clearButton = document.getElementById('clear');

console.log('TEST log');
ideaGenButton.addEventListener('click', function() {
    var initMessage = genInitMessage();
    var triggerMessage = '按照要求描述短视频的创作思路.';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for ideaGen:', finalMessage);
    addMessage('user','请按照要求生成初始脚本思路');
    sendMessage(finalMessage);
});

searchButton.addEventListener('click', function() {
    var initMessage = genInitMessage();
    var triggerMessage = '请围绕描述的短视频创作内容，收集相关的资料.';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for search:', finalMessage);
    addMessage('user','搜索内容相关资料');
    sendMessage(finalMessage);
});

scriptGenButton.addEventListener('click', function() {
    var initMessage = genInitMessage();
    var triggerMessage = '请根据现有的相关材料和内容，生成一个短视频创作脚本，以及该短视频的标题.';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for scriptGen:', finalMessage);
    addMessage('user','生成初始创作脚本');
    sendMessage(finalMessage);
});

clearButton.addEventListener('click', function() {
    console.log('Combined message for clear:', 'clear chat');
    clrMessage();
});