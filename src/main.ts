import "./style.css";

window.addEventListener("DOMContentLoaded", main);

const COLORS = ["#1b1b1b", "#ff7676", "#08799e"] as const;
const FSM = [
	[0, 0, 2, 1, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 2, 1, 0, 0, 0, 0, 0],
] as const;

let size = 20;
let screenSize = 800;

function main() {
	const screen = document.querySelector("#screen") as HTMLCanvasElement;
	setCanvas();
	screen.width = screenSize;
	screen.height = screenSize;
	const playBtn = document.querySelector("#play") as HTMLButtonElement;
	const cells = Array<number[] | null>(screenSize / size).fill(null).map(() => Array<number>(screenSize / size).fill(0));
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
				ctx.fillStyle = COLORS[cells[i][j]];
				ctx.fillRect(i * size, j * size, size, size);
			}
		}
  
		if (playing) {
			const prevCells = cells.map(line => {
				return line.map(cell => {
					return cell;
				});
			});
    
			for (let i = 0; i < screen.width / size; i++)
				for (let j = 0; j < screen.height / size; j++)
					cells[i][j] = FSM[prevCells[i][j]][nbors(prevCells, i, j)];
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
						const curCol = cells[i][j];
						cells[i][j] = (curCol == 2) ? 0 : curCol + 1;
					}
				}
		}
	});

	playBtn.addEventListener("click", () => {
		playing = !playing;
		playBtn.classList.toggle("playing");
		playBtn.textContent = playing ? "Pause" : "Play";
	});
}

function setCanvas() {
	screenSize = Math.floor(Math.min(window.screen.width, window.screen.height) * .7);
	console.log(screenSize);

	const cellsInLine = screenSize / 30 < 25 ? 20 : 30;
	
	size = screenSize / cellsInLine;
	console.log(size);
	while (size != Math.floor(size)) {
		screenSize--;
		size = screenSize / cellsInLine;
	}
}

function nbors(arr: number[][], x: number, y: number) {
	let counter = 0;
	for (let i = (x === 0 ? 0 : -1); i <= (x === arr.length - 1 ? 0 : 1); i++) {
		const cur_x = x + i;
    
		for (let j = (y === 0 ? 0 : -1); j <= (y === arr[cur_x].length - 1 ? 0 : 1); j++) {
			const cur_y = y + j;
			if (cur_y === y && cur_x === x) continue;

			if (arr[cur_x][cur_y] > 0) counter++;
		}
	}

	return counter;
}