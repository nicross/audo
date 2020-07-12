content.system.music = (() => {
  const bus = engine.audio.mixer.createBus(),
    context = engine.audio.context(),
    filter = context.createBiquadFilter(),
    mixer = context.createGain(),
    panner = context.createStereoPanner()

  let hat,
    kick,
    timer

  bus.gain.value = engine.utility.fromDb(-12)
  filter.frequency.value = engine.const.maxFrequency

  panner.connect(mixer)
  mixer.connect(filter)
  filter.connect(bus)

  function calculateDuration() {
    return engine.utility.lerp(1, 1/8, content.system.player.velocityRatio())
  }

  function pulse() {
    const duration = calculateDuration(),
      now = engine.audio.time()

    kick = engine.audio.synth.createSimple({
      frequency: 120,
    }).connect(panner)

    kick.param.gain.setValueAtTime(engine.const.zeroGain, now)
    kick.param.gain.exponentialRampToValueAtTime(1, now + 1/64)
    kick.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 1/4)
    kick.stop(now + 1/4)

    hat = engine.audio.synth.createBuffer({
      buffer: engine.audio.buffer.noise.white(),
    }).filtered({
      frequency: 10000,
      type: 'bandpass',
    }).connect(panner)

    hat.param.gain.setValueAtTime(engine.const.zeroGain, now)
    hat.param.gain.exponentialRampToValueAtTime(1/64, now + 1/64)
    hat.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + duration/3 - engine.const.zeroTime)
    hat.param.gain.exponentialRampToValueAtTime(1/64, now + duration/2)
    hat.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + duration*2/3 - engine.const.zeroTime)

    timer = context.createConstantSource()
    timer.start(now)
    timer.stop(now + duration)
    timer.onended = pulse
  }

  return {
    blur: function () {
      engine.audio.ramp.linear(filter.frequency, 60, 2)
      engine.audio.ramp.linear(mixer.gain, 1, 2)
      engine.audio.ramp.linear(panner.pan, 0, 2)
      return this
    },
    start: function () {
      pulse()
      return this
    },
    unblur: function () {
      engine.audio.ramp.exponential(filter.frequency, engine.const.maxFrequency, 1/2)
      return this
    },
    update: function (delta) {
      const position = engine.position.get()

      const gain = engine.utility.clamp(1 - (Math.abs(position.y) / content.const.roadRadius), 0, 1)
      const pan = engine.utility.clamp(position.y / content.const.roadRadius, -1, 1)

      engine.audio.ramp.linear(mixer.gain, gain, delta)
      engine.audio.ramp.linear(panner.pan, pan, delta)

      return this
    },
  }
})()

engine.state.once('import', () => content.system.music.start())

engine.loop.on('frame', (e) => {
  if (e.paused) {
    return
  }

  content.system.music.update(e.delta)
})
