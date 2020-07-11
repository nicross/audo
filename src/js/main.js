'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()
  engine.loop.start().pause()

  engine.audio.mixer.master.param.limiter.attack.value = 0.009
  engine.audio.mixer.master.param.limiter.gain.value = 1
  engine.audio.mixer.master.param.limiter.knee.value = 12
  engine.audio.mixer.master.param.limiter.ratio.value = 10
  engine.audio.mixer.master.param.limiter.release.value = 0.25
  engine.audio.mixer.master.param.limiter.threshold.value = -24

  engine.audio.mixer.auxiliary.reverb.setImpulse(engine.audio.buffer.impulse.medium())
  engine.audio.mixer.auxiliary.reverb.setGain(engine.utility.fromDb(-3))
})
