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

public class sketch_nov07a extends PApplet {

// Declaring a variable of type PImage
PImage img;
PImage bg;
int scaleWidth, scaleHeight;

public void setup() {

  img = loadImage("lady3.jpg");
   bg = loadImage("curtains.jpg");
     size(bg.width, bg.height);
  scaleWidth = img.width;
  scaleHeight = img.height; 

}


public void draw() {
  background(bg);
  tint(255, 127);
  blend(img, 0, 0, img.width, img.height, mouseX, mouseY, scaleWidth, scaleHeight, DARKEST);
}

public void keyPressed(){
    if (key == CODED) {
      if(keyCode == UP) {
         scaleWidth = (int) (img.width / 5 * 4);
         scaleHeight = (int) (img.height / 5 * 4);
  } else if (keyCode == DOWN) {
       scaleWidth = (int) (img.width * 5 / 4);
       scaleHeight = (int) (img.height * 5 / 4);
}
}
}

  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#DFDFDF", "sketch_nov07a" });
  }
}
