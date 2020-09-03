import React, {
    Component,
    useState,
    useRef,
    useEffect
} from 'react'

export default function GridComponent(grid) {
    
    const canvasRef = useRef(null);
    
    const CELL_WIDTH=25;
    const WIDTH = 500;    
    const MARGIN = 5;
    const [gridData,setGridData] = useState({});
    
    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d');
        drawGrid(ctx);        
    })   

    function drawGrid(ctx){
        
        ctx.clearRect(0,0,WIDTH+MARGIN, WIDTH+MARGIN);
        for(let i=0; i < WIDTH/CELL_WIDTH+1; i++){ //rows
            ctx.beginPath()
            ctx.moveTo(MARGIN,MARGIN + i*CELL_WIDTH);
            ctx.lineTo(WIDTH +MARGIN, MARGIN + i*CELL_WIDTH);
            ctx.stroke();
        }

        for(let i=0; i < (WIDTH/CELL_WIDTH) +1; i++){ //cols
            ctx.beginPath()
            ctx.moveTo(MARGIN+i*CELL_WIDTH,MARGIN);
            ctx.lineTo(MARGIN+i*CELL_WIDTH , MARGIN + WIDTH);
            ctx.stroke();
        }                        
        
        for(const [key, value] of Object.entries(gridData)){            
            let loc = {x:key.split('|')[0], y:key.split('|')[1]}            
            if (gridData[key]){                
                ctx.fillRect(loc.y*CELL_WIDTH + MARGIN, loc.x*CELL_WIDTH + MARGIN, CELL_WIDTH,CELL_WIDTH);
            }
        }
    } 
    function locToCell(loc){
        
        return{
            row:Math.trunc((loc.y - MARGIN)/CELL_WIDTH),
            col:Math.trunc((loc.x - MARGIN)/CELL_WIDTH)
        }
    }
    function processClick(ctx, loc){
        if (loc.x >= MARGIN && loc.x <= WIDTH+MARGIN && loc.y >= MARGIN && loc.y <= WIDTH+MARGIN)            
        {
            var key = locToCell(loc);       
            var skey = `${key.row}|${key.col}`
            
            if (gridData[skey]){
                gridData[skey]=null;                    
            }     
            else{
                gridData[skey] = {color:'red'};                              
            }            
            
            setGridData(gridData);
            drawGrid(ctx);            
        }
    }
    return ( <canvas 
        ref = {canvasRef}
        width = {WIDTH+MARGIN}
        height = {WIDTH+MARGIN}        
        onClick = {
            e => {
                const canvas = canvasRef.current
                const ctx = canvas.getContext('2d');
                processClick(ctx,{x:e.clientX, y:e.clientY})
            }
        }
        />
    )
}