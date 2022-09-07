import { fabric } from 'fabric-with-gestures'

export const DrawGrid = {
  methods: {
    renderGridLines (width, height) {
      const grid = 20
      const canvas = document.getElementById('background-layer')
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'

        for (let i = 1; i < (width / grid); i++) {
          this.drawLine(ctx, i * grid, 0, i * grid, height)
          this.drawLine(ctx, 0, i * grid, width, i * grid)
        }
      }
    },
    drawLine (ctx, x1, y1, x2, y2) {
      if (x1 === x2) {
        x1 = x1 + 0.5
        x2 = x2 + 0.5
      }
      if (y1 === y2) {
        y1 = y1 + 0.5
        y2 = y2 + 0.5
      }

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.closePath()
    },
    drawGridLines (canvas, width, height) {
      const grid = 20
      for (let i = 1; i < (width / grid); i++) {
        canvas.add(
          new fabric.Line(
            [i * grid, 0, i * grid, height],
            { type: 'line', stroke: 'rgba(0, 0, 0, 0.05)', selectable: false, hasControls: false, evented: false }
          )
        )
        canvas.add(
          new fabric.Line(
            [0, i * grid, width, i * grid],
            { type: 'line', stroke: 'rgba(0, 0, 0, 0.05)', selectable: false, hasControls: false, evented: false }
          )
        )
      }

      // this.drawAxes(canvas, width, height)
    },
    drawAxes (canvas, width, height) {
      // axeX
      canvas.add(
        new fabric.Line(
          [0, height / 2, width, height / 2],
          { type: 'line', stroke: 'rgba(0, 0, 0, 0.5)', selectable: false, hasControls: false, evented: false }
        )
      )
      // axeY
      canvas.add(
        new fabric.Line(
          [width / 2, 0, width / 2, height],
          { type: 'line', stroke: 'rgba(0, 0, 0, 0.5)', selectable: false, hasControls: false, evented: false }
        )
      )
    }
  }
}
