export const DrawBaseRoofs = {
  data () {
    return {

    }
  },
  methods: {
    drawHipRoof (SectionId) {
      const HipLength = 210
      const RidgeLength = 300
      const Eave1Length = 600
      const Eave2Length = 300

      const Ridge1 = this.createSlopeLine('Ridge 1', -150, 0, RidgeLength, 0, this.LineRidge)
      const Hip1 = this.createSlopeLine('Hip 1', -300, -150, HipLength, 45, this.LineHip)
      const Hip2 = this.createSlopeLine('Hip 2', 150, 0, HipLength, -45, this.LineHip)
      const Hip3 = this.createSlopeLine('Hip 3', -150, 0, HipLength, 135, this.LineHip)
      const Hip4 = this.createSlopeLine('Hip 4', 150, 0, HipLength, 45, this.LineHip)
      const Eave1 = this.createSlopeLine('Eave 1', -300, -150, Eave1Length, 0, this.LineEave)
      const Eave2 = this.createSlopeLine('Eave 2', -300, -150, Eave2Length, 90, this.LineEave)
      const Eave3 = this.createSlopeLine('Eave 3', -300, 150, Eave1Length, 0, this.LineEave)
      const Eave4 = this.createSlopeLine('Eave 4', 300, -150, Eave2Length, 90, this.LineEave)

      this.createSlope([Eave1, Hip2, Ridge1, Hip1], '', SectionId)
      this.createSlope([Eave3, Hip4, Ridge1, Hip3], '', SectionId)
      this.createSlope([Eave2, Hip1, Hip3], '', SectionId)
      this.createSlope([Eave4, Hip2, Hip4], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },
    drawFlatRoof (SectionId) {
      const Eave1Length = 600
      const Eave2Length = 300
      const PositionX = -300
      const PositionY = -150

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Eave1Length, 0, this.LineEave, '1/12')
      const Eave2 = this.createSlopeLine('Eave 2', PositionX, PositionY, Eave2Length, 90, this.LineEave, '1/12')
      const Eave3 = this.createSlopeLine('Eave 3', PositionX, PositionY + Eave2Length, Eave1Length, 0, this.LineEave, '1/12')
      const Eave4 = this.createSlopeLine('Eave 4', PositionX + Eave1Length, PositionY, Eave2Length, 90, this.LineEave, '1/12')

      this.createSlope([Eave1, Eave4, Eave3, Eave2], '', SectionId, '1/12')

      // render all slopes
      this.drawSlopes()
    },
    drawBarrelRoof (SectionId) {
      const Eave1Length = 600
      const Eave2Length = 300
      const PositionX = -300
      const PositionY = -150

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Eave1Length, 0, this.LineEave, '')
      const Eave2 = this.createSlopeLine('Eave 2', PositionX, PositionY, Eave2Length, 90, this.LineEave, '')
      const Eave3 = this.createSlopeLine('Eave 3', PositionX, PositionY + Eave2Length, Eave1Length, 0, this.LineEave, '')
      const Eave4 = this.createSlopeLine('Eave 4', PositionX + Eave1Length, PositionY, Eave2Length, 90, this.LineEave, '')

      this.createSlope([Eave1, Eave4, Eave3, Eave2], '', SectionId, '')

      // render all slopes
      this.drawSlopes()
    },
    drawGableRoof (SectionId) {
      const Eave1Length = 600
      const Eave2Length = 300
      const PositionX = -300
      const PositionY = -150

      const Ridge1 = this.createSlopeLine('Ridge 1', PositionX, 0, Eave1Length, 0, this.LineRidge)
      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Eave1Length, 0, this.LineEave)
      const Eave2 = this.createSlopeLine('Rake 2', PositionX, PositionY, Eave2Length / 2, 90, this.LineRake)
      const Eave5 = this.createSlopeLine('Rake 5', PositionX, 0, Eave2Length / 2, 90, this.LineRake)
      const Eave3 = this.createSlopeLine('Eave 3', PositionX, PositionY + Eave2Length, Eave1Length, 0, this.LineEave)
      const Eave4 = this.createSlopeLine('Rake 4', PositionX + Eave1Length, PositionY, Eave2Length / 2, 90, this.LineRake)
      const Eave6 = this.createSlopeLine('Rake 6', PositionX + Eave1Length, PositionY + (Eave2Length / 2), Eave2Length / 2, 90, this.LineRake)

      this.createSlope([Eave1, Eave4, Ridge1, Eave2], '', SectionId)
      this.createSlope([Eave5, Eave3, Eave6, Ridge1], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },
    drawGambrelRoof (SectionId) {
      const Width = 600
      const Height = 300
      const PositionX = -300
      const PositionY = -150
      const EavePart = (Height / 4)

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Width, 0, this.LineEave)
      const Eave2 = this.createSlopeLine('Rake 1', PositionX + Width, PositionY, EavePart, 90, this.LineRake)
      const Ridge1 = this.createSlopeLine('Ridge 1', PositionX, -EavePart, Width, 0, this.LineRidge)
      const Eave7 = this.createSlopeLine('Rake 2', PositionX, PositionY, EavePart, 90, this.LineRake)

      const Ridge2 = this.createSlopeLine('Ridge 2', PositionX, 0, Width, 0, this.LineRidge)
      const Eave8 = this.createSlopeLine('Rake 3', PositionX + Width, PositionY + EavePart, EavePart, 90, this.LineRake)
      const Eave9 = this.createSlopeLine('Rake 4', PositionX, PositionY + EavePart, EavePart, 90, this.LineRake)

      const Ridge3 = this.createSlopeLine('Ridge 3', PositionX, EavePart, Width, 0, this.LineRidge)
      const Eave5 = this.createSlopeLine('Rake 5', PositionX + Width, PositionY + 2 * EavePart, EavePart, 90, this.LineRake)
      const Eave6 = this.createSlopeLine('Rake 6', PositionX, PositionY + 2 * EavePart, EavePart, 90, this.LineRake)

      const Eave3 = this.createSlopeLine('Rake 7', PositionX + Width, PositionY + 3 * EavePart, EavePart, 90, this.LineRake)
      const Eave4 = this.createSlopeLine('Rake 8', PositionX, PositionY + 3 * EavePart, EavePart, 90, this.LineRake)
      const Eave10 = this.createSlopeLine('Eave 2', PositionX, PositionY + Height, Width, 0, this.LineEave)

      this.createSlope([Eave1, Eave2, Ridge1, Eave7], '', SectionId)
      this.createSlope([Ridge1, Eave8, Ridge2, Eave9], '', SectionId)
      this.createSlope([Ridge2, Eave5, Ridge3, Eave6], '', SectionId)
      this.createSlope([Ridge3, Eave3, Eave10, Eave4], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },
    drawMansardRoof (SectionId) {
      const Width = 600
      const Height = 300
      /*
      const Diff = 60
      const HipLenght = Math.sqrt(Math.pow(Diff, 2) + Math.pow(Diff, 2))
      */
      const HipLenght = 85
      const Diff = Math.sqrt((Math.pow(HipLenght, 2) / 2))
      const PositionX = -300
      const PositionY = -150

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Width, 0, this.LineEave)
      const Ridge1 = this.createSlopeLine('Ridge 1', PositionX + Diff, PositionY + Diff, Width - (2 * Diff), 0, this.LineRidge)
      const Hip1 = this.createSlopeLine('Hip 1', PositionX + Width, PositionY, HipLenght, 135, this.LineHip)
      const Hip2 = this.createSlopeLine('Hip 2', PositionX, PositionY, HipLenght, 45, this.LineHip)

      const Eave2 = this.createSlopeLine('Eave 2', PositionX + Width, PositionY, Height, 90, this.LineEave)
      const Hip3 = this.createSlopeLine('Hip 3', PositionX + Width, PositionY + Height, HipLenght, -135, this.LineHip)
      const Ridge2 = this.createSlopeLine('Ridge 2', PositionX + Width - Diff, PositionY + Diff, Height - (2 * Diff), 90, this.LineRidge)

      const Eave3 = this.createSlopeLine('Eave 3', PositionX, PositionY + Height, Width, 0, this.LineEave)
      const Hip4 = this.createSlopeLine('Hip 4', PositionX, PositionY + Height, HipLenght, -45, this.LineHip)
      const Ridge3 = this.createSlopeLine('Ridge 3', PositionX + Diff, PositionY + Height - Diff, Width - 2 * Diff, 0, this.LineRidge)

      const Eave4 = this.createSlopeLine('Eave 4', PositionX, PositionY, Height, 90, this.LineEave)
      const Ridge4 = this.createSlopeLine('Ridge 4', PositionX + Diff, PositionY + Diff, Height - 2 * Diff, 90, this.LineRidge)

      this.createSlope([Eave1, Hip1, Ridge1, Hip2], '', SectionId)
      this.createSlope([Eave2, Hip3, Ridge2, Hip1], '', SectionId)
      this.createSlope([Hip4, Ridge3, Hip3, Eave3], '', SectionId)
      this.createSlope([Hip2, Ridge4, Hip4, Eave4], '', SectionId)
      this.createSlope([Ridge1, Ridge2, Ridge3, Ridge4], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },
    drawPartialHipRoof (SectionId) {
      const Width = 600
      const Height = 300
      const HipLength = 100
      const HipKatetLength = Math.sqrt((Math.pow(HipLength, 2) / 2))
      const RidgeLength = Width - 2 * HipKatetLength
      const PositionX = -300
      const PositionY = -150
      const Eave2Length = (Height / 2) - HipKatetLength

      const Ridge1 = this.createSlopeLine('Ridge 1', PositionX + HipKatetLength, 0, RidgeLength, 0, this.LineRidge)

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Width, 0, this.LineEave)

      const Eave2 = this.createSlopeLine('Rake 1', PositionX, PositionY, Eave2Length, 90, this.LineRake)
      const Eave21 = this.createSlopeLine('Eave 1.1', PositionX, PositionY + Eave2Length, Height - 2 * Eave2Length, 90, this.LineEave)
      const Eave22 = this.createSlopeLine('Rake 2', PositionX, PositionY + Height, Eave2Length, -90, this.LineRake)

      const Eave4 = this.createSlopeLine('Rake 3', PositionX + Width, PositionY, Eave2Length, 90, this.LineRake)
      const Eave41 = this.createSlopeLine('Eave 2.1', PositionX + Width, PositionY + Eave2Length, Height - 2 * Eave2Length, 90, this.LineEave)
      const Eave42 = this.createSlopeLine('Rake 4', PositionX + Width, PositionY + Height, Eave2Length, -90, this.LineRake)

      const Eave3 = this.createSlopeLine('Eave 2', PositionX, PositionY + Height, Width, 0, this.LineEave)

      const Hip1 = this.createSlopeLine('Hip 1', PositionX + HipKatetLength, 0, HipLength, -135, this.LineHip)
      const Hip2 = this.createSlopeLine('Hip 2', PositionX + HipKatetLength + RidgeLength, 0, HipLength, -45, this.LineHip)
      const Hip3 = this.createSlopeLine('Hip 3', PositionX + HipKatetLength, 0, HipLength, 135, this.LineHip)
      const Hip4 = this.createSlopeLine('Hip 4', PositionX + HipKatetLength + RidgeLength, 0, HipLength, 45, this.LineHip)

      this.createSlope([Eave1, Eave4, Hip2, Ridge1, Hip1, Eave2], '', SectionId)
      this.createSlope([Ridge1, Hip4, Eave42, Eave3, Eave22, Hip3], '', SectionId)
      this.createSlope([Hip1, Hip3, Eave21], '', SectionId)
      this.createSlope([Hip2, Eave41, Hip4], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },

    drawDutchHipRoof (SectionId) {
      const Width = 600
      const Height = 300
      const HipLength = 100
      const RakeLength = 80
      const HipKatetLength = Math.sqrt((Math.pow(HipLength, 2) / 2))
      const RidgeLength = Width - 2 * HipKatetLength
      const PositionX = -300
      const PositionY = -150

      const Ridge1 = this.createSlopeLine('Ridge 1', PositionX + HipKatetLength, 0, RidgeLength, 0, this.LineRidge)
      const Rake1 = this.createSlopeLine('Rake 1', PositionX + HipKatetLength + 5, PositionY + HipKatetLength, RakeLength, 90, this.LineRake)
      const Rake2 = this.createSlopeLine('Rake 2', PositionX + HipKatetLength + 5, PositionY + HipKatetLength + RakeLength, RakeLength, 90, this.LineRake)
      const Rake3 = this.createSlopeLine('Rake 3', PositionX + HipKatetLength + RidgeLength - 5,
        PositionY + HipKatetLength, RakeLength, 90, this.LineRake)
      const Rake4 = this.createSlopeLine('Rake 4',
        PositionX + HipKatetLength + RidgeLength - 5,
        PositionY + HipKatetLength + RakeLength, RakeLength, 90, this.LineRake)

      const Eave1 = this.createSlopeLine('Eave 1', PositionX, PositionY, Width, 0, this.LineEave)
      const Eave2 = this.createSlopeLine('Eave 2', PositionX, PositionY, Height, 90, this.LineEave)
      const Eave4 = this.createSlopeLine('Eave 4', PositionX + Width, PositionY, Height, 90, this.LineEave)
      const Eave3 = this.createSlopeLine('Eave 3', PositionX, PositionY + Height, Width, 0, this.LineEave)

      const Hip1 = this.createSlopeLine('Hip 1', PositionX, PositionY, HipLength + 5, 45, this.LineHip)
      const Hip2 = this.createSlopeLine('Hip 2', PositionX + Width, PositionY, HipLength + 5, 135, this.LineHip)
      const Hip3 = this.createSlopeLine('Hip 3', PositionX, PositionY + Height, HipLength + 5, -45, this.LineHip)
      const Hip4 = this.createSlopeLine('Hip 4', PositionX + Width, PositionY + Height, HipLength + 5, -135, this.LineHip)
      const Valey1 = this.createSlopeLine('Valey 1', PositionX + HipKatetLength,
        PositionY + HipKatetLength, 160, 90, this.LineValley)
      const Valey2 = this.createSlopeLine('Valey 2', PositionX + Width - HipKatetLength,
        PositionY + HipKatetLength, 160, 90, this.LineValley)

      this.createSlope([Eave1, Hip2, Rake3, Ridge1, Rake1, Hip1], '', SectionId)
      this.createSlope([Hip3, Rake2, Ridge1, Rake4, Hip4, Eave3], '', SectionId)
      this.createSlope([Hip1, Valey1, Hip3, Eave2], '', SectionId)
      this.createSlope([Eave4, Hip4, Valey2, Hip2], '', SectionId)

      // render all slopes
      this.drawSlopes()
    },
    drawTurretRoof (SectionId, SlopesNumber) {
      const SlopeAngle = 360 / SlopesNumber
      const RidgeLength = 260
      const [PositionX, PositionY] = [0, 0]
      // c 2 = a 2 + b 2 – 2ab · cos C
      const EaveLength = Math.sqrt(2 * Math.pow(RidgeLength, 2) - 2 * RidgeLength * RidgeLength * Math.cos(this.degreesToRadians(SlopeAngle)))
      let BasicAngle = 0

      for (let i = 1; i <= SlopesNumber; i++) {
        const Ridge1 = this.createSlopeLine('Hip ' + i, PositionX, PositionY, RidgeLength, BasicAngle, this.LineHip)
        const Ridge2 = this.createSlopeLine('Hip ' + i + 1, PositionX, PositionY, RidgeLength, BasicAngle + SlopeAngle, this.LineHip)
        const Eave1Coordinate = [
          Ridge1.Roof.coordinate[2], Ridge1.Roof.coordinate[3],
          Ridge2.Roof.coordinate[2], Ridge2.Roof.coordinate[3]
        ]
        const Eave1 = this.createLine(Eave1Coordinate, 'Eave ' + i, EaveLength, this.LineEave)

        this.createSlope([Ridge1, Eave1, Ridge2], '', SectionId)

        BasicAngle = BasicAngle + SlopeAngle
      }

      // render all slopes
      this.drawSlopes()
    }
  }
}
