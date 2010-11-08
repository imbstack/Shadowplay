/*

    P R O C E S S I N G . J S - 0.9.7
    a port of the Processing visualization language

    License       : MIT
    Developer     : John Resig: http://ejohn.org
    Web Site      : http://processingjs.org
    Java Version  : http://processing.org
    Github Repo.  : http://github.com/jeresig/processing-js
    Bug Tracking  : http://processing-js.lighthouseapp.com
    Mozilla POW!  : http://wiki.Mozilla.org/Education/Projects/ProcessingForTheWeb
    Maintained by : Seneca: http://zenit.senecac.on.ca/wiki/index.php/Processing.js
                    Hyper-Metrix: http://hyper-metrix.com/#Processing
                    BuildingSky: http://weare.buildingsky.net/pages/processing-js

 */

(function() {

  var undef; // intentionally left undefined

  var ajax = function ajax(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("If-Modified-Since", "Fri, 1 Jan 1960 00:00:00 GMT");
    xhr.send(null);
    // failed request?
    if (xhr.status !== 200 && xhr.status !== 0) { throw ("XMLHttpRequest failed, status code " + xhr.status); }
    return xhr.responseText;
  };

  /* Browsers fixes start */
  function fixReplaceByRegExp() {
    var re = /t/g;
    if ("t".replace(re,"") !== null && re.exec("t")) {
      return; // it is not necessary
    }
    var _ie_replace = String.prototype.replace;
    String.prototype.replace = function(searchValue, repaceValue) {
      var result = _ie_replace.apply(this, arguments);
      if (searchValue instanceof RegExp && searchValue.global) {
        searchValue.lastIndex = 0;
      }
      return result;
    };
  }

  function fixMatchByRegExp() {
    var re = /t/g;
    if ("t".match(re) !== null && re.exec("t")) {
      return; // it is not necessary
    }
    var _ie_match = String.prototype.match;
    String.prototype.match = function(searchValue) {
      var result = _ie_match.apply(this, arguments);
      if(searchValue instanceof RegExp && searchValue.global) {
        searchValue.lastIndex = 0;
      }
      return result;
    };
  }
  fixReplaceByRegExp();
  fixMatchByRegExp();

  (function fixOperaCreateImageData() {
    try {
      if (!("createImageData" in CanvasRenderingContext2D.prototype)) {
        CanvasRenderingContext2D.prototype.createImageData = function (sw, sh) {
          return new ImageData(sw, sh);
        };
      }
    } catch(e) {}
  }());
  /* Browsers fixes end */

  var PConstants = {
    X: 0,
    Y: 1,
    Z: 2,

    R: 3,
    G: 4,
    B: 5,
    A: 6,

    U: 7,
    V: 8,

    NX: 9,
    NY: 10,
    NZ: 11,

    EDGE: 12,

    // Stroke
    SR: 13,
    SG: 14,
    SB: 15,
    SA: 16,

    SW: 17,

    // Transformations (2D and 3D)
    TX: 18,
    TY: 19,
    TZ: 20,

    VX: 21,
    VY: 22,
    VZ: 23,
    VW: 24,

    // Material properties
    AR: 25,
    AG: 26,
    AB: 27,

    DR: 3,
    DG: 4,
    DB: 5,
    DA: 6,

    SPR: 28,
    SPG: 29,
    SPB: 30,

    SHINE: 31,

    ER: 32,
    EG: 33,
    EB: 34,

    BEEN_LIT: 35,

    VERTEX_FIELD_COUNT: 36,

    // Renderers
    P2D:    1,
    JAVA2D: 1,
    WEBGL:  2,
    P3D:    2,
    OPENGL: 2,
    PDF:    0,
    DXF:    0,

    // Platform IDs
    OTHER:   0,
    WINDOWS: 1,
    MAXOSX:  2,
    LINUX:   3,

    EPSILON: 0.0001,

    MAX_FLOAT:  3.4028235e+38,
    MIN_FLOAT: -3.4028235e+38,
    MAX_INT:    2147483647,
    MIN_INT:   -2147483648,

    PI:         Math.PI,
    TWO_PI:     2 * Math.PI,
    HALF_PI:    Math.PI / 2,
    THIRD_PI:   Math.PI / 3,
    QUARTER_PI: Math.PI / 4,

    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    WHITESPACE: " \t\n\r\f\u00A0",

    // Color modes
    RGB:   1,
    ARGB:  2,
    HSB:   3,
    ALPHA: 4,
    CMYK:  5,

    // Image file types
    TIFF:  0,
    TARGA: 1,
    JPEG:  2,
    GIF:   3,

    // Filter/convert types
    BLUR:      11,
    GRAY:      12,
    INVERT:    13,
    OPAQUE:    14,
    POSTERIZE: 15,
    THRESHOLD: 16,
    ERODE:     17,
    DILATE:    18,

    // Blend modes
    REPLACE:    0,
    BLEND:      1 << 0,
    ADD:        1 << 1,
    SUBTRACT:   1 << 2,
    LIGHTEST:   1 << 3,
    DARKEST:    1 << 4,
    DIFFERENCE: 1 << 5,
    EXCLUSION:  1 << 6,
    MULTIPLY:   1 << 7,
    SCREEN:     1 << 8,
    OVERLAY:    1 << 9,
    HARD_LIGHT: 1 << 10,
    SOFT_LIGHT: 1 << 11,
    DODGE:      1 << 12,
    BURN:       1 << 13,

    // Color component bit masks
    ALPHA_MASK: 0xff000000,
    RED_MASK:   0x00ff0000,
    GREEN_MASK: 0x0000ff00,
    BLUE_MASK:  0x000000ff,

    // Projection matrices
    CUSTOM:       0,
    ORTHOGRAPHIC: 2,
    PERSPECTIVE:  3,

    // Shapes
    POINT:          2,
    POINTS:         2,
    LINE:           4,
    LINES:          4,
    TRIANGLE:       8,
    TRIANGLES:      9,
    TRIANGLE_STRIP: 10,
    TRIANGLE_FAN:   11,
    QUAD:           16,
    QUADS:          16,
    QUAD_STRIP:     17,
    POLYGON:        20,
    PATH:           21,
    RECT:           30,
    ELLIPSE:        31,
    ARC:            32,
    SPHERE:         40,
    BOX:            41,

    GROUP:          0,
    PRIMITIVE:      1,
    //PATH:         21, // shared with Shape PATH
    GEOMETRY:       3,

    // Shape Vertex
    VERTEX:        0,
    BEZIER_VERTEX: 1,
    CURVE_VERTEX:  2,
    BREAK:         3,
    CLOSESHAPE:    4,

    // Shape closing modes
    OPEN:  1,
    CLOSE: 2,

    // Shape drawing modes
    CORNER:          0, // Draw mode convention to use (x, y) to (width, height)
    CORNERS:         1, // Draw mode convention to use (x1, y1) to (x2, y2) coordinates
    RADIUS:          2, // Draw mode from the center, and using the radius
    CENTER_RADIUS:   2, // Deprecated! Use RADIUS instead
    CENTER:          3, // Draw from the center, using second pair of values as the diameter
    DIAMETER:        3, // Synonym for the CENTER constant. Draw from the center
    CENTER_DIAMETER: 3, // Deprecated! Use DIAMETER instead

    // Text vertical alignment modes
    BASELINE: 0,   // Default vertical alignment for text placement
    TOP:      101, // Align text to the top
    BOTTOM:   102, // Align text from the bottom, using the baseline

    // UV Texture coordinate modes
    NORMAL:     1,
    NORMALIZED: 1,
    IMAGE:      2,

    // Text placement modes
    MODEL: 4,
    SHAPE: 5,

    // Stroke modes
    SQUARE:  'butt',
    ROUND:   'round',
    PROJECT: 'square',
    MITER:   'miter',
    BEVEL:   'bevel',

    // Lighting modes
    AMBIENT:     0,
    DIRECTIONAL: 1,
    //POINT:     2, Shared with Shape constant
    SPOT:        3,

    // Key constants

    // Both key and keyCode will be equal to these values
    BACKSPACE: 8,
    TAB:       9,
    ENTER:     10,
    RETURN:    13,
    ESC:       27,
    DELETE:    127,
    CODED:     0xffff,

    // p.key will be CODED and p.keyCode will be this value
    SHIFT:     16,
    CONTROL:   17,
    ALT:       18,
    UP:        38,
    RIGHT:     39,
    DOWN:      40,
    LEFT:      37,

    // Cursor types
    ARROW:    'default',
    CROSS:    'crosshair',
    HAND:     'pointer',
    MOVE:     'move',
    TEXT:     'text',
    WAIT:     'wait',
    NOCURSOR: "url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), auto",

    // Hints
    DISABLE_OPENGL_2X_SMOOTH:     1,
    ENABLE_OPENGL_2X_SMOOTH:     -1,
    ENABLE_OPENGL_4X_SMOOTH:      2,
    ENABLE_NATIVE_FONTS:          3,
    DISABLE_DEPTH_TEST:           4,
    ENABLE_DEPTH_TEST:           -4,
    ENABLE_DEPTH_SORT:            5,
    DISABLE_DEPTH_SORT:          -5,
    DISABLE_OPENGL_ERROR_REPORT:  6,
    ENABLE_OPENGL_ERROR_REPORT:  -6,
    ENABLE_ACCURATE_TEXTURES:     7,
    DISABLE_ACCURATE_TEXTURES:   -7,
    HINT_COUNT:                  10,

    // PJS defined constants
    SINCOS_LENGTH:      parseInt(360 / 0.5, 10),
    PRECISIONB:         15, // fixed point precision is limited to 15 bits!!
    PRECISIONF:         1 << 15,
    PREC_MAXVAL:        (1 << 15) - 1,
    PREC_ALPHA_SHIFT:   24 - 15,
    PREC_RED_SHIFT:     16 - 15,
    NORMAL_MODE_AUTO:   0,
    NORMAL_MODE_SHAPE:  1,
    NORMAL_MODE_VERTEX: 2,
    MAX_LIGHTS:         8
  };

  // Typed Arrays: fallback to WebGL arrays or Native JS arrays if unavailable
  function setupTypedArray(name, fallback) {
    // check if TypedArray exists
    if (typeof this[name] !== "function") {
      // nope.. check if WebGLArray exists
      if (typeof this[fallback] === "function") {
        this[name] = this[fallback];
      } else {
        // nope.. set as Native JS array
        this[name] = function(obj) {
          if (obj instanceof Array) {
            return obj;
          } else if (typeof obj === "number") {
            return new Array(obj);
          }
        };
      }
    }
  }

  setupTypedArray("Float32Array", "WebGLFloatArray");
  setupTypedArray("Uint16Array",  "WebGLUnsignedShortArray");
  setupTypedArray("Uint8Array",   "WebGLUnsignedByteArray");

  var ArrayList = function() {
    function createArrayList(args) {
      var arr = [];
      for (var i = 0; i < args[0]; i++) {
        arr[i] = (args.length > 1 ? createArrayList(args.slice(1)) : 0 );
      }

      arr.get = function(i) {
        return this[i];
      };

      arr.contains = function(item) {
        return this.indexOf(item) !== -1;
      };

      arr.add = function() {
        if (arguments.length === 1) {
          this.push(arguments[0]); // for add(Object)
        } else if (arguments.length === 2) {
          if (typeof arguments[0] === 'number') {
            if (arguments[0] >= 0 && arguments[0] <= this.length) {
              this.splice(arguments[0], 0, arguments[1]); // for add(i, Object)
            } else {
              throw(arguments[0] + " is not a valid index");
            }
          } else {
            throw(typeof arguments[0] + " is not a number");
          }
        } else {
          throw("Please use the proper number of parameters.");
        }
      };

      arr.set = function() {
        if (arguments.length === 2) {
          if (typeof arguments[0] === 'number') {
            if (arguments[0] >= 0 && arguments[0] < this.length) {
              this.splice(arguments[0], 1, arguments[1]);
            } else {
              throw(arguments[0] + " is not a valid index.");
            }
          } else {
            throw(typeof arguments[0] + " is not a number");
          }
        } else {
          throw("Please use the proper number of parameters.");
        }
      };

      arr.size = function() {
        return this.length;
      };

      arr.clear = function() {
        this.length = 0;
      };

      arr.remove = function(i) {
        return this.splice(i, 1)[0];
      };

      arr.isEmpty = function() {
        return !this.length;
      };

      arr.clone = function() {
        return this.slice(0);
      };

      arr.toArray = function() {
        return this.slice(0);
      };

      return arr;
    }

    return createArrayList(Array.prototype.slice.call(arguments));
  };

  var HashMap = (function() {
    function virtHashCode(obj) {
      if (obj.constructor === String) {
        var hash = 0;
        for (var i = 0; i < obj.length; ++i) {
          hash = (hash * 31 + obj.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
      } else if (typeof(obj) !== "object") {
        return obj & 0xFFFFFFFF;
      } else if ("hashCode" in obj) {
        return obj.hashCode.call(obj);
      } else {
        if (obj.$id === undef) {
          obj.$id = ((Math.floor(Math.random() * 0x10000) - 0x8000) << 16) | Math.floor(Math.random() * 0x10000);
        }
        return obj.$id;
      }
    }

    function virtEquals(obj, other) {
      if (obj === null || other === null) {
        return (obj === null) && (other === null);
      } else if (obj.constructor === String) {
        return obj === other;
      } else if (typeof(obj) !== "object") {
        return obj === other;
      } else if ("equals" in obj) {
        return obj.equals.call(obj, other);
      } else {
        return obj === other;
      }
    }

    function HashMap() {
      if (arguments.length === 1 && arguments[0].constructor === HashMap) {
        return arguments[0].clone();
      }

      var initialCapacity = arguments.length > 0 ? arguments[0] : 16;
      var loadFactor = arguments.length > 1 ? arguments[1] : 0.75;
      var buckets = new Array(initialCapacity);
      var count = 0;
      var hashMap = this;

      function ensureLoad() {
        if (count <= loadFactor * buckets.length) {
          return;
        }
        var allEntries = [];
        for (var i = 0; i < buckets.length; ++i) {
          if (buckets[i] !== undef) {
            allEntries = allEntries.concat(buckets[i]);
          }
        }
        buckets = new Array(buckets.length * 2);
        for (var j = 0; j < allEntries.length; ++j) {
          var index = virtHashCode(allEntries[j].key) % buckets.length;
          var bucket = buckets[index];
          if (bucket === undef) {
            buckets[index] = bucket = [];
          }
          bucket.push(allEntries[j]);
        }
      }

      function Iterator(conversion, removeItem) {
        var bucketIndex = 0;
        var itemIndex = -1;
        var endOfBuckets = false;

        function findNext() {
          while (!endOfBuckets) {
            ++itemIndex;
            if (bucketIndex >= buckets.length) {
              endOfBuckets = true;
            } else if (buckets[bucketIndex] === undef || itemIndex >= buckets[bucketIndex].length) {
              itemIndex = -1;
              ++bucketIndex;
            } else {
              return;
            }
          }
        }

        this.hasNext = function() {
          return !endOfBuckets;
        };

        this.next = function() {
          var result = conversion(buckets[bucketIndex][itemIndex]);
          findNext();
          return result;
        };

        this.remove = function() {
          removeItem(this.next());
          --itemIndex;
        };

        findNext();
      }

      function Set(conversion, isIn, removeItem) {
        this.clear = function() {
          hashMap.clear();
        };

        this.contains = function(o) {
          return isIn(o);
        };

        this.containsAll = function(o) {
          var it = o.iterator();
          while (it.hasNext()) {
            if (!this.contains(it.next())) {
              return false;
            }
          }
          return true;
        };

        this.isEmpty = function() {
          return hashMap.isEmpty();
        };

        this.iterator = function() {
          return new Iterator(conversion, removeItem);
        };

        this.remove = function(o) {
          if (this.contains(o)) {
            removeItem(o);
            return true;
          }
          return false;
        };

        this.removeAll = function(c) {
          var it = c.iterator();
          var changed = false;
          while (it.hasNext()) {
            var item = it.next();
            if (this.contains(item)) {
              removeItem(item);
              changed = true;
            }
          }
          return true;
        };

        this.retainAll = function(c) {
          var it = this.iterator();
          var toRemove = [];
          while (it.hasNext()) {
            var entry = it.next();
            if (!c.contains(entry)) {
              toRemove.push(entry);
            }
          }
          for (var i = 0; i < toRemove.length; ++i) {
            removeItem(toRemove[i]);
          }
          return toRemove.length > 0;
        };

        this.size = function() {
          return hashMap.size();
        };

        this.toArray = function() {
          var result = new ArrayList(0);
          var it = this.iterator();
          while (it.hasNext()) {
            result.push(it.next());
          }
          return result;
        };
      }

      function Entry(pair) {
        this._isIn = function(map) {
          return map === hashMap && (pair.removed === undef);
        };

        this.equals = function(o) {
          return virtEquals(pair.key, o.getKey());
        };

        this.getKey = function() {
          return pair.key;
        };

        this.getValue = function() {
          return pair.value;
        };

        this.hashCode = function(o) {
          return virtHashCode(pair.key);
        };

        this.setValue = function(value) {
          var old = pair.value;
          pair.value = value;
          return old;
        };
      }

      this.clear = function() {
        count = 0;
        buckets = new Array(initialCapacity);
      };

      this.clone = function() {
        var map = new HashMap();
        map.putAll(this);
        return map;
      };

      this.containsKey = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return false;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            return true;
          }
        }
        return false;
      };

      this.containsValue = function(value) {
        for (var i = 0; i < buckets.length; ++i) {
          var bucket = buckets[i];
          if (bucket === undef) {
            continue;
          }
          for (var j = 0; j < bucket.length; ++j) {
            if (virtEquals(bucket[j].value, value)) {
              return true;
            }
          }
        }
        return false;
      };

      this.entrySet = function() {
        return new Set(

        function(pair) {
          return new Entry(pair);
        },

        function(pair) {
          return pair.constructor === Entry && pair._isIn(hashMap);
        },

        function(pair) {
          return hashMap.remove(pair.getKey());
        });
      };

      this.get = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            return bucket[i].value;
          }
        }
        return null;
      };

      this.isEmpty = function() {
        return count === 0;
      };

      this.keySet = function() {
        return new Set(

        function(pair) {
          return pair.key;
        },

        function(key) {
          return hashMap.containsKey(key);
        },

        function(key) {
          return hashMap.remove(key);
        });
      };

      this.put = function(key, value) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          ++count;
          buckets[index] = [{
            key: key,
            value: value
          }];
          ensureLoad();
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            var previous = bucket[i].value;
            bucket[i].value = value;
            return previous;
          }
        }
        ++count;
        bucket.push({
          key: key,
          value: value
        });
        ensureLoad();
        return null;
      };

      this.putAll = function(m) {
        var it = m.entrySet().iterator();
        while (it.hasNext()) {
          var entry = it.next();
          this.put(entry.getKey(), entry.getValue());
        }
      };

      this.remove = function(key) {
        var index = virtHashCode(key) % buckets.length;
        var bucket = buckets[index];
        if (bucket === undef) {
          return null;
        }
        for (var i = 0; i < bucket.length; ++i) {
          if (virtEquals(bucket[i].key, key)) {
            --count;
            var previous = bucket[i].value;
            bucket[i].removed = true;
            if (bucket.length > 1) {
              bucket.splice(i, 1);
            } else {
              buckets[index] = undef;
            }
            return previous;
          }
        }
        return null;
      };

      this.size = function() {
        return count;
      };

      this.values = function() {
        var result = new ArrayList(0);
        var it = this.entrySet().iterator();
        while (it.hasNext()) {
          var entry = it.next();
          result.push(entry.getValue());
        }
        return result;
      };
    }

    return HashMap;
  }());

  var PVector = (function() {
    function PVector(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }

    function createPVectorMethod(method) {
      return function(v1, v2) {
        var v = v1.get();
        v[method](v2);
        return v;
      };
    }

    function createSimplePVectorMethod(method) {
      return function(v1, v2) {
        return v1[method](v2);
      };
    }

    var simplePVMethods = "dist dot cross".split(" ");
    var method = simplePVMethods.length;

    PVector.angleBetween = function(v1, v2) {
      return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    };

    // Common vector operations for PVector
    PVector.prototype = {
      set: function(v, y, z) {
        if (arguments.length === 1) {
          this.set(v.x || v[0], v.y || v[1], v.z || v[2]);
        } else {
          this.x = v;
          this.y = y;
          this.z = z;
        }
      },
      get: function() {
        return new PVector(this.x, this.y, this.z);
      },
      mag: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      add: function(v, y, z) {
        if (arguments.length === 3) {
          this.x += v;
          this.y += y;
          this.z += z;
        } else if (arguments.length === 1) {
          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
        }
      },
      sub: function(v, y, z) {
        if (arguments.length === 3) {
          this.x -= v;
          this.y -= y;
          this.z -= z;
        } else if (arguments.length === 1) {
          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
        }
      },
      mult: function(v) {
        if (typeof v === 'number') {
          this.x *= v;
          this.y *= v;
          this.z *= v;
        } else if (typeof v === 'object') {
          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
        }
      },
      div: function(v) {
        if (typeof v === 'number') {
          this.x /= v;
          this.y /= v;
          this.z /= v;
        } else if (typeof v === 'object') {
          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
        }
      },
      dist: function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      },
      dot: function(v, y, z) {
        if (arguments.length === 3) {
          return (this.x * v + this.y * y + this.z * z);
        } else if (arguments.length === 1) {
          return (this.x * v.x + this.y * v.y + this.z * v.z);
        }
      },
      cross: function(v) {
        return new PVector(this.y * v.z - v.y * this.z,
                           this.z * v.x - v.z * this.x,
                           this.x * v.y - v.x * this.y);
      },
      normalize: function() {
        var m = this.mag();
        if (m > 0) {
          this.div(m);
        }
      },
      limit: function(high) {
        if (this.mag() > high) {
          this.normalize();
          this.mult(high);
        }
      },
      heading2D: function() {
        return (-Math.atan2(-this.y, this.x));
      },
      toString: function() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
      },
      array: function() {
        return [this.x, this.y, this.z];
      }
    };

    while (method--) {
      PVector[simplePVMethods[method]] = createSimplePVectorMethod(simplePVMethods[method]);
    }

    for (method in PVector.prototype) {
      if (PVector.prototype.hasOwnProperty(method) && !PVector.hasOwnProperty(method)) {
        PVector[method] = createPVectorMethod(method);
      }
    }

    return PVector;
  }());

  var Processing = this.Processing = function Processing(curElement, aCode) {
    var p = this;

    // Include Package Classes -- do this differently in the future.
    p.ArrayList   = ArrayList;
    p.HashMap     = HashMap;
    p.PVector     = PVector;
    //p.PImage    = PImage;     // TODO
    //p.PShape    = PShape;     // TODO
    //p.PShapeSVG = PShapeSVG;  // TODO

    // PJS specific (non-p5) methods and properties to externalize
    p.externals = {
      canvas:  curElement,
      context: undef,
      sketch:  undef,
      onblur:  function() {},
      onfocus: function() {}
    };

    p.name            = 'Processing.js Instance'; // Set Processing defaults / environment variables
    p.use3DContext    = false; // default '2d' canvas context

    p.focused         = true;
    p.breakShape      = false;

    // Glyph path storage for textFonts
    p.glyphTable      = {};

    // Global vars for tracking mouse position
    p.pmouseX         = 0;
    p.pmouseY         = 0;
    p.mouseX          = 0;
    p.mouseY          = 0;
    p.mouseButton     = 0;
    p.mouseScroll     = 0;

    // Undefined event handlers to be replaced by user when needed
    p.mouseClicked    = undef;
    p.mouseDragged    = undef;
    p.mouseMoved      = undef;
    p.mousePressed    = undef;
    p.mouseReleased   = undef;
    p.mouseScrolled   = undef;
    p.key             = undef;
    p.keyCode         = undef;
    p.keyPressed      = undef;
    p.keyReleased     = undef;
    p.keyTyped        = undef;
    p.draw            = undef;
    p.setup           = undef;

    // Remapped vars
    p.__mousePressed  = false;
    p.__keyPressed    = false;
    p.__frameRate     = 0;

    // The current animation frame
    p.frameCount      = 0;

    // The height/width of the canvas
    p.width           = curElement.width  - 0;
    p.height          = curElement.height - 0;

    p.defineProperty = function(obj, name, desc) {
      if("defineProperty" in Object) {
        Object.defineProperty(obj, name, desc);
      } else {
        if (desc.hasOwnProperty("get")) {
          obj.__defineGetter__(name, desc.get);
        }
        if (desc.hasOwnProperty("set")) {
          obj.__defineSetter__(name, desc.set);
        }
      }
    };

    // "Private" variables used to maintain state
    var curContext,
        curSketch,
        online = true,
        doFill = true,
        fillStyle = [1.0, 1.0, 1.0, 1.0],
        currentFillColor = 0xFFFFFFFF,
        isFillDirty = true,
        doStroke = true,
        strokeStyle = [0.8, 0.8, 0.8, 1.0],
        currentStrokeColor = 0xFFFDFDFD,
        isStrokeDirty = true,
        lineWidth = 1,
        loopStarted = false,
        doLoop = true,
        looping = 0,
        curRectMode = PConstants.CORNER,
        curEllipseMode = PConstants.CENTER,
        normalX = 0,
        normalY = 0,
        normalZ = 0,
        normalMode = PConstants.NORMAL_MODE_AUTO,
        inDraw = false,
        curFrameRate = 60,
        curCursor = PConstants.ARROW,
        oldCursor = curElement.style.cursor,
        curMsPerFrame = 1,
        curShape = PConstants.POLYGON,
        curShapeCount = 0,
        curvePoints = [],
        curTightness = 0,
        curveDet = 20,
        curveInited = false,
        bezDetail = 20,
        colorModeA = 255,
        colorModeX = 255,
        colorModeY = 255,
        colorModeZ = 255,
        pathOpen = false,
        mouseDragging = false,
        curColorMode = PConstants.RGB,
        curTint = function() {},
        curTextSize = 12,
        curTextFont = "Arial",
        getLoaded = false,
        start = new Date().getTime(),
        timeSinceLastFPS = start,
        framesSinceLastFPS = 0,
        textcanvas,
        curveBasisMatrix,
        curveToBezierMatrix,
        curveDrawMatrix,
        bezierDrawMatrix,
        bezierBasisInverse,
        bezierBasisMatrix,
        // Shaders
        programObject3D,
        programObject2D,
        programObjectUnlitShape,
        boxBuffer,
        boxNormBuffer,
        boxOutlineBuffer,
        rectBuffer,
        rectNormBuffer,
        sphereBuffer,
        lineBuffer,
        fillBuffer,
        fillColorBuffer,
        strokeColorBuffer,
        pointBuffer,
        shapeTexVBO,
        canTex,   // texture for createGraphics
        curTexture = {width:0,height:0},
        curTextureMode = PConstants.IMAGE,
        usingTexture = false,
        textBuffer,
        textureBuffer,
        indexBuffer,
        // Text alignment
        horizontalTextAlignment = PConstants.LEFT,
        verticalTextAlignment = PConstants.BASELINE,
        baselineOffset = 0.2, // percent
        tMode = PConstants.MODEL,
        // Pixels cache
        originalContext,
        proxyContext = null,
        isContextReplaced = false,
        setPixelsCached,
        maxPixelsCached = 1000,
        codedKeys = [PConstants.SHIFT, PConstants.CONTROL, PConstants.ALT, PConstants.UP, PConstants.RIGHT, PConstants.DOWN, PConstants.LEFT];

    // Get padding and border style widths for mouse offsets
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

    if (document.defaultView && document.defaultView.getComputedStyle) {
      stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(curElement, null)['paddingLeft'], 10)      || 0;
      stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(curElement, null)['paddingTop'], 10)       || 0;
      styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(curElement, null)['borderLeftWidth'], 10)  || 0;
      styleBorderTop   = parseInt(document.defaultView.getComputedStyle(curElement, null)['borderTopWidth'], 10)   || 0;
    }

    // User can only have MAX_LIGHTS lights
    var lightCount = 0;

    //sphere stuff
    var sphereDetailV = 0,
        sphereDetailU = 0,
        sphereX = [],
        sphereY = [],
        sphereZ = [],
        sinLUT = new Array(PConstants.SINCOS_LENGTH),
        cosLUT = new Array(PConstants.SINCOS_LENGTH),
        sphereVerts,
        sphereNorms;

    // Camera defaults and settings
    var cam,
        cameraInv,
        forwardTransform,
        reverseTransform,
        modelView,
        modelViewInv,
        userMatrixStack,
        inverseCopy,
        projection,
        manipulatingCamera = false,
        frustumMode = false,
        cameraFOV = 60 * (Math.PI / 180),
        cameraX = curElement.width / 2,
        cameraY = curElement.height / 2,
        cameraZ = cameraY / Math.tan(cameraFOV / 2),
        cameraNear = cameraZ / 10,
        cameraFar = cameraZ * 10,
        cameraAspect = curElement.width / curElement.height;

    var vertArray = [],
        curveVertArray = [],
        curveVertCount = 0,
        isCurve = false,
        isBezier = false,
        firstVert = true;

    //PShape stuff
    var curShapeMode = PConstants.CORNER;

    var colors = {
      aliceblue:            "#f0f8ff",
      antiquewhite:         "#faebd7",
      aqua:                 "#00ffff",
      aquamarine:           "#7fffd4",
      azure:                "#f0ffff",
      beige:                "#f5f5dc",
      bisque:               "#ffe4c4",
      black:                "#000000",
      blanchedalmond:       "#ffebcd",
      blue:                 "#0000ff",
      blueviolet:           "#8a2be2",
      brown:                "#a52a2a",
      burlywood:            "#deb887",
      cadetblue:            "#5f9ea0",
      chartreuse:           "#7fff00",
      chocolate:            "#d2691e",
      coral:                "#ff7f50",
      cornflowerblue:       "#6495ed",
      cornsilk:             "#fff8dc",
      crimson:              "#dc143c",
      cyan:                 "#00ffff",
      darkblue:             "#00008b",
      darkcyan:             "#008b8b",
      darkgoldenrod:        "#b8860b",
      darkgray:             "#a9a9a9",
      darkgreen:            "#006400",
      darkkhaki:            "#bdb76b",
      darkmagenta:          "#8b008b",
      darkolivegreen:       "#556b2f",
      darkorange:           "#ff8c00",
      darkorchid:           "#9932cc",
      darkred:              "#8b0000",
      darksalmon:           "#e9967a",
      darkseagreen:         "#8fbc8f",
      darkslateblue:        "#483d8b",
      darkslategray:        "#2f4f4f",
      darkturquoise:        "#00ced1",
      darkviolet:           "#9400d3",
      deeppink:             "#ff1493",
      deepskyblue:          "#00bfff",
      dimgray:              "#696969",
      dodgerblue:           "#1e90ff",
      firebrick:            "#b22222",
      floralwhite:          "#fffaf0",
      forestgreen:          "#228b22",
      fuchsia:              "#ff00ff",
      gainsboro:            "#dcdcdc",
      ghostwhite:           "#f8f8ff",
      gold:                 "#ffd700",
      goldenrod:            "#daa520",
      gray:                 "#808080",
      green:                "#008000",
      greenyellow:          "#adff2f",
      honeydew:             "#f0fff0",
      hotpink:              "#ff69b4",
      indianred:            "#cd5c5c",
      indigo:               "#4b0082",
      ivory:                "#fffff0",
      khaki:                "#f0e68c",
      lavender:             "#e6e6fa",
      lavenderblush:        "#fff0f5",
      lawngreen:            "#7cfc00",
      lemonchiffon:         "#fffacd",
      lightblue:            "#add8e6",
      lightcoral:           "#f08080",
      lightcyan:            "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgrey:            "#d3d3d3",
      lightgreen:           "#90ee90",
      lightpink:            "#ffb6c1",
      lightsalmon:          "#ffa07a",
      lightseagreen:        "#20b2aa",
      lightskyblue:         "#87cefa",
      lightslategray:       "#778899",
      lightsteelblue:       "#b0c4de",
      lightyellow:          "#ffffe0",
      lime:                 "#00ff00",
      limegreen:            "#32cd32",
      linen:                "#faf0e6",
      magenta:              "#ff00ff",
      maroon:               "#800000",
      mediumaquamarine:     "#66cdaa",
      mediumblue:           "#0000cd",
      mediumorchid:         "#ba55d3",
      mediumpurple:         "#9370d8",
      mediumseagreen:       "#3cb371",
      mediumslateblue:      "#7b68ee",
      mediumspringgreen:    "#00fa9a",
      mediumturquoise:      "#48d1cc",
      mediumvioletred:      "#c71585",
      midnightblue:         "#191970",
      mintcream:            "#f5fffa",
      mistyrose:            "#ffe4e1",
      moccasin:             "#ffe4b5",
      navajowhite:          "#ffdead",
      navy:                 "#000080",
      oldlace:              "#fdf5e6",
      olive:                "#808000",
      olivedrab:            "#6b8e23",
      orange:               "#ffa500",
      orangered:            "#ff4500",
      orchid:               "#da70d6",
      palegoldenrod:        "#eee8aa",
      palegreen:            "#98fb98",
      paleturquoise:        "#afeeee",
      palevioletred:        "#d87093",
      papayawhip:           "#ffefd5",
      peachpuff:            "#ffdab9",
      peru:                 "#cd853f",
      pink:                 "#ffc0cb",
      plum:                 "#dda0dd",
      powderblue:           "#b0e0e6",
      purple:               "#800080",
      red:                  "#ff0000",
      rosybrown:            "#bc8f8f",
      royalblue:            "#4169e1",
      saddlebrown:          "#8b4513",
      salmon:               "#fa8072",
      sandybrown:           "#f4a460",
      seagreen:             "#2e8b57",
      seashell:             "#fff5ee",
      sienna:               "#a0522d",
      silver:               "#c0c0c0",
      skyblue:              "#87ceeb",
      slateblue:            "#6a5acd",
      slategray:            "#708090",
      snow:                 "#fffafa",
      springgreen:          "#00ff7f",
      steelblue:            "#4682b4",
      tan:                  "#d2b48c",
      teal:                 "#008080",
      thistle:              "#d8bfd8",
      tomato:               "#ff6347",
      turquoise:            "#40e0d0",
      violet:               "#ee82ee",
      wheat:                "#f5deb3",
      white:                "#ffffff",
      whitesmoke:           "#f5f5f5",
      yellow:               "#ffff00",
      yellowgreen:          "#9acd32"
    };

    // Stores states for pushStyle() and popStyle().
    var styleArray = new Array(0);

    // Vertices are specified in a counter-clockwise order
    // triangles are in this order: back, front, right, bottom, left, top
    var boxVerts = new Float32Array([
       0.5,  0.5, -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
      -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,
       0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,
       0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5,
      -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
      -0.5,  0.5, -0.5, -0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5]);

    var boxOutlineVerts = new Float32Array([
       0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5,
       0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5, -0.5,
      -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,
       0.5, -0.5,  0.5,  0.5, -0.5, -0.5,  0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5]);

    var boxNorms = new Float32Array([
       0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
       0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
       1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
       0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
      -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
       0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0]);

    // These verts are used for the fill and stroke using TRIANGLE_FAN and LINE_LOOP
    var rectVerts = new Float32Array([0,0,0, 0,1,0, 1,1,0, 1,0,0]);

    var rectNorms = new Float32Array([0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1]);

    // Vertex shader for points and lines
    var vShaderSrcUnlitShape =
      "varying vec4 frontColor;" +

      "attribute vec3 aVertex;" +
      "attribute vec4 aColor;" +

      "uniform mat4 uView;" +
      "uniform mat4 uProjection;" +

      "void main(void) {" +
      "  frontColor = aColor;" +
      "  gl_Position = uProjection * uView * vec4(aVertex, 1.0);" +
      "}";

    var fShaderSrcUnlitShape =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +

      "void main(void){" +
      "  gl_FragColor = frontColor;" +
      "}";

    // Vertex shader for points and lines
    var vertexShaderSource2D =
      "varying vec4 frontColor;" +

      "attribute vec3 Vertex;" +
      "attribute vec2 aTextureCoord;" +
      "uniform vec4 color;" +

      "uniform mat4 model;" +
      "uniform mat4 view;" +
      "uniform mat4 projection;" +
      "uniform float pointSize;" +
      "varying vec2 vTextureCoord;"+

      "void main(void) {" +
      "  gl_PointSize = pointSize;" +
      "  frontColor = color;" +
      "  gl_Position = projection * view * model * vec4(Vertex, 1.0);" +
      "  vTextureCoord = aTextureCoord;" +
      "}";

    var fragmentShaderSource2D =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +
      "varying vec2 vTextureCoord;"+

      "uniform sampler2D uSampler;"+
      "uniform int picktype;"+

      "void main(void){" +
      "  if(picktype == 0){"+
      "    gl_FragColor = frontColor;" +
      "  }" +
      "  else if(picktype == 1){"+
      "    float alpha = texture2D(uSampler, vTextureCoord).a;"+
      "    gl_FragColor = vec4(frontColor.rgb*alpha, alpha);\n"+
      "  }"+
      "}";

    // Vertex shader for boxes and spheres
    var vertexShaderSource3D =
      "varying vec4 frontColor;" +

      "attribute vec3 Vertex;" +
      "attribute vec3 Normal;" +
      "attribute vec4 aColor;" +
      "attribute vec2 aTexture;" +
      "varying   vec2 vTexture;" +

      "uniform vec4 color;" +

      "uniform bool usingMat;" +
      "uniform vec3 specular;" +
      "uniform vec3 mat_emissive;" +
      "uniform vec3 mat_ambient;" +
      "uniform vec3 mat_specular;" +
      "uniform float shininess;" +

      "uniform mat4 model;" +
      "uniform mat4 view;" +
      "uniform mat4 projection;" +
      "uniform mat4 normalTransform;" +

      "uniform int lightCount;" +
      "uniform vec3 falloff;" +

      "struct Light {" +
      "  bool dummy;" +
      "  int type;" +
      "  vec3 color;" +
      "  vec3 position;" +
      "  vec3 direction;" +
      "  float angle;" +
      "  vec3 halfVector;" +
      "  float concentration;" +
      "};" +
      "uniform Light lights[8];" +

      "void AmbientLight( inout vec3 totalAmbient, in vec3 ecPos, in Light light ) {" +
      // Get the vector from the light to the vertex
      // Get the distance from the current vector to the light position
      "  float d = length( light.position - ecPos );" +
      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ));" + "  totalAmbient += light.color * attenuation;" +
      "}" +

      "void DirectionalLight( inout vec3 col, in vec3 ecPos, inout vec3 spec, in vec3 vertNormal, in Light light ) {" +
      "  float powerfactor = 0.0;" +
      "  float nDotVP = max(0.0, dot( vertNormal, light.position ));" +
      "  float nDotVH = max(0.0, dot( vertNormal, normalize( light.position-ecPos )));" +

      "  if( nDotVP != 0.0 ){" +
      "    powerfactor = pow( nDotVH, shininess );" +
      "  }" +

      "  col += light.color * nDotVP;" +
      "  spec += specular * powerfactor;" +
      "}" +

      "void PointLight( inout vec3 col, inout vec3 spec, in vec3 vertNormal, in vec3 ecPos, in vec3 eye, in Light light ) {" +
      "  float powerfactor;" +

      // Get the vector from the light to the vertex
      "   vec3 VP = light.position - ecPos;" +

      // Get the distance from the current vector to the light position
      "  float d = length( VP ); " +

      // Normalize the light ray so it can be used in the dot product operation.
      "  VP = normalize( VP );" +

      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ));" +

      "  float nDotVP = max( 0.0, dot( vertNormal, VP ));" +
      "  vec3 halfVector = normalize( VP + eye );" +
      "  float nDotHV = max( 0.0, dot( vertNormal, halfVector ));" +

      "  if( nDotVP == 0.0) {" +
      "    powerfactor = 0.0;" +
      "  }" +
      "  else{" +
      "    powerfactor = pow( nDotHV, shininess );" +
      "  }" +

      "  spec += specular * powerfactor * attenuation;" +
      "  col += light.color * nDotVP * attenuation;" +
      "}" +

      /*
      */
      "void SpotLight( inout vec3 col, inout vec3 spec, in vec3 vertNormal, in vec3 ecPos, in vec3 eye, in Light light ) {" +
      "  float spotAttenuation;" +
      "  float powerfactor;" +

      // calculate the vector from the current vertex to the light.
      "  vec3 VP = light.position - ecPos; " +
      "  vec3 ldir = normalize( light.direction );" +

      // get the distance from the spotlight and the vertex
      "  float d = length( VP );" +
      "  VP = normalize( VP );" +

      "  float attenuation = 1.0 / ( falloff[0] + ( falloff[1] * d ) + ( falloff[2] * d * d ) );" +

      // dot product of the vector from vertex to light and light direction.
      "  float spotDot = dot( VP, ldir );" +

      // if the vertex falls inside the cone
      "  if( spotDot < cos( light.angle ) ) {" +
      "    spotAttenuation = pow( spotDot, light.concentration );" +
      "  }" +
      "  else{" +
      "    spotAttenuation = 1.0;" +
      "  }" +
      "  attenuation *= spotAttenuation;" +

      "  float nDotVP = max( 0.0, dot( vertNormal, VP ));" +
      "  vec3 halfVector = normalize( VP + eye );" +
      "  float nDotHV = max( 0.0, dot( vertNormal, halfVector ));" +

      "  if( nDotVP == 0.0 ) {" +
      "    powerfactor = 0.0;" +
      "  }" +
      "  else {" +
      "    powerfactor = pow( nDotHV, shininess );" +
      "  }" +

      "  spec += specular * powerfactor * attenuation;" +
      "  col += light.color * nDotVP * attenuation;" +
      "}" +

      "void main(void) {" +
      "  vec3 finalAmbient = vec3( 0.0, 0.0, 0.0 );" +
      "  vec3 finalDiffuse = vec3( 0.0, 0.0, 0.0 );" +
      "  vec3 finalSpecular = vec3( 0.0, 0.0, 0.0 );" +

      "  vec4 col = color;" +
      "  if(color[0] == -1.0){" +
      "    col = aColor;" +
      "  }" +

      "  vec3 norm = vec3( normalTransform * vec4( Normal, 0.0 ) );" +

      "  vec4 ecPos4 = view * model * vec4(Vertex,1.0);" +
      "  vec3 ecPos = (vec3(ecPos4))/ecPos4.w;" +
      "  vec3 eye = vec3( 0.0, 0.0, 1.0 );" +

      // If there were no lights this draw call, just use the
      // assigned fill color of the shape and the specular value
      "  if( lightCount == 0 ) {" +
      "    frontColor = col + vec4(mat_specular,1.0);" +
      "  }" +
      "  else {" +
      "    for( int i = 0; i < lightCount; i++ ) {" +
      "      if( lights[i].type == 0 ) {" +
      "        AmbientLight( finalAmbient, ecPos, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 1 ) {" +
      "        DirectionalLight( finalDiffuse,ecPos, finalSpecular, norm, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 2 ) {" +
      "        PointLight( finalDiffuse, finalSpecular, norm, ecPos, eye, lights[i] );" +
      "      }" +
      "      else if( lights[i].type == 3 ) {" +
      "        SpotLight( finalDiffuse, finalSpecular, norm, ecPos, eye, lights[i] );" +
      "      }" +
      "    }" +

      "   if( usingMat == false ) {" +
      "    frontColor = vec4(  " +
      "      vec3(col) * finalAmbient +" +
      "      vec3(col) * finalDiffuse +" +
      "      vec3(col) * finalSpecular," +
      "      col[3] );" +
      "   }" +
      "   else{" +
      "     frontColor = vec4( " +
      "       mat_emissive + " +
      "       (vec3(col) * mat_ambient * finalAmbient) + " +
      "       (vec3(col) * finalDiffuse) + " +
      "       (mat_specular * finalSpecular), " +
      "       col[3] );" +
      "    }" +
      "  }" +
      "  vTexture.xy = aTexture.xy;" +
      "  gl_Position = projection * view * model * vec4( Vertex, 1.0 );" +
      "}";

    var fragmentShaderSource3D =
      "#ifdef GL_ES\n" +
      "precision highp float;\n" +
      "#endif\n" +

      "varying vec4 frontColor;" +

      "uniform sampler2D sampler;" +
      "uniform bool usingTexture;" +
      "varying vec2 vTexture;" +

      // In Processing, when a texture is used, the fill color is ignored
      "void main(void){" +
      "  if(usingTexture){" +
      "    gl_FragColor =  vec4(texture2D(sampler, vTexture.xy));" +
      "  }"+
      "  else{" +
      "    gl_FragColor = frontColor;" +
      "  }" +
      "}";

    ////////////////////////////////////////////////////////////////////////////
    // 3D Functions
    ////////////////////////////////////////////////////////////////////////////

    /*
      Sets the uniform variable 'varName' to the value specified by 'value'.
      Before calling this function, make sure the correct program object
      has been installed as part of the current rendering state.

      On some systems, if the variable exists in the shader but isn't used,
      the compiler will optimize it out and this function will fail.
    */
    function uniformf(programObj, varName, varValue) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (varValue.length === 4) {
          curContext.uniform4fv(varLocation, varValue);
        } else if (varValue.length === 3) {
          curContext.uniform3fv(varLocation, varValue);
        } else if (varValue.length === 2) {
          curContext.uniform2fv(varLocation, varValue);
        } else {
          curContext.uniform1f(varLocation, varValue);
        }
      }
    }

    function uniformi(programObj, varName, varValue) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (varValue.length === 4) {
          curContext.uniform4iv(varLocation, varValue);
        } else if (varValue.length === 3) {
          curContext.uniform3iv(varLocation, varValue);
        } else if (varValue.length === 2) {
          curContext.uniform2iv(varLocation, varValue);
        } else {
          curContext.uniform1i(varLocation, varValue);
        }
      }
    }

    function vertexAttribPointer(programObj, varName, size, VBO) {
      var varLocation = curContext.getAttribLocation(programObj, varName);
      if (varLocation !== -1) {
        curContext.bindBuffer(curContext.ARRAY_BUFFER, VBO);
        curContext.vertexAttribPointer(varLocation, size, curContext.FLOAT, false, 0, 0);
        curContext.enableVertexAttribArray(varLocation);
      }
    }

    function disableVertexAttribPointer(programObj, varName){
      var varLocation = curContext.getAttribLocation(programObj, varName);
      if (varLocation !== -1) {
        curContext.disableVertexAttribArray(varLocation);
      }
    }

    function uniformMatrix(programObj, varName, transpose, matrix) {
      var varLocation = curContext.getUniformLocation(programObj, varName);
      // the variable won't be found if it was optimized out.
      if (varLocation !== -1) {
        if (matrix.length === 16) {
          curContext.uniformMatrix4fv(varLocation, transpose, matrix);
        } else if (matrix.length === 9) {
          curContext.uniformMatrix3fv(varLocation, transpose, matrix);
        } else {
          curContext.uniformMatrix2fv(varLocation, transpose, matrix);
        }
      }
    }

    var imageModeCorner = function imageModeCorner(x, y, w, h, whAreSizes) {
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    };
    var imageModeConvert = imageModeCorner;

    var imageModeCorners = function imageModeCorners(x, y, w, h, whAreSizes) {
      return {
        x: x,
        y: y,
        w: whAreSizes ? w : w - x,
        h: whAreSizes ? h : h - y
      };
    };

    var imageModeCenter = function imageModeCenter(x, y, w, h, whAreSizes) {
      return {
        x: x - w / 2,
        y: y - h / 2,
        w: w,
        h: h
      };
    };

    var createProgramObject = function(curContext, vetexShaderSource, fragmentShaderSource) {
      var vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER);
      curContext.shaderSource(vertexShaderObject, vetexShaderSource);
      curContext.compileShader(vertexShaderObject);
      if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
        throw curContext.getShaderInfoLog(vertexShaderObject);
      }

      var fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER);
      curContext.shaderSource(fragmentShaderObject, fragmentShaderSource);
      curContext.compileShader(fragmentShaderObject);
      if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
        throw curContext.getShaderInfoLog(fragmentShaderObject);
      }

      var programObject = curContext.createProgram();
      curContext.attachShader(programObject, vertexShaderObject);
      curContext.attachShader(programObject, fragmentShaderObject);
      curContext.linkProgram(programObject);
      if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
        throw "Error linking shaders.";
      }

      return programObject;
    };

    ////////////////////////////////////////////////////////////////////////////
    // Char handling
    ////////////////////////////////////////////////////////////////////////////
    var charMap = {};

    var Char = p.Character = function Char(chr) {
      if (typeof chr === 'string' && chr.length === 1) {
        this.code = chr.charCodeAt(0);
      } else {
        this.code = NaN;
      }

      return (charMap[this.code] === undef) ? charMap[this.code] = this : charMap[this.code];
    };

    Char.prototype.toString = function() {
      return String.fromCharCode(this.code);
    };

    Char.prototype.valueOf = function() {
      return this.code;
    };

    ////////////////////////////////////////////////////////////////////////////
    // PShape
    ////////////////////////////////////////////////////////////////////////////
    var PShape = p.PShape = function(family) {
      this.family    = family || PConstants.GROUP;
      this.visible   = true;
      this.style     = true;
      this.children  = [];
      this.nameTable = [];
      this.params    = [];
      this.name      = "";
      this.image     = null;  //type PImage
      this.matrix    = null;
      this.kind      = null;
      this.close     = null;
      this.width     = null;
      this.height    = null;
      this.parent    = null;
      /* methods */
      this.isVisible = function(){
        return this.visible;
      };
      this.setVisible = function (visible){
        this.visible = visible;
      };
      this.disableStyle = function(){
        this.style = false;
        for(var i = 0; i < this.children.length; i++)
        {
          this.children[i].disableStyle();
        }
      };
      this.enableStyle = function(){
        this.style = true;
        for(var i = 0; i < this.children.length; i++)
        {
          this.children[i].enableStyle();
        }
      };
      this.getFamily = function(){
        return this.family;
      };
      this.getWidth = function(){
        return this.width;
      };
      this.getHeight = function(){
        return this.height;
      };
      this.setName = function(name){
        this.name = name;
      };
      this.getName = function(){
        return this.name;
      };
      this.draw = function(){
        if (this.visible) {
          this.pre();
          this.drawImpl();
          this.post();
        }
      };
      this.drawImpl = function(){
        if (this.family === PConstants.GROUP) {
          this.drawGroup();
        } else if (this.family === PConstants.PRIMITIVE) {
          this.drawPrimitive();
        } else if (this.family === PConstants.GEOMETRY) {
          this.drawGeometry();
        } else if (this.family === PConstants.PATH) {
          this.drawPath();
        }
      };
      this.drawPath = function(){
        if (this.vertices.length === 0) { return; }

        p.beginShape();
        var i;
        if (this.vertexCodes.length === 0) {  // each point is a simple vertex
          if (this.vertices[0].length === 2) {  // drawing 2D vertices
            for (i = 0; i < this.vertices.length; i++) {
              p.vertex(this.vertices[i][0], this.vertices[i][1]);
            }
          } else {  // drawing 3D vertices
            for (i = 0; i < this.vertices.length; i++) {
              p.vertex(this.vertices[i][0], this.vertices[i][1], this.vertices[i][2]);
            }
          }
        } else {  // coded set of vertices
          var index = 0;
          var j;
          if (this.vertices[0].length === 2) {  // drawing a 2D path
            for (j = 0; j < this.vertexCodes.length; j++) {
              switch (this.vertexCodes[j]) {
              case PConstants.VERTEX:
                p.vertex(this.vertices[index][0], this.vertices[index][1]);
                if ( this.vertices[index]["moveTo"] === true) {
                  vertArray[vertArray.length-1]["moveTo"] = true;
                } else if ( this.vertices[index]["moveTo"] === false) {
                  vertArray[vertArray.length-1]["moveTo"] = false;
                }
                p.breakShape = false;
                index++;
                break;
              case PConstants.BEZIER_VERTEX:
                p.bezierVertex(this.vertices[index+0][0], this.vertices[index+0][1],
                               this.vertices[index+1][0], this.vertices[index+1][1],
                               this.vertices[index+2][0], this.vertices[index+2][1]);
                index += 3;
                break;
              case PConstants.CURVE_VERTEX:
                p.curveVertex(this.vertices[index][0], this.vertices[index][1]);
                index++;
                break;
              case PConstants.BREAK:
                p.breakShape = true;
                break;
              }
            }
          } else {  // drawing a 3D path
            for (j = 0; j < this.vertexCodes.length; j++) {
              switch (this.vertexCodes[j]) {
                case PConstants.VERTEX:
                  p.vertex(this.vertices[index][0], this.vertices[index][1], this.vertices[index][2]);
                  if (this.vertices[index]["moveTo"] === true) {
                    vertArray[vertArray.length-1]["moveTo"] = true;
                  } else if (this.vertices[index]["moveTo"] === false) {
                    vertArray[vertArray.length-1]["moveTo"] = false;
                  }
                  p.breakShape = false;
                  break;
                case PConstants.BEZIER_VERTEX:
                  p.bezierVertex(this.vertices[index+0][0], this.vertices[index+0][1], this.vertices[index+0][2],
                                 this.vertices[index+1][0], this.vertices[index+1][1], this.vertices[index+1][2],
                                 this.vertices[index+2][0], this.vertices[index+2][1], this.vertices[index+2][2]);
                  index += 3;
                  break;
                case PConstants.CURVE_VERTEX:
                  p.curveVertex(this.vertices[index][0], this.vertices[index][1], this.vertices[index][2]);
                  index++;
                  break;
                case PConstants.BREAK:
                  p.breakShape = true;
                  break;
              }
            }
          }
        }
        p.endShape(this.close ? PConstants.CLOSE : PConstants.OPEN);
      };
      this.drawGeometry = function() {
        p.beginShape(this.kind);
        var i;
        if (this.style) {
          for (i = 0; i < this.vertices.length; i++) {
            p.vertex(this.vertices[i]);
          }
        } else {
          for (i = 0; i < this.vertices.length; i++) {
            var vert = this.vertices[i];
            if (vert[2] === 0) {
              p.vertex(vert[0], vert[1]);
            } else {
              p.vertex(vert[0], vert[1], vert[2]);
            }
          }
        }
        p.endShape();
      };
      this.drawGroup = function() {
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].draw();
        }
      };
      this.drawPrimitive = function() {
        switch (this.kind) {
          case PConstants.POINT:
            p.point(this.params[0], this.params[1]);
            break;
          case PConstants.LINE:
            if (this.params.length === 4) {  // 2D
              p.line(this.params[0], this.params[1],
                     this.params[2], this.params[3]);
            } else {  // 3D
              p.line(this.params[0], this.params[1], this.params[2],
                     this.params[3], this.params[4], this.params[5]);
            }
            break;
          case PConstants.TRIANGLE:
            p.triangle(this.params[0], this.params[1],
                       this.params[2], this.params[3],
                       this.params[4], this.params[5]);
            break;
          case PConstants.QUAD:
            p.quad(this.params[0], this.params[1],
                   this.params[2], this.params[3],
                   this.params[4], this.params[5],
                   this.params[6], this.params[7]);
            break;
          case PConstants.RECT:
            if (this.image !== null) {
              p.imageMode(PConstants.CORNER);
              p.image(this.image, this.params[0], this.params[1], this.params[2], this.params[3]);
            } else {
              p.rectMode(PConstants.CORNER);
              p.rect(this.params[0], this.params[1], this.params[2], this.params[3]);
            }
            break;
          case PConstants.ELLIPSE:
            p.ellipseMode(PConstants.CORNER);
            p.ellipse(this.params[0], this.params[1], this.params[2], this.params[3]);
            break;
          case PConstants.ARC:
            p.ellipseMode(PConstants.CORNER);
            p.arc(this.params[0], this.params[1], this.params[2], this.params[3], this.params[4], this.params[5]);
            break;
          case PConstants.BOX:
            if (this.params.length === 1) {
              p.box(this.params[0]);
            } else {
              p.box(this.params[0], this.params[1], this.params[2]);
            }
            break;
          case PConstants.SPHERE:
            p.sphere(this.params[0]);
            break;
        }
      };
      this.pre = function() {
        if (this.matrix) {
          p.pushMatrix();
          curContext.transform(this.matrix.elements[0], this.matrix.elements[3], this.matrix.elements[1], this.matrix.elements[4], this.matrix.elements[2], this.matrix.elements[5]);
          //p.applyMatrix(this.matrix.elements[0],this.matrix.elements[0]);
        }
        if (this.style) {
          p.pushStyle();
          this.styles();
        }
      };
      this.post = function() {
        if (this.matrix) {
          p.popMatrix();
        }
        if (this.style) {
          p.popStyle();
        }
      };
      this.styles = function() {
        if (this.stroke) {
          p.stroke(this.strokeColor);
          p.strokeWeight(this.strokeWeight);
          p.strokeCap(this.strokeCap);
          p.strokeJoin(this.strokeJoin);
        } else {
          p.noStroke();
        }

        if (this.fill) {
          p.fill(this.fillColor);

        } else {
          p.noFill();
        }
      };

      // return the PShape at the specific index from the children array or
      // return the Phape from a parent shape specified by its name
      this.getChild = function(child) {
        if (typeof child === 'number') {
          return this.children[child];
        } else {
          var found,
              i;
          if(child === "" || this.name === child){
            return this;
          } else {
            if(this.nameTable.length > 0)
            {
              for(i = 0; i < this.nameTable.length || found; i++)
              {
                if(this.nameTable[i].getName === child) {
                  found = this.nameTable[i];
                }
              }
              if (found) { return found; }
            }
            for(i = 0; i < this.children.lenth; i++)
            {
              found = this.children[i].getChild(child);
              if(found) { return found; }
            }
          }
          return null;
        }
      };
      this.getChildCount = function () {
        return this.children.length;
      };
      this.addChild = function( child ) {
        this.children.push(child);
        child.parent = this;
        if (child.getName() !== null) {
          this.addName(child.getName(), child);
        }
      };
      this.addName = function(name,  shape) {
        if (this.parent !== null) {
          this.parent.addName( name, shape );
        } else {
          this.nameTable.push( [name, shape] );
        }
      };
      this.translate = function() {
        if(arguments.length === 2)
        {
          this.checkMatrix(2);
          this.matrix.translate(arguments[0], arguments[1]);
        } else {
          this.checkMatrix(3);
          this.matrix.translate(arguments[0], arguments[1], 0);
        }
      };
      this.checkMatrix = function(dimensions) {
        if(this.matrix === null) {
          if(dimensions === 2) {
            this.matrix = new p.PMatrix2D();
          } else {
            this.matrix = new p.PMatrix3D();
          }
        }else if(dimensions === 3 && this.matrix instanceof p.PMatrix2D) {
          this.matrix = new p.PMatrix3D();
        }
      };
      this.rotateX = function(angle) {
        this.rotate(angle, 1, 0, 0);
      };
      this.rotateY = function(angle) {
        this.rotate(angle, 0, 1, 0);
      };
      this.rotateZ = function(angle) {
        this.rotate(angle, 0, 0, 1);
      };
      this.rotate = function() {
        if(arguments.length === 1){
          this.checkMatrix(2);
          this.matrix.rotate(arguments[0]);
        } else {
          this.checkMatrix(3);
          this.matrix.rotate(arguments[0], arguments[1], arguments[2] ,arguments[3]);
        }
      };
      this.scale = function() {
        if(arguments.length === 2) {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0], arguments[1]);
        } else if (arguments.length === 3) {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0], arguments[1], arguments[2]);
        } else {
          this.checkMatrix(2);
          this.matrix.scale(arguments[0]);
        }
      };
      this.resetMatrix = function() {
        this.checkMatrix(2);
        this.matrix.reset();
      };
      this.applyMatrix = function(matrix) {
        if (arguments.length === 1) {
          this.applyMatrix(matrix.elements[0], matrix.elements[1], 0, matrix.elements[2],
                          matrix.elements[3], matrix.elements[4], 0, matrix.elements[5],
                          0, 0, 1, 0,
                          0, 0, 0, 1);
        } else if (arguments.length === 6) {
          this.checkMatrix(2);
          this.matrix.apply(arguments[0], arguments[1], arguments[2], 0,
                            arguments[3], arguments[4], arguments[5], 0,
                            0,   0,   1,   0,
                            0,   0,   0,   1);

        } else if (arguments.length === 16) {
          this.checkMatrix(3);
          this.matrix.apply(arguments[0], arguments[1], arguments[2], arguments[3],
                            arguments[4], arguments[5], arguments[6], arguments[7],
                            arguments[8], arguments[9], arguments[10], arguments[11],
                            arguments[12], arguments[13], arguments[14], arguments[15]);
        }
      };
      // findChild not in yet
      // apply missing
      // contains missing
      // find child missing
      // getPrimitive missing
      // getParams missing
      // getVertex , getVertexCount missing
      // getVertexCode , getVertexCodes , getVertexCodeCount missing
      // getVertexX, getVertexY, getVertexZ missing

    };

    var PShapeSVG = function() {
      p.PShape.call( this ); // PShape is the base class.
      if (arguments.length === 1) {
        this.element  = new p.XMLElement(null, arguments[0]);
        // set values to their defaults according to the SVG spec
        this.vertexCodes         = [];
        this.vertices            = [];
        this.opacity             = 1;

        this.stroke              = false;
        this.strokeColor         = PConstants.ALPHA_MASK;
        this.strokeWeight        = 1;
        this.strokeCap           = PConstants.SQUARE;  // equivalent to BUTT in svg spec
        this.strokeJoin          = PConstants.MITER;
        this.strokeGradient      = null;
        this.strokeGradientPaint = null;
        this.strokeName          = null;
        this.strokeOpacity       = 1;

        this.fill                = true;
        this.fillColor           = PConstants.ALPHA_MASK;
        this.fillGradient        = null;
        this.fillGradientPaint   = null;
        this.fillName            = null;
        this.fillOpacity         = 1;

        if (this.element.getName() !== "svg") {
          throw("root is not <svg>, it's <" + this.element.getName() + ">");
        }
      }
      else if (arguments.length === 2) {
        if (typeof arguments[1] === 'string') {
          if (arguments[1].indexOf(".svg") > -1) { //its a filename
            this.element = new p.XMLElement(null, arguments[1]);
            // set values to their defaults according to the SVG spec
            this.vertexCodes         = [];
            this.vertices            = [];
            this.opacity             = 1;

            this.stroke              = false;
            this.strokeColor         = PConstants.ALPHA_MASK;
            this.strokeWeight        = 1;
            this.strokeCap           = PConstants.SQUARE;  // equivalent to BUTT in svg spec
            this.strokeJoin          = PConstants.MITER;
            this.strokeGradient      = "";
            this.strokeGradientPaint = "";
            this.strokeName          = "";
            this.strokeOpacity       = 1;

            this.fill                = true;
            this.fillColor           = PConstants.ALPHA_MASK;
            this.fillGradient        = null;
            this.fillGradientPaint   = null;
            this.fillOpacity         = 1;

          }
        } else { // XMLElement
          if (arguments[0]) { // PShapeSVG
            this.element             = arguments[1];
            this.vertexCodes         = arguments[0].vertexCodes.slice();
            this.vertices            = arguments[0].vertices.slice();

            this.stroke              = arguments[0].stroke;
            this.strokeColor         = arguments[0].strokeColor;
            this.strokeWeight        = arguments[0].strokeWeight;
            this.strokeCap           = arguments[0].strokeCap;
            this.strokeJoin          = arguments[0].strokeJoin;
            this.strokeGradient      = arguments[0].strokeGradient;
            this.strokeGradientPaint = arguments[0].strokeGradientPaint;
            this.strokeName          = arguments[0].strokeName;

            this.fill                = arguments[0].fill;
            this.fillColor           = arguments[0].fillColor;
            this.fillGradient        = arguments[0].fillGradient;
            this.fillGradientPaint   = arguments[0].fillGradientPaint;
            this.fillName            = arguments[0].fillName;
            this.strokeOpacity       = arguments[0].strokeOpacity;
            this.fillOpacity         = arguments[0].fillOpacity;
            this.opacity             = arguments[0].opacity;
          }
        }
      }

      this.name      = this.element.getStringAttribute("id");
      var displayStr = this.element.getStringAttribute("display", "inline");
      this.visible   = displayStr !== "none";
      var str = this.element.getAttribute("transform");
      if (str) {
        this.matrix = this.parseMatrix(str);
      }
      // not proper parsing of the viewBox, but will cover us for cases where
      // the width and height of the object is not specified
      var viewBoxStr = this.element.getStringAttribute("viewBox");
      if ( viewBoxStr !== null ) {
        var viewBox = viewBoxStr.split(" ");
        this.width  = viewBox[2];
        this.height = viewBox[3];
      }

      // TODO if viewbox is not same as width/height, then use it to scale
      // the original objects. for now, viewbox only used when width/height
      // are empty values (which by the spec means w/h of "100%"
      var unitWidth  = this.element.getStringAttribute("width");
      var unitHeight = this.element.getStringAttribute("height");
      if (unitWidth !== null) {
        this.width  = this.parseUnitSize(unitWidth);
        this.height = this.parseUnitSize(unitHeight);
      } else {
        if ((this.width === 0) || (this.height === 0)) {
          // For the spec, the default is 100% and 100%. For purposes
          // here, insert a dummy value because this is prolly just a
          // font or something for which the w/h doesn't matter.
          this.width  = 1;
          this.height = 1;

          //show warning
          throw("The width and/or height is not " +
                                "readable in the <svg> tag of this file.");
        }
      }
      this.parseColors(this.element);
      this.parseChildren(this.element);

    };

    PShapeSVG.prototype = {
      // getChild missing
      // print missing
      // parse style attributes
      // styles missing but deals with strokeGradient and fillGradient
      parseMatrix: function(str) {
        this.checkMatrix(2);
        var pieces = [];
        str.replace(/\s*(\w+)\((.*?)\)/g, function(all) {
          // get a list of transform definitions
          pieces.push(p.trim(all));
        });
        if (pieces.length === 0) {
          p.println("Transformation:" + str + " is empty");
          return null;
        }
        for (var i =0; i< pieces.length; i++) {
          var m = [];
          pieces[i].replace(/\((.*?)\)/, (function() {
            return function(all, params) {
              // get the coordinates that can be separated by spaces or a comma
              m = params.replace(/,+/g, " ").split(/\s+/);
            };
          }()));

          if (pieces[i].indexOf("matrix") !== -1) {
            this.matrix.set(m[0], m[2], m[4], m[1], m[3], m[5]);
          } else if (pieces[i].indexOf("translate") !== -1) {
            var tx = m[0];
            var ty = (m.length === 2) ? m[1] : 0;
            this.matrix.translate(tx,ty);
          } else if (pieces[i].indexOf("scale") !== -1) {
            var sx = m[0];
            var sy = (m.length === 2) ? m[1] : m[0];
            this.matrix.scale(sx,sy);
          } else if (pieces[i].indexOf("rotate") !== -1) {
            var angle = m[0];
            if (m.length === 1) {
              this.matrix.rotate(p.radians(angle));
            } else if (m.length === 3) {
              this.matrix.translate(m[1], m[2]);
              this.matrix.rotate(p.radians(m[0]));
              this.matrix.translate(-m[1], -m[2]);
            }
          } else if (pieces[i].indexOf("skewX") !== -1) {
            this.matrix.skewX(parseFloat(m[0]));
          } else if (pieces[i].indexOf("skewY") !== -1) {
            this.matrix.skewY(m[0]);
          }
        }
        return this.matrix;
      },
      parseChildren:function(element) {
        var newelement = element.getChildren();
        var children   = new p.PShape();
        for (var i = 0; i < newelement.length; i++) {
          var kid = this.parseChild(newelement[i]);
          if (kid) {
            children.addChild(kid);
          }
        }
        this.children.push(children);
      },
      getName: function() {
        return this.name;
      },
      parseChild: function( elem ) {
        var name = elem.getName();
        var shape;
        switch (name) {
          case "g":
            shape = new PShapeSVG(this, elem);
            break;
          case "defs":
            // generally this will contain gradient info, so may
            // as well just throw it into a group element for parsing
            shape = new PShapeSVG(this, elem);
            break;
          case "line":
            shape = new PShapeSVG(this, elem);
            shape.parseLine();
            break;
          case "circle":
            shape = new PShapeSVG(this, elem);
            shape.parseEllipse(true);
            break;
          case "ellipse":
            shape = new PShapeSVG(this, elem);
            shape.parseEllipse(false);
            break;
          case "rect":
            shape = new PShapeSVG(this, elem);
            shape.parseRect();
            break;
          case "polygon":
            shape = new PShapeSVG(this, elem);
            shape.parsePoly(true);
            break;
          case "polyline":
            shape = new PShapeSVG(this, elem);
            shape.parsePoly(false);
            break;
          case "path":
            shape = new PShapeSVG(this, elem);
            shape.parsePath();
            break;
          case "radialGradient":
            //return new RadialGradient(this, elem);
            break;
          case "linearGradient":
            //return new LinearGradient(this, elem);
            break;
          case "text":
            p.println("Text in SVG files is not currently supported, convert text to outlines instead." );
            break;
          case "filter":
            p.println("Filters are not supported.");
            break;
          case "mask":
            p.println("Masks are not supported.");
            break;
          default:
            p.println("Ignoring  <" + name + "> tag.");
            break;
        }
        return shape;
      },
      parsePath: function() {
        this.family = PConstants.PATH;
        this.kind = 0;
        var pathDataChars = [];
        var c;
        var pathData = p.trim(this.element.getStringAttribute("d").replace(/[\s,]+/g,' ')); //change multiple spaces and commas to single space
        if (pathData === null) { return; }
        pathData = pathData.toCharArray();
        var cx     = 0,
            cy     = 0,
            ctrlX  = 0,
            ctrlY  = 0,
            ctrlX1 = 0,
            ctrlX2 = 0,
            ctrlY1 = 0,
            ctrlY2 = 0,
            endX   = 0,
            endY   = 0,
            ppx    = 0,
            ppy    = 0,
            px     = 0,
            py     = 0,
            i      = 0,
            j      = 0,
            valOf  = 0;
        var str = "";
        var tmpArray =[];
        var flag = false;
        var lastInstruction;
        var command;
        while (i< pathData.length) {
          valOf = pathData[i].valueOf();
          if ((valOf >= 65 && valOf <= 90) || (valOf >= 97 && valOf <= 122)) { // if its a letter
            // populate the tmpArray with coordinates
            j = i;
            i++;
            if (i < pathData.length) { // dont go over boundary of array
              tmpArray = [];
              valOf = pathData[i].valueOf();
              while (!((valOf >= 65 && valOf <= 90) || (valOf >= 97 && valOf <= 100) || (valOf >= 102 && valOf <= 122)) && flag === false) { // if its NOT a letter
                if (valOf === 32) { //if its a space and the str isn't empty
                  // somethimes you get a space after the letter
                  if (str !== "") {
                    tmpArray.push(parseFloat(str));
                    str = "";
                  }
                  i++;
                } else if (valOf === 45) { //if its a -
                  // allow for 'e' notation in numbers, e.g. 2.10e-9
                  if (pathData[i-1].valueOf() === 101) {
                    str += pathData[i].toString();
                    i++;
                  } else {
                    // sometimes no space separator after (ex: 104.535-16.322)
                    if (str !== "") {
                      tmpArray.push(parseFloat(str));
                    }
                    str = pathData[i].toString();
                    i++;
                  }
                } else {
                  str += pathData[i].toString();
                  i++;
                }
                if (i === pathData.length) { // dont go over boundary of array
                  flag = true;
                } else {
                  valOf = pathData[i].valueOf();
                }
              }
            }
            if (str !== "") {
              tmpArray.push(parseFloat(str));
              str = "";
            }
            command = pathData[j];
            switch (command.valueOf()) {
              case 77:  // M - move to (absolute)
                if (tmpArray.length >= 2 && tmpArray.length % 2 ===0) { // need one+ pairs of co-ordinates
                  cx = tmpArray[0];
                  cy = tmpArray[1];
                  this.parsePathMoveto(cx, cy);
                  if (tmpArray.length > 2) {
                    for (j = 2; j < tmpArray.length; j+=2) {
                      // absolute line to
                      cx = tmpArray[j];
                      cy = tmpArray[j+1];
                      this.parsePathLineto(cx,cy);
                    }
                  }
                }
                break;
              case 109:  // m - move to (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  this.parsePathMoveto(cx,cy);
                  if (tmpArray.length > 2) {
                    for (j = 2; j < tmpArray.length; j+=2) {
                      // relative line to
                      cx += tmpArray[j];
                      cy += tmpArray[j + 1];
                      this.parsePathLineto(cx,cy);
                    }
                  }
                }
                break;
              case 76: // L - lineto (absolute)
              if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                for (j = 0; j < tmpArray.length; j+=2) {
                  cx = tmpArray[j];
                  cy = tmpArray[j + 1];
                  this.parsePathLineto(cx,cy);
                }
              }
              break;

              case 108: // l - lineto (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    cx += tmpArray[j];
                    cy += tmpArray[j+1];
                    this.parsePathLineto(cx,cy);
                  }
                }
                break;

              case 72: // H - horizontal lineto (absolute)
                for (j = 0; j < tmpArray.length; j++) { // multiple x co-ordinates can be provided
                  cx = tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 104: // h - horizontal lineto (relative)
                for (j = 0; j < tmpArray.length; j++) { // multiple x co-ordinates can be provided
                  cx += tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 86: // V - vertical lineto (absolute)
                for (j = 0; j < tmpArray.length; j++) { // multiple y co-ordinates can be provided
                  cy = tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 118: // v - vertical lineto (relative)
                for (j = 0; j < tmpArray.length; j++) { // multiple y co-ordinates can be provided
                  cy += tmpArray[j];
                  this.parsePathLineto(cx, cy);
                }
                break;

              case 67: // C - curve to (absolute)
                if (tmpArray.length >= 6 && tmpArray.length % 6 === 0) { // need one+ multiples of 6 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=6) {
                    ctrlX1 = tmpArray[j];
                    ctrlY1 = tmpArray[j + 1];
                    ctrlX2 = tmpArray[j + 2];
                    ctrlY2 = tmpArray[j + 3];
                    endX   = tmpArray[j + 4];
                    endY   = tmpArray[j + 5];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 99: // c - curve to (relative)
                if (tmpArray.length >= 6 && tmpArray.length % 6 === 0) { // need one+ multiples of 6 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=6) {
                    ctrlX1 = cx + tmpArray[j];
                    ctrlY1 = cy + tmpArray[j + 1];
                    ctrlX2 = cx + tmpArray[j + 2];
                    ctrlY2 = cy + tmpArray[j + 3];
                    endX   = cx + tmpArray[j + 4];
                    endY   = cy + tmpArray[j + 5];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 83: // S - curve to shorthand (absolute)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    if (lastInstruction.toLowerCase() ===  "c" || lastInstruction.toLowerCase() ===  "s") {
                      ppx    = this.vertices[ this.vertices.length-2 ][0];
                      ppy    = this.vertices[ this.vertices.length-2 ][1];
                      px     = this.vertices[ this.vertices.length-1 ][0];
                      py     = this.vertices[ this.vertices.length-1 ][1];
                      ctrlX1 = px + (px - ppx);
                      ctrlY1 = py + (py - ppy);
                    } else {
                      //If there is no previous curve, the current point will be used as the first control point.
                      ctrlX1 = this.vertices[this.vertices.length-1][0];
                      ctrlY1 = this.vertices[this.vertices.length-1][1];
                    }
                    ctrlX2 = tmpArray[j];
                    ctrlY2 = tmpArray[j + 1];
                    endX   = tmpArray[j + 2];
                    endY   = tmpArray[j + 3];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 115: // s - curve to shorthand (relative)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    if (lastInstruction.toLowerCase() ===  "c" || lastInstruction.toLowerCase() ===  "s") {
                      ppx    = this.vertices[this.vertices.length-2][0];
                      ppy    = this.vertices[this.vertices.length-2][1];
                      px     = this.vertices[this.vertices.length-1][0];
                      py     = this.vertices[this.vertices.length-1][1];
                      ctrlX1 = px + (px - ppx);
                      ctrlY1 = py + (py - ppy);
                    } else {
                      //If there is no previous curve, the current point will be used as the first control point.
                      ctrlX1 = this.vertices[this.vertices.length-1][0];
                      ctrlY1 = this.vertices[this.vertices.length-1][1];
                    }
                    ctrlX2 = cx + tmpArray[j];
                    ctrlY2 = cy + tmpArray[j + 1];
                    endX   = cx + tmpArray[j + 2];
                    endY   = cy + tmpArray[j + 3];
                    this.parsePathCurveto(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 81: // Q - quadratic curve to (absolute)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    ctrlX = tmpArray[j];
                    ctrlY = tmpArray[j + 1];
                    endX  = tmpArray[j + 2];
                    endY  = tmpArray[j + 3];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 113: // q - quadratic curve to (relative)
                if (tmpArray.length >= 4 && tmpArray.length % 4 === 0) { // need one+ multiples of 4 co-ordinates
                  for (j = 0; j < tmpArray.length; j+=4) {
                    ctrlX = cx + tmpArray[j];
                    ctrlY = cy + tmpArray[j + 1];
                    endX  = cx + tmpArray[j + 2];
                    endY  = cy + tmpArray[j + 3];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 84: // T - quadratic curve to shorthand (absolute)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    if (lastInstruction.toLowerCase() ===  "q" || lastInstruction.toLowerCase() ===  "t") {
                      ppx   = this.vertices[this.vertices.length-2][0];
                      ppy   = this.vertices[this.vertices.length-2][1];
                      px    = this.vertices[this.vertices.length-1][0];
                      py    = this.vertices[this.vertices.length-1][1];
                      ctrlX = px + (px - ppx);
                      ctrlY = py + (py - ppy);
                    } else {
                      // If there is no previous command or if the previous command was not a Q, q, T or t,
                      // assume the control point is coincident with the current point.
                      ctrlX = cx;
                      ctrlY = cy;
                    }
                    endX  = tmpArray[j];
                    endY  = tmpArray[j + 1];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 116:  // t - quadratic curve to shorthand (relative)
                if (tmpArray.length >= 2 && tmpArray.length % 2 === 0) { // need one+ pairs of co-ordinates
                  for (j = 0; j < tmpArray.length; j+=2) {
                    if (lastInstruction.toLowerCase() ===  "q" || lastInstruction.toLowerCase() ===  "t") {
                      ppx   = this.vertices[this.vertices.length-2][0];
                      ppy   = this.vertices[this.vertices.length-2][1];
                      px    = this.vertices[this.vertices.length-1][0];
                      py    = this.vertices[this.vertices.length-1][1];
                      ctrlX = px + (px - ppx);
                      ctrlY = py + (py - ppy);
                    } else {
                      // If there is no previous command or if the previous command was not a Q, q, T or t,
                      // assume the control point is coincident with the current point.
                      ctrlX = cx;
                      ctrlY = cy;
                    }
                    endX  = cx + tmpArray[j];
                    endY  = cy + tmpArray[j + 1];
                    this.parsePathQuadto(cx, cy, ctrlX, ctrlY, endX, endY);
                    cx = endX;
                    cy = endY;
                  }
                }
                break;

              case 90: //Z
              case 122: //z
                this.close = true;
                break;
            }
            lastInstruction = command.toString();
          } else { i++;}
        }
      },
      parsePathQuadto: function(x1, y1, cx, cy, x2, y2) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BEZIER_VERTEX);
          // x1/y1 already covered by last moveto, lineto, or curveto
          this.parsePathVertex(x1 + ((cx-x1)*2/3), y1 + ((cy-y1)*2/3));
          this.parsePathVertex(x2 + ((cx-x2)*2/3), y2 + ((cy-y2)*2/3));
          this.parsePathVertex(x2, y2);
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathCurveto : function(x1,  y1, x2, y2, x3, y3) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BEZIER_VERTEX );
          this.parsePathVertex(x1, y1);
          this.parsePathVertex(x2, y2);
          this.parsePathVertex(x3, y3);
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathLineto: function(px, py) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.VERTEX);
          this.parsePathVertex(px, py);
          // add property to distinguish between curContext.moveTo or curContext.lineTo
          this.vertices[this.vertices.length-1]["moveTo"] = false;
        } else {
          throw ("Path must start with M/m");
        }
      },
      parsePathMoveto: function(px, py) {
        if (this.vertices.length > 0) {
          this.parsePathCode(PConstants.BREAK);
        }
        this.parsePathCode(PConstants.VERTEX);
        this.parsePathVertex(px, py);
        // add property to distinguish between curContext.moveTo or curContext.lineTo
        this.vertices[this.vertices.length-1]["moveTo"] = true;
      },
      parsePathVertex: function(x,  y) {
        var verts = [];
        verts[0]  = x;
        verts[1]  = y;
        this.vertices.push(verts);
      },
      parsePathCode: function(what) {
        this.vertexCodes.push(what);
      },
      parsePoly: function(val) {
        this.family    = PConstants.PATH;
        this.close     = val;
        var pointsAttr = p.trim(this.element.getStringAttribute("points").replace(/[,\s]+/g,' '));
        if (pointsAttr !== null) {
          //split into array
          var pointsBuffer = pointsAttr.split(" ");
          if (pointsBuffer.length % 2 === 0) {
            for (var i = 0; i < pointsBuffer.length; i++) {
              var verts = [];
              verts[0]  = pointsBuffer[i];
              verts[1]  = pointsBuffer[++i];
              this.vertices.push(verts);
            }
          } else {
            p.println("Error parsing polygon points: odd number of coordinates provided");
          }
        }
      },
      parseRect: function() {
        this.kind      = PConstants.RECT;
        this.family    = PConstants.PRIMITIVE;
        this.params    = [];
        this.params[0] = this.element.getFloatAttribute("x");
        this.params[1] = this.element.getFloatAttribute("y");
        this.params[2] = this.element.getFloatAttribute("width");
        this.params[3] = this.element.getFloatAttribute("height");

      },
      parseEllipse: function(val) {
        this.kind   = PConstants.ELLIPSE;
        this.family = PConstants.PRIMITIVE;
        this.params = [];

        this.params[0] = this.element.getFloatAttribute("cx");
        this.params[1] = this.element.getFloatAttribute("cy");

        var rx, ry;
        if (val) {
          rx = ry = this.element.getFloatAttribute("r");
        } else {
          rx = this.element.getFloatAttribute("rx");
          ry = this.element.getFloatAttribute("ry");
        }
        this.params[0] -= rx;
        this.params[1] -= ry;

        this.params[2] = rx*2;
        this.params[3] = ry*2;
      },
      parseLine: function() {
        this.kind = PConstants.LINE;
        this.family = PConstants.PRIMITIVE;
        this.params = [];
        this.params[0] = this.element.getFloatAttribute("x1");
        this.params[1] = this.element.getFloatAttribute("y1");
        this.params[2] = this.element.getFloatAttribute("x2");
        this.params[3] = this.element.getFloatAttribute("y2");
      },
      parseColors: function(element) {
        if (element.hasAttribute("opacity")) {
          this.setOpacity(element.getAttribute("opacity"));
        }
        if (element.hasAttribute("stroke")) {
          this.setStroke(element.getAttribute("stroke"));
        }
        if (element.hasAttribute("stroke-width")) {
          // if NaN (i.e. if it's 'inherit') then default back to the inherit setting
          this.setStrokeWeight(element.getAttribute("stroke-width"));
        }
        if (element.hasAttribute("stroke-linejoin") ) {
          this.setStrokeJoin(element.getAttribute("stroke-linejoin"));
        }
        if (element.hasAttribute("stroke-linecap")) {
          this.setStrokeCap(element.getStringAttribute("stroke-linecap"));
        }
        // fill defaults to black (though stroke defaults to "none")
        // http://www.w3.org/TR/SVG/painting.html#FillProperties
        if (element.hasAttribute("fill")) {
          this.setFill(element.getStringAttribute("fill"));
        }
        if (element.hasAttribute("style")) {
          var styleText   = element.getStringAttribute("style");
          var styleTokens = styleText.toString().split( ";" );

          for (var i = 0; i < styleTokens.length; i++) {
            var tokens = p.trim(styleTokens[i].split( ":" ));
            switch(tokens[0]){
              case "fill":
                this.setFill(tokens[1]);
                break;
              case "fill-opacity":

                this.setFillOpacity(tokens[1]);

                break;
              case "stroke":
                this.setStroke(tokens[1]);
                break;
              case "stroke-width":
                this.setStrokeWeight(tokens[1]);
                break;
              case "stroke-linecap":
                this.setStrokeCap(tokens[1]);
                break;
              case "stroke-linejoin":
                this.setStrokeJoin(tokens[1]);
                break;
              case "stroke-opacity":
                this.setStrokeOpacity(tokens[1]);
                break;
              case "opacity":
                this.setOpacity(tokens[1]);
                break;
              // Other attributes are not yet implemented
            }
          }
        }
      },
      setFillOpacity: function(opacityText) {
        this.fillOpacity = parseFloat(opacityText);
        this.fillColor   = this.fillOpacity * 255  << 24 | this.fillColor & 0xFFFFFF;
      },
      setFill: function (fillText) {
        var opacityMask = this.fillColor & 0xFF000000;
        if (fillText === "none") {
          this.fill = false;
        } else if (fillText.indexOf("#") === 0) {
          this.fill      = true;
          this.fillColor = opacityMask | (parseInt(fillText.substring(1), 16 )) & 0xFFFFFF;
        } else if (fillText.indexOf("rgb") === 0) {
          this.fill      = true;
          this.fillColor = opacityMask | this.parseRGB(fillText);
        } else if (fillText.indexOf("url(#") === 0) {
          this.fillName = fillText.substring(5, fillText.length - 1 );
          /*Object fillObject = findChild(fillName);
          if (fillObject instanceof Gradient) {
            fill = true;
            fillGradient = (Gradient) fillObject;
            fillGradientPaint = calcGradientPaint(fillGradient); //, opacity);
          } else {
            System.err.println("url " + fillName + " refers to unexpected data");
          }*/
        } else {
          if (colors[fillText]) {
            this.fill      = true;
            this.fillColor = opacityMask | (parseInt(colors[fillText].substring(1), 16)) & 0xFFFFFF;
          }
        }
      },
      setOpacity: function(opacity) {
        this.strokeColor = parseFloat(opacity) * 255 << 24 | this.strokeColor & 0xFFFFFF;
        this.fillColor   = parseFloat(opacity) * 255 << 24 | this.fillColor & 0xFFFFFF;
      },
      setStroke: function(strokeText) {
        var opacityMask = this.strokeColor & 0xFF000000;
        if (strokeText === "none") {
          this.stroke = false;
        } else if (strokeText.charAt( 0 ) === "#") {
          this.stroke      = true;
          this.strokeColor = opacityMask | (parseInt( strokeText.substring( 1 ), 16 )) & 0xFFFFFF;
        } else if (strokeText.indexOf( "rgb" ) === 0 ) {
          this.stroke = true;
          this.strokeColor = opacityMask | this.parseRGB(strokeText);
        } else if (strokeText.indexOf( "url(#" ) === 0) {
          this.strokeName = strokeText.substring(5, strokeText.length - 1);
            //this.strokeObject = findChild(strokeName);
          /*if (strokeObject instanceof Gradient) {
            strokeGradient = (Gradient) strokeObject;
            strokeGradientPaint = calcGradientPaint(strokeGradient); //, opacity);
          } else {
            System.err.println("url " + strokeName + " refers to unexpected data");
          }*/
        } else {
          if (colors[strokeText]){
            this.stroke      = true;
            this.strokeColor = opacityMask | (parseInt(colors[strokeText].substring(1), 16)) & 0xFFFFFF;
          }
        }
      },
      setStrokeWeight: function(weight) {
        this.strokeWeight = this.parseUnitSize(weight);
      },
      setStrokeJoin: function(linejoin) {
        if (linejoin === "miter") {
          this.strokeJoin = PConstants.MITER;

        } else if (linejoin === "round") {
          this.strokeJoin = PConstants.ROUND;

        } else if (linejoin === "bevel") {
          this.strokeJoin = PConstants.BEVEL;
        }
      },
      setStrokeCap: function (linecap) {
        if (linecap === "butt") {
          this.strokeCap = PConstants.SQUARE;

        } else if (linecap === "round") {
          this.strokeCap = PConstants.ROUND;

        } else if (linecap === "square") {
          this.strokeCap = PConstants.PROJECT;
        }
      },
      setStrokeOpacity: function (opacityText) {
        this.strokeOpacity = parseFloat(opacityText);
        this.strokeColor   = this.strokeOpacity * 255 << 24 | this.strokeColor & 0xFFFFFF;
      },
      parseRGB: function(color) {
        var sub    = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
        var values = sub.split(", ");
        return (values[0] << 16) | (values[1] << 8) | (values[2]);
      },
      parseUnitSize: function (text) {
        var len = text.length - 2;
        if (len < 0) { return text; }
        if (text.indexOf("pt") === len) {
          return parseFloat(text.substring(0, len)) * 1.25;
        } else if (text.indexOf("pc") === len) {
          return parseFloat( text.substring( 0, len)) * 15;
        } else if (text.indexOf("mm") === len) {
          return parseFloat( text.substring(0, len)) * 3.543307;
        } else if (text.indexOf("cm") === len) {
          return parseFloat(text.substring(0, len)) * 35.43307;
        } else if (text.indexOf("in") === len) {
          return parseFloat(text.substring(0, len)) * 90;
        } else if (text.indexOf("px") === len) {
          return parseFloat(text.substring(0, len));
        } else {
          return parseFloat(text);
        }
      }
    };

    p.shape = function(shape, x, y, width, height) {
      if (arguments.length >= 1 && arguments[0] !== null) {
        if (shape.isVisible()) {
          p.pushMatrix();
          if (curShapeMode === PConstants.CENTER) {
            if (arguments.length === 5) {
              p.translate(x - width/2, y - height/2);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x - shape.getWidth()/2, - shape.getHeight()/2);
            } else {
              p.translate(-shape.getWidth()/2, -shape.getHeight()/2);
            }
          } else if (curShapeMode === PConstants.CORNER) {
            if (arguments.length === 5) {
              p.translate(x, y);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x, y);
            }
          } else if (curShapeMode === PConstants.CORNERS) {
            if (arguments.length === 5) {
              width  -= x;
              height -= y;
              p.translate(x, y);
              p.scale(width / shape.getWidth(), height / shape.getHeight());
            } else if (arguments.length === 3) {
              p.translate(x, y);
            }
          }
          shape.draw();
          if ((arguments.length === 1 && curShapeMode === PConstants.CENTER ) || arguments.length > 1) {
            p.popMatrix();
          }
        }
      }
    };

    p.shapeMode = function (mode) {
      curShapeMode = mode;
    };

    p.loadShape = function (filename) {
      if (arguments.length === 1) {
        if (filename.indexOf(".svg") > -1) {
          return new PShapeSVG(null, filename);
        }
      }
      return null;
    };


    ////////////////////////////////////////////////////////////////////////////
    // XMLAttribute
    ////////////////////////////////////////////////////////////////////////////
    var XMLAttribute = function(fname, n, nameSpace, v, t){
      this.fullName = fname || "";
      this.name = n || "";
      this.namespace = nameSpace || "";
      this.value = v;
      this.type = t;
    };
    XMLAttribute.prototype = {
      getName: function() {
        return this.name;
      },
      getFullName: function() {
        return this.fullName;
      },
      getNamespace: function() {
        return this.namespace;
      },
      getValue: function() {
        return this.value;
      },
      getType: function() {
        return this.type;
      },
      setValue: function(newval) {
        this.value = newval;
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // XMLElement
    ////////////////////////////////////////////////////////////////////////////
    var XMLElement = p.XMLElement = function() {
      if (arguments.length === 4) {
        this.attributes = [];
        this.children   = [];
        this.fullName   = arguments[0] || "";
        if (arguments[1]) {
            this.name = arguments[1];
        } else {
            var index = this.fullName.indexOf(':');
            if (index >= 0) {
                this.name = this.fullName.substring(index + 1);
            } else {
                this.name = this.fullName;
            }
        }
        this.namespace = arguments[1];
        this.content   = "";
        this.lineNr    = arguments[3];
        this.systemID  = arguments[2];
        this.parent    = null;
      }
      else if ((arguments.length === 2 && arguments[1].indexOf(".") > -1) ) { // filename or svg xml element
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;
        this.parse(arguments[arguments.length -1]);
      } else if (arguments.length === 1 && typeof arguments[0] === "string"){
        //xml string
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;
        this.parse(arguments[0]);
      }
      else { //empty ctor
        this.attributes = [];
        this.children   = [];
        this.fullName   = "";
        this.name       = "";
        this.namespace  = "";
        this.content    = "";
        this.systemID   = "";
        this.lineNr     = "";
        this.parent     = null;

      }
      return this;
    };
    /*XMLElement methods
      missing: enumerateAttributeNames(), enumerateChildren(),
      NOTE: parse does not work when a url is passed in
    */
    XMLElement.prototype = {
      parse: function(filename) {
        var xmlDoc;
        try {
          if (filename.indexOf(".xml") > -1 || filename.indexOf(".svg") > -1) {
            filename = ajax(filename);
          }
          xmlDoc = new DOMParser().parseFromString(filename, "text/xml");
          var elements = xmlDoc.documentElement;
          if (elements) {
            this.parseChildrenRecursive(null, elements);
          } else {
            throw ("Error loading document");
          }
          return this;
        } catch(e) {
          throw(e);
        }
      },
      createElement: function () {
        if (arguments.length === 2) {
          return new XMLElement(arguments[0], arguments[1], null, null);
        } else {
          return new XMLElement(arguments[0], arguments[1], arguments[2], arguments[3]);
        }
      },
      hasAttribute: function (name) {
        return this.getAttribute(name) !== null;
        //2 parameter call missing
      },
      createPCDataElement: function () {
        return new XMLElement();
      },
      equals: function(object){
        if (typeof object === "Object") {
          return this.equalsXMLElement(object);
        }
      },
      equalsXMLElement: function (object) {
        if (object instanceof XMLElement) {
          if (this.name !== object.getLocalName) { return false; }
          if (this.attributes.length !== object.getAttributeCount()) { return false; }
          for (var i = 0; i < this.attributes.length; i++){
            if (! object.hasAttribute(this.attributes[i].getName(), this.attributes[i].getNamespace())) { return false; }
            if (this.attributes[i].getValue() !== object.attributes[i].getValue()) { return false; }
            if (this.attributes[i].getType()  !== object.attributes[i].getType()) { return false; }
          }
          if (this.children.length !== object.getChildCount()) { return false; }
          var child1, child2;
          for (i = 0; i < this.children.length; i++) {
            child1 = this.getChildAtIndex(i);
            child2 = object.getChildAtIndex(i);
            if (! child1.equalsXMLElement(child2)) { return false; }
          }
          return true;
        }
      },
      getContent: function(){
         return this.content;
      },
      getAttribute: function (){
        var attribute;
        if( arguments.length === 2 ){
          attribute = this.findAttribute(arguments[0]);
          if (attribute) {
            return attribute.getValue();
          } else {
            return arguments[1];
          }
        } else if (arguments.length === 1) {
          attribute = this.findAttribute(arguments[0]);
          if (attribute) {
            return attribute.getValue();
          } else {
            return null;
          }
        }
      },
      getStringAttribute: function() {
        if (arguments.length === 1) {
          return this.getAttribute(arguments[0]);
        } else if (arguments.length === 2){
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      getFloatAttribute: function() {
        if (arguments.length === 1 ) {
          return parseFloat(this.getAttribute(arguments[0], 0));
        } else if (arguments.length === 2 ){
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      getIntAttribute: function () {
        if (arguments.length === 1) {
          return this.getAttribute( arguments[0], 0 );
        } else if (arguments.length === 2) {
          return this.getAttribute(arguments[0], arguments[1]);
        } else {
          return this.getAttribute(arguments[0], arguments[1],arguments[2]);
        }
      },
      hasChildren: function () {
        return this.children.length > 0 ;
      },
      addChild: function (child) {
        if (child !== null) {
          child.parent = this;
          this.children.push(child);
        }
      },
      insertChild: function (child, index) {
        if (child) {
          if ((child.getLocalName() === null) && (! this.hasChildren())) {
            var lastChild = this.children[this.children.length -1];
            if (lastChild.getLocalName() === null) {
                lastChild.setContent(lastChild.getContent() + child.getContent());
                return;
            }
          }
          child.parent = this;
          this.children.splice(index,0,child);
        }
      },
      getChild: function (index){
        if (typeof index  === "number") {
          return this.children[index];
        }
        else if (index.indexOf('/') !== -1) { // path was given
          this.getChildRecursive(index.split("/"), 0);
        } else {
          var kid, kidName;
          for (var i = 0; i < this.getChildCount(); i++) {
            kid = this.getChild(i);
            kidName = kid.getName();
            if (kidName !== null && kidName === index) {
                return kid;
            }
          }
          return null;
        }
      },
      getChildren: function(){
        if (arguments.length === 1) {
          if (typeof arguments[0]  === "number") {
            return this.getChild( arguments[0]);
          } else if (arguments[0].indexOf('/') !== -1) { // path was given
            return this.getChildrenRecursive( arguments[0].split("/"), 0);
          } else {
            var matches = [];
            var kid, kidName;
            for (var i = 0; i < this.getChildCount(); i++) {
              kid = this.getChild(i);
              kidName = kid.getName();
              if (kidName !== null && kidName === arguments[0]) {
                matches.push(kid);
              }
            }
            return matches;
          }
        }else {
          return this.children;
        }
      },
      getChildCount: function(){
        return this.children.length;
      },
      getChildRecursive: function (items, offset) {
        var kid, kidName;
        for(var i = 0; i < this.getChildCount(); i++) {
            kid = this.getChild(i);
            kidName = kid.getName();
            if (kidName !== null && kidName === items[offset]) {
              if (offset === items.length-1) {
                return kid;
              } else {
                offset += 1;
                return kid.getChildRecursive(items, offset);
              }
            }
        }
        return null;
      },
      getChildrenRecursive: function (items, offset) {
        if (offset === items.length-1) {
          return this.getChildren(items[offset]);
        }
        var matches = this.getChildren(items[offset]);
        var kidMatches;
        for (var i = 0; i < matches.length; i++) {
          kidMatches = matches[i].getChildrenRecursive(items, offset+1);
        }
        return kidMatches;
      },
      parseChildrenRecursive: function (parent , elementpath){
        var xmlelement,
          xmlattribute,
          tmpattrib;
        if (!parent) {
          this.fullName = elementpath.localName;
          this.name     = elementpath.nodeName;
          this.content  = elementpath.textContent || "";
          xmlelement    = this;
        } else { // a parent
          xmlelement         = new XMLElement(elementpath.localName, elementpath.nodeName, "", "");
          xmlelement.content = elementpath.textContent || "";
          xmlelement.parent  = parent;
        }

        for (var l = 0; l < elementpath.attributes.length; l++) {
          tmpattrib    = elementpath.attributes[l];
          xmlattribute = new XMLAttribute(tmpattrib.getname , tmpattrib.nodeName, tmpattrib.namespaceURI , tmpattrib.nodeValue , tmpattrib.nodeType);
          xmlelement.attributes.push(xmlattribute);
        }

        for (var node in elementpath.childNodes){
          if(elementpath.childNodes[node].nodeType === 1) { //ELEMENT_NODE type
            xmlelement.children.push( xmlelement.parseChildrenRecursive(xmlelement, elementpath.childNodes[node]));
          }
        }
        return xmlelement;
      },
      isLeaf: function(){
        return this.hasChildren();
      },
      listChildren: function() {
        var arr = [];
        for (var i = 0; i < this.children.length; i++) {
          arr.push( this.getChild(i).getName());
        }
        return arr;
      },
      removeAttribute: function (name , namespace) {
        this.namespace = namespace || "";
        for (var i = 0; i < this.attributes.length; i++){
          if (this.attributes[i].getName() === name && this.attributes[i].getNamespace() === this.namespace) {
            this.attributes.splice(i, 0);
          }
        }
      },
      removeChild: function(child) {
        if (child) {
          for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].equalsXMLElement(child)) {
              this.children.splice(i, 0);
            }
          }
        }
      },
      removeChildAtIndex: function(index) {
        if (this.children.length > index) { //make sure its not outofbounds
          this.children.splice(index, 0);
        }
      },
      findAttribute: function (name, namespace) {
        this.namespace = namespace || "";
        for (var i = 0; i < this.attributes.length; i++ ) {
          if (this.attributes[i].getName() === name && this.attributes[i].getNamespace() === this.namespace) {
             return this.attributes[i];
          }
        }
      },
      setAttribute: function() {
        var attr;
        if (arguments.length === 3) {
          var index = arguments[0].indexOf(':');
          var name  = arguments[0].substring(index + 1);
          attr      = this.findAttribute( name, arguments[1] );
          if (attr) {
            attr.setValue(arguments[2]);
          } else {
            attr = new XMLAttribute(arguments[0], name, arguments[1], arguments[2], "CDATA");
            this.attributes.addElement(attr);
          }
        } else {
          attr = this.findAttribute(arguments[0]);
          if (attr) {
            attr.setValue(arguments[1]);
          } else {
            attr = new XMLAttribute(arguments[0], arguments[0], null, arguments[1], "CDATA");
            this.attributes.addElement(attr);
          }
        }
      },
      setContent: function(content) {
        this.content = content;
      },
      setName: function() {
        if (arguments.length === 1) {
          this.name      = arguments[0];
          this.fullName  = arguments[0];
          this.namespace = arguments[0];
        } else {
          var index = arguments[0].indexOf(':');
          if ((arguments[1] === null) || (index < 0)) {
              this.name = arguments[0];
          } else {
              this.name = arguments[0].substring(index + 1);
          }
          this.fullName  = arguments[0];
          this.namespace = arguments[1];
        }
      },
      getName: function() {
        return this.fullName;
      }
    };


    ////////////////////////////////////////////////////////////////////////////
    // 2D Matrix
    ////////////////////////////////////////////////////////////////////////////

    /*
      Helper function for printMatrix(). Finds the largest scalar
      in the matrix, then number of digits left of the decimal.
      Call from PMatrix2D and PMatrix3D's print() function.
    */
    var printMatrixHelper = function printMatrixHelper(elements) {
      var big = 0;
      for (var i = 0; i < elements.length; i++) {
        if (i !== 0) {
          big = Math.max(big, Math.abs(elements[i]));
        } else {
          big = Math.abs(elements[i]);
        }
      }

      var digits = (big + "").indexOf(".");
      if (digits === 0) {
        digits = 1;
      } else if (digits === -1) {
        digits = (big + "").length;
      }

      return digits;
    };

    var PMatrix2D = p.PMatrix2D = function() {
      if (arguments.length === 0) {
        this.reset();
      } else if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
        this.set(arguments[0].array());
      } else if (arguments.length === 6) {
        this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      }
    };

    PMatrix2D.prototype = {
      set: function() {
        if (arguments.length === 6) {
          var a = arguments;
          this.set([a[0], a[1], a[2],
                    a[3], a[4], a[5]]);
        } else if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          this.elements = arguments[0].array();
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          this.elements = arguments[0].slice();
        }
      },
      get: function() {
        var outgoing = new PMatrix2D();
        outgoing.set(this.elements);
        return outgoing;
      },
      reset: function() {
        this.set([1, 0, 0, 0, 1, 0]);
      },
      // Returns a copy of the element values.
      array: function array() {
        return this.elements.slice();
      },
      translate: function(tx, ty) {
        this.elements[2] = tx * this.elements[0] + ty * this.elements[1] + this.elements[2];
        this.elements[5] = tx * this.elements[3] + ty * this.elements[4] + this.elements[5];
      },
      transpose: function() {
        // Does nothing in Processing.
      },
      mult: function(source, target) {
        var x, y;
        if (source instanceof PVector) {
          x = source.x;
          y = source.y;
          if (!target) {
            target = new PVector();
          }
        } else if (source instanceof Array) {
          x = source[0];
          y = source[1];
          if (!target) {
            target = [];
          }
        }
        if (target instanceof Array) {
          target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2];
          target[1] = this.elements[3] * x + this.elements[4] * y + this.elements[5];
        } else if (target instanceof PVector) {
          target.x = this.elements[0] * x + this.elements[1] * y + this.elements[2];
          target.y = this.elements[3] * x + this.elements[4] * y + this.elements[5];
          target.z = 0;
        }
        return target;
      },
      multX: function(x, y) {
        return (x * this.elements[0] + y * this.elements[1] + this.elements[2]);
      },
      multY: function(x, y) {
        return (x * this.elements[3] + y * this.elements[4] + this.elements[5]);
      },
      skewX: function(angle) {
        this.apply(1, 0, 1, angle, 0, 0);
      },
      skewY: function(angle) {
        this.apply(1, 0, 1,  0, angle, 0);
      },
      determinant: function() {
        return (this.elements[0] * this.elements[4] - this.elements[1] * this.elements[3]);
      },
      invert: function() {
        var d = this.determinant();
        if ( Math.abs( d ) > PConstants.FLOAT_MIN ) {
          var old00 = this.elements[0];
          var old01 = this.elements[1];
          var old02 = this.elements[2];
          var old10 = this.elements[3];
          var old11 = this.elements[4];
          var old12 = this.elements[5];
          this.elements[0] =  old11 / d;
          this.elements[3] = -old10 / d;
          this.elements[1] = -old01 / d;
          this.elements[1] =  old00 / d;
          this.elements[2] = (old01 * old12 - old11 * old02) / d;
          this.elements[5] = (old10 * old02 - old00 * old12) / d;
          return true;
        }
        return false;
      },
      scale: function(sx, sy) {
        if (sx && !sy) {
          sy = sx;
        }
        if (sx && sy) {
          this.elements[0] *= sx;
          this.elements[1] *= sy;
          this.elements[3] *= sx;
          this.elements[4] *= sy;
        }
      },
      apply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          source = arguments[0].array();
        } else if (arguments.length === 6) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, this.elements[2],
                      0, 0, this.elements[5]];
        var e = 0;
        for (var row = 0; row < 2; row++) {
          for (var col = 0; col < 3; col++, e++) {
            result[e] += this.elements[row * 3 + 0] * source[col + 0] +
                         this.elements[row * 3 + 1] * source[col + 3];
          }
        }
        this.elements = result.slice();
      },
      preApply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          source = arguments[0].array();
        } else if (arguments.length === 6) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }
        var result = [0, 0, source[2],
                      0, 0, source[5]];
        result[2] = source[2] + this.elements[2] * source[0] + this.elements[5] * source[1];
        result[5] = source[5] + this.elements[2] * source[3] + this.elements[5] * source[4];
        result[0] = this.elements[0] * source[0] + this.elements[3] * source[1];
        result[3] = this.elements[0] * source[3] + this.elements[3] * source[4];
        result[1] = this.elements[1] * source[0] + this.elements[4] * source[1];
        result[4] = this.elements[1] * source[3] + this.elements[4] * source[4];
        this.elements = result.slice();
      },
      rotate: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var temp1 = this.elements[0];
        var temp2 = this.elements[1];
        this.elements[0] =  c * temp1 + s * temp2;
        this.elements[1] = -s * temp1 + c * temp2;
        temp1 = this.elements[3];
        temp2 = this.elements[4];
        this.elements[3] =  c * temp1 + s * temp2;
        this.elements[4] = -s * temp1 + c * temp2;
      },
      rotateZ: function(angle) {
        this.rotate(angle);
      },
      print: function() {
        var digits = printMatrixHelper(this.elements);
        var output = "" + p.nfs(this.elements[0], digits, 4) + " " +
                     p.nfs(this.elements[1], digits, 4) + " " +
                     p.nfs(this.elements[2], digits, 4) + "\n" +
                     p.nfs(this.elements[3], digits, 4) + " " +
                     p.nfs(this.elements[4], digits, 4) + " " +
                     p.nfs(this.elements[5], digits, 4) + "\n\n";
        p.println(output);
      }
    };

    ////////////////////////////////////////////////////////////////////////////
    // PMatrix3D
    ////////////////////////////////////////////////////////////////////////////

    var PMatrix3D = p.PMatrix3D = function PMatrix3D() {
      // When a matrix is created, it is set to an identity matrix
      this.reset();
    };

    PMatrix3D.prototype = {
      set: function() {
        if (arguments.length === 16) {
          this.elements = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          this.elements = arguments[0].array();
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          this.elements = arguments[0].slice();
        }
      },
      get: function() {
        var outgoing = new PMatrix3D();
        outgoing.set(this.elements);
        return outgoing;
      },
      reset: function() {
        this.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      // Returns a copy of the element values.
      array: function array() {
        return this.elements.slice();
      },
      translate: function(tx, ty, tz) {
        if (tz === undef) {
          tz = 0;
        }

        this.elements[3]  += tx * this.elements[0]  + ty * this.elements[1]  + tz * this.elements[2];
        this.elements[7]  += tx * this.elements[4]  + ty * this.elements[5]  + tz * this.elements[6];
        this.elements[11] += tx * this.elements[8]  + ty * this.elements[9]  + tz * this.elements[10];
        this.elements[15] += tx * this.elements[12] + ty * this.elements[13] + tz * this.elements[14];
      },
      transpose: function() {
        var temp = this.elements.slice();
        this.elements[0]  = temp[0];
        this.elements[1]  = temp[4];
        this.elements[2]  = temp[8];
        this.elements[3]  = temp[12];
        this.elements[4]  = temp[1];
        this.elements[5]  = temp[5];
        this.elements[6]  = temp[9];
        this.elements[7]  = temp[13];
        this.elements[8]  = temp[2];
        this.elements[9]  = temp[6];
        this.elements[10] = temp[10];
        this.elements[11] = temp[14];
        this.elements[12] = temp[3];
        this.elements[13] = temp[7];
        this.elements[14] = temp[11];
        this.elements[15] = temp[15];
      },
      /*
        You must either pass in two PVectors or two arrays,
        don't mix between types. You may also omit a second
        argument and simply read the result from the return.
      */
      mult: function(source, target) {
        var x, y, z, w;
        if (source instanceof PVector) {
          x = source.x;
          y = source.y;
          z = source.z;
          w = 1;
          if (!target) {
            target = new PVector();
          }
        } else if (source instanceof Array) {
          x = source[0];
          y = source[1];
          z = source[2];
          w = source[3] || 1;

          if (!target || target.length !== 3 && target.length !== 4) {
            target = [0, 0, 0];
          }
        }

        if (target instanceof Array) {
          if (target.length === 3) {
            target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3];
            target[1] = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7];
            target[2] = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11];
          } else if (target.length === 4) {
            target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3] * w;
            target[1] = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7] * w;
            target[2] = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11] * w;
            target[3] = this.elements[12] * x + this.elements[13] * y + this.elements[14] * z + this.elements[15] * w;
          }
        }
        if (target instanceof PVector) {
          target.x = this.elements[0] * x + this.elements[1] * y + this.elements[2] * z + this.elements[3];
          target.y = this.elements[4] * x + this.elements[5] * y + this.elements[6] * z + this.elements[7];
          target.z = this.elements[8] * x + this.elements[9] * y + this.elements[10] * z + this.elements[11];
        }
        return target;
      },
      preApply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          source = arguments[0].array();
        } else if (arguments.length === 16) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0];
        var e = 0;
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++, e++) {
            result[e] += this.elements[col + 0] * source[row * 4 + 0] + this.elements[col + 4] *
                         source[row * 4 + 1] + this.elements[col + 8] * source[row * 4 + 2] +
                         this.elements[col + 12] * source[row * 4 + 3];
          }
        }
        this.elements = result.slice();
      },
      apply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix3D) {
          source = arguments[0].array();
        } else if (arguments.length === 16) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0,
                      0, 0, 0, 0];
        var e = 0;
        for (var row = 0; row < 4; row++) {
          for (var col = 0; col < 4; col++, e++) {
            result[e] += this.elements[row * 4 + 0] * source[col + 0] + this.elements[row * 4 + 1] *
                         source[col + 4] + this.elements[row * 4 + 2] * source[col + 8] +
                         this.elements[row * 4 + 3] * source[col + 12];
          }
        }
        this.elements = result.slice();
      },
      rotate: function(angle, v0, v1, v2) {
        if (!v1) {
          this.rotateZ(angle);
        } else {
          // TODO should make sure this vector is normalized
          var c = p.cos(angle);
          var s = p.sin(angle);
          var t = 1.0 - c;

          this.apply((t * v0 * v0) + c,
                     (t * v0 * v1) - (s * v2),
                     (t * v0 * v2) + (s * v1),
                     0,
                     (t * v0 * v1) + (s * v2),
                     (t * v1 * v1) + c,
                     (t * v1 * v2) - (s * v0),
                     0,
                     (t * v0 * v2) - (s * v1),
                     (t * v1 * v2) + (s * v0),
                     (t * v2 * v2) + c,
                     0, 0, 0, 0, 1);
        }
      },
      invApply: function() {
        if (inverseCopy === undef) {
          inverseCopy = new PMatrix3D();
        }
        var a = arguments;
        inverseCopy.set(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8],
                        a[9], a[10], a[11], a[12], a[13], a[14], a[15]);

        if (!inverseCopy.invert()) {
          return false;
        }
        this.preApply(inverseCopy);
        return true;
      },
      rotateX: function(angle) {
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.apply([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
      },

      rotateY: function(angle) {
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.apply([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
      },
      rotateZ: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.apply([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      },
      // Uniform scaling if only one value passed in
      scale: function(sx, sy, sz) {
        if (sx && !sy && !sz) {
          sy = sz = sx;
        } else if (sx && sy && !sz) {
          sz = 1;
        }

        if (sx && sy && sz) {
          this.elements[0]  *= sx;
          this.elements[1]  *= sy;
          this.elements[2]  *= sz;
          this.elements[4]  *= sx;
          this.elements[5]  *= sy;
          this.elements[6]  *= sz;
          this.elements[8]  *= sx;
          this.elements[9]  *= sy;
          this.elements[10] *= sz;
          this.elements[12] *= sx;
          this.elements[13] *= sy;
          this.elements[14] *= sz;
        }
      },
      skewX: function(angle) {
        var t = Math.tan(angle);
      
