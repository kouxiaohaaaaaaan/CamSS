import requests
import json
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

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

    payload = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": message
            }
        ]
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    res_dict = json.loads(response.text)

    #return "TESTING"
    return res_dict['result']

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

