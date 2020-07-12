content.sfx = {}

content.sfx.bus = engine.audio.mixer.createBus()
content.sfx.bus.gain.value = engine.utility.fromDb(0)

content.sfx.boost = () => {
  const now = engine.audio.time()

  const frequency = engine.utility.midiToFrequency(48)

  const jump = engine.audio.synth.createFm({
    carrierFrequency: frequency,
    carrierType: 'square',
    modDepth: frequency,
    modFrequency: engine.utility.addInterval(frequency, 30/12),
    modType: 'sawtooth',
  }).filtered({
    frequency: frequency * 16,
  }).connect(content.sfx.bus)

  jump.param.detune.setValueAtTime(1200, now)
  jump.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/16)
  jump.param.detune.linearRampToValueAtTime(1200, now + 1/4)

  jump.param.gain.setValueAtTime(engine.const.zeroGain, now)
  jump.param.gain.exponentialRampToValueAtTime(1/8, now + 1/32)
  jump.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 4)

  jump.stop(now + 4)
}

content.sfx.gameOver = () => {
  const now = engine.audio.time()

  const noise = engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.pink(),
  }).filtered({
    frequency: 120,
  }).connect(content.sfx.bus)

  noise.param.gain.setValueAtTime(engine.const.zeroGain, now)
  noise.param.gain.exponentialRampToValueAtTime(8, now + 1/16) // XXX: Above 0 dB
  noise.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 4)

  noise.stop(now + 4)

  const tone = engine.audio.synth.createSimple({
    frequency: engine.utility.midiToFrequency(90),
  }).connect(content.sfx.bus)

  tone.param.gain.setValueAtTime(engine.const.zeroGain, now)
  tone.param.gain.linearRampToValueAtTime(1/256, now + 1.5)
  tone.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 3)

  tone.stop(now + 3)

  const zap = engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.white(),
  }).filtered({
    type: 'bandpass',
  }).connect(content.sfx.bus)

  zap.param.gain.setValueAtTime(engine.const.zeroGain, now)
  zap.param.gain.exponentialRampToValueAtTime(1/32, now + 1/32)
  zap.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 2)

  zap.filter.frequency.setValueAtTime(engine.const.minFrequency, now)
  zap.filter.frequency.exponentialRampToValueAtTime(engine.const.maxFrequency, now + 1/4)
  zap.filter.frequency.exponentialRampToValueAtTime(engine.const.minFrequency, now + 2)

  zap.filter.Q.setValueAtTime(1, now)
  zap.filter.Q.linearRampToValueAtTime(10, now + 1/32)
  zap.filter.Q.linearRampToValueAtTime(1, now + 2)

  zap.stop(now + 2)
}

content.sfx.lap = () => {
  const now = engine.audio.time()

  const synth = engine.audio.synth.createSimple({
    frequency: engine.utility.midiToFrequency(60),
  }).connect(content.sfx.bus)

  synth.param.detune.setValueAtTime(1200, now)
  synth.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/16)
  synth.param.detune.linearRampToValueAtTime(1200, now + 1/4)

  synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
  synth.param.gain.exponentialRampToValueAtTime(1/16, now + 1/32)
  synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 3)

  synth.stop(now + 3)
}

content.sfx.shieldDown = () => {
  const now = engine.audio.time()

  const frequency = engine.utility.midiToFrequency(60)

  const synth = engine.audio.synth.createAdditive({
    frequency,
    harmonic: [
      {
        coefficient: 1,
        gain: 1,
        type: 'sawtooth',
      },
      {
        coefficient: engine.utility.addInterval(1, 3/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1,
        type: 'square',
      },
      {
        coefficient: engine.utility.addInterval(1, 7/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1,
        type: 'triangle',
      },
    ],
  }).filtered({
    frequency: frequency * 8,
  })

  synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/16)
  synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 3)

  synth.param.detune.setValueAtTime(-600, now)
  synth.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/16)
  synth.param.detune.setValueAtTime(engine.const.zero, now + 1/8)
  synth.param.detune.linearRampToValueAtTime(-600, now + 1/4)

  const lfo = engine.audio.synth.createLfo({
    depth: 1/4,
    frequency: 8,
  })

  const mixer = engine.audio.context().createGain()
  mixer.gain.value = 3/4

  lfo.connect(mixer.gain)
  synth.connect(mixer)
  mixer.connect(content.sfx.bus)

  lfo.stop(now + 3)
  synth.stop(now + 3)
}

content.sfx.shieldUp = () => {
  const now = engine.audio.time()

  const frequency = engine.utility.midiToFrequency(60)

  const synth = engine.audio.synth.createAdditive({
    frequency,
    harmonic: [
      {
        coefficient: 1,
        gain: 1,
        type: 'sawtooth',
      },
      {
        coefficient: engine.utility.addInterval(1, 4/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1,
        type: 'square',
      },
      {
        coefficient: engine.utility.addInterval(1, 7/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1,
        type: 'triangle',
      },
    ],
  }).filtered({
    frequency: frequency * 8,
  })

  synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/16)
  synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 3)

  synth.param.detune.setValueAtTime(1200, now)
  synth.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/16)
  synth.param.detune.setValueAtTime(engine.const.zero, now + 1/8)
  synth.param.detune.linearRampToValueAtTime(1200, now + 1/4)

  const lfo = engine.audio.synth.createLfo({
    depth: 1/4,
    frequency: 8,
  })

  const mixer = engine.audio.context().createGain()
  mixer.gain.value = 3/4

  lfo.connect(mixer.gain)
  synth.connect(mixer)
  mixer.connect(content.sfx.bus)

  lfo.stop(now + 3)
  synth.stop(now + 3)
}
