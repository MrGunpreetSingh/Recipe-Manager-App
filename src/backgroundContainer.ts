import { SKContainer } from "../simplekit/src/imperative-mode";

export class BackgroundContainer extends SKContainer {
  private imageUrl: string;
  private imageLoaded: boolean = false;
  private backgroundImage: HTMLImageElement;

  constructor(imageUrl: string, props?: any) {
    super(props);
    this.imageUrl = imageUrl;

    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => {
      this.imageLoaded = true;
    };
    this.backgroundImage.src = this.imageUrl;
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    
    // Get canvas dimensions for full-screen background
    const canvasWidth = gc.canvas.width;
    const canvasHeight = gc.canvas.height;
    
    // Draw background image if loaded
    if (this.imageLoaded && this.backgroundImage.complete) {
      // Draw image to fill the entire canvas
      gc.drawImage(this.backgroundImage, 0, 0, canvasWidth, canvasHeight);
    } else {
      // Draw fallback color while image loads (light gray)
      gc.fillStyle = "#f5f5f5";
      gc.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    gc.restore();

    // Temporarily clear fill so parent doesn't draw it on top of the image
    const originalFill = this.fill;
    this.fill = "";
    
    // Call parent draw to handle children (this will draw children on top, but no fill)
    super.draw(gc);
    
    // Restore fill
    this.fill = originalFill;
  }
}

