import { fabric } from 'fabric-with-gestures'
import { v4 as uuid } from 'uuid'

export const DrawPolygon = {
  data () {
    return {
      Slopes: [],
      DefaultCanvasScale: 10,
      LineEave: 'eave',
      LineRidge: 'ridge',
      LineHip: 'hip',
      LineRake: 'rake',
      LineValley: 'valley',
      DrawModePoints: [],
      LineWhileMouseMove: ''
    }
  },
  methods: {
    getFeetFromPixel (PixelValue) {
      return PixelValue / this.DefaultCanvasScale
    },
    getPixelFromFeet (FeetValue) {
      return FeetValue * this.DefaultCanvasScale
    },
    makeLine (coords, name) {
      const line = new fabric.Line(coords, {
        stroke: 'red',
        strokeWidth: 6,
        selectable: true,
        name: name,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        lockMovementX: false,
        lockMovementY: false,
        hasBorders: false,
        borderScaleFactor: 0
      })
      line.id = uuid()
      return line
    },
    getAngleLineTypes () {
      return [this.LineHip, this.LineValley, this.LineRake]
    },
    createLine (coords, name, length, type, pitch = '4/12') {
      const line = this.makeLine(coords, name)
      let textPrefix = ''

      switch (type) {
        case 'eave': line.stroke = 'black'
          line.strokeWidth = 6
          break
        case 'ridge': line.strokeWidth = 6
          break
        case 'hip':
          line.stroke = 'orange'
          textPrefix = this.getAngleChar() + ' '
          break
        case 'rake': line.stroke = 'green'
          textPrefix = this.getAngleChar() + ' '
          break
        case 'valley':
          line.stroke = 'blue'
          textPrefix = this.getAngleChar() + ' '
          break
      }
      const projectionLength = this.getFeetFromPixel(length)

      line.Roof = {
        type: type,
        length: length,
        realLength: projectionLength,
        projectionLength: projectionLength,
        pitch: pitch,
        coordinate: coords,
        objectType: 'line'
      }
      this.setLineRealLength(line)
      line.Roof.lengthLabel = this.makeLineLengthLabel(coords, line.Roof.realLength, textPrefix, projectionLength)

      // line points
      line.Roof.point1 = this.makeLinePoint(coords[0], coords[1], line, 'point1')
      line.Roof.point2 = this.makeLinePoint(coords[2], coords[3], line, 'point2')
      return line
    },
    setLineProjectionLength (line) {
      let projectionLength = line.Roof.realLength
      if (line.Roof.pitch !== undefined && line.Roof.pitch !== '0' && line.Roof.pitch !== '' && this.getAngleLineTypes().indexOf(line.Roof.type) !== -1) {
        projectionLength = line.Roof.realLength * Math.cos(this.getPitchAngleRadians(line.Roof.pitch))
      }
      line.Roof.projectionLength = projectionLength
    },
    setLineRealLength (line) {
      if (line.Roof.pitch !== undefined && line.Roof.pitch !== '0' && line.Roof.pitch !== '' && this.getAngleLineTypes().indexOf(line.Roof.type) !== -1) {
        line.Roof.realLength = line.Roof.projectionLength / Math.cos(this.getPitchAngleRadians(line.Roof.pitch))
      } else {
        line.Roof.realLength = line.Roof.projectionLength
      }
    },
    makeLinePoint (left, top, line, label) {
      const point = new fabric.Circle({
        hasControls: false,
        radius: 10,
        fill: 'yellow',
        stroke: 'yellow',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center',
        left: left,
        top: top,
        visible: false
      })
      point.id = uuid()
      point.distance = this.getDistance(0, 0, left, top)
      point.Roof = {
        objectType: 'point',
        LineId: line.id,
        label: label
      }
      return point
    },
    findPointLine (point) {
      return this.DrawCanvas.getObjects().find(item => {
        return item.Roof !== undefined && item.Roof.objectType === 'line' && item.id === point.Roof.LineId
      })
    },
    moveLinePoint (point) {
      const line = this.findPointLine(point)
      if (line !== undefined) {
        point.distance = this.getDistance(0, 0, point.left, point.top)
        this.moveToNearestPoint(point)

        if (point.Roof.label === 'point1') {
          line.Roof.coordinate[0] = point.left
          line.Roof.coordinate[1] = point.top
        } else {
          line.Roof.coordinate[2] = point.left
          line.Roof.coordinate[3] = point.top
        }
        line.set({
          x1: line.Roof.coordinate[0],
          y1: line.Roof.coordinate[1],
          x2: line.Roof.coordinate[2],
          y2: line.Roof.coordinate[3]
        })
        line.setCoords()

        this.updateLineLength(line)
        this.updateLineSlopes(line)
        this.updateConfigOverview()
      }
    },
    updateLineLength (line) {
      const length = Math.sqrt(Math.pow((line.x1 - line.x2), 2) + Math.pow((line.y1 - line.y2), 2))
      line.Roof.length = length
      line.Roof.projectionLength = this.getFeetFromPixel(length)
      this.setLineRealLength(line)

      this.updateLineText(line)
      this.updateLineTextPosition(line)
    },
    updateLinePointsPosition (line) {
      line.Roof.point1.left = line.Roof.coordinate[0]
      line.Roof.point1.top = line.Roof.coordinate[1]
      line.Roof.point2.left = line.Roof.coordinate[2]
      line.Roof.point2.top = line.Roof.coordinate[3]
    },
    moveLine (line) {
      this.moveLineToNearestPoints(line)

      this.updateLineTextPosition(line)
      this.updateLineSlopes(line)
      this.updateConfigOverview()
    },
    moveLineUpdateCoordinates (line) {
      const deltaX = line.left - line.Roof.left
      const deltaY = line.top - line.Roof.top

      line.Roof.left = line.left
      line.Roof.top = line.top
      line.Roof.coordinate[0] += deltaX
      line.Roof.coordinate[1] += deltaY
      line.Roof.coordinate[2] += deltaX
      line.Roof.coordinate[3] += deltaY
    },
    moveLineToNearestPoints (line) {
      let delta = { x: 0, y: 0 }
      const point1 = line.Roof.point1
      const point2 = line.Roof.point2

      delta = this.checkLinePointDistance(point1, delta)
      delta = this.checkLinePointDistance(point2, delta)

      // set new coordinates for point1, point2, and line
      if (delta.x > 0 || delta.y > 0) {
        // set point 1
        point1.set({ left: point1.left + delta.x, top: point1.top + delta.y })
        point1.setCoords()

        // set point 2
        point2.set({ left: point2.left + delta.x, top: point2.top + delta.y })
        point2.setCoords()

        // set line
        line.Roof.coordinate[0] = point1.left
        line.Roof.coordinate[1] = point1.top
        line.Roof.coordinate[2] = point2.left
        line.Roof.coordinate[3] = point2.top
        line.set({
          x1: line.Roof.coordinate[0],
          y1: line.Roof.coordinate[1],
          x2: line.Roof.coordinate[2],
          y2: line.Roof.coordinate[3]
        })
        line.setCoords()
        line.Roof.left = line.left
        line.Roof.top = line.top
      } else {
        this.moveLineUpdateCoordinates(line)
        this.updateLinePointsPosition(line)
      }
    },
    checkLinePointDistance (point, delta) {
      // update line points distance
      point.distance = this.getDistance(0, 0, point.left, point.top)

      // check point
      if (delta.x === 0 && delta.y === 0) {
        const NearestPoint = this.detectNearestPoint(point)
        if (NearestPoint !== undefined && NearestPoint !== '' && NearestPoint.id !== undefined) {
          delta.x = NearestPoint.left - point.left
          delta.y = NearestPoint.top - point.top
        }
      }
      return delta
    },
    changeLineLength (line, length) {
      line.Roof.realLength = length
      this.setLineProjectionLength(line)

      this.renderLineLength(line)
      // this.moveLineUpdateCoordinates(line)
      this.updateLinePointsPosition(line)
      this.updateLineText(line)
      this.updateLineTextPosition(line)
      this.updateLineSlopes(line)
    },
    updateLineSlopes (line) {
      this.Slopes.forEach((slope) => {
        const LineExistInSlope = slope.slopesFabric.find(item => item.id === line.id)
        if (LineExistInSlope !== undefined) {
          this.updateSlopePolygon(slope)
        }
      })
    },
    renderLineLength (line) {
      const points = this.getLinePoints(line.Roof.coordinate)
      const p1 = points[0]
      const p2 = points[1]
      const cosX = (p2.x - p1.x) / line.Roof.length
      const sinY = (p2.y - p1.y) / line.Roof.length

      line.Roof.length = this.getPixelFromFeet(line.Roof.projectionLength)

      const NewX = p1.x + line.Roof.length * cosX
      const NewY = p1.y + line.Roof.length * sinY
      line.Roof.coordinate = [p1.x, p1.y, NewX, NewY]
      line.set({
        x1: p1.x,
        y1: p1.y,
        x2: NewX,
        y2: NewY
      })
      line.setCoords()
    },
    changeLineType (line, type) {
      line.Roof.type = type
      let color = 'red'
      let width = 5
      switch (type) {
        case 'eave': color = 'black'
          width = 8
          break
        case 'ridge': width = 8
          break
        case 'rake': color = 'green'
          width = 5
          break
        case 'valley': color = 'blue'
          width = 5
          break
      }
      line.set('stroke', color)
      line.set('strokeWidth', width)
      this.DrawCanvas.renderAll()
    },
    degreesToRadians (degrees) {
      return degrees * (Math.PI / 180)
    },
    radiansToDegrees (radians) {
      return radians * (180 / Math.PI)
    },
    getCoordinate (x = 0, y = 0, length = 30, angle = 0) {
      const x1 = x + this.CenterX
      const y1 = y + this.CenterY
      const x2 = x1 + length * Math.cos(this.degreesToRadians(angle))
      const y2 = y1 + length * Math.sin(this.degreesToRadians(angle))

      return [x1, y1, x2, y2]
    },

    createSlopeLine (name, x = 0, y = 0, length = 30, angle = 0, type, pitch = '4/12') {
      const coordinate = this.getCoordinate(x, y, length, angle)

      return this.createLine(coordinate, name, length, type, pitch)
    },

    createSlope (slopes, name = '', SectionId = '', pitch = '4/12') {
      const id = this.Slopes.length + 1
      const SlopeName = (name === '') ? 'Slope ' + id : name
      let points = []

      slopes.forEach((slope) => {
        const line = slope.Roof.coordinate
        this.addPolygonPoint(points, line[0], line[1])
        this.addPolygonPoint(points, line[2], line[3])
      })
      points = this.sortPolygonPoints(points)
      const polygon = this.makePolygon(points, SlopeName, SectionId)
      polygon.Roof = {
        type: 'slope',
        pitch: pitch,
        objectType: 'slope'
      }
      const label = this.makePolygonText(points, SlopeName, pitch, SectionId)
      const pitchLabel = this.makePitchLabel(points, pitch)
      const area = this.getSlopeArea(slopes, polygon.points, pitch)

      this.Slopes.push({
        id: uuid(),
        SectionId: SectionId,
        name: SlopeName,
        slopesFabric: slopes,
        polygon: polygon,
        area: area,
        pitch: pitch,
        label: label,
        pitchLabel: pitchLabel
      })
    },
    updateSlopePolygon (Slope) {
      const SlopeName = Slope.name
      const pitch = Slope.pitch
      let points = []

      this.removeSlopePolygon(Slope)

      Slope.slopesFabric.forEach((slope) => {
        const line = slope.Roof.coordinate
        this.addPolygonPoint(points, line[0], line[1])
        this.addPolygonPoint(points, line[2], line[3])
      })
      points = this.sortPolygonPoints(points)

      const polygon = this.makePolygon(points, SlopeName, Slope.SectionId)
      polygon.Roof = {
        type: 'slope',
        pitch: pitch
      }

      Slope.polygon = polygon
      Slope.area = this.getSlopeArea(Slope.slopesFabric, polygon.points, Slope.pitch)
      Slope.label = this.makePolygonText(points, SlopeName, pitch, Slope.SectionId)
      Slope.pitchLabel = this.makePitchLabel(points, pitch)

      this.renderSlopePolygon(Slope)
    },
    removeSlopePolygon (slope) {
      this.DrawCanvas.remove(slope.polygon)
      this.DrawCanvas.remove(slope.label)
      this.DrawCanvas.remove(slope.pitchLabel)
    },
    renderSlopePolygon (slope) {
      this.DrawCanvas.add(slope.polygon)
      this.DrawCanvas.sendToBack(slope.polygon)
      this.DrawCanvas.add(slope.label)
      this.DrawCanvas.add(slope.pitchLabel)
    },
    sortPolygonPoints (points) {
      points.sort((a, b) => a.y - b.y)
      const cy = (points[0].y + points[points.length - 1].y) / 2
      points.sort((a, b) => b.x - a.x)
      const cx = (points[0].x + points[points.length - 1].x) / 2
      const center = { x: cx, y: cy }
      let startAng
      points.forEach(point => {
        let ang = Math.atan2(point.y - center.y, point.x - center.x)
        if (!startAng) {
          startAng = ang
        } else {
          if (ang < startAng) {
            ang += Math.PI * 2
          }
        }
        point.angle = ang
      })

      points.sort((a, b) => a.angle - b.angle)
      const ccwPoints = points.reverse()
      ccwPoints.unshift(ccwPoints.pop())

      return points
    },
    addPolygonPoint (points, x, y) {
      let canAddPoint = true
      points.forEach((point) => {
        if (this.equalCoordinate(point.x, x) && this.equalCoordinate(point.y, y)) {
          canAddPoint = false
        }
      })
      if (canAddPoint) {
        points.push({ x: x, y: y })
      }
    },
    makePolygonText (points, SlopeName, pitch, SectionId) {
      const centralPoint = this.getPolygonCenterPoint(points)
      return new fabric.Text(SlopeName, {
        fontFamily: 'Calibri',
        fontSize: 16,
        backgroundColor: 'rgba(240,235,231)',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        left: centralPoint.x,
        top: centralPoint.y,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: true,
        borderScaleFactor: 5,
        SectionId: SectionId,
        Roof: {
          objectType: 'slopeLabel',
          polygonName: SlopeName,
          polygonPitch: pitch
        }
      })
    },
    makePitchLabel (points, pitch) {
      const centralPoint = this.getPolygonCenterPoint(points)
      return new fabric.Text(pitch, {
        fontFamily: 'Calibri',
        fontSize: 16,
        fill: '#9757D7',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        left: centralPoint.x,
        top: centralPoint.y - 20,
        evented: false
      })
    },
    updateLineText (line) {
      const textPrefix = (this.getAngleLineTypes().indexOf(line.Roof.type) !== -1) ? this.getAngleChar() + ' ' : ''
      let text = textPrefix + this.getFootAndInchesFromFootFloat(line.Roof.realLength)

      if (this.getAngleLineTypes().indexOf(line.Roof.type) !== -1) {
        text += ' ' + this.getFootAndInchesFromFootFloat(line.Roof.projectionLength)
      }

      line.Roof.lengthLabel.text = text
    },
    getFootAndInchesFromFootFloat (RealLength) {
      const Foot = parseInt(RealLength)
      const Inches = Math.round(12 * (RealLength - Foot))
      const InchesString = Inches > 0 ? Inches + this.getInchesSeparator() : ''
      return Foot + this.getFootSeparator() + InchesString
    },
    getFootFloatFromFootAndInchesString (FootAndInches) {
      const m = FootAndInches.split(this.getFootSeparator())
      let foot = 1 * m[0]
      let inches = 0
      if (m[1] !== undefined) {
        inches = parseInt(1 * m[1].replace('"', ''))
        foot = foot + (inches / 12)
      }
      return foot
    },
    updateLineTextPosition (line) {
      const LabelCoordinates = this.getLineLabelCoordinates(line.Roof.coordinate)
      line.Roof.lengthLabel.left = LabelCoordinates.left
      line.Roof.lengthLabel.top = LabelCoordinates.top
      line.Roof.lengthLabel.angle = LabelCoordinates.angle
    },
    makeLineLengthLabel (Coordinates, RealLength, textPrefix = '', projectionLength = '') {
      const LabelCoordinates = this.getLineLabelCoordinates(Coordinates)
      let text = textPrefix + this.getFootAndInchesFromFootFloat(RealLength)
      const TextColor = textPrefix === '' ? 'blue' : 'black'
      let textAlign = 'center'
      if (textPrefix !== '' && projectionLength !== '') {
        text = text + ' ' + this.getFootAndInchesFromFootFloat(projectionLength)
        textAlign = 'right'
      }

      return new fabric.Textbox(text, {
        fontFamily: 'Calibri',
        fontSize: 12,
        maxFontSize: 12,
        fill: TextColor,
        width: 45,
        textAlign: textAlign,
        originX: 'center',
        originY: 'center',
        left: LabelCoordinates.left,
        top: LabelCoordinates.top,
        angle: LabelCoordinates.angle,
        evented: false,
        objectType: 'lineDimensions',
        visible: this.isShowDimensions
      })
    },
    getLineLabelCoordinates (Coordinates) {
      const centralPoint = this.getLineCenterPoint(Coordinates)
      const angle = this.getLineAngle(Coordinates)
      const angleDiff = Math.abs(Math.round(90 - Math.abs(angle)))
      const diffX = (angleDiff > 80 && angleDiff < 91) ? 0 : 20
      const diffY = (angleDiff > 80 && angleDiff < 91) ? 10 : 0

      return { left: (centralPoint.x + diffX), top: (centralPoint.y - diffY), angle: 0 }
    },
    getLineAngle (coordinates) {
      const points = this.getLinePoints(coordinates)
      const p1 = points[0]
      const p2 = points[1]
      const deltaY = (p1.y - p2.y)
      const deltaX = (p2.x - p1.x)

      return this.radiansToDegrees(Math.atan2(deltaY, deltaX))
    },
    getLinePoints (coordinates) {
      let p1 = { x: coordinates[0], y: coordinates[1] }
      let p2 = { x: coordinates[2], y: coordinates[3] }

      if (p1.x > p2.x || p1.y > p2.y) {
        p2 = { x: coordinates[0], y: coordinates[1] }
        p1 = { x: coordinates[2], y: coordinates[3] }
      }
      return [p1, p2]
    },
    getLineCenterPoint (coordinates) {
      const points = [
        { x: coordinates[0], y: coordinates[1] },
        { x: coordinates[2], y: coordinates[3] }
      ]
      return this.getPolygonCenterPoint(points)
    },
    getPolygonCenterPoint (points) {
      const centralPoint = { x: 0, y: 0 }
      let minX = 0
      let maxX = 0
      let minY = 0
      let maxY = 0

      points.forEach((point) => {
        maxX = (point.x > maxX) ? point.x : maxX
        minX = (minX === 0 || point.x < minX) ? point.x : minX
        maxY = (point.y > maxY) ? point.y : maxY
        minY = (minY === 0 || point.y < minY) ? point.y : minY
      })
      centralPoint.y = minY + ((maxY - minY) / 2)
      centralPoint.x = minX + ((maxX - minX) / 2)
      return centralPoint
    },
    equalCoordinate (value1, value2) {
      const delta = 10
      return Math.abs(value1 - value2) < delta
    },
    makePolygon (points, name = '', SectionId = '') {
      return new fabric.Polygon(points, {
        fill: 'rgba(240,235,231)',
        selectable: false,
        name: name,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        hasBorders: true,
        borderScaleFactor: 5,
        SectionId: SectionId
      }
      )
    },
    drawSlopes () {
      this.Slopes.forEach((slope) => {
        // render polygon area
        this.renderSlopePolygon(slope)

        // render lines
        slope.slopesFabric.forEach((line) => {
          if (!this.isObjectRendered(line)) {
            this.DrawCanvas.add(line)
            if (line.Roof.lengthLabel !== undefined) {
              this.DrawCanvas.add(line.Roof.lengthLabel)
            }
          }
        })
      })

      // render line points
      const Lines = []
      this.Slopes.forEach((slope) => {
        slope.slopesFabric.forEach((line) => {
          if (Lines.indexOf(line.id) === -1) {
            if (line.Roof.point1 !== undefined) {
              this.DrawCanvas.add(line.Roof.point1)
            }
            if (line.Roof.point2 !== undefined) {
              this.DrawCanvas.add(line.Roof.point2)
            }
            Lines.push(line.id)
          }
        })
      })
    },
    isObjectRendered (object) {
      const exist = this.DrawCanvas.getObjects().find(item => item.name === object.name)
      return !(exist === undefined)
    },
    getSlopesArea () {
      let Total = 0
      this.Slopes.forEach((slope) => {
        if (slope.polygon.points.length > 2) {
          Total += 1 * this.getSlopeArea(slope.slopesFabric, slope.polygon.points, slope.pitch)
        }
      })
      return Total.toFixed(0)
    },
    getSlopeArea (lines, points, pitch = '0') {
      let s = 0
      if (lines.length === 3) {
        s = this.getTriangleArea(lines)
      } else {
        s = this.getPolygonArea(points)
      }

      if (pitch !== '0') {
        s = s / Math.cos(this.getPitchAngleRadians(pitch))
      }
      return s.toFixed(2)
    },
    getPredominantPitch () {
      let PredominantPitch = ''
      let MaxCount = 0
      const Pitches = []

      this.Slopes.forEach((slope) => {
        const pitch = slope.polygon.Roof.pitch
        const exist = Pitches.find(item => item.value === pitch)
        if (exist === undefined) {
          Pitches.push({ value: pitch, count: 1 })
        } else {
          exist.count++
          if (exist.count > MaxCount) {
            PredominantPitch = pitch
            MaxCount = exist.count
          }
        }
      })
      return PredominantPitch
    },
    getTriangleArea (lines) {
      const a = lines[0].Roof.realLength
      const b = lines[1].Roof.realLength
      const c = lines[2].Roof.realLength
      const p = (a + b + c) / 2

      return Math.sqrt(p * (p - a) * (p - b) * (p - c))
    },
    getTrapezoidArea (lines, points) {
      const a = lines[0].Roof.realLength
      const b = lines[2].Roof.realLength
      const c = lines[1].Roof.realLength
      const d = lines[3].Roof.realLength

      // is Rectangle test
      /*
      if (this.isRectangle(lines)) {
        return this.getPolygonArea(lines)
      }
      const PS = this.getPolygonArea(points)
       */

      // Trapezoid
      const p = (a + b + c + d) / 2
      let S = Math.sqrt((p - a) * (p - b) * (p - a - c) * (p - a - d))
      S = ((a + b) / Math.abs(a - b)) * S

      return S
    },
    getPolygonArea (points) {
      let nextIndex = 0
      let nextPoint = {}
      let S = 0

      points.forEach((point, index) => {
        nextIndex = (index === points.length - 1) ? 0 : index + 1
        nextPoint = points[nextIndex]
        S = S + (this.getFeetFromPixel(point.x) * this.getFeetFromPixel(nextPoint.y) - this.getFeetFromPixel(point.y) * this.getFeetFromPixel(nextPoint.x))
      })
      return Math.abs(S / 2)
    },
    isRectangle (lines) {
      console.log(lines)

      return true
    },
    getRectangleArea (a, b) {
      return a * b
    },
    isParallelLines (lines) {

    },
    ZoomCanvas () {
      let zoom = this.CanvasScale / 10
      if (zoom > 2) zoom = 2
      if (zoom < 0.5) zoom = 0.5
      this.DrawCanvas.setZoom(zoom)
    },
    drawConfig (SectionId, code, ScopesNumber, DrawingToolConfig) {
      // render default
      if (DrawingToolConfig === undefined || DrawingToolConfig.lines === undefined || DrawingToolConfig.lines.length === 0) {
        this.renderDefaultRoof(SectionId, code, ScopesNumber)
        return false
      }

      // render from config
      const lines = []
      DrawingToolConfig.lines.forEach((line) => {
        lines.push({
          id: line.id,
          fablicLine: this.createLine(line.coordinate, line.name, line.length, line.type, line.pitch)
        })
      })

      let slopeLines = []
      DrawingToolConfig.slopes.forEach((slope) => {
        // detect slope lines
        slopeLines = []
        slope.lines.forEach((lineId) => {
          const lineObject = lines.find(item => item.id === lineId)
          if (lineObject !== undefined) {
            slopeLines.push(lineObject.fablicLine)
          }
        })
        // create slope
        this.createSlope(slopeLines, slope.name, slope.SectionId, slope.pitch)
      })

      // render all slopes
      this.drawSlopes()
    },
    renderDefaultRoof (SectionId, code, ScopesNumber) {
      switch (code) {
        case 'flat': this.drawFlatRoof(SectionId)
          break
        case 'barrel': this.drawBarrelRoof(SectionId)
          break
        case 'hip': this.drawHipRoof(SectionId)
          break
        case 'partial_hip': this.drawPartialHipRoof(SectionId)
          break
        case 'dutch_hip': this.drawDutchHipRoof(SectionId)
          break
        case 'gable': this.drawGableRoof(SectionId)
          break
        case 'gambrel': this.drawGambrelRoof(SectionId)
          break
        case 'mansard': this.drawMansardRoof(SectionId)
          break
        case 'turret': this.drawTurretRoof(SectionId, ScopesNumber)
          break
        default: this.drawFlatRoof(SectionId)
          break
      }
    },
    hideAllLinePoints () {
      this.DrawCanvas.getObjects().forEach((object) => {
        if (object.Roof !== undefined && object.Roof.objectType === 'point') {
          object.visible = false
        }
      })
    },
    onSelectionCleared () {
      this.hideAllLinePoints()
    },
    onSelectSlope () {
      this.hideAllLinePoints()
    },
    onSelectSlopeLabel () {
      this.hideAllLinePoints()

      this.SelectFabricObject.name = this.SelectFabricObject.Roof.polygonName
      this.SelectFabricObject.pitch = this.SelectFabricObject.Roof.polygonPitch
    },
    onSelectLine () {
      this.SelectFabricObject.Roof.top = this.SelectFabricObject.top
      this.SelectFabricObject.Roof.left = this.SelectFabricObject.left

      this.toggleLinePoints()
    },
    onSelectLinePoint () {

    },
    toggleLinePoints () {
      this.hideAllLinePoints()

      this.SelectFabricObject.Roof.point1.set({
        visible: !this.SelectFabricObject.Roof.point1.visible
      })
      this.SelectFabricObject.Roof.point2.set({
        visible: !this.SelectFabricObject.Roof.point2.visible
      })
    },
    ceilFeet (feet) {
      let foot = 0
      let inches = 0
      try {
        feet = '' + feet
        const m = feet.split('.')
        foot = 1 * m[0]
        if (m[1] !== undefined && m[1] > 0) {
          inches = parseInt(((1 * feet - foot) * 12))
        }
      } catch (e) {
        return '' + feet + this.getFootSeparator()
      }
      return inches > 0 ? '' + foot + this.getFootSeparator() + inches + this.getInchesSeparator() : '' + foot + this.getFootSeparator()
    },
    moveToNearestPoint (point) {
      const NearestPoint = this.detectNearestPoint(point)
      if (NearestPoint !== undefined && NearestPoint !== '' && NearestPoint.id !== undefined) {
        point.set({ left: NearestPoint.left, top: NearestPoint.top })
        point.setCoords()
      }
    },
    detectNearestPoint (point) {
      let NearestPoint = ''
      const deltaNearestPoints = 10
      const deltaBetweenPoints = 10
      const distanceMin = point.distance - deltaNearestPoints
      const distanceMax = point.distance + deltaNearestPoints

      // Nearest points by distance radius
      const Points = this.DrawCanvas.getObjects().filter(object => {
        if (object.Roof === undefined || object.Roof.objectType !== 'point' || object.distance === undefined || object.id === point.id) {
          return false
        }
        return (object.distance > distanceMin && object.distance < distanceMax)
      })

      // detect distance between points
      let distanceBetweenPoints = 0
      if (Points.length > 0) {
        Points.forEach((DistancePoint) => {
          distanceBetweenPoints = this.getDistance(point.left, point.top, DistancePoint.left, DistancePoint.top)
          if (distanceBetweenPoints <= deltaBetweenPoints) {
            NearestPoint = DistancePoint
            return DistancePoint
          }
        })
      }
      return NearestPoint
    },
    toggleLineDimensions () {
      const self = this
      this.DrawCanvas.getObjects().forEach((object) => {
        if (object.objectType !== undefined && object.objectType === 'lineDimensions') {
          object.visible = self.isShowDimensions
        }
      })
      this.DrawCanvas.requestRenderAll()
    },
    getDistance (x1, y1, x2, y2) {
      const xDistance = x2 - x1
      const yDistance = y2 - y1

      return parseInt(Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)))
    },
    CircleDistance () {
      const circle1 = {}
      const circle2 = {}
      if (this.getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius) {
        circle1.color = 'red'
      } else {
        circle1.color = 'black'
      }
    },
    UpdateSlopePitch (slope) {
      const self = this
      slope.slopesFabric.forEach((object) => {
        if (object.Roof.objectType !== undefined && object.Roof.objectType === 'line') {
          if ([self.LineHip, self.LineValley].indexOf(object.Roof.type) !== -1) {
            this.UpdateLineLengthByChangeSlopePitch(object, slope.pitch)
          }
        }
      })
    },
    UpdateLineLengthByChangeSlopePitch (line, pitch) {
      // update line real length
      line.Roof.realLength = line.Roof.projectionLength / Math.cos(this.getPitchAngleRadians(pitch))
      line.Roof.pitch = pitch
      this.updateLineText(line)

      // update slope area
    },
    getPitchAngleRadians (pitch) {
      return Math.atan(this.PitchToNumber(pitch))
    },
    PitchToNumber (pitch) {
      if (pitch === '0') {
        return 0
      }
      const m = pitch.split('/')
      return m[0] / m[1]
    },
    addDrawPoint (point) {
      if (this.DrawModePoints.length > 0) {
        // complete line
      }
      const CursorX = point.x + this.CanvasOffset.left
      const CursorY = point.y + this.CanvasOffset.top

      // add polygon point
      this.DrawModePoints.push({ x: CursorX, y: CursorY })
    },
    drawLineWhileMouseMove (point) {
      if (this.DrawModePoints.length === 0) {
        return false
      }

      // get last polygon point
      const LastPoint = this.DrawModePoints[this.DrawModePoints.length - 1]
      if (LastPoint !== undefined) {
        const CursorX = point.x + this.CanvasOffset.left
        const CursorY = point.y + this.CanvasOffset.top
        const coordinates = [LastPoint.x, LastPoint.y, CursorX, CursorY]

        // create line while mouse moving
        if (this.LineWhileMouseMove === '') {
          this.DrawCanvas.add(this.makeMovingLine(coordinates))
          this.LineWhileMouseMove = this.DrawCanvas.getObjects().find(item => item.id === 'MovingLine')
        } else {
          this.updateMovingLine(coordinates)
        }
      }
    },
    drawPolygon () {

    },
    makeMovingLine (coords) {
      return new fabric.Line(coords, {
        stroke: 'red',
        strokeWidth: 6,
        selectable: false,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        lockMovementX: false,
        lockMovementY: false,
        hasBorders: false,
        borderScaleFactor: 0,
        evented: false,
        id: 'MovingLine'
      })
    },
    updateMovingLine (coordinate) {
      this.LineWhileMouseMove.set({
        x1: coordinate[0],
        y1: coordinate[1],
        x2: coordinate[2],
        y2: coordinate[3]
      })
      this.LineWhileMouseMove.setCoords()
      this.DrawCanvas.requestRenderAll()
    },
    deleteMovingLine () {
      this.isDrawMode = false
      this.DrawCanvas.remove(this.LineWhileMouseMove)
      this.LineWhileMouseMove = ''
      this.DrawModePoints = []
      console.log('delete line')
    },
    getOffset (el) {
      const rect = el.getBoundingClientRect()
      return {
        left: el.scrollLeft - rect.left,
        top: el.scrollTop - rect.top
      }
    }
  }
}
