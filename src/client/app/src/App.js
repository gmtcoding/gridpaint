import React from 'react';
import GridComponent from './components/GridComponent'
function App() {
  const g = {"1|1":{color:'red'}, "2|1":{color:'green'},"3|3":{color:'blue'}}
  return (
    <div className="App">          
        <GridComponent grid={g}/>    
    </div>
  );
}

export default App;
