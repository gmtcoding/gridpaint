import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import {connect} from 'react-redux'
import GridComponent from './components/GridComponent'

class App extends React.Component {
  uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  constructor(){
    super()    
    this.state = {
      value:'',
      wSocket:null,
      gridId:this.uuidv4(),
      gridData: {"1|1":{color:'red'}, "2|1":{color:'green'},"3|3":{color:'blue'},"4|4":{color:'green'}}  
    }
  }
  componentDidMount(){
    this.connectToServer()
  }
  uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }      
  
  gridClickProcessor = (message)=>
  {      
      console.log(message)
      this.state.wSocket.emit('grid_to_update', JSON.stringify(message));     
  }  
  connectToServer = ()=> {
    var socket = io('localhost:8090');
    socket.on('grid_was_updated',(msg, callback)=>{

      console.log(msg['updated_by'] + ' updated grid to ...')
      console.log(msg['data'])
      this.props.dispatch({
        type:'GRID_WAS_CLICKED',
        payload:{
          gridData:msg['data'],
          gridId:this.state.gridId
        }
      })
      this.setState({gridData:msg['data']})
    })
    socket.on('connect',()=>{
      console.log('Socket is opened and connected.')      
    });
    socket.on('message', (msg, callback)=>{
      console.log('Recieved something I think');
    })
    socket.on('after_connect', (msg, callback)=>{
      console.log(msg);
    });
    socket.on('client_update', (msg, callback)=>{
      console.log('Sent an data update');
      console.log(msg);
    })        
    this.setState({wSocket:socket})
    console.log(this.state)
  };  
  
  onButtonClicked = (e)=>{        
    console.log(e);
  }    
  render(){
    return (
      <div className="App">          
          <GridComponent grid={this.state.gridData} onGridClicked={this.gridClickProcessor} gridId={this.state.gridId}/>    
          <button onClick={this.onButtonClicked}>Click me</button>
      </div>
    );
  }  
}
const mapDispatchToProps = dispatch =>{
  return {
    dispatch
  }
}
const mapStateToProps = state=>{
  return {
    gridId:state.gridId,
    gridData:state.gridData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
