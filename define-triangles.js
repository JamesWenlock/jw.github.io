class Triangle {
    g;
    size;
    p1;
    p2;
    p3;
    center;
    color;
    lineThickness;
    hitArea;
    flip;
    fill;
    curD;
    targetD;
    curV;
    targetV;
    a;
    maxSpeed;
    target;
    radius;
    freq;
    curRadius;
    curFreq;
    radius;
    circleVector;
    circleTick;
    
    

    constructor(x = 0, y = 0, size = 100, stage, color = 0xFFFF00, lineThickness = 1, flip = false, fill = false, rX = 0, rY = 0, freq = 0) {
        this.g = new PIXI.Graphics();
        stage.addChild(this.g);
        
        this.g.interactive = true;
        this.g.buttonMode = true;
        this.flip = flip;
        this.fill = fill;
        this.size = size;
        this.freq = freq;
        this.radius = ({x: rX, y: rY});
        this.curFreq = freq;
        this.curRadius = this.radius;
        this.circleTick = 0;
        this.center = ({x : x, y : y});
        this.curD = ({x : 0, y : 0});
        this.d = ({x : 0, y : 0});
        this.target = this.center;
        this.color = color;
        this.lineThickness = lineThickness;
        this.curV = 0;
        this.setVelocity(0);
        this.setAccel(0);
        this.setDirection(0, 0);
        this.updateCircle();
    }

    setBehavior(f) {
        this.g.click = f;
    }

    updateCircle() {
      this.curFreq = this.smooth(this.freq, this.curFreq, 0.001 / 60);
      this.curRadius.x = this.smooth(this.radius.x, this.curRadius.x, 0.001 / 60);
      this.curRadius.y = this.smooth(this.radius.y, this.curRadius.y, 0.001 / 60);
      let angle = Math.PI * 2 * this.curFreq * (this.circleTick /  60);
      let vX = Math.cos(angle) * this.curRadius.x;
      let vY = Math.sin(angle) * this.curRadius.y;
      this.circleVector = ({x : vX, y : vY});
      this.circleTick = this.circleTick + 1;
    }
  
    updateSize(size) {
        this.size = size;
        this.updatePoints()
    }

    updatePoints() {
        let l = Math.sqrt(Math.pow(this.size, 2) - Math.pow(0.5 * this.size, 2));
        let curCenter = ({
          x : (this.center.x + this.circleVector.x), 
          y : (this.center.y + this.circleVector.y)
        });
        this.p1 = {
            x : curCenter.x,
            y : curCenter.y - (l / 2)
        };
        if (this.flip) {
          this.p1.y = curCenter.y + (l / 2) 
        }
        let yPos = 0;
        if (this.flip) {
            yPos = this.p1.y - l;
        } else {
            yPos = this.p1.y + l;
        }
        this.p2 = {
            x: this.p1.x - (this.size / 2),
            y: yPos
        };
        this.p3 = {
            x: this.p1.x + (this.size / 2),
            y: yPos
        };
        this.g.hitArea = new PIXI.Polygon(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y)
        return curCenter;
    }
    
    setDirection(x, y) {
      let denominator = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      x = x / denominator;
      y = y / denominator;
      this.targetD = ({x : x, y : y});
    }
    
    setVelocity(vel) {
      this.targetV = vel / 60;
    }
  
    setAccel(accel) {
      this.a = accel / 60;
    }
  
    setRadius(radius) {
      this.radius = radius; 
    }
  
    setFreq(freq) {
      this.freq = freq; 
    }
  
    setTarget(x, y) {
      this.target.x = x;
      this.target.y = y;
    }
  
    smooth (t, c, s) {
        if (c < t) {
            c = c + s; 
        }
        if (c > t) {
            c = c - s;   
        }
        return c;
    }
  
    move() {
        this.curV = this.smooth(this.targetV, this.curV, this.a);
        this.curD.x = this.smooth(this.targetD.x, this.curD.x, this.a); 
        this.curD.y = this.smooth(this.targetD.y, this.curD.y, this.a);
        let deltaX = (this.curD.x * this.curV);
        let deltaY = (this.curD.y * this.curV);
        this.center = ({x : deltaX + this.center.x, y : deltaY + this.center.y});
        this.updateCircle();
        this.updatePoints();
        this.draw();
    }
  
    draw() {
        this.g.clear();
        this.g.lineStyle(this.lineThickness, this.color);
        if (this.fill) {
          this.g.beginFill(0x000000, 1);
        }
        this.g.moveTo(this.p1.x, this.p1.y);
        this.g.lineTo(this.p2.x, this.p2.y);
        this.g.lineTo(this.p3.x, this.p3.y);
        this.g.lineTo(this.p1.x, this.p1.y);
        if (this.fill) {
          this.g.endFill();
        }
    }
}

class TriText extends Triangle {
  text;
  fontAdjust;
  
  constructor (x = 0, y = 0, size = 100, stage, color = 0xFFFF00, lineThickness = 1, flip = false, fill = false, rX = 0, rY = 0, freq = 0, string = "default", fontFamily = 'Major Mono Display, monospace', fontSize = 0.3, align = "center", textColor = "white", fontAdjust = 0.15) {
    super(x, y, size, stage, color, lineThickness, flip, fill, rX, rY, freq)
    this.fontAdjust = fontAdjust;
    let textStyle = new PIXI.TextStyle({
      align: "center",
      fill: textColor,
      stroke: textColor,
      fontFamily: fontFamily,
      fontSize: fontSize * this.size,
      wordWrap: true,
      wordWrapWidth: (0.5 * this.size),
    });
    this.text = new PIXI.Text(string, textStyle);
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.5;
    stage.addChild(this.text);
    this.updatePoints();
    this.draw();
  }
  
