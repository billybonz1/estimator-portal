<template>
  <div ref="canvas_outer" class="canvas-scrollbar" style="height: calc(100vh - 375px); overflow: auto;">
    <div class="central-content">
      <div class="controls-menu">
        <div v-for="control in controls" :key="control.code"
             :title="control.title"
             :class="'btn ' + control.code + ' ' + ((control.code === currentControl) ? 'active' : '')"
             @click="selectControl(control.code)">
        </div>
        <div class="btn dimensions" :class="(isShowDimensions) ? 'active' : ''" title="Show dimensions">
          <button @click="toggleDimensions()">H</button>
        </div>
        <div class="btn"><button @click="ZoomIn">+</button></div>
        <div class="btn"><button @click="ZoomOut">-</button></div>
      </div>
      <div id="jsDevConsole" style="position: absolute;z-index: 100;"></div>
      <div class="element-info" v-show="SelectObject.name !== ''">
        <div class="element-info-item" v-show="SelectObject.name !== '' && SelectObject.type === 'slope'">
          <div>Name</div>
          <div>
            <input type="text" style="width: 120px" v-model="SelectObject.name" @change="UpdateName">
          </div>
        </div>
        <div class="element-info-item" v-show="SelectObject.pitch !== '' && this.componentConfig.UniqueId !== '7'  && SelectObject.type === 'slope'">
          <div>Pitch</div>
          <div>
            <Select2 :options="getPitchList()" v-model="SelectObject.pitch" :settings="{ width: '120px', minimumResultsForSearch: -1 }" @select="UpdatePitch"/>
          </div>
        </div>
        <div class="element-info-item" v-show="SelectObject.type !== '' && SelectObject.type !== 'slope'">
          <div>Type</div>
          <div>
            <Select2 :options="LineTypes" v-model="SelectObject.type" :settings="{ width: '120px', minimumResultsForSearch: -1 }" @select="UpdateType"/>
          </div>
        </div>
        <div class="element-info-item" v-show="SelectObject.length !== ''">
          <div>Length</div>
          <div>
            <input type="text" style="width: 120px"
                   v-model="SelectObject.length"
                   @change="UpdateLength"
                   v-maska="FootAndInchesMask()">
          </div>
        </div>
      </div>

      <div class="roof-info">
        <div class="roof-info-item">
          <div>Roof type</div><div>{{ componentConfig.Title }}</div>
        </div>
        <div class="roof-info-item">
          <div>Total area, sq ft</div><div>{{ componentConfig.Overview.TotalArea }}</div>
        </div>
        <div class="roof-info-item">
          <div>Total slopes</div><div>{{ componentConfig.Overview.SlopesCount }}</div>
        </div>
        <div class="roof-info-item">
          <div>Total line lengths, ft</div><div>{{ componentConfig.Overview.LinesInfo.total.total }}</div>
        </div>
        <div class="roof-info-item">
          <div class="ridges">Ridges, ft</div><div>{{ componentConfig.Overview.LinesInfo.ridge.total }}</div>
        </div>
        <div class="roof-info-item">
          <div class="hips">Hips, ft</div><div>{{ componentConfig.Overview.LinesInfo.hip.total }}</div>
        </div>
        <div class="roof-info-item">
          <div class="valleys">Valleys, ft</div><div>{{ componentConfig.Overview.LinesInfo.valley.total }}</div>
        </div>
        <div class="roof-info-item">
          <div class="rakes">Rakes, ft</div><div>{{ componentConfig.Overview.LinesInfo.rake.total }}</div>
        </div>
        <div class="roof-info-item">
          <div class="eaves">Eaves, ft</div><div>{{ componentConfig.Overview.LinesInfo.eave.total }}</div>
        </div>
      </div>
      <div id="jsFullCanvas" style="width: 2000px; height: 2000px;">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { maska } from 'maska'
