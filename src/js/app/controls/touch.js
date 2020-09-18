app.controls.touch = (() => {
  let isLeft = false,
    isRight = false,
    left,
    right

  engine.ready(() => {
    left = document.querySelector('.a-game--left')
    right = document.querySelector('.a-game--right')

    left.addEventListener('touchend', onLeftTouchend)
    left.addEventListener('touchstart', onLeftTouchstart)

    right.addEventListener('touchend', onRightTouchend)
    right.addEventListener('touchstart', onRightTouchstart)
  })

  function onLeftTouchend() {
    left.classList.remove('a-game--control-active')
    isLeft = false
  }

  function onLeftTouchstart() {
    left.classList.add('a-game--control-active')
    isLeft = true
  }

  function onRightTouchend() {
    right.classList.remove('a-game--control-active')
    isRight = false
  }

  function onRightTouchstart() {
    right.classList.add('a-game--control-active')
    isRight = true
  }

  return {
    game: () => {
      const state = {}

      if (isLeft && !isRight) {
        state.x = -1
      }

      if (isRight && !isLeft) {
        state.x = 1
      }

      return state
    },
  }
})()
