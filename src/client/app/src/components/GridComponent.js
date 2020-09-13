import React, 
    {    
        createRef
    }    
 from 'react'
import {connect} from 'react-redux';

class GridComponent extends React.Component {                
    
    constructor(props){
        super(props)
        this.canvasRef = createRef()
        this.CELL_WIDTH = props.cellWidth;
        this.WIDTH = props.width;
        this.MARGIN = props.margin;
        this.state = {
            gridData : {},
            gridId : props.gridId,
            onGridClicked : props.onGridClicked,
            redrawGrid: !props.redrawGrid,
            paintingColor : props.paintingColor
        }

    }    
    
    componentDidUpdate(prevProps)           
    {           
        this.drawGrid()     
    }
        
    drawGrid = () => {                
        const ctx = this.canvasRef.current.getContext('2d');                
        ctx.clearRect(0,0,this.WIDTH+this.MARGIN, this.WIDTH+this.MARGIN);
        for(let i=0; i < this.WIDTH/this.CELL_WIDTH+1; i++){ //rows
            ctx.beginPath()
            ctx.moveTo(this.MARGIN,this.MARGIN + i*this.CELL_WIDTH);
            ctx.lineTo(this.WIDTH +this.MARGIN, this.MARGIN + i*this.CELL_WIDTH);
            ctx.stroke();
            
            ctx.beginPath()
            ctx.moveTo(this.MARGIN+i*this.CELL_WIDTH,this.MARGIN);
            ctx.lineTo(this.MARGIN+i*this.CELL_WIDTH , this.MARGIN + this.WIDTH);
            ctx.stroke();

        }                             
        for(const [key, value] of Object.entries(this.props.gridData)){                        
            if (this.props.gridData[key]){                
                let loc = {x:key.split('|')[0], y:key.split('|')[1]}            
                ctx.fillStyle = this.props.gridData[key].color
                ctx.fillRect(loc.y*this.CELL_WIDTH + this.MARGIN, loc.x*this.CELL_WIDTH + this.MARGIN, this.CELL_WIDTH,this.CELL_WIDTH);
            }
        }        
    } 
    locToCell = (loc) => {
        
        return{
            row:Math.trunc((loc.y - this.MARGIN)/this.CELL_WIDTH),
            col:Math.trunc((loc.x - this.MARGIN)/this.CELL_WIDTH)
        }
    }
    processClick = (loc) => {
        if (loc.x >= this.MARGIN && loc.x <= this.WIDTH+this.MARGIN && loc.y >= this.MARGIN && loc.y <= this.WIDTH+this.MARGIN)            
        {
            var key = this.locToCell(loc);       
            var skey = `${key.row}|${key.col}`
            var gridCopy = {...this.state.gridData}
            if (gridCopy[skey]){
                gridCopy[skey]=null;                    
            }     
            else{                
                gridCopy[skey] = {color:this.state.paintingColor};                              
            }   
            const payload = {
                'updateCommand':{'command':gridCopy[skey]!==null?'PAINT':'DELETE', 'location':skey, 'color':this.state.paintingColor},
                'updatedBy':this.state.gridId
            }                                                                     
            this.props.dispatch({
                type:'UPDATE_COMMAND',
                payload
              })
            if (this.state.onGridClicked != null){                
                this.state.onGridClicked(payload);                                
            }   
            this.drawGrid()       
        }
    }
    render()
    {
        return ( <canvas 
            ref = {this.canvasRef}
            width = {this.WIDTH+this.MARGIN}
            height = {this.WIDTH+this.MARGIN}        
            onClick = {
                e => {                    
                    this.processClick({x:e.clientX, y:e.clientY})
                }
            }
            />
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(GridComponent);