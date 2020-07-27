content.sfx = {}

content.sfx.bus = engine.audio.mixer.createBus()
content.sfx.bus.gain.value = engine.utility.fromDb(0)

content.sfx.boost = () => {
  const now = engine.audio.time()

  const frequency = engine.utility.midiToFrequency(48)

  const synth = engine.audio.synth.createMod({
    amodDepth: 1/4,
    amodFrequency: 16,
    amodType: 'triangle',
    carrierFrequency: frequency,
    carrierGain: 3/4,
    carrierType: 'square',
    fmodDepth: frequency,
    fmodFrequency: engine.utility.addInterval(frequency, 30/12),
    fmodType: 'sawtooth',
  }).filtered({
    frequency: frequency * 16,
  }).connect(content.sfx.bus)

  synth.param.detune.setValueAtTime(1200, now)
  synth.param.detune.linearRampToValueAtTime(engine.const.zero, now + 1/32)
  synth.param.detune.linearRampToValueAtTime(1200, now + 1/8)
  synth.param.detune.linearRampToValueAtTime(12000, now + 3)

  synth.param.gain.setValueAtTime(engine.const.zeroGain, now)
  synth.param.gain.exponentialRampToValueAtTime(1/8, now + 1/32)
  synth.param.gain.exponentialRampToValueAtTime(1/32, now + 1/4)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 3)

  synth.stop(now + 3)
}

content.sfx.gameOver = () => {
  const now = engine.audio.time()

  const noise = engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.pink(),
  }).filtered({
    frequency: 240,
  }).connect(content.sfx.bus)

  noise.param.gain.setValueAtTime(engine.const.zeroGain, now)
  noise.param.gain.exponentialRampToValueAtTime(8, now + 1/32) // XXX: Above 0 dB
  noise.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 4)

  noise.stop(now + 4)

  const tone = engine.audio.synth.createSimple({
    frequency: engine.utility.midiToFrequency(90),
  }).connect(content.sfx.bus)

  tone.param.gain.setValueAtTime(engine.const.zeroGain, now)
  tone.param.gain.linearRampToValueAtTime(1/256, now + 1.5)
  tone.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 4)

  tone.stop(now + 4)

  const zapFrequency = engine.utility.midiToFrequency(36)

  const zap = engine.audio.synth.createMod({
    amodDepth: 1/4,
    amodFrequency: 16,
    amodType: 'triangle',
    carrierFrequency: zapFrequency,
    carrierGain: 3/4,
    carrierType: 'square',
    fmodDepth: zapFrequency,
    fmodFrequency: engine.utility.addInterval(zapFrequency, 30/12),
    fmodType: 'sawtooth',
  }).filtered({
    frequency: zapFrequency * 16,
  }).connect(content.sfx.bus)

  zap.param.detune.setValueAtTime(8000, now)
  zap.param.detune.linearRampToValueAtTime(0, now + 3)

  zap.param.gain.setValueAtTime(engine.const.zeroGain, now)
  zap.param.gain.exponentialRampToValueAtTime(1/8, now + 1/16)
  zap.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 2)

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
  synth.param.gain.exponentialRampToValueAtTime(1/8, now + 1/32)
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
        coefficient: 0.5,
        gain: 1/3,
        type: 'sawtooth',
      },
      {
        coefficient: engine.utility.addInterval(1, 3/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1/3,
        type: 'square',
      },
      {
        coefficient: engine.utility.addInterval(1, 7/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1/3,
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
    frequency: 16,
    type: 'triangle',
  })

  const mixer = engine.audio.context().createGain()
  mixer.gain.value = 3/4

  lfo.connect(mixer.gain)
  synth.connect(mixer)
  mixer.connect(content.sfx.bus)

  const noise = engine.audio.synth.createBuffer({
    buffer: engine.audio.buffer.noise.pink(),
  }).filtered({
    frequency: 120,
  }).connect(content.sfx.bus)

  noise.param.gain.setValueAtTime(engine.const.zeroGain, now)
  noise.param.gain.exponentialRampToValueAtTime(8, now + 1/32) // XXX: Above 0 dB
  noise.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + 3)

  lfo.stop(now + 3)
  noise.stop(now + 3)
  synth.stop(now + 3)
}

content.sfx.shieldUp = () => {
  const now = engine.audio.time()

  const frequency = engine.utility.midiToFrequency(60)

  const synth = engine.audio.synth.createAdditive({
    frequency,
    harmonic: [
      {
        coefficient: 0.5,
        gain: 1/3,
        type: 'sawtooth',
      },
      {
        coefficient: engine.utility.addInterval(1, 4/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1/3,
        type: 'square',
      },
      {
        coefficient: engine.utility.addInterval(1, 7/12),
        detune: engine.utility.random.float(-25, 25),
        gain: 1/3,
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
    frequency: 16,
    type: 'triangle',
  })

  const mixer = engine.audio.context().createGain()
  mixer.gain.value = 3/4

  lfo.connect(mixer.gain)
  synth.connect(mixer)
  mixer.connect(content.sfx.bus)

  lfo.stop(now + 3)
  synth.stop(now + 3)
}
