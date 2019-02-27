
function rand(n){
	return (Math.random() * n) | 0;
}

const EMPTY = 0;
const WALL = 1;
const BEGIN = 2;
const END = 3;

class Map {
	
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.ground = [];
		for (let i=0; i<this.width*this.height; ++i){
			this.ground[i] = EMPTY;
		}
		this.begin = {x: 0, y: 0};
		this.end = {x: this.width-1, y: this.height-1};
	}
	
	index(x, y){
		if (x < 0 || x >= this.width || y < 0 || y >= this.height){
			throw RangeError("Map location out of bounds");
		}
		return x + y * this.width;
	}
	
	get(x, y){
		return this.ground[this.index(x, y)];
	}
	
	set(x, y, val){
		this.ground[this.index(x, y)] = val;
	}
	
	toStr(valueChars){
		let s = "";
		for (let y=0; y<this.height; ++y){
			for (let x=0; x<this.width; ++x){
				s += valueChars[this.get(x, y)];
			}
			s += '\n';
		}
		return s;
	}
}

function bsp(map, xmin, ymin, xmax, ymax, depth) {
	let width = xmax - xmin;
	let height = ymax - ymin;
	let size = width * height;
	let tosplit = depth > 0 && size > 8 + rand(20) + rand(20);
	if (
			tosplit &&
			height >= 5 &&
			width > 2 && (
				width < 5 ||
				2 + (height * 2 >= width * 3) - (width * 2 >= height * 3) > rand(4)
			)) {
		// horizontal wall

		let sepmin = ymin + 1 + rand(height - 3);
		let sepmax = sepmin + 2 + rand(2);
		sepmax = Math.min(ymax - 1, sepmax);
		for (let x = xmin; x < xmax; ++x) {
			for (let y = sepmin; y < sepmax; ++y) {
				map.set(x, y, WALL);
			}
		}
		if (rand(2) == 0) {
			bsp(map, xmin, ymin, xmax, sepmin, depth - 1);
			bsp(map, xmin, sepmax, xmax, ymax, depth - 1);
		} else {
			bsp(map, xmin, sepmax, xmax, ymax, depth - 1);
			bsp(map, xmin, ymin, xmax, sepmin, depth - 1);
		}
		let l = width;
		// draw 1 to 3 doors
		for (let i = 0, ln = 1 + rand(3); i < ln; ++i) {
			// pick a random door position
			let dp = rand(l);
			// if this door ends in a wall, move until there is a place where a
			// door makes sense
			for (let i = 0; i < l; ++i) {
				let doorposmin = map.index(xmin + (i + dp) % l, sepmin);
				let doorposmax = map.index(xmin + (i + dp) % l, sepmax);
				if (map.ground[doorposmax] == EMPTY &&
					map.ground[doorposmin - map.width] == EMPTY) {
					for (let p = doorposmin; p < doorposmax; p += map.width) {
						map.ground[p] = EMPTY;
					}
					break;
				}
			}
		}
	} else if (tosplit && width >= 5 && width > 2) {
		// vertical wall
		let sepmin = xmin + 1 + rand(width - 3);
		let sepmax = sepmin + 2 + rand(2);
		sepmax = Math.min(xmax - 1, sepmax);

		for (let y = ymin; y < ymax; ++y) {
			for (let x = sepmin; x < sepmax; ++x) {
				map.ground[map.index(x, y)] = WALL;
			}
		}
		if (rand(2)) {
			bsp(map, xmin, ymin, sepmin, ymax, depth - 1);
			bsp(map, sepmax, ymin, xmax, ymax, depth - 1);
		} else {
			bsp(map, sepmax, ymin, xmax, ymax, depth - 1);
			bsp(map, xmin, ymin, sepmin, ymax, depth - 1);
		}
		let l = height;
		let dp = rand(l);
		for (let i = 0, ln = 1 + rand(3); i < ln; ++i) {
			for (let i = 0; i < l; ++i) {
				let doorposmin = map.index(sepmin, ymin + (i + dp) % l);
				let doorposmax = map.index(sepmax, ymin + (i + dp) % l);
				if (map.ground[doorposmax] == EMPTY &&
					map.ground[doorposmin - 1] == EMPTY) {
					for (let p = doorposmin; p < doorposmax; ++p) {
						map.ground[p] = EMPTY;
					}
					break;
				}
			}
		}
	} else {
		if (width >= 2 && height >= 2) {
			let x = xmin + 1 + rand(width - 1);
			let y = ymin + rand(height);
			if (map.begin.x < 0) {
				map.begin.x = x;
				map.begin.y = y;
			} else {
				map.end.x = x;
				map.end.y = y;
			}
		}
	}
}

function generateMap(){
	
	// create a new map
	let map = new Map(64, 64);
	
	map.begin = {x: -1, y: -1};
	map.end = {x: -1, y: -1};
	
	let xmin = 1;
	let ymin = 1;
	let xmax = 63;
	let ymax = 63;
	
	// draw the walls on the sides but leave the middle area open
	for (let x = 0; x < map.width; x++) {
		for (let y = 0; y < map.height; y++) {
			if (x < xmin || y < ymin || x >= xmax || y >= ymax) {
				map.set(x, y, WALL);
			} else {
				map.set(x, y, EMPTY);
			}
		}
	}
	
	bsp(map, xmin, ymin, xmax, ymax, 12);
	
	map.set(map.begin.x, map.begin.y, BEGIN);
	map.set(map.end.x, map.end.y, END);
	
	
	return map;
}


function main(){
	
	let mapping = ".#BE?????????????";
// 	mapping[EMPTY] =  '.';
// 	mapping[WALL] = '#';
	
	let map = generateMap();
	
	document.getElementById("field").innerHTML = map.toStr(mapping);
	
}

window.addEventListener("load", main);