import { fabric } from 'fabric-with-gestures'
import Select2 from 'vue3-select2-component'
import { DrawBaseRoofs } from '@/mixins/DrawBaseRoofs'
import { DrawPolygon } from '@/mixins/DrawPolygon'
import { DrawGrid } from '@/mixins/DrawGrid'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [DrawBaseRoofs, DrawPolygon, DrawGrid, BaseComponent],
  components: {
    Select2
  },
  directives: {
    maska
  },
  data () {
    return {
      componentConfig: {},
      DrawingToolConfig: [],
      defaultOverview: {
        TotalArea: '',
        SlopesCount: 0,
        PredominantPitch: '',
        LinesInfo: {
          total: { count: 0, total: 0 },
          ridge: { count: 0, total: 0 },
          hip: { count: 0, total: 0 },
          valley: { count: 0, total: 0 },
          eave: { count: 0, total: 0 },
          rake: { count: 0, total: 0 }
        }
      },
      currentControl: 'select',
      controls: [
        { code: 'select', title: 'Select' },
        { code: 'line', title: 'Line' },
        { code: 'hand', title: 'Hand' }
      ],
      PitchList: [
        '0', '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12', '12/12',
        '13/12', '14/12', '15/12', '16/12', '17/12', '18/12', '19/12'
      ],
      LineTypes: ['ridge', 'hip', 'valley', 'eave', 'rake'],
      SelectFabricObject: {},
      DrawCanvas: null,
      CanvasWidth: 800,
      CanvasHeight: 600,
      CenterX: 600,
      CenterY: 200,
      CanvasScale: 10,
      lastX: 0,
      lastY: 0,
      isScrollMode: false,
      isDrawMode: false,
      scrollCanvasOuter: '',
      jsDevConsole: '',
      isShowDimensions: false,
      CanvasOffset: { left: 0, top: 0 }
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')

    this.componentConfig.Sections.forEach((section) => {
      if (section.RidgeLength === undefined) {
        section.RidgeLength = '0' + this.getFootSeparator()
      }
      if (section.HipLength === undefined) {
        section.HipLength = '0' + this.getFootSeparator()
      }
    })

    if (this.componentConfig.Overview === undefined) {
      this.componentConfig.Overview = this.defaultOverview
    }
    this.DrawingToolConfig = this.$store.getters.getComponentConfig('DrawingTool')
    if (this.DrawingToolConfig === undefined) {
      this.DrawingToolConfig = []
    }
  },
  mounted () {
    this.DrawCanvas = null

    // init
    this.jsDevConsole = document.querySelector('#jsDevConsole')
    this.scrollCanvasOuter = this.$refs.canvas_outer
    window.addEventListener('resize', this.resizeEvent)
    this.resizeEvent()

    // create canvas
    this.initCanvas()
    this.renderConfig()

    // export canvas as image and load file on server
    this.emitter.all.delete('runExportCanvasPreview')
    this.emitter.on('runExportCanvasPreview', () => {
      this.ExportCanvasPreview()
    })
    this.isEnableNextButton()
  },
  unmounted () {
    window.removeEventListener('resize', this.resizeEvent)

    this.DrawCanvas.__eventListeners = {}
    this.DrawCanvas.clear()
    this.DrawCanvas = null
  },
  computed: {
    SelectObject () {
      const object = { name: '', pitch: '', type: '', length: '' }

      // if selected point - need show line info
      if (this.SelectFabricObject.Roof !== undefined && this.SelectFabricObject.Roof.objectType === 'point') {
        const line = this.findPointLine(this.SelectFabricObject)
        if (line !== undefined) {
          object.name = line.name
          object.pitch = ''
          object.type = line.Roof.type
          object.length = this.getFootAndInchesFromFootFloat(line.Roof.realLength)
          return object
        }
      }

      // if selected slope label - need show slope info
      if (this.SelectFabricObject.Roof !== undefined && this.SelectFabricObject.Roof.objectType === 'slopeLabel') {
        object.name = this.SelectFabricObject.Roof.polygonName
        object.pitch = this.SelectFabricObject.Roof.polygonPitch
        object.type = 'slope'
        return object
      }

      if (this.SelectFabricObject.name !== undefined) {
        object.name = this.SelectFabricObject.name
        object.pitch = this.SelectFabricObject.Roof.pitch !== undefined ? this.SelectFabricObject.Roof.pitch : ''
        object.type = this.SelectFabricObject.Roof.type !== undefined ? this.SelectFabricObject.Roof.type : ''
        object.length = this.SelectFabricObject.Roof.realLength !== undefined ? this.getFootAndInchesFromFootFloat(this.SelectFabricObject.Roof.realLength) : ''
      }
      return object
    }
  },
  methods: {
    getPitchList () {
      const FlatPitch = ['0', '1/12', '2/12', '3/12']

      return this.componentConfig.UniqueId === '2' ? FlatPitch : this.PitchList
    },
    isEnableNextButton () {
      this.$store.dispatch('EnableNextStepButton')
    },
    showInfo () {
      const info = document.querySelector('.sketch')
      info.classList.toggle('active')
    },
    selectControl (code) {
      this.currentControl = code

      switch (this.currentControl) {
        case 'line':
          break
        case 'select':
          break
        case 'hand':
          break
      }
    },
    ZoomIn () {
      if (this.CanvasScale < 20) {
        this.CanvasScale = this.CanvasScale + 2
        this.ZoomCanvas()
      }
    },
    ZoomOut () {
      if (this.CanvasScale > 5) {
        this.CanvasScale = this.CanvasScale - 2
        this.ZoomCanvas()
      }
    },
    enableSelection () {
      this.DrawCanvas.selection = true
    },
    disableSelection () {
      this.DrawCanvas.selection = false
    },
    initCanvas () {
      fabric.Object.prototype.transparentCorners = false
      fabric.Object.prototype.getAngleInRadians = function () {
        return this.getAngle() / 180 * Math.PI
      }

      /*
      const addListener = fabric.util.addListener
      const removeListener = fabric.util.removeListener
      const addEventOptions = { passive: false }
      fabric.util.object.extend(fabric.Canvas.prototype, {
        _onTouchStart: function (e) {
          (!this.allowTouchScrolling || this.getActiveObject()) && e.preventDefault && e.preventDefault()

          if (this.mainTouchId === null) {
            this.mainTouchId = this.getPointerId(e)
          }
          this.__onMouseDown(e)
          this._resetTransformEventData()
          const canvasElement = this.upperCanvasEl
          const eventTypePrefix = this._getEventPrefix()
          addListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions)
          addListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions)
          // Unbind mousedown to prevent double triggers from touch devices
          removeListener(canvasElement, eventTypePrefix + 'down', this._onMouseDown)
        }
      })
      */

      // create canvas
      this.DrawCanvas = new fabric.Canvas(this.$refs.canvas, {
        preserveObjectStacking: true,
        perPixelTargetFind: true,
        hoverCursor: 'pointer',
        borderScaleFactor: 5,
        backgroundColor: 'white',
        selection: false
      })
      this.DrawCanvas.__eventListeners = {}
      this.DrawCanvas.clear()

      this.initCanvasEvents()
      this.drawGridLines(this.DrawCanvas, this.CanvasWidth, this.CanvasHeight)
    },
    initCanvasEvents () {
      const self = this
      this.DrawCanvas.on('mouse:down', (event) => {
        // event.button === 1 'left click', 2 - 'middle click', 3 - 'right click'
        // Capture mouse coords for mousewheel-zoom-to-cursor
        if (event.button === 1 && ['hand', 'select'].indexOf(this.currentControl) !== -1 && !this.isScrollMode) {
          this.isScrollMode = true
        }

        // draw mode
        if (event.button === 1 && ['line'].indexOf(this.currentControl) !== -1) {
          if (!this.isDrawMode) {
            this.isDrawMode = true
          }
          this.addDrawPoint(event.e)
        }
      })

      this.DrawCanvas.on('mouse:up', (event) => {
        if (event.button === 1 && this.isScrollMode) {
          this.isScrollMode = false
        }
      })

      this.DrawCanvas.on('mouse:move:before', (event) => {
        if (event.button === 1 && this.isScrollMode) {
          self.scrollCanvasOuter.scrollLeft += event.e.movementX
          self.scrollCanvasOuter.scrollTop += event.e.movementY
        }

        if (event.button === 1 && this.isDrawMode && ['line'].indexOf(this.currentControl) !== -1) {
          this.drawLineWhileMouseMove(event.e)
        }
      })

      this.DrawCanvas.on('after:render', function () {

      })

      this.DrawCanvas.on('selection:created', function (obj) {
        self.SelectedObjects(obj.selected)
      })

      this.DrawCanvas.on('selection:updated', function (obj) {
        self.SelectedObjects(obj.selected)
      })

      this.DrawCanvas.on('selection:cleared', function (obj) {
        self.onSelectionCleared()
        setTimeout(() => {
          self.SelectFabricObject = {}
        }, 500)
      })

      this.DrawCanvas.on('object:moving', function (e) {
        if (e.target.Roof !== undefined) {
          if (e.target.Roof.objectType === 'line') {
            self.moveLine(e.target)
          }
          if (e.target.Roof.objectType === 'point') {
            self.moveLinePoint(e.target)
          }
        }
      })
      /*
      this.DrawCanvas.on('touch:gesture', function (obj) {
        self.debug('touch:gesture')
      })
      this.DrawCanvas.on('touch:drag', function (obj) {
        self.debug('touch:drag')
      })
      this.DrawCanvas.on('touch:orientation', function (obj) {
        self.debug('touch:orientation')
      })
      this.DrawCanvas.on('touch:longpress', function (obj) {
        self.debug('touch:longpress')
      })
      */
    },
    debug (message) {
      try {
        if (this.jsDevConsole.clientWidth > 1000) {
          this.jsDevConsole.innerHTML = ''
        }
        this.jsDevConsole.innerHTML += message + ' '
      } catch (e) {}
    },
    resizeEvent () {
      const PADDING = 100
      const outer = document.getElementById('jsFullCanvas')
      const canvas = document.querySelector('canvas')
      this.CanvasWidth = canvas.width = outer.clientWidth + PADDING * 2
      this.CanvasHeight = canvas.height = outer.clientHeight + PADDING * 2
      this.CenterX = parseInt((this.CanvasWidth / 2))
      this.CenterY = parseInt((this.CanvasHeight / 2))

      if (this.DrawCanvas !== undefined && this.DrawCanvas !== null) {
        this.DrawCanvas.setWidth(this.CanvasWidth)
        this.DrawCanvas.setHeight(this.CanvasHeight)
      }

      const scrollDemo = this.$refs.canvas_outer
      scrollDemo.scrollLeft = scrollDemo.clientWidth / 2
      scrollDemo.scrollTop = (this.CanvasHeight - scrollDemo.clientHeight) / 2

      this.CanvasOffset = this.getOffset(scrollDemo)
      scrollDemo.addEventListener('scroll', this.onCanvasScroll)
    },
    onCanvasScroll () {
      this.CanvasOffset = this.getOffset(this.scrollCanvasOuter)
    },
    SelectedObjects (selected) {
      if (selected.length > 0) {
        this.SelectFabricObject = selected[0]
        if (this.SelectFabricObject.Roof !== undefined && this.SelectFabricObject.Roof.objectType !== undefined) {
          switch (this.SelectFabricObject.Roof.objectType) {
            case 'slope': this.onSelectSlope()
              break
            case 'line': this.onSelectLine()
              break
            case 'point': this.onSelectLinePoint()
              break
            case 'slopeLabel': this.onSelectSlopeLabel()
              break
          }
        }
      }
    },
    renderConfig () {
      const SectionId = this.componentConfig.Sections[0].id
      const code = this.componentConfig.Sections[0].code
      const ScopesNumber = this.componentConfig.ScopesNumber

      this.drawConfig(SectionId, code, ScopesNumber, this.DrawingToolConfig)

      this.updateConfigOverview()
    },
    saveConfig () {
      const config = {
        lines: [],
        slopes: []
      }
      this.Slopes.forEach((slope) => {
        const lines = []

        slope.slopesFabric.forEach((line) => {
          if (line.Roof.type !== undefined && line.Roof.realLength !== undefined) {
            if (config.lines.find(item => item.id === line.id) === undefined) {
              config.lines.push({
                id: line.id,
                name: line.name,
                coordinate: line.Roof.coordinate,
                length: line.Roof.length,
                realLength: line.Roof.realLength,
                type: line.Roof.type,
                pitch: line.Roof.pitch
              })
            }
            lines.push(line.id)
          }
        })

        config.slopes.push({
          id: slope.id,
          SectionId: slope.SectionId,
          name: slope.name,
          pitch: slope.pitch,
          lines: lines
        })

        this.updateSlopeValues(slope.SectionId, slope.id, slope.name, slope.pitch, slope.area)
      })

      this.$store.dispatch('setComponentValue', { component: 'DrawingTool', value: config })
    },
    updateSlopeValues (SectionId, SlopeId, Name, Pitch, Area) {
      const Section = this.componentConfig.Sections.find(item => item.id === SectionId)
      if (Section !== undefined) {
        const Slope = Section.slopes.find(item => item.id === SlopeId)
        if (Slope !== undefined) {
          Slope.name = Name
          Slope.pitch = Pitch
          Slope.area = parseInt(Area)
        }
      }
    },
    UpdateName () {
      // if selected object - slope label
      if (this.SelectFabricObject.Roof !== undefined && this.SelectFabricObject.Roof.objectType === 'slopeLabel') {
        this.SelectFabricObject.Roof.polygonName = this.SelectObject.name
      }

      const slope = this.Slopes.find(item => {
        return item.SectionId === this.SelectFabricObject.SectionId && item.name === this.SelectFabricObject.name
      })
      this.SelectFabricObject.name = this.SelectObject.name
      slope.name = this.SelectObject.name
      slope.label.text = slope.name

      this.saveConfig()
    },
    UpdatePitch () {
      // if selected object - slope label
      if (this.SelectFabricObject.Roof !== undefined && this.SelectFabricObject.Roof.objectType === 'slopeLabel') {
        this.SelectFabricObject.Roof.polygonPitch = this.SelectObject.pitch
      }

      this.SelectFabricObject.Roof.pitch = this.SelectObject.pitch
      const slope = this.Slopes.find(item => {
        return item.SectionId === this.SelectFabricObject.SectionId && item.name === this.SelectFabricObject.name
      })
      slope.pitch = this.SelectObject.pitch
      slope.pitchLabel.text = slope.pitch
      this.UpdateSlopePitch(slope)

      this.DrawCanvas.renderAll()

      this.updateConfigOverview()
    },
    UpdateLength () {
      // convert foot and inches to foot as float
      const RealLength = this.getFootFloatFromFootAndInchesString(this.SelectObject.length)

      this.changeLineLength(this.SelectFabricObject, RealLength)
      this.updateConfigOverview()
    },
    UpdateType () {
      this.changeLineType(this.SelectFabricObject, this.SelectObject.type)
      this.updateConfigOverview()
    },
    updateConfigOverview () {
      this.componentConfig.Overview = this.defaultOverview

      if (this.Slopes !== undefined && this.Slopes.length > 0) {
        this.componentConfig.Overview.TotalArea = this.getSlopesArea()
        this.componentConfig.Overview.SlopesCount = this.Slopes.length
        this.componentConfig.Overview.PredominantPitch = this.getPredominantPitch()
        this.componentConfig.Overview.LinesInfo = this.getLinesInfo()
      }
      this.getSectionsInfo()
      this.saveConfig()
    },
    getSectionsInfo () {
      const Sections = []

      this.Slopes.forEach((slope) => {
        let Section = Sections.find(item => item.id === slope.SectionId)
        if (Section === undefined) {
          Sections.push({ id: slope.SectionId, ridge: 0, hip: 0, valley: 0, eave: 0, rake: 0, lines: [] })
          Section = Sections.find(item => item.id === slope.SectionId)
        }

        slope.slopesFabric.forEach((line) => {
          if (line.Roof.type !== undefined && line.Roof.realLength !== undefined) {
            if (Section.lines.indexOf(line.id) === -1) {
              Section[line.Roof.type] = Section[line.Roof.type] + line.Roof.realLength
              Section.lines.push(line.id)
            }
          }
        })
        this.linkSlopesInfo(slope)
      })

      Sections.forEach((Section) => {
        const exist = this.componentConfig.Sections.find(item => item.id === Section.id)
        if (exist !== undefined) {
          exist.RidgeLength = this.ceilFeet(Section.ridge)
          exist.HipLength = this.ceilFeet(Section.hip)
        }
      })
      return Sections
    },
    linkSlopesInfo (slope) {
      const Section = this.componentConfig.Sections.find(item => item.id === slope.SectionId)
      if (Section === undefined || Section.slopes === undefined || !Array.isArray(Section.slopes)) {
        return false
      }
      const ConfigSlope = Section.slopes.find(item => item.name === slope.name)
      if (ConfigSlope === undefined) {
        return false
      }

      if (ConfigSlope.id !== slope.id) {
        slope.id = ConfigSlope.id
      }
    },
    getLinesInfo () {
      const LinesInfo = {
        total: { count: 0, total: 0 },
        ridge: { count: 0, total: 0 },
        hip: { count: 0, total: 0 },
        valley: { count: 0, total: 0 },
        eave: { count: 0, total: 0 },
        rake: { count: 0, total: 0 }
      }

      if (this.Slopes !== undefined && this.Slopes.length > 0) {
        let lineLength = 0
        let type = ''

        this.DrawCanvas.getObjects().forEach((line) => {
          if (line.Roof !== undefined && this.LineTypes.includes(line.Roof.type)) {
            lineLength = line.Roof.realLength
            type = line.Roof.type

            LinesInfo.total.total = LinesInfo.total.total + lineLength
            LinesInfo.total.count++
            LinesInfo[type].total = LinesInfo[type].total + lineLength
            LinesInfo[type].count++
          }
        })

        // to int
        for (const [key, value] of Object.entries(LinesInfo)) {
          LinesInfo[key].total = Math.ceil(value.total)
        }
      }
      return LinesInfo
    },
    ExportCanvasPreview () {
      try {
        const self = this
        const cropData = this.getCropParams()
        const post = {
          model: 'api.ScopeIntegration',
          method: 'saveDrawSketchPreview',
          params: {
            scopeId: this.$store.getters.getCurrentScope.id,
            cropData: cropData,
            image: this.DrawCanvas.toDataURL()
          }
        }
        this.$store.dispatch('ApiCall', post)
          .then((response) => {
            self.$store.dispatch('saveScopePhoto', response)
          })
      } catch (e) {
        console.log(e)
      }
    },
    getCropParams () {
      let minX = 0
      let minY = 0
      let maxX = 0
      let maxY = 0

      this.DrawCanvas.getObjects().forEach((object) => {
        if (object.Roof !== undefined && object.Roof.objectType === 'line') {
          minX = (minX === 0 || object.Roof.coordinate[0] < minX) ? object.Roof.coordinate[0] : minX
          minX = (minX === 0 || object.Roof.coordinate[2] < minX) ? object.Roof.coordinate[2] : minX
          minY = (minY === 0 || object.Roof.coordinate[1] < minY) ? object.Roof.coordinate[1] : minY
          minY = (minY === 0 || object.Roof.coordinate[3] < minY) ? object.Roof.coordinate[3] : minY

          maxX = (object.Roof.coordinate[0] > maxX) ? object.Roof.coordinate[0] : maxX
          maxX = (object.Roof.coordinate[2] > maxX) ? object.Roof.coordinate[2] : maxX
          maxY = (object.Roof.coordinate[1] > maxY) ? object.Roof.coordinate[1] : maxY
          maxY = (object.Roof.coordinate[3] > maxY) ? object.Roof.coordinate[3] : maxY
        }
      })

      const delta = 100
      const x = (minX - delta) < 0 ? 0 : (minX - delta)
      const y = (minY - delta) < 0 ? 0 : (minY - delta)
      const width = maxX - minX + 2 * delta
      const height = y + (maxY - minY) + delta

      return {
        x: x, y: y, width: width, height: height
      }
    },
    toggleDimensions () {
      this.isShowDimensions = !this.isShowDimensions
      this.toggleLineDimensions()
    }
  }
}

