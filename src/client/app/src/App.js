import React from 'react';
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
      wSocket:null,
      initialized:false,
      gridData:{'1|1':{'color':'blue'}, '2|1':{'color':'blue'},'3|3':{'color':'blue'},'4|4':{'color':'blue'}}
    }
  }
  componentDidMount(){
    console.log('in componentDidMount()')
    console.log(this.state.gridData)    
    this.connectToServer()
  }
  
  gridClickProcessor = (message)=>
  {               
      if (this.state.initialized){
        console.log(message)
        this.props.dispatch({
          type:'GRID_WAS_UPDATED',
          payload:{
            gridData:message['gridData'],
            updatedBy:message['gridId']          
          }
        })
        this.state.wSocket.emit('grid_to_update', JSON.stringify(message));           
      }
      else{
        console.log('Not initialized');
      }
      
  }  
  connectToServer = ()=> {
    var socket = io('localhost:8090');
    socket.on('grid_was_updated',(msg, callback)=>{    
      console.log('Received an update')
      console.log('Grid id is ' + this.state.gridId)
      console.log('Updated by ' + msg['updatedBy'])
      //if (this.state.gridId != msg['updatedBy'])
      //    return;
      console.log('Processing update')
      this.setState({initialized:true}); 
      this.setState({gridData:msg['gridData']})
    })
    //--------------------------------------
    socket.on('connect',()=>{
      console.log('Socket is opened. Ready for COMMS.')      
    });  
    
    this.setState({wSocket:socket})    
    
  };  
  
  onButtonClicked = (e)=>{        
    console.log(e);
  }    
  render(){
    console.log('in render()')
    console.log(this.state.gridData)
    return (
      <div className="App">          
          <GridComponent onGridClicked={this.gridClickProcessor} gridId={this.state.gridId} gridData={this.state.gridData}/>    
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
  console.log('in mapStateToProps')
  console.log(state)  
  return {
    gridId:state.gridId,
    gridData:state.gridData,
    counter:100
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
