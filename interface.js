let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}
PIXI.utils.sayHello(type)
let app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: true, // default: false
    resolution: 1 // default: 1   
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Create the main stage for your display objects

class Triangle {
    g;
    size;
    p1;
    p2;
    p3;
    color;
    lineThickness;
    hitArea;
    flip;

    constructor(x, y, size, stage, color, lineThickness, flip) {
        this.g = new PIXI.Graphics();
        this.g.interactive = true;
        this.g.buttonMode = true;
        this.flip = flip;
        this.size = size;
        this.color = color;
        this.lineThickness = lineThickness;
        stage.addChild(this.g);
        this.updatePoints(x, y);
    }

    setButtonBehavior(f) {
        this.g.click = f;
    }

    updateSize(size) {
        this.size = size;
        this.updatePoints(this.p1.x, this.p1.y)
    }

    updatePoints(x, y) {
        let l = Math.sqrt(Math.pow(this.size, 2) - Math.pow(0.5 * this.size, 2));
        this.p1 = {
            x: x,
            y: y
        };
        let yPos = 0;
        if (this.flip) {
            yPos = y - l;
        } else {
            yPos = y + l;
        }
        this.p2 = {
            x: x + (this.size / 2),
            y: yPos
        };
        this.p3 = {
            x: x - (this.size / 2),
            y: yPos
        };
        this.g.hitArea = new PIXI.Polygon(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y)
    }

    draw() {
        this.g.clear();
        this.g.lineStyle(this.lineThickness, this.color);
        this.g.moveTo(this.p1.x, this.p1.y);
        this.g.lineTo(this.p2.x, this.p2.y);
        this.g.lineTo(this.p3.x, this.p3.y);
        this.g.lineTo(this.p1.x, this.p1.y);
    }
}

class TriGroup {
    triArr;
    points;
    pixiContainer;
    
    constructor(x, y, size, depth, stage) {

        this.pixiContainer = new PIXI.Container();
        stage.addChild(this.pixiContainer);
        this.triArr = [];
        this.points = new Set();
        let thisSize = size / depth;
        let l = Math.sqrt(Math.pow(thisSize, 2) - Math.pow(0.5 * thisSize, 2));

        this.collectPoints(x, y, l, thisSize, depth, 1);
        console.log(this.points);
        this.makeTriangles(thisSize);
    }

    collectPoints(x, y, l, size, depth, curDepth) {
        if (depth >= curDepth) {
            this.points.add({
                x: x,
                y: y
            });
            console.log('curDepth: ' + curDepth);
            console.log('l: ' + l);
            console.log("x: " + x + " y: " + y);
            this.collectPoints(x + (size / 2), y + l, l, size, depth, curDepth + 1);
            this.collectPoints(x - (size / 2), y + l, l, size, depth, curDepth + 1);
        }
    }
  
    makeTriangles(size) {
        for (let point of this.points) {
            console.log(point);
            this.triArr.push(new Triangle(point.x, point.y, size, this.pixiContainer, 0xFFF00, 1, false))
        }
        console.log(this.triArr);
    }
  
    moveTriangles(deltaX, deltaY) {
        for (let tri of this.triArr) {
            tri.updatePoints(tri.p1.x + deltaX, tri.p1.y + deltaY);
        }
        this.drawTriangles();
    }
  
    drawTriangles() {
        for (let tri of this.triArr) {
            tri.draw();
        }
    }
}

window.addEventListener('resize', function() {
  location.reload();
});
let arr = [];
for (var i = 0; i < 30; i ++ ) {
  arr.push(new Triangle(window.innerWidth * Math.random(), window.innerHeight * Math.random(), ((Math.random() * 50) + 20), app.stage, "0x" + (Math.floor(Math.random()*16777215).toString(16)), 1, false))
}

for (let tri of arr) {
  tri.draw();
}
let triGroup = new TriGroup(app.view.width / 2, app.view.height * 0.1, Math.min(app.view.width, app.view.height) * 0.8, 3, app.stage);

console.log(triGroup.pixiContainer);


app.ticker.add(animate);
triGroup.drawTriangles();

let count = 0;
let max = 1000;
let amp = 0.25;
triGroup.moveTriangles(-10, -20);
function animate() {
   let y = Math.sin(2 * Math.PI * count / max);
   let x = Math.cos(2 * Math.PI * count / max);
   console.log("^x " + x + " ^y " + y);
  
   triGroup.moveTriangles(
     Math.cos(2 * Math.PI * (count / max)) * amp, 
     Math.sin(2 * Math.PI * (count / max)) * amp
   );
  for (let tri of arr) {
    tri.updatePoints(tri.p1.x + Math.cos(2 * Math.PI * (count / max) + (Math.random() * 1/20) + 1) * (Math.random() * 1.1), tri.p1.y + Math.sin(2 * Math.PI * (count / max) + (Math.random() * 1/20)) *
    (Math.random() * 0.9));
    tri.updateSize(Math.max((tri.size + ((Math.random() * 0.5) - 0.25)), 20));
    tri.draw();
  }
  count = count + 1; 
  if (count == max) {
     count = 0;
   }
}