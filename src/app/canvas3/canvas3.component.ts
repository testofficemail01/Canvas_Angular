import { isPlatformBrowser, NgClass } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, PLATFORM_ID, signal, untracked, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from 'ngx-color-picker';

type toolType = 'free-hand' | 'circle' | 'rectangle' | 'straight_line' | 'curve_line';
@Component({
  selector: 'app-canvas3',
  standalone: true,
  imports: [MatIconModule, ColorPickerModule, NgClass],
  templateUrl: './canvas3.component.html',
  styleUrl: './canvas3.component.scss'
})

export class Canvas3Component implements AfterViewInit {
  private platformId = inject(PLATFORM_ID)

  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas3');
  private ctx = signal<CanvasRenderingContext2D | null>(null);
  private drawing = signal<boolean>(false);

  private startX = 0;
  private startY = 0;
  // Variables for freehand drawing
  private lastX = 0;
  private lastY = 0;

  protected selectedTool = signal<toolType>('free-hand');
  protected selectedColor = signal<string>('#000000');

  constructor() {
    effect(() => {
      const _selectedColor = this.selectedColor();
      untracked(() => {
        const ctx = this.ctx();
        if (ctx) {
          ctx!.strokeStyle = this.selectedColor();
          ctx!.fillStyle = this.selectedColor();
        }
      })
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas()?.nativeElement;
    if (isPlatformBrowser(this.platformId) && canvas) {
      this.ctx.set(canvas.getContext('2d'));

      // const pixelRatio = window.devicePixelRatio || 1;
      const pixelRatio = 1;

      // Adjust canvas size for high-DPI displays
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Set canvas resolution based on the device pixel ratio
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      const ctx = this.ctx();
      if (ctx) {
        ctx!.strokeStyle = this.selectedColor();
        ctx!.fillStyle = this.selectedColor();
        ctx!.lineWidth = 2; // Default line width
        ctx!.lineCap = 'round'; // Smooth lines
      }


      canvas.addEventListener('mousedown', this.startDrawing.bind(this));
      canvas.addEventListener('mousemove', this.draw.bind(this));
      canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
      canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
    }
  }

  private startDrawing(event: MouseEvent): void {
    const ctx = this.ctx();
    const canvas = this.canvas()?.nativeElement;

    if (!ctx || !canvas) return;
    this.drawing.set(true);
    const rect = canvas.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;

    if (this.selectedTool() === 'free-hand') {
      this.lastX = this.startX;
      this.lastY = this.startY;
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
    }
  }

  private stopDrawing(): void {
    const drawing = this.drawing();
    const ctx = this.ctx();

    if (!drawing || !ctx) return;

    this.drawing.set(false);

    if (this.selectedTool() === 'free-hand') {
      ctx.closePath();
    }
  }

  private draw(event: MouseEvent): void {
    const drawing = this.drawing();
    const ctx = this.ctx();
    const selectedTool = this.selectedTool();
    const currentColor = this.selectedColor();

    if (!drawing || !ctx) return;

    const canvas = this.canvas()?.nativeElement;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;



      if (selectedTool === 'free-hand') {
        // Freehand drawing: draw line segments following the mouse
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
        this.lastX = x;
        this.lastY = y;
      } else {
        // For shapes like rectangle and circle, implement dynamic previews
        this.clearCanvas(true); // Clear for dynamic preview
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;

        if (selectedTool === 'rectangle') {
          const width = x - this.startX;
          const height = y - this.startY;
          ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (selectedTool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
          );
          ctx.beginPath();
          ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  }

  protected changeSelectedTool(toolType: toolType) {
    this.selectedTool.set(toolType);
    console.log("this.selectedTool: ", this.selectedTool());
  }

  // clearCanvas(): void {
  //   const canvas = this.canvas()?.nativeElement;
  //   const ctx = this.ctx();

  //   if (canvas && ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.beginPath(); // Reset the path
  //   }
  // }

  clearCanvas(clearAll: boolean = true): void {
    const canvas = this.canvas()?.nativeElement;
    const ctx = this.ctx();
    
    if (!canvas || !ctx) return;

    if (clearAll) {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  exportCanvasAsImage(): void {
    const canvas = this.canvas();
    if (!canvas || !this.ctx()) return;
    const dataURL = canvas.nativeElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas-drawing.png';
    link.click();
  }
























  /*
  
    private undoStack: string[] = [];
    private redoStack: string[] = [];

    saveState(): void {
      this.undoStack.push(this.canvas.nativeElement.toDataURL());
      // Clear redo stack when a new action is performed
      this.redoStack = [];
    }

    undo(): void {
      if (this.undoStack.length > 0) {
        const lastState = this.undoStack.pop();
        if (lastState) {
          this.redoStack.push(this.canvas.nativeElement.toDataURL());
          this.restoreState(lastState);
        }
      }
    }

    redo(): void {
      if (this.redoStack.length > 0) {
        const state = this.redoStack.pop();
        if (state) {
          this.undoStack.push(this.canvas.nativeElement.toDataURL());
          this.restoreState(state);
        }
      }
    }

    restoreState(state: string): void {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        this.clearCanvas();
        this.ctx!.drawImage(img, 0, 0);
      };
    }





    //-------------------
    startDrawing(event: MouseEvent): void {
  if (!this.ctx) return;
  this.saveState(); // Save state before new action
  // Existing code...
}

  */
}
