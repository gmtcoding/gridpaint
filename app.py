#!/usr/bin/env python
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send

import os
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = 'my secret'
socketio = SocketIO(app, cors_allowed_origins="*")
grid_data = {'1|1':{'color':'green'}, '2|1':{'color':'red'},'3|3':{'color':'cyan'},'4|4':{'color':'yellow'},'5|5':{'color':'red'}}

@app.route("/")
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('****** A client connected. ******')
    emit('initialize', {'updatedBy': 'init', 'gridData': grid_data})


@socketio.on('update_grid')
def handle_grid_update(msg):
    update_command = json.loads(msg)    
    print('Received update_grid message from client ', update_command)        
    grid_data[update_command['updateCommand']['location']] = update_command['updateCommand']['color']
    emit('update_command', update_command, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8090, debug=True)