  updateSize(size) {
      this.text.style.fontSize = this.fontSize * size;
      this.updatePoints(this.center.x, this.center.y)
  }
  
  updatePoints() {
        let curCenter = super.updatePoints();
        this.positionText(curCenter.x, curCenter.y);
  }
  
  positionText(x, y) {
    this.text.x = x;
    if (this.flip) {
      this.text.y = y - (this.size * this.fontAdjust);
    } else {
      this.text.y = y + (this.size * this.fontAdjust);
    }
  }
  
  setText(string) {
    this.text.text = string
  }
}

class TriImage extends Triangle {
  sprite;
  
  constructor (x = 0, y = 0, size = 100, stage, color = 0xFFFF00, lineThickness = 1, flip = false, fill = false, rX = 0, rY = 0, freq = 0, img) {
    super(x, y, size, stage, color, lineThickness, flip, fill, rX, rY, freq);
    var texture = PIXI.Texture.fromImage(img);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    stage.addChild(this.sprite);
    this.updateSize(size);
    this.updatePoints();
    this.draw();
  }
  
  updateSize(size) {
      this.size = size;
      this.sprite.width = size  * 0.5;
      this.sprite.height = size * 0.5;
      
      this.updatePoints(this.center.x, this.center.y)
  }
  
  updatePoints() {
      let curCenter = super.updatePoints();
      this.positionImg(curCenter.x, curCenter.y + (this.sprite.height / 4));
  }
  
  setImage (img) {
    var texture = PIXI.Texture.fromImage(img);
    this.sprite.texture = texture;
    this.updateSize(this.size);
  }
  
  positionImg(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  }
}

class TriGroup {
    triArr;
    points;
    pixiContainer;
    topPoints;
    flipPoints;
    color;
    
    constructor(x, y, size, depth, stage, color, radius = 0, freq = 0, fontFamily = 'Major Mono Display, monospace' , fontSize = 0.1, align = "center", textColor = "white") {
        this.pixiContainer = new PIXI.Container();
        stage.addChild(this.pixiContainer);
        this.triArr = [];
        this.points = new Set();
        this.topPoints = [];
        this.flipPoints = new Set();
        this.color = color;
        let thisSize = size / depth;
        let l = Math.sqrt(Math.pow(thisSize, 2) - Math.pow(0.5 * thisSize, 2));
        this.collectPoints(x, y - (l / 2), l, thisSize, depth, 1);
        this.makeTriangles(thisSize, this.points, false, l, radius, freq, fontFamily, fontSize, align, textColor);
        // this.drawLine(0, app.view.width, this.triArr[0].p2, this.triArr[0].p1);
        // this.drawLine(0, app.view.width, this.triArr[0].p1, this.triArr[0].p3);
        this.collectFlipPoints();
        this.makeTriangles(thisSize, this.flipPoints, true, l, radius, freq, fontFamily, fontSize, align, textColor);
    }
  
    getY (x, p1, p2) {
        let m = (p2.y - p1.y) / (p2.x - p1.x);
        return m * (x - p1.x) + p1.y;
    }
    
    drawLine (x1, x2, p1, p2) {
      let graphics = new PIXI.Graphics();
      app.stage.addChild(graphics);
      graphics.lineStyle(1, 0xFFF00);
      graphics.moveTo(x1, this.getY(x1, p1, p2));
      graphics.lineTo(x2, this.getY(x2, p1, p2));
    }
  
    notOnLine(point, p1, p2) {
      let m = (p2.y - p1.y) / (p2.x - p1.x);
      let y = m * (point.x - p1.x)+ p1.y; 
      let roundingError = 50;
      let lowerBound = y >= point.y - roundingError;
      let upperBound = y <= point.y + roundingError;
      let bool = !(lowerBound && upperBound);
      return bool;
    }
  
    addFlipPoint(point) {
      let notOnLine1 = this.notOnLine(point, this.triArr[0].p2, this.triArr[0].p1);
      let notOnLine2 = this.notOnLine(point, this.triArr[0].p1, this.triArr[0].p3);
      if (notOnLine1 && notOnLine2) {
        this.flipPoints.add(point);
      }
    }
    
    collectPoints(x, y, l, size, depth, curDepth) {
        if (depth >= curDepth) {
            let point = {x : x, y : y};
            this.points.add(point);
            this.collectPoints(x + (size / 2), y + l, l, size, depth, curDepth + 1);
            this.collectPoints(x - (size / 2), y + l, l, size, depth, curDepth + 1);
        }
    }
  
    collectFlipPoints() {
        for (let tri of this.triArr) {
          this.addFlipPoint(tri.p1);
          this.addFlipPoint(tri.p2);
          this.addFlipPoint(tri.p3);
        }    
    }
  
    makeTriangles(size, points, flip, l, radius, freq, fontFamily, fontSize, align, textColor) {
        let deltaY = -1 * (l / 2);
        for (let point of points) {
            this.triArr.push(new TriText(point.x, point.y + deltaY, size, this.pixiContainer, this.color, 1, flip, true, radius, freq, "test", fontFamily, fontSize, align, textColor))
        }
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