</script>

<style>
.controls-menu {
  display: block;
  margin-bottom: 20px;
  position: absolute;
  z-index: 100;
  top: 230px;
  background: white;
}

.controls-menu .btn {
  width: 30px;
  height: 30px;
  margin: 10px;
  border: 1px solid white;
}

.controls-menu .btn button{
  width: 30px;
  height: 30px;
}

.controls-menu .btn:hover {
  background-color: gainsboro;
}

.controls-menu .btn.active {
  border: 1px solid #3772FF;
}

.controls-menu .line {
  background: url(../img/draw/controls/line.svg) center no-repeat;
}

.controls-menu .select {
  background: url(../img/draw/controls/select.svg) center no-repeat;
}

.controls-menu .hand {
  background: url(../img/draw/controls/cursor-hand-icon.png) center no-repeat;
}
.controls-menu .dimensions {

}
.controls-menu .dimensions.active {
  border: none;
}
.controls-menu .dimensions.active button{
  border: 1px solid #3772FF;
}

.element-info {
  position: absolute;
  z-index: 100;
  margin: 5px;
}

.roof-info {
  position: absolute;
  top: 420px;
  left: 40px;
  margin: 10px;
  z-index: 100;
  font-size: 10px;
}
.roof-info-item {
  display: flex;
  justify-content: space-between;
  width: 120px;
}

.roof-info-item .ridges{
  color: red;
  font-weight: bold;
}
.roof-info-item .hips{
  color: orange;
}
.roof-info-item .eaves{
  color: black;
}
.roof-info-item .valleys{
  color: blue;
}
.roof-info-item .rakes{
  color: green;
}
.zoom-control button{
  width: 30px;
  height: 30px;
}
</style>
