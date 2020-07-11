content.prop.opponent.base = engine.prop.base.invent({
  name: 'opponent/base',
  onConstruct: function ({
    index,
  }) {
    this.index = index

    this.buildAeroSynth()
    this.buildToneSynth()
  },
  onUpdate: function () {
    const velocityRatio = Math.min(1, Math.abs(this.velocity) / 10)

    this.updateAeroSynth(velocityRatio)
    this.updateToneSynth(velocityRatio)
  },
  buildAeroSynth: function () {
    this.aeroSynth = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.pink(),
    }).filtered().connect(this.output.input)

    this.aeroSynth.param.gain.value = engine.utility.fromDb(-3)
    this.aeroSynth.filter.frequency.value = 250
  },
  updateAeroSynth: function (velocityRatio) {
    this.aeroSynth.filter.frequency.value = engine.utility.lerp(250, 1000, velocityRatio)
  },
  buildToneSynth: function () {
    const note = 36 + this.index

    this.toneSynth = engine.audio.synth.createSimple({
      frequency: engine.utility.midiToFrequency(note),
      type: 'triangle',
    }).connect(this.output.input)

    this.toneSynth.param.gain.value = engine.utility.fromDb(-6)
  },
  updateToneSynth: function (velocityRatio) {
    this.toneSynth.param.detune.value = engine.utility.lerp(0, 1200, velocityRatio)
  },
})
