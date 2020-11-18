
var fontName = 'Major Mono Display';
var audioSum = 0;
let anlz = -1;
var dataArray = "yes"; 


window.onload = function () {
  	WebFont.load(
	 {
		// this event is triggered when the fonts have been rendered, see https://github.com/typekit/webfontloader
		active : function()
		{
			start();
		},

		// multiple fonts can be passed here
		google :
		{
			families: [ fontName ]
		}
	});
  
}

// this one is important
function doMagic() {
	// create <p> tag with our font and render some text secretly. We don't need to see it after all...
	
	var el = document.createElement('p');
	el.style.fontFamily = fontName;
	el.style.fontSize = "0px";
	el.style.visibility = "hidden";
	el.innerHTML = '.';
	
	document.body.appendChild(el);
};

function createMenu() {
  let fullSize = Math.min(app.view.width * 0.8, app.view.height * 0.8);
  let btnSize = fullSize / 2; 
  let centerX = app.view.width / 2;
  let centerY = app.view.height / 2;
  let fill = true;
  let color = 0xFFFF00;
  let lineThickness = 3;
  let radius = ({x: 50, y: 20});
  let freq = 0.1;
  let fontFamily =  "Major Mono Display, monospace";
  let fontSize = 0.1;
  let fontColor = "white";
  let l = Math.sqrt(Math.pow(btnSize, 2) - Math.pow(0.5 * btnSize, 2));
  let makeBtn = function(x, y, str, flip, color) {
    return new TriText(x, y, btnSize, app.stage, color, lineThickness, flip, fill, radius.x, radius.y, freq, str, fontFamily, fontSize, "center", color, 0.17);
  } 
  
  let about = makeBtn(centerX, centerY - (btnSize / 2), "About", false, 0xffac63);
  let plugIns = makeBtn(about.p2.x - radius.x, about.p2.y + (l / 2), "plugins", false, 0x637aff);
  let projects = makeBtn(about.p3.x - radius.x, about.p2.y + (l / 2), "projects", false, 0xf263ff);
  let sounds = makeBtn(centerX, projects.p3.y - (l / 2), "sounds", true, 0xbce6eb);
  
  let menu = {
    about: about,
    plugIns: plugIns,
    sounds: sounds,
    projects: projects 
  }
  
  for (const btn of Object.entries(menu)) {
    btn[1].draw();
    btn[1].setVelocity(300);
    btn[1].setAccel(2);
  }
  return menu;
}
function randHex() {
  return "0x" + Math.floor(Math.random()*16777215).toString(16)
}
function createLinks() {
  let btnSize = Math.min(app.view.width * 0.8, app.view.height * 0.8);
  let links = {
    linkedin: new TriImage(app.view.width * 0.73, app.view.height * 0.2, btnSize / 4, app.stage, randHex(), 4, false, true, 6, 3, 0.25, "imgs/linkedin.png"),
    git: new TriImage(app.view.width * 0.83, app.view.height * 0.3, btnSize / 6, app.stage, randHex(), 4, false, true, 6, 2, 0.34, "imgs/github.png")
  }
  
  for (const tri of Object.entries(links)) {
    tri[1].draw();
    tri[1].setVelocity(300);
    tri[1].setAccel(2);
  }
  return links;
}

function createBackground() {
  let num = 500;
  let bTriArr = [];
  let bTriArrSize = [];
  for (var i = 0; i < num; i++) {
    let size = Math.random() * app.view.height * 0.01 + (app.view.height * 0.003);
    bTriArr.push(new Triangle(Math.random() * app.view.width, Math.random() * app.view.height, size * 3, app.stage, randHex(), 2, flip = false, fill = false, rX = size * 15, rY = size * 5 + 23, 0.1));
  }
  for (var i = 0; i < num; i++) {
    bTriArr[i].updatePoints();
    bTriArr[i].draw();
    bTriArrSize.push(bTriArr[i].size)
  }
  return {tri: bTriArr, size: bTriArrSize}
}

function start() {
let sound = makeSound("website", false, true, {a: [2000, 7000]});
Howler.mute(false);
Howler.volume(1);
Howler.html5 = false;

let sndImages = ["volume_mute", "volume_low", "volume_mid", "volume_high"];
let sndIndex = 0;
nresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}


// defines triangles
var bTriArr = createBackground();
console.log(bTriArr);
//var menu = createMenu();
var links = createLinks();
var logo = new TriText(app.view.width / 2, app.view.height / 2, Math.min(app.view.width, app.view.height) * 0.8, app.stage, 0xFFFF00, 3, false, true, 10, 5, 0.2, "j w", "Major Mono Display, monospace", 0.3, "center", 0xFFFF00, 0.05); 
var cv = new TriText(app.view.width * 0.27, app.view.height * 0.3, Math.min(app.view.width, app.view.height) * 0.3, app.stage, 0xff0000, 3, false, true, 10, 5, 0.2, "c v", "Major Mono Display, monospace", 0.3, "center", 0xff0000, 0.05); 
var sndCtrl = new TriImage(app.view.width * 0.79, app.view.height * 0.13, Math.min(app.view.width, app.view.height) * 0.1, app.stage, randHex(), 4, false, true, 15, 10, 0.13, "imgs/volume_mute.png");
  
var soundInit = false;
var prevVol = 0;
  
links.linkedin.g.click = function () {
  window.open("https://www.linkedin.com/in/james-wenlock");
}

links.git.g.click = function () {
  window.open("https://www.linkedin.com/in/james-wenlock");
}

cv.g.click = function () {
  window.open("Wenlock_CV_2020.pdf")
}

sndCtrl.g.click = function (e) {
  console.log("clicked");
  if (!sound.playing()) {
    sound.play();
  }
  if (!soundInit) {
    let actx = Howler.ctx;

    anlz = actx.createAnalyser();
    dataArray = new Uint8Array(anlz.frequencyBinCount);
    console.log("data-arr: " + dataArray);
    anlz.fftSize = 2048;

    Howler.masterGain.connect(anlz);
    soundInit = true;
  }
  let curVol = sndIndex / (sndImages.length - 1);
  sound.fade(prevVol, curVol, 100);
  sndCtrl.setImage("imgs/" + sndImages[sndIndex] + ".png");
  prevVol = sndIndex / (sndImages.length - 1);
  sndIndex = (sndIndex + 1) % sndImages.length;
} 

function menuLoop() {
  /*
  for (const tri of Object.entries(menu)) {
    tri[1].move();
  }  
  */
  for (const tri of Object.entries(links)) {
    tri[1].move();
  }
  logo.move();
  sndCtrl.move();
  cv.move();
  for (var i = 0; i < bTriArr.tri.length; i++) {
    
    bTriArr.tri[i].updateSize((audioSum * 70000) + bTriArr.size[i]);
    bTriArr.tri[i].move();
  }
}

function sndLoop() {
  if (soundInit) {
    anlz.getByteTimeDomainData(dataArray);
    audioSum = new Float32Array(dataArray).map(s=>((s-128)/128)**2).reduce((a,c) => a+c )/dataArray.length;
  }
  
}
  
app.ticker.add(animate);
let sndTicker = 0;
function animate() {
  menuLoop();
  sndLoop();
};

};
