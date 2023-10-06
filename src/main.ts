import "./style.css"

window.addEventListener("DOMContentLoaded", main);



function main() {
  const screen = document.querySelector("#screen") as HTMLCanvasElement;
  const playBtn = document.querySelector("#play") as HTMLButtonElement;
  const size = 20;
  const cells = Array<number[] | null>(screen.width / size).fill(null).map(() => Array<number>(screen.height / size).fill(0));
  let playing = false;

  if (!screen) {
    throw new Error("Can not find canvas :(");
  }
  
  if (!playBtn) {
    throw new Error("No play btn :(");
  }

  function render() {
    const ctx = screen.getContext("2d");
  
    if (!ctx) {
      throw new Error("No 2d ctx :(");
    }
  
  
  
    for (let i = 0; i < screen.width / size; i++) {
      for (let j = 0; j < screen.height / size; j++) {
        switch (cells[i][j]) {
          case 0:
            ctx.fillStyle = "#1b1b1b";
            break;
          case 1:
            ctx.fillStyle = "#ff7676";
            break;
        }
        ctx.fillRect(i * size, j * size, size, size);
      }
    }
  
    if (playing) {
      const prev_cells = cells.map(line => {
        return line.map(cell => {
          return cell;
        })
      });
    
      for (let i = 0; i < screen.width / size; i++) {
        for (let j = 0; j < screen.height / size; j++) {
          const nbors_count = nbors(prev_cells, i, j);
          if (nbors_count) {
            console.log(nbors_count);
          }
          
          switch (prev_cells[i][j]) {
            case 0:
              if (nbors_count === 3) {
                cells[i][j] = 1;
                console.log("aa");
              }
              break;
            case 1:
              if (nbors_count < 2 || nbors_count > 3) {
                
                
                cells[i][j] = 0;
              }
              break;
          }
        }
      }
    }
    setTimeout(() => {
      requestAnimationFrame(render);
    }, 1000 / 5); 
  }

  render();

  screen.addEventListener("mousedown", e => {
    const x = e.offsetX;
    const y = e.offsetY;
  
    for (let i = 0; i < screen.width / size; i++) {
      if ((i * size <= x) && ((i + 1) * size > x))
      for (let j = 0; j < screen.height / size; j++) {
        if ((j * size <= y) && ((j + 1) * size > y)) {
          switch (cells[i][j]) {
            case 0:
              cells[i][j] = 1;
              break;
            case 1:
              cells[i][j] = 0;
              break;
          }
        }
      }
    }
  });

  playBtn.addEventListener("click", () => {
    playing = !playing;
  });
}


function nbors(arr: number[][], x: number, y: number) {
  let counter = 0;
  for (let i = (x === 0 ? 0 : -1); i <= (x === arr.length - 1 ? 0 : 1); i++) {
    const cur_x = x + i;
    
    for (let j = (y === 0 ? 0 : -1); j <= (y === arr[cur_x].length - 1 ? 0 : 1); j++) {
      const cur_y = y + j;
      if (cur_y === y && cur_x === x) continue;

      if (arr[cur_x][cur_y] === 1) counter++;
    }
  }

  return counter;
}