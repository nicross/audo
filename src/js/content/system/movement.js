'use strict'

content.system.movement = (() => {
  const defaults = {
    angle: 0,
    deltaRotation: 0,
    deltaVelocity: 0,
    velocity: 0,
  }

  let state = {...defaults}

  return {
    get: () => ({...state}),
    reset: function () {
      return this.set()
    },
    set: function (values = {}) {
      state = {
        ...defaults,
        ...values,
      }

      return this
    },
    update: function ({translate}) {
      const delta = engine.loop.delta()

      const maxVelocity = Math.min(content.const.movementMaxVelocity * translate.radius, content.const.movementMaxVelocity)

      if (translate.radius > 0) {
        if (state.velocity <= maxVelocity - (delta * content.const.movementAcceleration)) {
          state.velocity += delta * content.const.movementAcceleration
        } else if (state.velocity > maxVelocity) {
          state.velocity -= delta * content.const.movementDeceleration
        }
      } else if (state.velocity >= delta * content.const.movementDeceleration) {
        state.velocity -= delta * content.const.movementDeceleration
      } else if (state.velocity != 0) {
        state.velocity = 0
      }

      if (translate.radius) {
        state.angle = translate.theta
      }

      state.deltaVelocity = delta * state.velocity

      engine.position.setVelocity({
        x: state.velocity * Math.cos(state.angle),
        y: state.velocity * Math.sin(state.angle),
      })

      return this
    },
  }
})()

engine.state.on('reset', () => content.system.movement.reset())
