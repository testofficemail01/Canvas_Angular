import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas1',
  standalone: true,
  imports: [],
  templateUrl: './canvas1.component.html',
  styleUrl: './canvas1.component.scss'
})
export class Canvas1Component implements OnInit {
  ngOnInit(): void {
    const canvas: HTMLCanvasElement = document.getElementById('canvas1') as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio || 1;
      console.log("ctx: ", ctx);

      if (ctx) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // Set the actual canvas size, accounting for pixel ratio
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        // Scale the canvas context to accommodate the pixel ratio
        ctx.scale(pixelRatio, pixelRatio);

        ctx.font = "bold 48px serif";

        /* Draw two lines crossing eatch other and a text at center */
        // 1st line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // text
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.strokeStyle
        ctx.strokeText('Study', width / 2 - 63, height / 2 + 10);

        // 2nd line
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(0, height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'blue';
        ctx.stroke();




        /** Draw a circle */
        ctx.beginPath();
        ctx.arc(300, 150, 50, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();




        /* draw a arch */
        // Tangential lines
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.moveTo(200, 20);
        ctx.lineTo(200, 130);
        ctx.lineTo(50, 20);
        ctx.stroke();

        // Arc
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(200, 20);
        ctx.arcTo(200, 130, 50, 20, 40);
        ctx.stroke();

        // Start point
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(200, 20, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Control points
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(200, 130, 5, 0, 2 * Math.PI); // Control point one
        ctx.arc(50, 20, 5, 0, 2 * Math.PI); // Control point two
        ctx.fill();
      }
    }
  }
}
