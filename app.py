import os.path

import requests
import json
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
import webbrowser
from threading import Timer

base_dir = os.path.abspath(os.path.dirname(__file__))
chat_f = 'chat_history.json'
chat_msg_f = 'chat_history.msg.json'
chat_msg_f_mod = 'chat_history.msg.converted.json'
system_person = '你是一个专业的短视频内容创作者，精通各类媒体短视频脚本的创作.'
system_person += '当被要求扩写或者生成完整脚本时，对细节有更多的描述.'
system_person += '每一次如果返回的完整内容超过最大token，需要按顺序拆分成完整独立的部分.'
system_person += '每一次都要告知用户生成还未结束，需要输入 \'继续\' 两个字.'

def load_env():
    env_path = os.path.join(base_dir,'.env')
    with open(env_path, 'r') as file:
        lines = file.readlines()
    env_vars = {}
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            key, value = map(str.strip,line.split('='))
            env_vars[key] = value
    return env_vars

env_vars = load_env()
API_KEY = env_vars["API_KEY"]
SECRET_KEY = env_vars["SECRET_KEY"]

app = Flask(__name__, template_folder='.')
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')
def open_browser():
    webbrowser.open_new('http://127.0.0.1:7777/')

@app.route('/getresponse',methods=['POST'])
@cross_origin()
def get_response():
    data = request.json
    user_message = data['message']
    #call chatbot to get a resp
    chatbot_response = chatbot_res(user_message)
    return jsonify({'response': chatbot_response})

def chatbot_res(message):
    url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=" + get_access_token(API_KEY,SECRET_KEY)

    try:
        with open(chat_msg_f, 'r') as f:
            data = json.load(f)
    except json.decoder.JSONDecodeError:
        data = []
    except FileNotFoundError:
        data = []
    if not isinstance(data, list):
        data = [data]
    user_data = {"role": "user", "content": message}
    data.append(user_data)
    #print(data)
    payload = json.dumps({
        "messages": data,
        "system": system_person
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    try:
        with open(chat_f, 'r') as f:
            data = json.load(f)
    except json.decoder.JSONDecodeError:
        data = []
    except FileNotFoundError:
        data = []
    if not isinstance(data, list):
        data = [data]
    #print(data)
    data.append(response.json())
    with open(chat_f, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=True)

    try:
        with open(chat_msg_f, 'r') as f:
            data = json.load(f)
    except json.decoder.JSONDecodeError:
        data = []
    except FileNotFoundError:
        data = []
    if not isinstance(data, list):
        data = [data]
    user_data = {"role": "user", "content": message}
    bot_data = {"role": "assistant", "content": response.json()['result']}
    data.append(user_data)
    data.append(bot_data)
    with open(chat_msg_f, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=True)

    with open(chat_msg_f_mod, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return response.json()['result']

@app.route('/clrresponse',methods=['POST'])
def clr_response():
    with open(chat_f, 'w') as f:
        pass
    with open(chat_msg_f, 'w') as f:
        pass
    return jsonify({'response': "Done"})

def get_access_token(API_KEY,SECRET_KEY):
    """
    使用 AK，SK 生成鉴权签名（Access Token）
    :return: access_token，或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {"grant_type": "client_credentials", "client_id": API_KEY, "client_secret": SECRET_KEY}
    return str(requests.post(url, params=params).json().get("access_token"))


if __name__ == '__main__':
    Timer(1, open_browser).start()
    app.run(port=7777,debug=False)

