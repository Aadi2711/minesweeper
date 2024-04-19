
export const TILE_STATUSES = {
    HIDDEN : 'hidden',
    MINE : 'mine',
    NUMBER : 'number',
    MARKED : 'marked',
}

export function createBoard(boardSize, numberofMines){
    const board=[];
    const minePositions= getMinePositions(boardSize, numberofMines);
    for (let x=0; x<boardSize; x++){
        const row=[];
        for(let y=0; y<boardSize; y++){
            const element= document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN;
            const tile={
                    element,
                    x,
                    y,
                    mine: minePositions.some(matchPosition.bind(null, {x,y})),
                    get status(){
                        return element.dataset.status
                    },
                    set status(value){
                        this.element.dataset.status = value
                    },
            }
            row.push(tile);
        }
        board.push(row);
    }

    return board;
}

export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED){
        return;
    }

    if(tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN
    }
    else{
        tile.status = TILE_STATUSES.MARKED
    }
}

export function revealTitle(board, tile){
    if(tile.status !== TILE_STATUSES.HIDDEN){
        return;
    }

    if(tile.mine){
        tile.status = TILE_STATUSES.MINE;
        return;
    }

    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t=>t.mine)
    if(mines.length===0){
        adjacentTiles.forEach(revealTitle.bind(null, board))
    }
    else{
        tile.element.textContent = mines.length;
    }
}

function getMinePositions(boardSize, numberofMines){
    const positions= []

    while(positions.length < numberofMines){
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }

        if(!positions.some(matchPosition.bind(null, position))){
            positions.push(position)
        }
    }

    return positions
}

function matchPosition(a,b){
    return a.x === b.x && a.y === b.y
}

function randomNumber(size){
    return Math.floor(Math.random()*size)
}

function nearbyTiles(board, {x,y}){
    const tiles=[]

    for (let xOffset =-1; xOffset <=1; xOffset++){
        for (let yOffset =-1; yOffset <=1; yOffset++){
            const tile= board[x + xOffset]?.[y+yOffset]
            if(tile) tiles.push(tile)
        }
    }

    return tiles;
}

export function checkWin(board){
    return board.every(row=>{
        return row.every(tile =>{
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status=== TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED ))
        })
    })
}

export function checkLose(board){
    return board.some(row =>{
        return row.some(tile=>{
             if(tile.status === TILE_STATUSES.MINE){
                return true;
             }
        })
    });
}