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
        this.CELL_WIDTH = 25;
        this.WIDTH = 500;
        this.MARGIN = 5;
        this.state = {
            gridData : this.props.gridData,
            gridId : this.props.gridId,
            onGridClicked : this.props.onGridClick
        }

    }
    componentDidMount(){
        const ctx = this.canvasRef.current.getContext('2d');        
        this.drawGrid(ctx,this.state.gridData);   
        console.log('My id is ' + this.state.gridId);        
    }
    
    drawGrid = (ctx) => {
        
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
        
        for(const [key, value] of Object.entries(this.state.gridData)){                        
            if (this.state.gridData[key]){                
                let loc = {x:key.split('|')[0], y:key.split('|')[1]}            
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
    processClick = (ctx, loc) => {
        if (loc.x >= this.MARGIN && loc.x <= this.WIDTH+this.MARGIN && loc.y >= this.MARGIN && loc.y <= this.WIDTH+this.MARGIN)            
        {
            var key = this.locToCell(loc);       
            var skey = `${key.row}|${key.col}`
            
            if (this.state.gridData[skey]){
                this.state.gridData[skey]=null;                    
            }     
            else{                
                this.state.gridData[skey] = {color:'red'};                              
            }                                                
            
            this.drawGrid(ctx, this.state.gridData);                 
            if (this.state.onGridClicked != null){
                this.state.onGridClicked({'gridId':this.state.gridId, 'gridData':this.state.gridData});
            }
            
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
                    const canvas = this.canvasRef.current
                    const ctx = canvas.getContext('2d');
                    this.processClick(ctx,{x:e.clientX, y:e.clientY})
                }
            }
            />
        )
    }
    
}

export default GridComponent;