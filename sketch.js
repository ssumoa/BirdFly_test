/**
 * @name Mic Threshold
 * @arialabel Black rectangle is drawn on the bottom of a bar based on the amplitude of the user’s audio input. At a certain minimum amplitude, grey squares are randomly drawn on the right side of the screen
 * @description <p>Trigger an event (draw a rectangle) when the Audio Input
 * volume surpasses a threshold.</p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em></p>
 */
// Adapted from Learning Processing, Daniel Shiffman
// learningprocessing.com
let input;
let analyzer;

let n = 50;
let circles =  [];
let birds =  [];

let imgW =[];
let imgB =[];
let imgX = 30;
let imgY = 30;
let frameNum = 0;
let xPos = 30;

let life = true;
let event = false;
let time = 0;
let endTime = 0;
function preload(){
  for(let i=1; i<=12; i++){
    imgW[i-1] = loadImage('data/img/w/' + i + '.png');
  }
  for(let i=1; i<=12; i++){
    imgB[i-1] = loadImage('data/img/b/' + i + '.png');
  }
}

function setup() {
  let main =   createCanvas(1920,1080);
  main.parent('item');
 
  background(0);
  noStroke();
  frameRate(24);
  
  for(let i = 0; i<n; i++){
    let x = random(width/4);
    let y = random(height);
    birds[i] = new Bird(x,y);
  }

  // Create an Audio input
  input = new p5.AudioIn();

  input.start();
}

function draw() {
  state1();
 //if(y<600){console.log(y); fill(0);rect(0,0,width,height)};
}


function state1(){
  
  if(frameCount%24==0) time ++;

  // Get the overall volume (between 0 and 1.0)
  let volume = input.getLevel();
  
  // If the volume > 0.1,  a rect is drawn at a random location.
  // The louder the volume, the larger the rectangle.
  let threshold = 0.1;
  // if (volume > threshold) {
  //   stroke(0);
  //   fill(0, 100);
  //   rect(random(40, width), random(height), volume * 50, volume * 50);
  // }
  // Graph the overall potential volume, w/ a line at the threshold
  let v = map(volume, 0, 0.1, 0, 100);
  if(v>10)  { endTime = time+4;}
    if(time>=endTime){ event = false;}
    else event = true; 
  
  let ythreshold = map(threshold, 0, 1, height, 0);
  //console.log(y);
  colorMode(HSB,300,255,255,255);
  fill(frameCount%300,255,255,70);
  rect(0,0,width, height);

  //makeNewBird(140, 20);
    if(life){
      makeNewBird(140, 20);
      if(birds.length == 140) life = !life;
    } 
    else{
      removeBird(100 , 20);
      if(birds.length == 100) life = !life; 
      }
      console.log(birds.length);  
  if(!event){
  let cn = random(50);
  for(let i = 0; i < birds.length; i++){
    birds[i].update(random(1,1.5));
    birds[i].wrap();
    
    if(16<i)
    birds[i].display(1, imgW);
    else birds[i].display(1, imgB);
    
  }
  }else{
    if(life){
      makeNewBird(15);
    if(birds.length == 100) life = !life;
  }
    else{ removeBird(15);if(birds.length == 60) life = !life; }  
  
  for(let i = 0; i < birds.length; i++){
    if(birds[i].posX<width/2){
      birds[i].update(-random(1.5,4));
      birds[i].wrap();
      if(16<i)
    birds[i].display(-1, imgW);
    else birds[i].display(-1, imgB);
    }
    else{ 
      birds[i].update(random(1.5,4));
      birds[i].wrap();
      if(16<i)
    birds[i].display(1, imgW);
    else birds[i].display(1, imgB);
    ;
    }
  }
  }
  console.log(event);

}

class Bird{
  constructor(posX_, posY_) {
  this.posX= posX_;
  this.posY= posY_;
  this.incr=0;
  this.theta=0;
}

move() {
  this.update();
  this.wrap();
  this.display();
}

update(dir) {
  this.incr -=  0.008;
  this.theta = noise(this.posX * 0.06, this.posY * 0.04, this.incr) * TWO_PI;
  this.posX -= 5 * cos(this.theta) *dir;
  //if(this.posY>20 && posY <height-20) this.posY -= 4 * sin(this.theta);
this.posY -= 4 * sin(this.theta)*dir;    
  //console.log(this.posX + " : " + this.posY);
}

  
display(dir, imgArr) {
    if (this.posX > 0 && this.posX < width && this.posY > 0  && this.posY < height) {
   // fill(255);
  let size = this.posX;
  colorMode(HSB,100,255,255,255);
  fill(0,2);fill(time%100,100,255,2); rect(0,0,width, height);
  // if(frameNum == 4 || frameNum ==8)  rect(0,0,width, height);
  push();
  translate(this.posX,this.posY);
    rotate(radians(330));
    rotate(radians(35 * (this.posY*2)/float(height)));
    //scale(1 + size/width);
    birdFly(0, 0, size, dir, imgArr);
    pop();
  }
}
  
displayB(dir) {
  if (this.posX > 0 && this.posX < width && this.posY > 0  && this.posY < height) {
 // fill(255);
let size = this.posX;
//colorMode(HSB,300,255,255,255);
//fill(0,2);
//fill(frameCount%300,100,255,2); rect(0,0,width, height);
// if(frameNum == 4 || frameNum ==8)  rect(0,0,width, height);
push();
translate(this.posX,this.posY);
  rotate(radians(330));
  rotate(radians(35 * (this.posY*2)/float(height)));
  //scale(1 + size/width);
  birdFlyB(0, 0, size, dir, imgB);
  pop();
  }
  }


wrap() {
  if (this.posX < 0) this.posX = width -30;
  if (this.posX > width -100 ) this.posX =  0;
  if (this.posY < 0) this.posY = height-30;
  if (this.posY > height) this.posY =  0;

}

}

function birdFly(posX, posY, size_, dir_, imgArr){

  let size = 60+1.3*(size_/width *100);
  let dir = 1 * dir_;
  scale(dir,1);
  image(imgArr[frameNum],posX*dir ,posY,size,size);
  //blendMode(HARD_LIGHT);
  //colorMode(HSB);
  //fill(random(255),random(255),random(255));
  //circle(posX*dir-size ,posY-size,size,size);
    frameNum ++;
    if (frameNum  >= 11)
    {
      frameNum = 0;
    }
  
}

function birdFlyB(posX, posY, size_, dir_){

  let size = 60+1.3*(size_/width *100);
  let dir = 1 * dir_;
  scale(dir,1);
  image(imgB[frameNum],posX*dir ,posY,size,size);
  blendMode(HARD_LIGHT);
  //colorMode(HSB);
  //fill(random(255),random(255),random(255));
  //circle(posX*dir-size ,posY-size,size,size);
    frameNum ++;
    if (frameNum  >= 11)
    {
      frameNum = 0;
    }
  
}



function makeNewBird(n, rate){
if(birds.length <n){
  if(random(100)<rate){
    birds.push(new Bird( random(width/8),random(height*0.1, height*0.9)));
  }
}
}

function removeBird(n, rate){
if(birds.length >n){
  if(random(100)<rate){
    birds.pop(new Bird( random(width/8),random(height*0.1, height*0.9)));
  }
}
}

function surprising() {

}

let lp = true;
function mousePressed() {
  if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
    let fs = fullscreen();
    fullscreen(!fs);
      // lp = !lp;
      // if(!lp) noLoop();
      // else noLoop();
  }
}