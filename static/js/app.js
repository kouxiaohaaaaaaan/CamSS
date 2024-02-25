var chatbox = document.getElementById('message-list');

function helpMessage() {
    var messageClass = 'chatbot-message';
    var name = '小媒';
    var defaultMessage = "<b>系统使用说明:</b>\n1. 按照左侧提示依次选择或填入要求的信息;\n";
    defaultMessage += "2. 填完内容元素后，点击 <b>资料生成</b>，并可在右侧输入框中进行内容调整;\n";
    defaultMessage += "3. 选题创意、内容元素和视频名称也可以通过点击右侧的 <b>小媒推荐</b> 来获取灵感;\n";
    defaultMessage += "4. 左侧要求全部填选后，点击 <b>稿件生成</b>，查看最终的脚本;\n";
    defaultMessage += "5. 任何时候可以点击 <b>重新开始</b>，从头来过。\n";
    defaultMessage += "6. 如果发现小媒回复没有写全，可以输入<b>继续</b> 两个字试试哦。";
    let text_updated = defaultMessage.replace(/\n/g, "<br>");
    var messageHTML = '';
    messageHTML = `
        <div class="message-container ${messageClass}">
            <span class="name">${name}</span>
            <div class="message">${text_updated}</div>
        </div>
    `;
    chatbox.innerHTML += messageHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    helpMessage();
});

