// Declaring a variable of type PImage
PImage img;
PImage bg;
int scaleWidth, scaleHeight;

void setup() {

  img = loadImage("lady3.jpg");
   bg = loadImage("curtains.jpg");
     size(bg.width, bg.height);
  scaleWidth = img.width;
  scaleHeight = img.height; 

}


void draw() {
  background(bg);
  tint(255, 127);
  blend(img, 0, 0, img.width, img.height, mouseX, mouseY, scaleWidth, scaleHeight, DARKEST);
}

void keyPressed(){
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

