#!/usr/bin/env python
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

import os
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = 'my secret'
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('*** A client connected. ***')


@socketio.on('grid_to_update')
def handle_grid_update(msg):
    d = json.loads(msg)
    print('Received a grid updated from client ', d['id'])    
    socketio.emit('grid_was_updated', {'updated_by': d['id'], 'data': d['data']})


@socketio.on('message')
def handle_message(message):
    print('Received message: ' + str(message))


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8090, debug=True)
