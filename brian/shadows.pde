PVector pos, vel;
Button left;
Button[] buttons = new Button[4];

void setup() {
  textFont(loadFont("FreeSansBold-30.vlw")); 
  size(640, 380, P3D);
  noStroke();
  stroke(0);
  buttons[0] = new Button(50, height-130, 32,32,loadImage("arrow_up.png"),0);
  buttons[1] = new Button(18,height-98,32,32,loadImage("arrow_left.png"),1);
  buttons[2] = new Button(50,height-66,32,32,loadImage("arrow_down.png"),2);
  buttons[3] = new Button(82,height-98,32,32,loadImage("arrow_right.png"),3);
  vel = new PVector(0.0,0.0);
  pos = new PVector(random(90), random(90));
}

void draw() {
  background(255);
  lights();
  text("Guess the Shadow", 4, 35);
  fill(255);
  //draw all buttons
  for (int i = 0; i < buttons.length; i++) {
    buttons[i].drawSelf();
  }
  translate(width/2, height/2, 50); 
  rotateX(pos.x);
  rotateZ(pos.y);
  pos.add(vel);
  fill(0);
  box(150);
}

void mousePressed() {
  /*
  if (mouseButton == LEFT) {
   vel.x = .01;
   } else if (mouseButton == RIGHT) {
   vel.y = .01;
   }
   */
  for(int i = 0; i < buttons.length; i++) {
    buttons[i].pressedP(mouseX, mouseY,vel);
  }
}

void mouseReleased() {
  vel.set(0.0,0.0,0.0);
}

