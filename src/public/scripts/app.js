
function viewport() {
	var e = window, a = 'inner';
	if ( !( 'innerWidth' in window ) ) {
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

let WINDOW_WIDTH = window.innerWidth;
let WINDOW_HEIGHT = window.innerHeight;

const TAP_THRESHOLD = 10;
const TAP_TIME_THRESHOLD = 150;

let touchstart_time = new Date().getTime();

let canvas = document.getElementById ("canvas");
document.getElementById ('canvas').width = WINDOW_WIDTH;
document.getElementById ('canvas').height = WINDOW_HEIGHT;
canvas.getContext ("2d").font = '30px Arial';

let client = new Client(canvas, WINDOW_WIDTH, WINDOW_HEIGHT);
client.connectToServer();
client.update(new Date().getTime());

let onresize = function(e) {
	WINDOW_WIDTH = window.innerWidth;
	WINDOW_HEIGHT = window.innerHeight;
   client.resize (WINDOW_WIDTH, WINDOW_HEIGHT);
   document.getElementById ('canvas').width = WINDOW_WIDTH;
   document.getElementById ('canvas').height = WINDOW_HEIGHT;
}
window.addEventListener("resize", onresize);

let lastpos = {x:0, y:0};
let startpos = {x:0, y:0 }

window.addEventListener('touchstart', function(e) {
    lastpos.x = e.touches[0].clientX;
    lastpos.y = e.touches[0].clientY;

	touchstart_time = new Date().getTime();

	startpos = lastpos;
  });


  window.addEventListener('touchmove', function(e) {
    let newpos = {x:e.touches[0].clientX, y:e.touches[0].clientY};
	let diff = {x:newpos.x-lastpos.x, y:newpos.y-lastpos.y};
	lastpos = newpos;
	
    client.sendPos(diff);
  });

  window.addEventListener('touchend', function(e) {
	let delta = new Date().getTime() - touchstart_time;

	if(delta < TAP_TIME_THRESHOLD) {
		// click happened, check if one of the buttons has been clicked
		if(checkCollision(client.keyboardButtonPos, lastpos)) {
			//console.log(this.document.getElementById("keyboard"));
			//this.document.getElementById("keyboard").focus();
		} else if (checkCollision(client.rightMouseButtonPos, lastpos)) {
			//var a = prompt("Enter message to send");
			client.sendRightClick();
		} else {
			client.sendClick();
		}
	}
  });

  let checkCollision = function(rect, pos) {
	  return (pos.x < rect.x + rect.w && pos.x > rect.x && pos.y < rect.y + rect.h && pos.y > rect.y);
  }