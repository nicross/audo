content.prop.opponent.base = engine.prop.base.invent({
  name: 'opponent/base',
  onConstruct: function ({
    index,
  }) {
    this.index = index

    this.buildToneSynth()
  },
  onDestroy: function () {
    this.destroyToneSynth()

    if (this.collisionSynth) {
      this.destroyCollisionSynth()
    }
  },
  onUpdate: function ({delta}) {
    const velocityRatio = Math.min(1, Math.abs(this.velocity) / 20)

    this.updateCollisionSynth(delta)
    this.updateToneSynth(velocityRatio)
  },
  buildCollisionSynth: function () {
    const note = 66 + this.index
    const frequency = engine.utility.midiToFrequency(note)

    this.collisionSynth = engine.audio.synth.createMod({
      amodDepth: 0.5,
      amodFrequency: 1,
      amodType: 'triangle',
      carrierFrequency: frequency,
      carrierGain: 0.5,
      carrierType: 'sawtooth',
      fmodDepth: frequency / 2,
      fmodFrequency: frequency / 2,
      fmodType: 'sawtooth',
    }).filtered({
      frequency: frequency * 2,
    }).connect(this.output.input)
  },
  destroyCollisionSynth: function () {
    this.collisionSynth.stop().disconnect()
    delete this.collisionSynth
  },
  duck: function () {
    const now = engine.audio.time()
    this.output.input.gain.setValueAtTime(1, now)
    this.output.input.gain.exponentialRampToValueAtTime(engine.utility.fromDb(-24), now + 1/32)
    this.output.input.gain.exponentialRampToValueAtTime(1, now + 3)
    return this
  },
  updateCollisionSynth: function (delta) {
    const position = engine.position.get()

    const yDistance = Math.abs(this.y - position.y)
    let collisionChance = engine.utility.clamp(engine.utility.scale(yDistance, this.radius, this.radius * 8, 1, 0), 0, 1)

    const isIncoming = (this.velocity < 0 && this.x > 0)
      || (this.velocity > 0 && this.x < 0)

    if (collisionChance && !isIncoming && this.collisionSynth) {
      collisionChance = (1 - Math.min(1, Math.abs(this.x) / Math.abs(this.velocity))) * collisionChance
    } else if (collisionChance && !isIncoming) {
      collisionChance = 0
    }

    if (!collisionChance) {
      if (this.collisionSynth) {
        this.destroyCollisionSynth()
      }
      return
    }

    if (!this.collisionSynth) {
      this.buildCollisionSynth()
    }

    const reactionTime = 10
    const reactionDistance = reactionTime * Math.abs(this.velocity)
    const reactionCompensation = -engine.utility.toDb(engine.utility.distanceToPower(reactionDistance)) / 4

    const compensation = engine.utility.fromDb(
      this.distance < reactionDistance
        ? Math.max(0, reactionCompensation * this.distance / reactionDistance)
        : reactionCompensation
    )

    engine.audio.ramp.linear(this.collisionSynth.param.amod.frequency, engine.utility.lerp(2, 8, collisionChance), delta)
    engine.audio.ramp.linear(this.collisionSynth.param.fmod.depth, collisionChance * this.collisionSynth.param.frequency.value, delta)
    engine.audio.ramp.linear(this.collisionSynth.param.fmod.frequency, collisionChance * this.collisionSynth.param.frequency.value, delta)
    engine.audio.ramp.linear(this.collisionSynth.param.gain, collisionChance * compensation, delta)
  },
  buildToneSynth: function () {
    const frequency = engine.utility.midiToFrequency(36 + this.index)

    this.toneSynth = engine.audio.synth.createSimple({
      frequency,
      type: 'square',
    }).filtered({
      frequency: frequency * 16,
    }).connect(this.output.input)

    this.toneSynth.param.gain.value = engine.utility.fromDb(-3)
  },
  destroyToneSynth: function () {
    this.toneSynth.stop()
    delete this.toneSynth
  },
  updateToneSynth: function (velocityRatio) {
    this.toneSynth.param.detune.value = engine.utility.lerp(0, 1200, velocityRatio)
  },
})
