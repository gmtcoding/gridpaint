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
    emit('grid_was_updated', {'updatedBy': 'init', 'gridData': grid_data})    


@socketio.on('grid_to_update')
def handle_grid_update(msg):
    grid_data = json.loads(msg)
    print('Received grid_to_update message from client ', grid_data['gridId'])    
    emit('grid_was_updated', {'updatedBy': grid_data['gridId'], 'gridData': grid_data['gridData']}, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8090, debug=True)
