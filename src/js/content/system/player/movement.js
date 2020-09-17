content.system.player.movement = {
  update: function ({x}) {
    const movement = content.system.movement.get(),
      position = engine.position.getVector()

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
      content.system.movement.reset()
      engine.position.setVector({
        x: 0,
        y: engine.utility.clamp(position.y, -content.const.roadRadius, content.const.roadRadius)
      })
    } else if (directionChanged) {
      content.system.movement.set({
        ...movement,
        velocity: movement.velocity * 2/3,
      })
    }

    content.const.movementAcceleration = Math.min(content.system.player.relativeVelocity(), engine.const.gravity)

    content.system.movement.update({
      translate: {
        radius: translateRadius,
        theta: translateTheta,
      },
    })

    return this
  },
}
