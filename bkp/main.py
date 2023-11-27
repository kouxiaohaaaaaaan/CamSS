# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import requests
import json

def load_env():
    with open('../.env', 'r') as file:
        lines = file.readlines()
    env_vars = {}
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            key, value = map(str.strip,line.split('='))
            env_vars[key] = value
    return env_vars


def main(API_KEY,SECRET_KEY):
    url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=" + get_access_token(API_KEY,SECRET_KEY)

    payload = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": "我在上海，周末可以去哪里玩？"
            }
        ]
    })
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)

def get_access_token(API_KEY,SECRET_KEY):
    """
    使用 AK，SK 生成鉴权签名（Access Token）
    :return: access_token，或是None(如果错误)
    """
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {"grant_type": "client_credentials", "client_id": API_KEY, "client_secret": SECRET_KEY}
    return str(requests.post(url, params=params).json().get("access_token"))


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    env_vars = load_env()
    API_KEY = env_vars["API_KEY"]
    SECRET_KEY = env_vars["SECRET_KEY"]
    main(API_KEY,SECRET_KEY)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
