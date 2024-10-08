import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, PLATFORM_ID, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-canvas2',
  standalone: true,
  imports: [],
  templateUrl: './canvas2.component.html',
  styleUrl: './canvas2.component.scss'
})
export class Canvas2Component implements AfterViewInit {
  private platformId = inject(PLATFORM_ID)

  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas2');
  private ctx = signal<CanvasRenderingContext2D | null>(null);
  private drawing = signal<boolean>(false);

  ngAfterViewInit(): void {
    const _canvas = this.canvas()?.nativeElement;
    if (isPlatformBrowser(this.platformId) && _canvas) {
      this.ctx.set(_canvas.getContext('2d'));

      // const pixelRatio = window.devicePixelRatio || 1;
      const pixelRatio = 1;

      // Adjust canvas size for high-DPI displays
      const width = _canvas.clientWidth;
      const height = _canvas.clientHeight;

      // Set canvas resolution based on the device pixel ratio
      _canvas.width = width * pixelRatio;
      _canvas.height = height * pixelRatio;

      _canvas.addEventListener('mousedown', this.startDrawing.bind(this));
      _canvas.addEventListener('mousemove', this.draw.bind(this));
      _canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
      _canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
    }
  }

  private startDrawing(event: MouseEvent): void {
    this.drawing.set(true);
    this.draw(event);
  }

  private stopDrawing(): void {
    this.drawing.set(false);
    const _ctx = this.ctx();
    _ctx && _ctx.beginPath(); // Reset the path
  }

  private draw(event: MouseEvent): void {
    const _drawing = this.drawing();
    const _ctx = this.ctx();

    if (!_drawing || !_ctx) return;

    const _canvas = this.canvas()?.nativeElement;
    if (_canvas) {
      const rect = _canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      _ctx.lineWidth = 2;
      _ctx.lineCap = 'round';
      _ctx.strokeStyle = 'black';

      _ctx.lineTo(x, y);
      _ctx.stroke();
      _ctx.beginPath();
      _ctx.moveTo(x, y);
    }
  }

  clearCanvas(): void {
    const _canvas = this.canvas()?.nativeElement;
    const _ctx = this.ctx();

    if (_canvas && _ctx) {
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
      _ctx.beginPath(); // Reset the path
    }
  }
}
