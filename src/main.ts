import "./style.css";
import pauseIcon from "./assets/icons/pause.svg";
import playIcon from "./assets/icons/play.svg";

window.addEventListener("DOMContentLoaded", main);

const MIN_SCREEN_SIZE = 100;
const BASE_SIZE = 30;
const COLORS = ["#1b1b1b", "#ff7676", "#08799e"] as const;

const FSM = [
	[0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 2, 2, 0, 0, 0, 0, 0],
	[0, 0, 1, 2, 0, 0, 0, 0, 0],
] as const;

let size = BASE_SIZE;

function main(): void {
	const speed = 5;
	const screen = document.querySelector("#screen") as HTMLCanvasElement;
	setCanvas(screen);
	const playBtn = document.querySelector("#play") as HTMLButtonElement;
	const stopBtn = document.querySelector("#stop") as HTMLButtonElement;
	let cells = Array<number[] | null>(screen.width / size).fill(null).map(() => Array<number>(screen.height / size).fill(0));
	let playing = false;

	if (!screen) {
		throw new Error("Can not find canvas :(");
	}
  
	if (!playBtn) {
		throw new Error("No play btn :(");
	}

	if (!playBtn) {
		throw new Error("No stop btn :(");
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
		}, 1000 / speed); 
	}

	render();

	function initCells(): number[][] {
		return Array<number[] | null>(screen.width / size).fill(null).map(() => Array<number>(screen.height / size).fill(0));
	}

	function reinitCells(): number[][] {
		return initCells().map((line, x) => line.map((_, y) => {
			const prevLine = cells[x];
			if (prevLine) {
				return prevLine[y] || 0;
			}
			return 0;
		}));
	}

	function updatePlayBtn(): void {
		if (playing) {
			playBtn.classList.add("playing");
			playBtn.innerHTML = `<img src=${pauseIcon} />`;
		} else {
			playBtn.classList.remove("playing");
			playBtn.innerHTML = `<img src=${playIcon} />`;
		} 

	}

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
		updatePlayBtn();
	});

	stopBtn.addEventListener("click", () => {
		setCanvas(screen);
		cells = initCells();
		playing = false;
		updatePlayBtn();
	});

	window.addEventListener("resize", () => {
		setCanvas(screen);
		cells = reinitCells();
	});
}

function setCanvas(canvas: HTMLCanvasElement) {
	const windowWidth = Math.min((window.screen.width, window.innerWidth));
	const windowHeight = Math.min((window.screen.height, window.innerHeight));

	canvas.width = MIN_SCREEN_SIZE > Math.floor(windowWidth * .85) ? MIN_SCREEN_SIZE : Math.floor(windowWidth * .85);
	canvas.height = MIN_SCREEN_SIZE > Math.floor(windowHeight * .85) ? MIN_SCREEN_SIZE : Math.floor(windowHeight * .85);
	
	size = BASE_SIZE;

	while (canvas.height / size < 12 || canvas.width / size < 12) {
		size--;
	}
	

	while ((Math.floor(canvas.width / size) != canvas.width / size) || (document.body.clientWidth - 1 > windowWidth && MIN_SCREEN_SIZE < canvas.width)) {
		canvas.width--;
	}

	while ((Math.floor(canvas.height / size) != canvas.height / size) || (document.body.clientHeight - 1 > windowHeight && MIN_SCREEN_SIZE < canvas.height)) {
		canvas.height--;
	}
}

function nbors(arr: number[][], x: number, y: number): number {
	let counter = 0;
	for (let i = -1; i <= 1; i++) {
		const cur_x = (x + i + arr.length) % arr.length; 
    
		for (let j = -1; j <= 1; j++) {
			const cur_y = (arr[cur_x].length + y + j) % arr[cur_x].length;
			if (cur_y === y && cur_x === x) continue;

			if (arr[cur_x][cur_y] > 0) counter++;
		}
	}

	return counter;
}
