import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, OnInit, PLATFORM_ID, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-canvas1',
  standalone: true,
  imports: [],
  templateUrl: './canvas1.component.html',
  styleUrl: './canvas1.component.scss'
})
export class Canvas1Component {

  private document = inject(DOCUMENT);
  private canvasElement = viewChild<ElementRef>('canvas');
  private isDragging = signal<boolean>(false);

  private circle = { x: 95, y: 150, radius: 30 }; // Circle properties
  private offset = { x: 0, y: 0 }; // Offset for dragging

  constructor() {
    afterNextRender(() => {
      const canvasElement = this.canvasElement()
      if (canvasElement) {
        const canavs: HTMLCanvasElement = canvasElement.nativeElement;
        if (canavs) {
          this.canvasInit(canavs);

          canavs.addEventListener('mousedown', this.onMouseDown.bind(this));
          canavs.addEventListener('mousemove', this.onMouseMove.bind(this));
          canavs.addEventListener('mouseup', this.onMouseUp.bind(this));
          // canavs.addEventListener('mouseleave', this.onMouseUp.bind(this)); // Handle case where mouse leaves the canvas

        }
      }
    })
  }


  private canvasInit(canvas: HTMLCanvasElement): void {
    const gap = 15;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const _width = 400;
    const _height = height - 50;
    if (ctx) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath()
      ctx.moveTo(gap, gap)
      ctx.lineTo(gap, _height)
      ctx.lineTo(_width, _height)
      ctx.lineTo(_width, gap)
      ctx.lineTo(gap, gap)
      ctx.closePath()
      ctx.stroke();
      this.drawCircle(ctx)
    }
  }

  private drawLinesToEdges(ctx: CanvasRenderingContext2D): void {
    const canvas = ctx.canvas;

    // edges of the circle
    const leftEdge = this.circle.x - this.circle.radius;
    const rightEdge = this.circle.x + this.circle.radius;
    const topEdge = this.circle.y - this.circle.radius;
    const bottomEdge = this.circle.y + this.circle.radius;

    ctx.strokeStyle = '#00b7ff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(leftEdge, this.circle.y);
    ctx.lineTo(0, this.circle.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightEdge, this.circle.y);
    ctx.lineTo(canvas.width, this.circle.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.circle.x, topEdge);
    ctx.lineTo(this.circle.x, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.circle.x, bottomEdge);
    ctx.lineTo(this.circle.x, canvas.height);
    ctx.stroke();
  }


  private drawCircle(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas before drawing

    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
    ctx.fill();

    this.drawLinesToEdges(ctx);
  }


  onMouseDown(event: MouseEvent) {
    const { offsetX, offsetY } = event;
    // Check if the mouse is inside the circle
    const dx = offsetX - this.circle.x;
    const dy = offsetY - this.circle.y;
    if (dx * dx + dy * dy <= this.circle.radius * this.circle.radius) {
      this.isDragging.set(true);
      this.offset.x = dx;
      this.offset.y = dy;
    }
  }
  onMouseMove(event: MouseEvent) {
    if (this.isDragging()) {
      const { offsetX, offsetY } = event;
      // Update circle position
      this.circle.x = offsetX - this.offset.x;
      this.circle.y = offsetY - this.offset.y;

      const canvasElement = this.canvasElement();
      if (canvasElement) {
        const canvas: HTMLCanvasElement = canvasElement.nativeElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx && this.drawCircle(ctx);
        }
      }
    }
  }
  onMouseUp(event: MouseEvent) {
    this.isDragging.set(false);
  }
}
