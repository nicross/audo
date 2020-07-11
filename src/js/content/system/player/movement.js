content.system.player.movement = {
  update: function ({x}) {
    const position = engine.position.get()

    const allowLeft = position.y > -content.const.roadRadius,
      allowRight = position.y < content.const.roadRadius

    const isLeft = x < 0,
      isRight = x > 0

    let translateRadius = 0,
      translateTheta = 0

    if (allowLeft && isLeft) {
      translateRadius = -x
      translateTheta = -Math.PI/2
    } else if (allowRight && isRight) {
      translateRadius = x
      translateTheta = Math.PI/2
    }

    if (!allowLeft || !allowRight) {
      engine.movement.reset()
      engine.position.set({
        x: 0,
        y: engine.utility.clamp(position.y, -content.const.roadRadius, content.const.roadRadius)
      })
    }

    const relativeVelocity = content.system.player.relativeVelocity()
    engine.const.movementAcceleration = relativeVelocity

    engine.movement.update({
      translate: {
        radius: translateRadius,
        theta: translateTheta,
      },
      rotate: 0,
    })

    return this
  },
}
