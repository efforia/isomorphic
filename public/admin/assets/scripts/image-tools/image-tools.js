var _createClass = (function() {
  function e(b, c) {
    for (var a = 0; a < c.length; a++) {
      var d = c[a]
      d.enumerable = d.enumerable || !1
      d.configurable = !0
      'value' in d && (d.writable = !0)
      Object.defineProperty(b, d.key, d)
    }
  }
  return function(b, c, a) {
    c && e(b.prototype, c)
    a && e(b, a)
    return b
  }
})()
function _classCallCheck(e, b) {
  if (!(e instanceof b)) throw new TypeError('Cannot call a class as a function')
}
var hasBlobConstructor =
    'undefined' !== typeof Blob &&
    (function() {
      try {
        return !!new Blob()
      } catch (e) {
        return !1
      }
    })(),
  hasArrayBufferViewSupport =
    hasBlobConstructor &&
    'undefined' !== typeof Uint8Array &&
    (function() {
      try {
        return 100 === new Blob([new Uint8Array(100)]).size
      } catch (e) {
        return !1
      }
    })(),
  hasToBlobSupport =
    'undefined' !== typeof HTMLCanvasElement ? HTMLCanvasElement.prototype.toBlob : !1,
  hasBlobSupport =
    hasToBlobSupport ||
    ('undefined' !== typeof Uint8Array &&
      'undefined' !== typeof ArrayBuffer &&
      'undefined' !== typeof atob),
  hasReaderSupport = 'undefined' !== typeof FileReader || 'undefined' !== typeof URL,
  ImageTools = (function() {
    function e() {
      _classCallCheck(this, e)
    }
    _createClass(e, null, [
      {
        key: 'resize',
        value: function(b, c, a) {
          'function' === typeof c && ((a = c), (c = { width: 640, height: 480 }))
          if (!e.isSupported() || !b.type.match(/image.*/) || b.type.match(/image\/gif/))
            return a(b, !1), !1
          var d = document.createElement('img')
          d.onload = function(f) {
            f = d.width
            var h = d.height,
              g = !1
            f >= h && f > c.width
              ? ((h *= c.width / f), (f = c.width), (g = !0))
              : h > c.height && ((f *= c.height / h), (h = c.height), (g = !0))
            g
              ? ((g = document.createElement('canvas')),
                (g.width = f),
                (g.height = h),
                g.getContext('2d').drawImage(d, 0, 0, f, h),
                hasToBlobSupport
                  ? g.toBlob(function(b) {
                      a(b, !0)
                    }, b.type)
                  : ((f = e._toBlob(g, b.type)), a(f, !0)))
              : a(b, !1)
          }
          e._loadImage(d, b)
          return !0
        }
      },
      {
        key: '_toBlob',
        value: function(b, c) {
          var a = b.toDataURL(c).split(',')
          var d = 0 <= a[0].indexOf('base64') ? atob(a[1]) : decodeURIComponent(a[1])
          for (
            var f = new ArrayBuffer(d.length), e = new Uint8Array(f), g = 0;
            g < d.length;
            g += 1
          )
            e[g] = d.charCodeAt(g)
          a = a[0].split(':')[1].split(';')[0]
          hasBlobConstructor
            ? (f = new Blob([hasArrayBufferViewSupport ? e : f], { type: a }))
            : ((e = new BlobBuilder()), e.append(f), (f = e.getBlob(a)))
          return f
        }
      },
      {
        key: '_loadImage',
        value: function(b, c, a) {
          if ('undefined' === typeof URL) {
            var d = new FileReader()
            d.onload = function(c) {
              b.src = c.target.result
              a && a()
            }
            d.readAsDataURL(c)
          } else (b.src = URL.createObjectURL(c)), a && a()
        }
      },
      {
        key: 'isSupported',
        value: function() {
          return 'undefined' !== typeof HTMLCanvasElement && hasBlobSupport && hasReaderSupport
        }
      }
    ])
    return e
  })()
