// Based on: https://github.com/dayAlone/koa-webpack-hot-middleware/blob/master/index.js
export default function applyExpressMiddleware(fn, req, res) {
  const originalEnd = res.end

  return new Promise((resolve, reject) => {
    res.end = function () {
      Reflect.apply(originalEnd, this, arguments)
      // originalEnd.apply(this, arguments)
      resolve(false)
    }
    fn(req, res, () => {
      resolve(true)
    })
  })
}
