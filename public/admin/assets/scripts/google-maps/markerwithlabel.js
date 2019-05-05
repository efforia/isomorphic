function inherits(a, c) {
  function d() {}
  d.prototype = c.prototype
  a.superClass_ = c.prototype
  a.prototype = new d()
  a.prototype.constructor = a
}
function MarkerLabel_(a, c, d) {
  this.marker_ = a
  this.handCursorURL_ = a.handCursorURL
  this.labelDiv_ = document.createElement('div')
  this.labelDiv_.style.cssText = 'position: absolute; overflow: hidden;'
  this.crossDiv_ = MarkerLabel_.getSharedCross(c)
}
inherits(MarkerLabel_, google.maps.OverlayView)
MarkerLabel_.getSharedCross = function(a) {
  if ('undefined' === typeof MarkerLabel_.getSharedCross.crossDiv) {
    var c = document.createElement('img')
    c.style.cssText = 'position: absolute; z-index: 1000002; display: none;'
    c.style.marginLeft = '-8px'
    c.style.marginTop = '-9px'
    c.src = a
    MarkerLabel_.getSharedCross.crossDiv = c
  }
  return MarkerLabel_.getSharedCross.crossDiv
}
MarkerLabel_.prototype.onAdd = function() {
  var a = this,
    c = !1,
    d = !1,
    k,
    l,
    m,
    g,
    f,
    n,
    p,
    q = 'url(' + this.handCursorURL_ + ')',
    h = function(a) {
      a.preventDefault && a.preventDefault()
      a.cancelBubble = !0
      a.stopPropagation && a.stopPropagation()
    },
    r = function() {
      a.marker_.setAnimation(null)
    }
  this.getPanes().markerLayer.appendChild(this.labelDiv_)
  'undefined' === typeof MarkerLabel_.getSharedCross.processed &&
    (this.getPanes().markerLayer.appendChild(this.crossDiv_),
    (MarkerLabel_.getSharedCross.processed = !0))
  this.listeners_ = [
    google.maps.event.addDomListener(this.labelDiv_, 'mouseover', function(b) {
      if (a.marker_.getDraggable() || a.marker_.getClickable())
        (this.style.cursor = 'pointer'), google.maps.event.trigger(a.marker_, 'mouseover', b)
    }),
    google.maps.event.addDomListener(this.labelDiv_, 'mouseout', function(b) {
      ;(!a.marker_.getDraggable() && !a.marker_.getClickable()) ||
        d ||
        ((this.style.cursor = a.marker_.getCursor()),
        google.maps.event.trigger(a.marker_, 'mouseout', b))
    }),
    google.maps.event.addDomListener(this.labelDiv_, 'mousedown', function(b) {
      d = !1
      a.marker_.getDraggable() && ((c = !0), (this.style.cursor = q))
      if (a.marker_.getDraggable() || a.marker_.getClickable())
        google.maps.event.trigger(a.marker_, 'mousedown', b), h(b)
    }),
    google.maps.event.addDomListener(document, 'mouseup', function(b) {
      c &&
        ((c = !1),
        (a.eventDiv_.style.cursor = 'pointer'),
        google.maps.event.trigger(a.marker_, 'mouseup', b))
      if (d) {
        if (f) {
          var e = a.getProjection().fromLatLngToDivPixel(a.marker_.getPosition())
          e.y += 20
          a.marker_.setPosition(a.getProjection().fromDivPixelToLatLng(e))
          try {
            a.marker_.setAnimation(google.maps.Animation.BOUNCE), setTimeout(r, 1406)
          } catch (t) {}
        }
        a.crossDiv_.style.display = 'none'
        a.marker_.setZIndex(k)
        g = !0
        d = !1
        b.latLng = a.marker_.getPosition()
        google.maps.event.trigger(a.marker_, 'dragend', b)
      }
    }),
    google.maps.event.addListener(a.marker_.getMap(), 'mousemove', function(b) {
      if (c)
        if (d) {
          b.latLng = new google.maps.LatLng(b.latLng.lat() - l, b.latLng.lng() - m)
          var e = a.getProjection().fromLatLngToDivPixel(b.latLng)
          f &&
            ((a.crossDiv_.style.left = e.x + 'px'),
            (a.crossDiv_.style.top = e.y + 'px'),
            (a.crossDiv_.style.display = ''),
            (e.y -= 20))
          a.marker_.setPosition(a.getProjection().fromDivPixelToLatLng(e))
          f && (a.eventDiv_.style.top = e.y + 20 + 'px')
          google.maps.event.trigger(a.marker_, 'drag', b)
        } else
          (l = b.latLng.lat() - a.marker_.getPosition().lat()),
            (m = b.latLng.lng() - a.marker_.getPosition().lng()),
            (k = a.marker_.getZIndex()),
            (n = a.marker_.getPosition()),
            (p = a.marker_.getMap().getCenter()),
            (f = a.marker_.get('raiseOnDrag')),
            (d = !0),
            a.marker_.setZIndex(1e6),
            (b.latLng = a.marker_.getPosition()),
            google.maps.event.trigger(a.marker_, 'dragstart', b)
    }),
    google.maps.event.addDomListener(document, 'keydown', function(b) {
      d &&
        27 === b.keyCode &&
        ((f = !1),
        a.marker_.setPosition(n),
        a.marker_.getMap().setCenter(p),
        google.maps.event.trigger(document, 'mouseup', b))
    }),
    google.maps.event.addDomListener(this.labelDiv_, 'click', function(b) {
      if (a.marker_.getDraggable() || a.marker_.getClickable())
        g ? (g = !1) : (google.maps.event.trigger(a.marker_, 'click', b), h(b))
    }),
    google.maps.event.addDomListener(this.labelDiv_, 'dblclick', function(b) {
      if (a.marker_.getDraggable() || a.marker_.getClickable())
        google.maps.event.trigger(a.marker_, 'dblclick', b), h(b)
    }),
    google.maps.event.addListener(this.marker_, 'dragstart', function(a) {
      d || (f = this.get('raiseOnDrag'))
    }),
    google.maps.event.addListener(this.marker_, 'drag', function(b) {
      !d &&
        f &&
        (a.setPosition(20),
        (a.labelDiv_.style.zIndex = 1e6 + (this.get('labelInBackground') ? -1 : 1)))
    }),
    google.maps.event.addListener(this.marker_, 'dragend', function(b) {
      d || (f && a.setPosition(0))
    }),
    google.maps.event.addListener(this.marker_, 'position_changed', function() {
      a.setPosition()
    }),
    google.maps.event.addListener(this.marker_, 'zindex_changed', function() {
      a.setZIndex()
    }),
    google.maps.event.addListener(this.marker_, 'visible_changed', function() {
      a.setVisible()
    }),
    google.maps.event.addListener(this.marker_, 'labelvisible_changed', function() {
      a.setVisible()
    }),
    google.maps.event.addListener(this.marker_, 'title_changed', function() {
      a.setTitle()
    }),
    google.maps.event.addListener(this.marker_, 'labelcontent_changed', function() {
      a.setContent()
    }),
    google.maps.event.addListener(this.marker_, 'labelanchor_changed', function() {
      a.setAnchor()
    }),
    google.maps.event.addListener(this.marker_, 'labelclass_changed', function() {
      a.setStyles()
    }),
    google.maps.event.addListener(this.marker_, 'labelstyle_changed', function() {
      a.setStyles()
    })
  ]
}
MarkerLabel_.prototype.onRemove = function() {
  var a
  this.labelDiv_.parentNode.removeChild(this.labelDiv_)
  for (a = 0; a < this.listeners_.length; a++) google.maps.event.removeListener(this.listeners_[a])
}
MarkerLabel_.prototype.draw = function() {
  this.setContent()
  this.setTitle()
  this.setStyles()
}
MarkerLabel_.prototype.setContent = function() {
  var a = this.marker_.get('labelContent')
  'undefined' === typeof a.nodeType
    ? (this.labelDiv_.innerHTML = a)
    : ((this.labelDiv_.innerHTML = ''), this.labelDiv_.appendChild(a))
}
MarkerLabel_.prototype.setTitle = function() {
  this.labelDiv_.title = this.marker_.getTitle() || ''
}
MarkerLabel_.prototype.setStyles = function() {
  var a
  this.labelDiv_.className = this.marker_.get('labelClass')
  this.labelDiv_.style.cssText = ''
  var c = this.marker_.get('labelStyle')
  for (a in c) c.hasOwnProperty(a) && (this.labelDiv_.style[a] = c[a])
  this.setMandatoryStyles()
}
MarkerLabel_.prototype.setMandatoryStyles = function() {
  this.labelDiv_.style.position = 'absolute'
  this.labelDiv_.style.overflow = 'hidden'
  'undefined' !== typeof this.labelDiv_.style.opacity &&
    '' !== this.labelDiv_.style.opacity &&
    ((this.labelDiv_.style.MsFilter =
      '"progid:DXImageTransform.Microsoft.Alpha(opacity=' +
      100 * this.labelDiv_.style.opacity +
      ')"'),
    (this.labelDiv_.style.filter = 'alpha(opacity=' + 100 * this.labelDiv_.style.opacity + ')'))
  this.setAnchor()
  this.setPosition()
  this.setVisible()
}
MarkerLabel_.prototype.setAnchor = function() {
  var a = this.marker_.get('labelAnchor')
  this.labelDiv_.style.marginLeft = -a.x + 'px'
  this.labelDiv_.style.marginTop = -a.y + 'px'
}
MarkerLabel_.prototype.setPosition = function(a) {
  var c = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition())
  'undefined' === typeof a && (a = 0)
  this.labelDiv_.style.left = Math.round(c.x) + 'px'
  this.labelDiv_.style.top = Math.round(c.y - a) + 'px'
  this.setZIndex()
}
MarkerLabel_.prototype.setZIndex = function() {
  var a = this.marker_.get('labelInBackground') ? -1 : 1
  'undefined' === typeof this.marker_.getZIndex()
    ? (this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + a)
    : (this.labelDiv_.style.zIndex = this.marker_.getZIndex() + a)
}
MarkerLabel_.prototype.setVisible = function() {
  this.marker_.get('labelVisible')
    ? (this.labelDiv_.style.display = this.marker_.getVisible() ? 'block' : 'none')
    : (this.labelDiv_.style.display = 'none')
}
function MarkerWithLabel(a) {
  a = a || {}
  a.labelContent = a.labelContent || ''
  a.labelAnchor = a.labelAnchor || new google.maps.Point(0, 0)
  a.labelClass = a.labelClass || 'markerLabels'
  a.labelStyle = a.labelStyle || {}
  a.labelInBackground = a.labelInBackground || !1
  'undefined' === typeof a.labelVisible && (a.labelVisible = !0)
  'undefined' === typeof a.raiseOnDrag && (a.raiseOnDrag = !0)
  'undefined' === typeof a.clickable && (a.clickable = !0)
  'undefined' === typeof a.draggable && (a.draggable = !1)
  'undefined' === typeof a.optimized && (a.optimized = !1)
  a.crossImage =
    a.crossImage ||
    'http' +
      ('https:' === document.location.protocol ? 's' : '') +
      '://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png'
  a.handCursor =
    a.handCursor ||
    'http' +
      ('https:' === document.location.protocol ? 's' : '') +
      '://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur'
  a.optimized = !1
  this.label = new MarkerLabel_(this, a.crossImage, a.handCursor)
  google.maps.Marker.apply(this, arguments)
}
inherits(MarkerWithLabel, google.maps.Marker)
MarkerWithLabel.prototype.setMap = function(a) {
  google.maps.Marker.prototype.setMap.apply(this, arguments)
  this.label.setMap(a)
}