function addMessage(sender, text) {
    var messageClass = sender === 'user' ? 'user-message' : 'chatbot-message';
    var name = sender === 'user' ? '用户' : '小媒';
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
    // clear the message to the chatbox
    chatbox.innerHTML = `
        <div class="message-container user-message">
            <div class="message">删除历史记录</div>
            <span class="name">用户</span>
        </div>
    `;
    helpMessage();

    // Send user input to the python backend
    fetch('http://127.0.0.1:7777/clrresponse', {
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
    //typingIndicator.scrollIntoView();
    //console.log('发送到chat的信息:',userInput)

    // Send user input to the python backend
    fetch('http://127.0.0.1:7777/getresponse', {
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
//        updateDraftButtonState();
    });

    var videoStyle2 = videoStyle.select2({
        placeholder: "请选择，可多选,可自定义输入",
        tags: true,
        tokenSeparators: [' ',''],
        allowClear: true
    });
    videoStyle2.on('change', function() {
//        updateDraftButtonState();
    });

    var videoNarr2 = videoNarr.select2({
        placeholder: "请选择，可多选,可自定义输入",
        tags: true,
        tokenSeparators: [' ',''],
        allowClear: true
    });
    videoNarr2.on('change', function() {
//        updateDraftButtonState();
    });

});

//获取元素
var theme = document.getElementById('options-theme');
var themeInfo = document.getElementById('theme-info');
var topicInfo = document.getElementById('topic-info');
var elementInfo = document.getElementById('element-info');
var videoName = document.getElementById('video-name');
//var videoForm = document.getElementById('options-video-form');
//var videoStyle = document.getElementById('options-video-style');
//var videoNarr = document.getElementById('options-video-narrative');

function genInitMessage1() {

    var initMessage1 = '用户需要你的帮助来完成一部短视频脚本的创作.';
    var initMessage2 = '主题类别: ' + theme.value + '. 主题内容: ' + themeInfo.value + '.';

    var initMessage = initMessage1 + initMessage2;
    return initMessage;
}

function genInitMessage2() {

    var initMessage = '选题创意: ';
    initMessage += topicInfo.value + '.';

    return initMessage;
}

function genInitMessage3() {

    var initMessage = '短视频内容元素: ';
    initMessage += elementInfo.value + '.';

    return initMessage;
}

function genInitMessage4() {

    var initMessage = '短视频名称: ';
    initMessage += videoName.value + '.';

    return initMessage;
}

function genInitMessage() {

    var initMessage1 = genInitMessage1();
    var initMessage2 = genInitMessage2();
    var initMessage3 = genInitMessage3();
    var initMessage4 = genInitMessage4();

    var initMessage5 = '表现形式为: ' + videoForm.val() + '.';
    var initMessage6 = '叙事方式为: ' + videoStyle.val() + '.';
    var initMessage7 = '人声形式为: ' + videoNarr.val() + '.';
    var initMessage = initMessage1 + initMessage2 + initMessage3 + initMessage4 + initMessage5 + initMessage6 + initMessage7;
    return initMessage;
}

//function genReqrMessageOrig() {
//    var initMessage1 = '输出的内容和格式要求如下: ';
//    var initMessage2 = '第一部分为基本信息，包括短视频名称，主题类别，主题内容，选题内容，表现形式，叙事方式，人声形式. ';
//    var initMessage3 = '第二部分为视频脚本的输出，包含开头，中间片段，结尾.';
//    initMessage3 += '开头和结尾根据主题类别和主题内容，需要至少两个画面，每一个画面描述不能少于200中文字，每一个画面需要包含运镜的描述，需要标明表现形式. ';
//    initMessage3 += '每一个画面需要有对应的人声脚本，脚本不少于200中文字，需要首位呼应. ';
//    var initMessage4 = '中间片段按照之前的选题素材扩写，每一个选题内容都需要有至少三个画面，每一个画面描述不能少于300中文字. 每一个画面需要包含运镜的描述，需要标明表现形式. ';
//    initMessage4 += '每一个画面需要有对应的人声脚本，脚本至少要有300中文字.';
//    var initMessage5 = '如果返回的完整内容超过最大token，需要将完整脚本按顺序拆分成若干小于最大token的独立部分，';
//    initMessage5 += '并告知用户脚本生成还未结束，需要输入 \'继续\' 两个字.';
//
//    var message = initMessage1 + initMessage2 + initMessage3 + initMessage4 + initMessage5;
//    return message;
//}
function genReqrMessage() {
    var initMessage1 = '输出的内容和格式要求如下: ';
    var initMessage2 = '**短视频创作脚本**\n**基本信息**\n';
    initMessage2    += '*短视频名称:\n视频时长:分钟\n*主题类别:\n*主题内容:\n*选题创意:\n*内容元素:\n*表现形式:\n*叙事方式:\n*人声形式:\n\n';
    var initMessage3 = '开场需要概括性和介绍性，格式要求:**开场**\n*画面1*:(运镜)描述+(画面)描述100字(表现形式:)\n*(人声形式)脚本*:200字\n';
    initMessage3    += '画面2+人声脚本的要求同画面1+人声脚本\n';
    var initMessage4 = '每一个材料模块为一个章节，转场需要连贯自然，格式要求:**其中一个模块**\n*画面1*:(运镜)描述+(画面)描述200字描述(表现形式:)\n';
    initMessage4    += '*(人声形式)脚本*:300字\n*画面2+人声脚本要求同画面1+人声脚本\n';
    initMessage4    += '*画面3+人声脚本要求同画面1+人声脚本\n';
    var initMessage5 = '结尾需要和开场首尾呼应，格式要求和开场一致.';

    var message = initMessage1 + initMessage2 + initMessage3 + initMessage4 + initMessage5;
    return message;
}



var topicGenButton = document.getElementById('topic_auto_gen');
var elementGenButton = document.getElementById('element_auto_gen');
var nameGenButton = document.getElementById('name_auto_gen');
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

elementGenButton.addEventListener('click', function() {
    var initMessage1 = genInitMessage1();
    var initMessage2 = genInitMessage2();
    var initMessage3 = '请根据当前选题推荐5个相关的内容元素, 每个元素最好不要超过15个字，只需简单概括.';
    var finalMessage = initMessage1 + initMessage2 + initMessage3;
    console.log('Combined message for elementGen:', finalMessage);
    addMessage('user','请按照要求推荐5个相关的内容元素');
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
    var initMessage4 = genInitMessage4();
    var initMessage = initMessage1 + initMessage2 + initMessage3 + initMessage4;
    var triggerMessage = '请根据该短视频的主题类别、主题内容和选题，对每个元素进行相关材料的收集和推荐，每个元素多于300字，';
    triggerMessage    += '完成后询问是否需要扩写，如被要求扩写,内容加倍.';
    var finalMessage = initMessage + triggerMessage;
    console.log('Combined message for search:', finalMessage);
    addMessage('user','搜索内容相关资料');
    sendMessage(finalMessage);
});

scriptGenButton.addEventListener('click', function() {
    var initMessage = genInitMessage();
    var triggerMessage = '请根据现有的相关材料和内容，生成一个短视频创作脚本. ';
    var requiredMessage = genReqrMessage();
    var finalMessage = initMessage + triggerMessage + requiredMessage;
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
theme.addEventListener('change',updateSearchButtonState);

themeInfo.addEventListener('input',updateTopicButtonState);
themeInfo.addEventListener('input',updateNameButtonState);
themeInfo.addEventListener('input',updateSearchButtonState);

topicInfo.addEventListener('input',updateNameButtonState);
topicInfo.addEventListener('input',updateSearchButtonState);

elementInfo.addEventListener('input',updateSearchButtonState);

//videoName.addEventListener('input',updateDraftButtonState);
searchButton.addEventListener('click', updateDraftButtonState);

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
        elementGenButton.disabled = false;
    } else {
        nameGenButton.disabled = true;
        elementGenButton.disabled = true;
    }
}

function updateSearchButtonState() {
    if (theme.selectedIndex > 0 && themeInfo.value.trim() !=="" && topicInfo.value.trim() !=="" && elementInfo.value.trim() !== "") {
        searchButton.disabled = false;
    } else {
        searchButton.disabled = true;
    }
}

function updateDraftButtonState() {
    if (theme.selectedIndex > 0 && themeInfo.value.trim() !==""
        && topicInfo.value.trim() !=="" && videoName.value.trim() !== "" && elementInfo.value.trim() !== ""
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
    submitButton.disabled = true;
});
