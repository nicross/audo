content.prop.opponent.base = engine.prop.base.invent({
  name: 'opponent/base',
  onConstruct: function () {
    this.buildAeroSynth()
  },
  onUpdate: function () {
    this.updateAeroSynth()
  },
  buildAeroSynth: function () {
    this.aeroSynth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.pink(),
    }).filtered().connect(this.output.input)

    this.aeroSynth.param.gain.value = engine.utility.fromDb(-3)
    this.aeroSynth.filter.frequency.value = 250
  },
  updateAeroSynth: function () {
    const strength = Math.min(1, Math.abs(this.velocity) / 10)
    this.aeroSynth.filter.frequency.value = engine.utility.lerp(250, 1000, strength)
  },
})
