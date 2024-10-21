import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, AfterViewInit, Component, ElementRef, inject, PLATFORM_ID, signal, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-canvas2',
  standalone: true,
  imports: [],
  templateUrl: './canvas2.component.html',
  styleUrl: './canvas2.component.scss'
})
export class Canvas2Component {
  // get canvas related references
  @ViewChild('canvas2') canvasElement!:ElementRef

  protected ctx: any
  protected BB: any
  protected offsetX: any
  protected offsetY: any
  protected WIDTH: any
  protected HEIGHT: any

  // drag related variables
  protected dragok: any
  protected startX: any;
  protected startY: any;


  // an array of objects that define different rectangles
  protected rects: any[] = [
    {
      x: 75 - 15,
      y: 50 - 15,
      width: 30,
      height: 30,
      fill: "#444444",
      isDragging: false
    },
    {
      x: 75 - 25,
      y: 50 - 25,
      width: 30,
      height: 30,
      fill: "#ff550d",
      isDragging: false
    },
    {
      x: 75 - 35,
      y: 50 - 35,
      width: 30,
      height: 30,
      fill: "#800080",
      isDragging: false
    },
    {
      x: 75 - 45,
      y: 50 - 45,
      width: 30,
      height: 30,
      fill: "#0c64e8",
      isDragging: false
    }
  ];

  constructor() {
    afterNextRender(() => {
      if (this.canvasElement) {
        const canavs: HTMLCanvasElement = this.canvasElement.nativeElement;
        if (canavs) {
          // canavs.addEventListener('mousedown', this.onMouseDown.bind(this));
          // canavs.addEventListener('mousemove', this.onMouseMove.bind(this));
          // canavs.addEventListener('mouseup', this.onMouseUp.bind(this));
          // canavs.addEventListener('mouseleave', this.onMouseUp.bind(this)); // Handle case where mouse leaves the canvas
        }
      }
    })
  }


}
