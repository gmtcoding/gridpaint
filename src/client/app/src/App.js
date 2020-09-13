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

  randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
  
end
  constructor(){
    super()    
    this.state = {      
      wSocket:null,
      initialized:false,
      gridData:{},
      updateId:this.uuidv4(),
      redrawGrid:true     
    }
  }
  componentDidMount(){
    console.log('in componentDidMount()')
    console.log(this.state.gridData);
    setTimeout(this.connectToServer(),5000);    
  }
  
  gridClickProcessor = (message)=>
  {               
      if (this.state.initialized){                
        this.state.wSocket.emit('update_grid', JSON.stringify(message));           
      }
      else{
        console.log('Not initialized');
      }
      
  }  
  connectToServer = ()=> {
    var socket = io('localhost:8090');
    socket.on('initialize',(msg, callback)=>{      
      this.props.dispatch({type:'INITIALIZE_GRID',payload:{
        gridData:msg['gridData']
      }})
      this.setState({initialized:true});       
    })
    socket.on('update_command',(msg, callback)=>{                
      if (this.props.gridId != msg['updatedBy']){                
        this.props.dispatch({
          type:'UPDATE_COMMAND',
          payload:{
            updateCommand:msg['updateCommand'],
            updatedBy:msg['gridId'],
            redrawGrid:!this.state.redrawGrid         
          }
        })        
      }
      
    })    
    socket.on('connect',()=>{
      console.log('Socket is opened. Ready for COMMS.')      
    });      
    this.setState({wSocket:socket})        
  };    
  
  render(){     
    return (
      <div className="App">          
          <GridComponent paintingColor = {this.randomColor()} redrawGrid={this.state.redrawGrid} width={500} margin={5} cellWidth={25} onGridClicked={this.gridClickProcessor} gridId={this.state.gridId} gridData={this.state.gridData}/>              
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
    gridData:state.gridData,
    redrawGrid:state.redrawGrid    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
