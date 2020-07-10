app.utility.number = (() => {
  const formatter = new Intl.NumberFormat('en-US')

  return {
    format: (value = 0) => formatter.format(value),
  }
})()
