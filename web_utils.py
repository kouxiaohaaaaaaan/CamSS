from flask import Flask, render_template, request
import os

app = Flask(__name__, template_folder='.')

@app.route('/')
def index():
    return render_template('index.html',title='Short Video Scripting Web Portal')

@app.route('/submit',methods=['POST'])
def submit():
    username = request.form.get('username')
    video_type = request.form.get('video_type')
    # Process the user input as needed
    return f"You submitted: \nUsername: {username}\nVideo Type: {video_type}"

if __name__ == '__main__':
    app.run()