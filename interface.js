window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

/*
let arr = [];
for (var i = 0; i < 100; i ++ ) {
  arr.push(new Triangle(window.innerWidth * Math.random(), window.innerHeight * Math.random(), ((Math.random() * 50) + 20), app.stage, "0x" + (Math.floor(Math.random()*16777215).toString(16)), 1, false, false))
}

for (let tri of arr) {
  tri.draw();
}

let triGroup = new TriGroup(app.view.width / 2, app.view.height * 0.1, Math.min(app.view.width, app.view.height) * 0.8, 2, app.stage, 0xffff00);

console.log(triGroup.pixiContainer);

let flyAway = false;
app.ticker.add(animate);
triGroup.drawTriangles();
for (let tri of triGroup.triArr) {
  tri.g.mousedown = function(e) {
    flyAway = true;
    console.log("mouse-is-down");
  }
}
*/
/*
let t = 0;
let count = 0;
let max = 1000;
let amp = 0.25;
let lastWidth = app.view.width;

window.addEventListener("resize", function (e) {
   let thisWidth = app.view.width;
   let dif;
    if (thisWidth > lastWidth) {
      dif = (thisWidth - lastWidth);
    } else {
      dif = -1 * (lastWidth - thisWidth);
    }
    dif = dif / 2;
     triGroup.moveTriangles(dif, 0);
  for (let tri of arr) {
    tri.updatePoints(tri.p1.x + dif, tri.p1.y)
  }
  lastWidth = thisWidth;
}) 
*/
/*
let isFlying = false;
//triGroup.moveTriangles(-10, -20);
let flyT = 0;
*/

function animate() {
    /*
    let y = Math.sin(2 * Math.PI * count / max);
   let x = Math.cos(2 * Math.PI * count / max);

   triGroup.moveTriangles(
     Math.cos(2 * Math.PI * (count / max)) * amp, 
     Math.sin(2 * Math.PI * (count / max)) * amp
   );
  if (flyAway) {
    if (isFlying) {
        
    }
    triGroup.moveTriangles(0, - (t * 0.0075));
  }
  for (let tri of arr) {
    tri.updatePoints(tri.p1.x + Math.cos(2 * Math.PI * (count / max) + (Math.random() * 1/20) + 1) * (Math.random() * 1.1), tri.p1.y + Math.sin(2 * Math.PI * (count / max) + (Math.random() * 1/20)) *
    (Math.random() * 0.9));
    tri.updateSize(Math.max((tri.size + ((Math.random() * 0.5) - 0.25)), 20));
    tri.draw();
  }
  count = count + 1; 
  t = t + 1;
  if (count == max) {
     count = 0;
   }
   */
}