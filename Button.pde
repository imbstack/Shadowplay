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
        case 0: vel.add(0.1,0.0,0.0);break;
        case 1: vel.add(0.0,-0.1,0.0);break;
        case 2: vel.add(-0.1,0.0,0.0);break;
        case 3: vel.add(0.0,0.1,0.0);break;
        default: vel.add(0.0,0.0,0.0);
      }
    }
  }
}
