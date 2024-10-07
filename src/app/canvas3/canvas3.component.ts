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
    this.drawing.set(true);
    this.draw(event);
  }

  private stopDrawing(): void {
    this.drawing.set(false);
    const ctx = this.ctx();
    ctx && ctx.beginPath(); // Reset the path
  }

  private draw(event: MouseEvent): void {
    const drawing = this.drawing();
    const ctx = this.ctx();

    if (!drawing || !ctx) return;

    const canvas = this.canvas()?.nativeElement;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  protected changeSelectedTool(toolType: toolType) {
    this.selectedTool.set(toolType);
    console.log("this.selectedTool: ", this.selectedTool());
  }

  clearCanvas(): void {
    const canvas = this.canvas()?.nativeElement;
    const ctx = this.ctx();

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath(); // Reset the path
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
}
