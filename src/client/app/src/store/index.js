import {createStore} from 'redux'

const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
const cf = 'blue'
const H =  {"1|1":{color:cf}, 
            "2|1":{color:cf},
            "3|1":{color:cf},
            "4|1":{color:cf},
            "5|1":{color:cf},
            "3|2":{color:cf},
            "3|3":{color:cf},
            "1|4":{color:cf}, 
            "2|4":{color:cf},
            "3|4":{color:cf},
            "4|4":{color:cf},
            "5|4":{color:cf}};

const I = {"1|6":{color:cf}, 
            "1|7":{color:cf},
            "1|8":{color:cf},
            "2|7":{color:cf},
            "3|7":{color:cf},
            "4|7":{color:cf},
            "5|7":{color:cf},
            "5|6":{color:cf},
            "5|8":{color:cf},
            };

const intitialState = {
    gridData: {...H, ...I},        
    gridId: uuidv4(),
    redrawGrid:true
}


const reducer = (state = intitialState, action) =>{
    switch (action.type){
        case 'INITIALIZE_GRID':{            
            return {...state,
                gridData:action.payload.gridData,
                gridId:state.gridId,
                redrawGrid:state.redrawGrid
            }
        }
        case 'UPDATE_COMMAND':{            
            switch(action.payload.updateCommand.command){
                case 'PAINT':
                    console.log(`PAINT ${action.payload.updateCommand.location} with color ${action.payload.updateCommand.color} received`)
                    let stateT = {...state}                    
                    stateT.gridData[action.payload.updateCommand.location] = {color:action.payload.updateCommand.color}                    
                    return {...state,
                        gridData : stateT.gridData,                                                 
                        redrawGrid: !state.redrawGrid};                                                            
                    
                default:
                    console.log('Unknown UPDATE_COMMAND type received.')
            }
            return {...state}
        }              
        default:
            return state
    }            
}

const store = createStore(reducer)

export default store