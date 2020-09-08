import {createStore} from 'redux'
const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

const intitialState = {
    gridData: {"1|1":{color:'red'}, "2|1":{color:'green'},"3|3":{color:'blue'},"4|4":{color:'green'}},
    gridId: uuidv4()
}


const reducer = (state = intitialState, action) =>{
    switch (action.type){
        case 'GRID_WAS_CLICKED':{            
            return Object.assign({}, state,{
                gridData:action.payload
            })
        }
        case 'TEST':{
            console.log('processed TEST ' + action.payload)
            return state
        }
        default:
            return state
    }            
}

const store = createStore(reducer)

export default store