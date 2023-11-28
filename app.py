import os.path

import requests
import json
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

chat_f = 'chat_history.json'
chat_msg_f = 'chat_history.msg.json'

def load_env():
    with open('.env', 'r') as file:
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

@app.route('/getresponse',methods=['POST'])
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
        "messages": data
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
    app.run(debug=True)

