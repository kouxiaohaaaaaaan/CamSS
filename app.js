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
            小媒正在输入...
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
var submitButton = document.getElementById('send-button');
var userInput = document.getElementById('user-input');
userInput.addEventListener('input', function(event) {
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

userInput.addEventListener('keydown', function(event) {
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
submitButton.addEventListener('click',function() {
    var userInputField = document.getElementById('user-input');
    var userInput = userInputField.value;

    // Add user's message to the chatbox
    addMessage('user', userInput);

    sendMessage(userInput);
    // Clear the user input
    userInputField.value = '';
});

var videoForm = $('#options-video-form');
var videoStyle = $('#options-video-style');
var videoNarr = $('#options-video-narrative');
$(document).ready(function() {
    // Initialize Select2 on the <select> element
    var videoForm2 = videoForm.select2({
        placeholder: "请选择，可多选,可自定义输入",
        tags: true,
        tokenSeparators: [' ',''],
        allowClear: true
    });
    videoForm2.on('change', function() {
        updateDraftButtonState();
    });

    var videoStyle2 = videoStyle.select2({
        placeholder: "请选择，可多选,可自定义输入",
        tags: true,
        tokenSeparators: [' ',''],
        allowClear: true
    });
    videoStyle2.on('change', function() {
        updateDraftButtonState();
    });

    var videoNarr2 = videoNarr.select2({
        placeholder: "请选择，可多选,可自定义输入",
        tags: true,
        tokenSeparators: [' ',''],
        allowClear: true
    });
    videoNarr2.on('change', function() {
        updateDraftButtonState();
    });

});

//获取元素
var theme = document.getElementById('options-theme');
var themeInfo = document.getElementById('theme-info');
var topicInfo = document.getElementById('topic-info');
var videoName = document.getElementById('video-name');
//var videoForm = document.getElementById('options-video-form');
//var videoStyle = document.getElementById('options-video-style');
//var videoNarr = document.getElementById('options-video-narrative');

function genInitMessage1() {

    var initMessage1 = '你现在是一个专业的精通各类媒体短视频制作的内容创作者，现在用户需要你的帮助来完成一部短视频的创作.';
    var initMessage2 = '该用户想要创作的主题类别是：' + theme.value + '. 想要包含的主题内容有：' + themeInfo.value + '.';

    var initMessage = initMessage1 + initMessage2;
    return initMessage;
}

function genInitMessage2() {

    var initMessage = '具体的内容需要包含：';
    initMessage += topicInfo.value + '.';

    return initMessage;
}

function genInitMessage3() {

    var initMessage = '短视频的名称叫做：';
    initMessage += videoName.value + '.';

    return initMessage;
}

function genInitMessage() {

    var initMessage1 = genInitMessage1();
    var initMessage2 = genInitMessage2();
    var initMessage3 = genInitMessage3();

    var initMessage4 = '短视频的表现形式限定为：' + videoForm.val() + '.';
    var initMessage5 = '短视频的叙事方式限定为：' + videoStyle.val() + '.';
    var initMessage6 = '短视频的人声形式限定为：' + videoNarr.val() + '.';
    var initMessage = initMessage1 + initMessage2 + initMessage3 + initMessage4 + initMessage5 + initMessage6;
    return initMessage;
}
var topicGenButton = document.getElementById('topic_auto_gen');
var nameGenButton = document.getElementById('name_auto_gen');
//var ideaGenButton = document.getElementById('idea-generation');
var searchButton = document.getElementById('material-search');
var scriptGenButton = document.getElementById('draft-script');
var clearButton = document.getElementById('clear');

console.log('TEST log');

topicGenButton.addEventListener('click', function() {
    var initMessage1 = genInitMessage1();
    var initMessage3 = '请根据当前信息推荐5个相关的创作选题思路, 每个选题思路最好不要超过15个字，只需简单概括.';
    var finalMessage = initMessage1 + initMessage3;
    console.log('Combined message for topicGen:', finalMessage);
    addMessage('user','请按照要求推荐5个相关的创作选题思路');
    sendMessage(finalMessage);
});

nameGenButton.addEventListener('click', function() {
    var initMessage1 = genInitMessage1();
    var initMessage2 = genInitMessage2();
    var initMessage3 = '请根据当前信息推荐5个视频名称.';
    var finalMessage = initMessage1 + initMessage2 + initMessage3;
    console.log('Combined message for topicGen:', finalMessage);
    addMessage('user','请按照要求推荐5个视频名称');
    sendMessage(finalMessage);
});

//ideaGenButton.addEventListener('click', function() {
//    var initMessage = genInitMessage();
//    var triggerMessage = '按照要求描述短视频的创作思路.';
//    var finalMessage = initMessage + triggerMessage;
//    console.log('Combined message for ideaGen:', finalMessage);
//    addMessage('user','请按照要求生成初始脚本思路');
//    sendMessage(finalMessage);
//});

searchButton.addEventListener('click', function() {
    var initMessage1 = genInitMessage1();
    var initMessage2 = genInitMessage2();
    var initMessage3 = genInitMessage3();
    var initMessage = initMessage1 + initMessage2 + initMessage3;
    var triggerMessage = '请根据该短视频的主题类别和主题内容，对每一个选题内容进行相关资料的收集和推荐，然后进行扩写，要求不能少于200字.';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for search:', finalMessage);
    addMessage('user','搜索内容相关资料');
    sendMessage(finalMessage);
});

scriptGenButton.addEventListener('click', function() {
    var initMessage = genInitMessage();
    var triggerMessage = '请根据现有的相关材料和内容，生成一个短视频创作脚本';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for scriptGen:', finalMessage);
    addMessage('user','生成初始创作脚本');
    sendMessage(finalMessage);
});

//更新输入框里的文字
document.getElementById('options-theme').addEventListener('change',updateThemeInfoPlaceholder);
function updateThemeInfoPlaceholder() {
    var select = document.getElementById('options-theme');
    var input = document.getElementById('theme-info');
    var selectedValue = select.value;

    if (selectedValue === '地方宣传类') {
        input.placeholder = '例：陕西宣传片';
    } else if (selectedValue === '节日节点类') {
        input.placeholder = '例：元旦/春节/端午';
    } else if (selectedValue === '传统文化类') {
        input.placeholder = '例：汉服/茶道/太极';
    } else if (selectedValue === '人物故事类') {
        input.placeholder = '例：李白生平介绍';
    }
}

theme.addEventListener('change',updateTopicButtonState);
theme.addEventListener('change',updateNameButtonState);
theme.addEventListener('change',updateDraftButtonState);

themeInfo.addEventListener('input',updateTopicButtonState);
themeInfo.addEventListener('input',updateNameButtonState);
themeInfo.addEventListener('input',updateDraftButtonState);

topicInfo.addEventListener('input',updateNameButtonState);
topicInfo.addEventListener('input',updateDraftButtonState);

videoName.addEventListener('input',updateDraftButtonState);

function updateTopicButtonState() {
    if (theme.selectedIndex > 0 && themeInfo.value.trim() !=="") {
        topicGenButton.disabled = false;
    } else {
        topicGenButton.disabled = true;
    }
}

function updateNameButtonState() {
    if (theme.selectedIndex > 0 && themeInfo.value.trim() !=="" && topicInfo.value.trim() !=="") {
        nameGenButton.disabled = false;
        searchButton.disabled = false;
    } else {
        nameGenButton.disabled = true;
        searchButton.disabled = true;
    }
}

function updateDraftButtonState() {
    if (theme.selectedIndex > 0 && themeInfo.value.trim() !==""
        && topicInfo.value.trim() !=="" && videoName.value.trim() !== ""
        && videoForm.val() !== null && videoForm.val().length > 0
        && videoStyle.val() !== null && videoStyle.val().length > 0
        && videoNarr.val() !== null && videoNarr.val().length > 0 ) {
        scriptGenButton.disabled = false;
    } else {
        scriptGenButton.disabled = true;
    }
}

userInput.addEventListener('input',updateSubmitButtonState);
function updateSubmitButtonState() {
    if (userInput.value.trim() !=="") {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}
clearButton.addEventListener('click', function() {
    console.log('Combined message for clear:', 'clear chat');
    clrMessage();
    theme.selectedIndex = 0;
    themeInfo.value = "";
    topicInfo.value = "";
    videoName.value = "";
    $('#options-video-form').val(null).trigger('change');
    $('#options-video-style').val(null).trigger('change');
    $('#options-video-narrative').val(null).trigger('change');
    topicGenButton.disabled = true;
    nameGenButton.disabled = true;
//    ideaGenButton.disabled = true;
    searchButton.disabled = true;
    scriptGenButton.disabled = true;
});
