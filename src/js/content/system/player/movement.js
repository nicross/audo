content.system.player.movement = {
  update: function ({x}) {
    const movement = engine.movement.get(),
      position = engine.position.get()

    const allowLeft = position.y < content.const.roadRadius,
      allowRight = position.y > -content.const.roadRadius

    const isLeft = x < 0,
      isRight = x > 0,
      wasLeft = movement.angle > 0,
      wasRight = movement.angle < 0

    const directionChanged = movement.velocity && ((isLeft && wasRight) || (isRight && wasLeft)),
      isBoundary = (isLeft && !allowLeft) || (isRight && !allowRight)

    let translateRadius = 0,
      translateTheta = 0

    if (allowLeft && isLeft) {
      translateRadius = -x
      translateTheta = Math.PI/2
    } else if (allowRight && isRight) {
      translateRadius = x
      translateTheta = -Math.PI/2
    }

    if (isBoundary) {
      engine.movement.reset()
      engine.position.set({
        x: 0,
        y: engine.utility.clamp(position.y, -content.const.roadRadius, content.const.roadRadius)
      })
    } else if (directionChanged) {
      engine.movement.set({
        ...movement,
        velocity: movement.velocity * 2/3,
      })
    }

    engine.const.movementAcceleration = Math.min(content.system.player.relativeVelocity(), engine.const.gravity)

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
