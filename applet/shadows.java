import processing.core.*; 
import processing.xml.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class shadows extends PApplet {

PVector pos, vel;
Button left;
Button[] buttons = new Button[4];

public void setup() {
  textFont(loadFont("FreeSansBold-30.vlw")); 
  size(640, 380, P3D);
  noStroke();
  stroke(0);
  buttons[0] = new Button(50, height-130, 32,32,loadImage("arrow_up.png"),0);
  buttons[1] = new Button(18,height-98,32,32,loadImage("arrow_left.png"),1);
  buttons[2] = new Button(50,height-66,32,32,loadImage("arrow_down.png"),2);
  buttons[3] = new Button(82,height-98,32,32,loadImage("arrow_right.png"),3);
  vel = new PVector(0.0f,0.0f);
  pos = new PVector(random(90), random(90));
}

public void draw() {
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

public void mousePressed() {
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

public void mouseReleased() {
  vel.set(0.0f,0.0f,0.0f);
}

class Button{
  public int x, y, w, h, dir;
  float rot;
  public PImage pic;
  public Button(int x, int y, int w, int h,PImage pic, int dir){
    //directions will be starting from 0 and proceeding right in pi/2 increments
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pic = pic;
    pic.resize(w,h);
    this.dir = dir;
  }
  
  public void drawSelf(){
    image(this.pic,this.x,this.y);
  }
  
  public void pressedP(int mX, int mY, PVector vel){
    if (mX > x && mX < x + w && mY > y && mY < y + h){
      switch(dir){
        case 0: vel.add(0.1f,0.0f,0.0f);break;
        case 1: vel.add(0.0f,-0.1f,0.0f);break;
        case 2: vel.add(-0.1f,0.0f,0.0f);break;
        case 3: vel.add(0.0f,0.1f,0.0f);break;
        default: vel.add(0.0f,0.0f,0.0f);
      }
    }
  }
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#DFDFDF", "shadows" });
  }
}
