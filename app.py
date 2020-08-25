from flask import Flask, render_template
from flask_socketio import SocketIO, emit

import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'my secret'
socketio = SocketIO(app, cors_allowed_origins="*")



@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('connect')
def test_connect():    
    print('Let us dance!')
    emit('after connect', {'data':'Let us light up the sky, mmkay'})

@socketio.on('client_event')
def handle_message(message):
    print('Received message: ' + str(message))


if __name__ == "__main__":
    socketio.run(app,host='0.0.0.0', port=8090, debug=True)
