// Wraps `fn` and returns a tuple of functions, `cancel` and `callback`.
// `callback` invokes `fn` with the same arguments *unless* `cancel` has
// been called first (in which case, `callback` is a no-op).
//
// Example:
//
//   const [cancel, callback] = makeCancellable(processHttpResponse)
//   request(url, callback)
//   // Do nothing with the response if more than 3 seconds pass
//   setTimeout(cancel, 3000)
export default function makeCancellable (fn, thisArg) {
  let cancelled = false

  const callback = function callback (...args) {
    if (!cancelled) {
      fn.apply(thisArg, args)
    }
  }

  const cancel = function cancel () {
    cancelled = true
  }

  return [cancel, callback]
}
