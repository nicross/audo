content.system.player.audio = (() => {
  const bus = engine.audio.mixer.createBus()

  bus.gain.value = engine.const.zeroGain

  return {
    onPause: function () {
      engine.audio.ramp.linear(bus.gain, 0, 0.25)
      return this
    },
    onResume: function () {
      engine.audio.ramp.linear(bus.gain, 1, 0.25)
      return this
    },
    reset: function () {
      this.engine.reset()
      this.guardrails.reset()
      this.movement.reset()
      return this
    },
    update: function (e) {
      this.engine.update(e)
      this.guardrails.update(e)
      this.movement.update(e)
      return this
    },
  }
})()

engine.loop.on('pause', () => content.system.player.audio.onPause())
engine.loop.on('resume', () => content.system.player.audio.onResume())
engine.loop.on('reset', () => content.system.player.audio.reset())

engine.loop.on('frame', (e) => {
  if (e.paused) {
    return
  }

  content.system.player.audio.update(e)
})
