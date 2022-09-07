export default {
  state: {
    dictionaryRoofs: [
      {
        id: '2',
        unique_id: '2',
        SimpleSelection: true,
        CombinationSelection: true,
        code: 'flat',
        title: 'Flat/Shed',
        scopes_number: 1,
        sections: [
          { id: '8329c295dc4a5-2', name: 'Section 1', code: 'flat', slopes_number: 1, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/flat.png'),
        description: 'A flat roof is a roof which is almost level in contrast to the many types of sloped roofs. A single-sloped roof with a small pitch is also known as shed roof.'
      },
      {
        id: '9',
        unique_id: '9',
        code: 'gable',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Gable',
        scopes_number: 2,
        sections: [
          { id: '8329c295dc4a5-9', name: 'Section 1', code: 'gable', slopes_number: 2, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/gable.png'),
        description: 'Roof style consisting of two sides that slope in opposite directions down from the peak or ridge. The roof ends form an inverted V and are filled in with triangular shaped gable end walls.'
      },
      {
        id: '4',
        unique_id: '4',
        code: 'hip',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Hip',
        scopes_number: 4,
        sections: [
          { id: '8329c295dc4a5-4', name: 'Section 1', code: 'hip', slopes_number: 4, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/hip.png'),
        description: 'Hip roof, also called hipped roof, roof that slopes upward from all sides of a structure, having no vertical ends. The hip is the external angle at which adjacent sloping sides of a roof meet.'
      },
      {
        id: '5',
        unique_id: '5',
        code: 'partial_hip',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Partial Hip',
        scopes_number: 4,
        sections: [
          { id: '8329c295dc4a5-5', name: 'Section 1', code: 'partial_hip', slopes_number: 4, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/partial_hip.png'),
        description: 'A partial hip roof is also known as a jerkin head roof or clipped gable. It is a variant of a hip roof depicting a small modification at the top of the gable.'
      },
      {
        id: '8',
        unique_id: '8',
        code: 'dutch_hip',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Dutch Hip',
        scopes_number: 4,
        sections: [
          { id: '8329c295dc4a5-8', name: 'Section 1', code: 'dutch_hip', slopes_number: 4, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/dutch_hip.png'),
        description: 'Dutch hip roof style is a combination of the traditional hip and the gable roof styles.'
      },
      {
        id: '6',
        unique_id: '6',
        code: 'gambrel',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Gambrel',
        scopes_number: 4,
        sections: [
          { id: '8329c295dc4a5-6', name: 'Section 1', code: 'gambrel', slopes_number: 4, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/gambrel.png'),
        description: 'Roof style consisting of two sides that meet at the ridge and slope in opposite directions. Each side has two sections, the lower section having a steeper slope than the upper section. The gambrel roof is often used on barns.'
      },
      {
        id: '7',
        unique_id: '7',
        code: 'barrel',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Barrel',
        scopes_number: 1,
        sections: [
          { id: '8329c295dc4a5-7', name: 'Section 1', code: 'barrel', slopes_number: 1, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/barrel.png'),
        description: 'A barrel roof is a curved roof that, especially from below, is curved like a cut-away barrel.'
      },
      {
        id: '1',
        unique_id: '1',
        code: 'turret',
        SimpleSelection: true,
        CombinationSelection: true,
        title: 'Turret',
        scopes_number: 5,
        scopes_number_min: 5,
        scopes_number_max: 12,
        sections: [
          { id: '8329c295dc4a5-1', name: 'Section 1', code: 'turret', slopes_number: 5, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/turret.png'),
        description: 'A turret roof is a small tower that projects vertically from the wall of a building. A turret can have a circular top with crenelations, a pointed roof, or other kind of apex.'
      },
      {
        id: '3',
        unique_id: '3',
        code: 'mansard',
        SimpleSelection: true,
        CombinationSelection: false,
        title: 'Mansard',
        scopes_number: 5,
        sections: [
          { id: '8329c295dc4a5-3', name: 'Section 1', code: 'mansard', slopes_number: 4, slopes: [] },
          { id: '8329c295dc4a5-32', name: 'Section 2', code: 'flat', slopes_number: 1, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/mansard.png'),
        description: 'A roof which has four sloping sides, each of which becomes steeper halfway down. It is a most functional device to increase the usefulness of the attic story with better light and headroom. On top of the steeply pitched lower surface is a low hip, frequently looking flat.'
      },
      {
        id: '10',
        unique_id: '10',
        code: 'combination',
        SimpleSelection: true,
        CombinationSelection: false,
        title: 'Combination',
        scopes_number: null,
        sections: [
          { id: '8329c295dc4a5-10', name: 'Section 1', code: 'gable', slopes_number: 2, slopes: [] },
          { id: '8329c295dc4a5-11', name: 'Section 2', code: 'flat', slopes_number: 1, slopes: [] }
        ],
        preview: require('@/assets/img/roofs/combination.png'),
        description: 'A combination roof is, quite literally, a combination of types of roofs. Often incorporating two or more designs for aesthetics and practical reasons, combination roofs can feature a range of styles.'
      },
      {
        id: '11',
        unique_id: '11',
        code: 'half_hip',
        SimpleSelection: false,
        CombinationSelection: true,
        title: 'Half hip',
        scopes_number: 3,
        sections: [
          { id: '8329c295dc4a5-12', name: 'Section 1', code: 'dutch_hip', slopes_number: 3, slopes: [] }
        ]
      },
      {
        id: '12',
        unique_id: '12',
        code: 'fan',
        SimpleSelection: false,
        CombinationSelection: true,
        title: 'Fan',
        scopes_number: 3,
        scopes_number_min: 3,
        scopes_number_max: 8,
        sections: [
          { id: '8329c295dc4a5-13', name: 'Section 1', code: 'fan', slopes_number: 3, slopes: [] }
        ]
      },
      {
        id: '13',
        unique_id: '13',
        code: 'bay',
        SimpleSelection: false,
        CombinationSelection: true,
        title: 'Bay',
        scopes_number: 3,
        sections: [
          { id: '8329c295dc4a5-14', name: 'Section 1', code: 'fan', slopes_number: 3, slopes: [] }
        ]
      }
    ],
    CoveringMaterials: {
      sloped: [
        {
          code: 'laminate',
          title: 'Laminate shingle',
          img: require('@/assets/img/materials/laminate.png'),
          layers: [1, 2, 3],
          thickness: ['25y', '30y', '35y', '40y', '50y'],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            thickness: '25y',
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'three_tab_shingle',
          title: 'Three-tab shingle',
          img: require('@/assets/img/materials/shingle.png'),
          layers: [1, 2, 3],
          thickness: ['25y', '30y', '35y', '40y', '50y'],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            thickness: '25y',
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'organic',
          title: 'Organic shingle',
          img: require('@/assets/img/materials/organic.png'),
          layers: [1, 2, 3],
          thickness: ['25y', '30y', '35y', '40y', '50y'],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            thickness: '25y',
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'composite',
          title: 'Synth. composite',
          img: require('@/assets/img/materials/composite.png'),
          layers: [1, 2, 3],
          thickness: [],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'slate',
          title: 'Slate',
          img: require('@/assets/img/materials/slate.png'),
          layers: [1],
          thickness: [],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'clay',
          title: 'Clay tile',
          img: require('@/assets/img/materials/clay.png'),
          layers: [1],
          thickness: [],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'cedar',
          title: 'Cedar shakes',
          img: require('@/assets/img/materials/cedar.png'),
          layers: [1],
          thickness: [],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'steel',
          title: 'Steel panel shakes',
          img: require('@/assets/img/materials/steel.png'),
          layers: [1],
          thickness: [],
          trim: { IceAndWaterShield: false, DripEdge: false },
          defaultConfig: {
            layers: 1,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            DripEdge: false
          }
        },
        {
          code: 'metal_painted',
          title: 'Metal, painted',
          img: require('@/assets/img/materials/metal_painted.png'),
          layers: [1, 2, 3],
          thickness: ['24ga', '26ga', '29ga'],
          shape: ['Flat seam', 'Standing seam', 'Ribbed', 'Corrugated'],
          underlaymentPresent: true,
          trim: { IceAndWaterShield: false, RakeTrim: false, RakeTrimLength: false, EaveTrim: false, EaveTrimLength: false },
          defaultConfig: {
            layers: 1,
            thickness: '24ga',
            shape: 'Flat seam',
            underlaymentPresent: true,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            RakeTrim: false,
            EaveTrim: false,
            RakeTrimLength: '',
            EaveTrimLength: ''
          }
        },
        {
          code: 'metal_galvanized',
          title: 'Metal, galvanized',
          img: require('@/assets/img/materials/metal_galvanized.png'),
          layers: [1, 2, 3],
          thickness: ['24ga', '26ga', '29ga'],
          shape: ['Flat seam', 'Standing seam', 'Ribbed', 'Corrugated'],
          underlaymentPresent: true,
          trim: { IceAndWaterShield: false, RakeTrim: false, RakeTrimLength: false, EaveTrim: false, EaveTrimLength: false },
          defaultConfig: {
            layers: 1,
            thickness: '24ga',
            shape: 'Flat seam',
            underlaymentPresent: true,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            RakeTrim: false,
            EaveTrim: false,
            RakeTrimLength: '',
            EaveTrimLength: ''
          }
        },
        {
          code: 'aluminum',
          title: 'Aluminum',
          img: require('@/assets/img/materials/aluminum.png'),
          layers: [1, 2, 3],
          thickness: ['0.019”', '0.034”'],
          shape: ['Flat seam', 'Standing seam', 'Ribbed', 'Corrugated'],
          underlaymentPresent: true,
          trim: { IceAndWaterShield: false, RakeTrim: false, RakeTrimLength: false, EaveTrim: false, EaveTrimLength: false },
          defaultConfig: {
            layers: 1,
            thickness: '0.019”',
            shape: 'Flat seam',
            underlaymentPresent: true,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            RakeTrim: false,
            EaveTrim: false,
            RakeTrimLength: '',
            EaveTrimLength: ''
          }
        },
        {
          code: 'copper',
          title: 'Copper',
          img: require('@/assets/img/materials/copper.png'),
          layers: [1, 2, 3],
          thickness: ['0.21” (16 Oz Cu)'],
          shape: ['Flat seam'],
          underlaymentPresent: true,
          trim: { IceAndWaterShield: false, RakeTrim: false, RakeTrimLength: false, EaveTrim: false, EaveTrimLength: false },
          defaultConfig: {
            layers: 1,
            thickness: '0.21” (16 Oz Cu)',
            shape: 'Flat seam',
            underlaymentPresent: true,
            underlayment_code: '15lb felt',
            IceAndWaterShield: false,
            RakeTrim: false,
            EaveTrim: false,
            RakeTrimLength: '',
            EaveTrimLength: ''
          }
        }
      ],
      flat: [
        {
          code: 'built_roofing',
          title: 'Built up roofing',
          img: require('@/assets/img/materials/built_roofing.png'),
          layers: [],
          thickness: ['3-ply', '5-ply'],
          defaultConfig: {
            thickness: '3-ply',
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        },
        {
          code: 'single_ply',
          title: 'Single ply',
          img: require('@/assets/img/materials/single_ply.png'),
          layers: [],
          thickness: ['45 mil', '60mil', '45mil fleece back', '60mil fleece back'],
          defaultConfig: {
            thickness: '45 mil',
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        },
        {
          code: 'modified_bitumen',
          title: 'Modified bitumen',
          img: require('@/assets/img/materials/modified_bitumen.png'),
          layers: [],
          thickness: [],
          defaultConfig: {
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        },
        {
          code: 'rolled_roofing',
          title: 'Rolled roofing',
          img: require('@/assets/img/materials/rolled_roofing.png'),
          layers: [],
          thickness: [],
          defaultConfig: {
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        },
        {
          code: 'rubber_roof_mech',
          title: 'Rubber roof, mechanically attached',
          img: require('@/assets/img/materials/rubber_roof_mech.png'),
          layers: [],
          thickness: ['45mil', '60mil', '75mil', '90mil'],
          defaultConfig: {
            thickness: '45mil',
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        },
        {
          code: 'rubber_roof_adhered',
          title: 'Rubber roof, fully adhered',
          img: require('@/assets/img/materials/rubber_roof_adhered.png'),
          layers: [],
          thickness: ['45mil', '60mil', '75mil', '90mil'],
          defaultConfig: {
            thickness: '45mil',
            underlayment_code: 'ISO board',
            underlayment_thickness: '1”'
          }
        }
      ]
    },
    UnderlaymentMaterials: {
      flat: [
        { type: 'ISO board', thickness: ['1”', '1.5”', '2”', '2.5”', '3”', '3.5”', '4”', '4.5”', '5”', '5.5”', '6”', '6.5”', '7”', '7.5”', '8”', '8.5”', '9”', '9.5”', '10”', '10.5”', '11”', '11.5”', '12”'] },
        { type: 'Fiber board', thickness: ['0.5”', '1”'] }
      ],
      sloped: [
        { type: '15lb felt', thickness: [] },
        { type: '30lb felt', thickness: [] },
        { type: 'Synthetic felt', thickness: [] }
      ]
    },
    CorrectiveActions: [
      { code: 'F', title: 'Repair' },
      { code: '+', title: 'Replace' },
      { code: '-', title: 'Remove' },
      { code: '&', title: 'Remove & Replace' },
      { code: 'R', title: 'Detach & Reset' },
      { code: 'M', title: 'Material Only' },
      { code: 'I', title: 'Install' }
    ],
    AdditionalComponents: [
      {
        type: 'flashing',
        code: 'Chimney flashing',
        title: 'Chimney flashing',
        img: require('@/assets/img/AdditionalComponents/ChimneyFlashing.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Perimeter', unit: 'Linear inches' }
        ]
      },
      {
        type: 'flashing',
        code: 'Step flashing',
        title: 'Step flashing',
        img: require('@/assets/img/AdditionalComponents/StepFlashing.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear feet' }
        ]
      },
      {
        type: 'flashing',
        code: 'Flashing',
        title: 'Flashing',
        img: require('@/assets/img/AdditionalComponents/Flashing.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear feet' }
        ]
      },
      {
        type: 'flashing',
        code: 'Cap flashing',
        title: 'Cap flashing',
        img: require('@/assets/img/AdditionalComponents/CapFlashing.png'),
        materials: ['Aluminum', 'Copper', 'Steel'],
        AddSize: { code: 'width', values: ['12”', '20”'] },
        units: [
          { label: 'Length', unit: 'Linear feet' }
        ]
      },
      {
        type: 'flashing',
        code: 'Curb flashing',
        title: 'Curb flashing',
        img: require('@/assets/img/AdditionalComponents/CurbFlashing.png'),
        units: [
          { label: 'Length', unit: 'Linear feet' }
        ]
      },
      {
        type: 'flashing',
        code: 'Dormer step flashing',
        title: 'Dormer step flashing',
        img: require('@/assets/img/AdditionalComponents/DormerStepFlashing.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear inches' }
        ],
        RoofTypes: ['Sloped']
      },
      {
        type: 'flashing',
        code: 'Dormer flashing',
        title: 'Dormer flashing',
        img: require('@/assets/img/AdditionalComponents/DormerFlashing.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear inches' }
        ],
        RoofTypes: ['Sloped']
      },
      {
        type: 'flashing',
        code: 'Valley metal',
        title: 'Valley metal',
        img: require('@/assets/img/AdditionalComponents/ValleyMetal.png'),
        materials: ['Aluminum', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear feet' }
        ],
        RoofTypes: ['Sloped']
      },
      {
        type: 'flashing',
        code: 'Pitch transition flashing',
        title: 'Pitch transition flashing',
        img: require('@/assets/img/AdditionalComponents/PitchTransitionFlashing.png'),
        materials: ['Same as covering'],
        units: [],
        AddSize: { code: 'Size', values: ['Same gauge as covering'] },
        RoofTypes: ['Sloped', 'metal']
      },
      {
        type: 'flashing',
        code: 'End wall flashing',
        title: 'End wall flashing',
        img: require('@/assets/img/AdditionalComponents/EndWallFlashing.png'),
        materials: ['Same as covering'],
        units: [],
        AddSize: { code: 'Size', values: ['Same gauge as covering'] },
        RoofTypes: ['Sloped', 'metal']
      },
      {
        type: 'ventilation',
        code: 'Chimney cap',
        title: 'Chimney cap',
        img: require('@/assets/img/AdditionalComponents/ChimneyCap.png'),
        materials: ['Concrete', 'Sheet metal'],
        units: [
          { label: 'Length', unit: 'Linear inches' },
          { label: 'Width', unit: 'Linear inches' }
        ]
      },
      {
        type: 'ventilation',
        code: 'Turtle vent',
        title: 'Turtle vent',
        img: require('@/assets/img/AdditionalComponents/TurtleVent.png'),
        materials: ['Metal', 'Plastic'],
        units: []
      },
      {
        type: 'ventilation',
        code: 'Turbine vent',
        title: 'Turbine vent',
        img: require('@/assets/img/AdditionalComponents/TurbineVent.png'),
        units: []
      },
      {
        type: 'ventilation',
        code: 'Exhaust cap',
        title: 'Exhaust cap',
        img: require('@/assets/img/AdditionalComponents/ExhaustCap.png'),
        AddSize: { code: 'Width', values: ['4”', '6”', '8”'] },
        units: []
      },
      {
        type: 'ventilation',
        code: 'Power attic vent cover',
        title: 'Power attic vent cover',
        img: require('@/assets/img/AdditionalComponents/PowerAtticVentCover.png'),
        materials: ['Metal', 'Plastic'],
        units: []
      },
      {
        type: 'ventilation',
        code: 'High profile wind ventilator',
        title: 'High profile wind ventilator',
        img: require('@/assets/img/AdditionalComponents/HighProfileWindVentilator.png'),
        units: []
      },
      {
        type: 'ventilation',
        code: 'Furnace rain cap',
        title: 'Furnace rain cap',
        img: require('@/assets/img/AdditionalComponents/FurnaceRainCap.png'),
        AddSize: { code: 'Width', values: ['5”', '6”', '8”'] },
        units: []
      },
      {
        type: 'drainage',
        code: 'Roof drain',
        title: 'Roof drain',
        img: require('@/assets/img/AdditionalComponents/RoofDrain.png'),
        materials: ['Cast iron', 'Plastic'],
        units: []
      },
      {
        type: 'drainage',
        code: 'Snow/Ice guard',
        title: 'Snow/Ice guard',
        img: require('@/assets/img/AdditionalComponents/SnowIceGuard.png'),
        RoofTypes: ['Sloped'],
        units: []
      },
      {
        type: 'drainage',
        code: 'Rain diverter',
        title: 'Rain diverter',
        img: require('@/assets/img/AdditionalComponents/RainDiverter.png'),
        RoofTypes: ['Sloped'],
        units: []
      },
      {
        type: 'drainage',
        code: 'Scupper drain',
        title: 'Scupper drain',
        img: require('@/assets/img/AdditionalComponents/ScupperDrain.png'),
        RoofTypes: ['Flat'],
        units: []
      },
      {
        type: 'other',
        code: 'Skylight',
        title: 'Skylight',
        img: require('@/assets/img/AdditionalComponents/Skylight.png'),
        units: [
          { label: 'Length', unit: 'Linear inches' },
          { label: 'Width', unit: 'Linear inches' }
        ]
      },
      {
        type: 'other',
        code: 'Pipe jack',
        title: 'Pipe jack',
        img: require('@/assets/img/AdditionalComponents/PipeJack.png'),
        materials: ['Rubber', 'Lead', 'Split boot'],
        units: []
      },
      {
        type: 'other',
        code: 'Cupola',
        title: 'Cupola',
        img: require('@/assets/img/AdditionalComponents/Cupola.png'),
        materials: ['Wood', 'Vinyl', 'Copper'],
        units: [
          { label: 'Length', unit: 'Linear inches' },
          { label: 'Width', unit: 'Linear inches' }
        ]
      },
      {
        type: 'other',
        code: 'Satellite dish',
        title: 'Satellite dish',
        img: require('@/assets/img/AdditionalComponents/SatelliteDish.png'),
        units: []
      },
      {
        type: 'other',
        code: 'Lightning rod',
        title: 'Lightning rod',
        img: require('@/assets/img/AdditionalComponents/LightningRod.png'),
        units: []
      },
      {
        type: 'other',
        code: 'Roof heating strip',
        title: 'Roof heating strip',
        img: require('@/assets/img/AdditionalComponents/RoofHeatingStrip.png'),
        units: []
      },
      {
        type: 'other',
        code: 'Gravel ballast',
        title: 'Gravel ballast',
        img: require('@/assets/img/AdditionalComponents/GravelBallast.png'),
        RoofTypes: ['Flat'],
        AddSize: { code: 'Size', values: ['Same as flat area of roof'] },
        units: []
      },
      {
        type: 'other',
        code: 'Cant strip',
        title: 'Cant strip',
        img: require('@/assets/img/AdditionalComponents/CantStrip.png'),
        RoofTypes: ['Flat with parapet'],
        AddSize: { code: 'Size', values: ['Same as perimeter of parapet'] },
        units: []
      }
    ],
    DamageTypes: [
      { id: 3, code: 'hail', title: 'Hail' },
      { id: 6, code: 'wind', title: 'Wind' },
      { id: 4, code: 'fire', title: 'Fire' },
      { id: 7, code: 'falling_debris', title: 'Falling debris' },
      { id: 8, code: 'ice_damming', title: 'Ice damming' },
      { id: 1, code: 'water', title: 'Water' },
      { id: 2, code: 'hazard', title: 'Hazard' },
      { id: 5, code: 'mold', title: 'Mold' }
    ],
    RoofScopingScenarios: [
      {
        code: 'scenario-1',
        roofTypes: [],
        materials: []
      },
      {
        code: 'scenario-2',
        roofTypes: ['flat'],
        materials: []
      },
      {
        code: 'scenario-3',
        roofTypes: [],
        materials: [
          'metal_painted', 'metal_galvanized', 'aluminum', 'copper'
        ]
      }
    ]
  },
  getters: {
    // Simple selection
    getRoofTypes (state) {
      return state.dictionaryRoofs.filter(roof => {
        return roof.CombinationSelection === true
      })
    },
    // Combination selection
    getRoofsDictionary (state) {
      return state.dictionaryRoofs.filter(roof => {
        return roof.SimpleSelection === true
      })
    },
    findRoof: (state) => (code) => {
      return state.dictionaryRoofs.find(item => item.code === code)
    },
    getRoofItem: (state) => (id) => {
      return state.dictionaryRoofs.find(item => item.unique_id === id)
    },
    getCoveringMaterials (state) {
      return state.CoveringMaterials
    },
    getUnderlaymentMaterials (state) {
      return state.UnderlaymentMaterials
    },
    getCorrectiveActions (state) {
      return state.CorrectiveActions
    },
    getAdditionalComponents (state) {
      return state.AdditionalComponents
    },
    getDamageTypes (state) {
      return state.DamageTypes
    },
    getRoofScopingScenarios (state) {
      return state.RoofScopingScenarios
    }
  },
  mutations: {
    updateRoofsDictionary (state, list) {
      state.dictionaryRoofs = list
    },
    setActiveRoofItem (state, id) {
      state.dictionaryRoofs.forEach((item) => {
        item.active = item.unique_id === id
        item.is_disabled = !(item.unique_id === id)
      })
    },
    resetRoofDictionary (state) {
      state.dictionaryRoofs.forEach((item) => {
        item.active = false
        item.is_disabled = false
      })
    }
  },
  actions: {
    setActiveRoofItem (context, id) {
      context.commit('setActiveRoofItem', id)
    },
    resetRoofDictionary (context) {
      context.commit('resetRoofDictionary')
    },
    async fetchRoofsDictionary (context) {
      /* const post = {
        model: 'api.DictionariesIntegration',
        method: 'getRoofsDictionary',
        params: {}
      }

      this.dispatch('ApiCall', post).then((response) => {
        context.commit('updateRoofsDictionary', response)
      }) */
    }
  }
}
