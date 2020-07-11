content.system.velocity = (() => {
  let time = 0,
    velocity = 0

  return {
    get: () => velocity,
    increment: function (value = 0) {
      velocity += value
      return this
    },
    reset: function () {
      time = 0
      velocity = 0
      return this
    },
    time: () => time,
    update: function (delta = 0) {
      time += delta
      velocity += delta * Math.log(time)
      return this
    },
  }
})()

engine.loop.on('frame', ({delta, paused}) => {
  if (!paused) {
    content.system.velocity.update(delta)
  }
})

engine.state.on('reset', () => content.system.velocity.reset())
