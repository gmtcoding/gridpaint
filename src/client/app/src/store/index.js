import {createStore} from 'redux'
const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

const intitialState = {
    gridData: {"1|1":{color:'cyan'}, "2|1":{color:'cyan'},"3|3":{color:'cyan'},"4|4":{color:'cyan'}},    
    gridId: navigator.userAgent.indexOf('Firefox')>0?'Firefox':'Chrome'
}


const reducer = (state = intitialState, action) =>{
    switch (action.type){
        case 'GRID_WAS_UPDATED':{               
            //console.log('Me: ' + state.gridId + ' Source gridId: ' +  action.payload.gridId)                            
            //console.log('grid is being updated ')
            console.log(action)
            return Object.assign({}, state,{
                gridData:action.payload.gridData,
                gridId:state.gridId                
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