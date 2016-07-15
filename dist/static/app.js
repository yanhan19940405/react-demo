/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function FastClick(layer) {
	  'use strict';
	
	  var oldOnClick;
	
	  /**
	   * Whether a click is currently being tracked.
	   *
	   * @type boolean
	   */
	  this.trackingClick = false;
	
	  /**
	   * Timestamp for when when click tracking started.
	   *
	   * @type number
	   */
	  this.trackingClickStart = 0;
	
	  /**
	   * The element being tracked for a click.
	   *
	   * @type EventTarget
	   */
	  this.targetElement = null;
	
	  /**
	   * X-coordinate of touch start event.
	   *
	   * @type number
	   */
	  this.touchStartX = 0;
	
	  /**
	   * Y-coordinate of touch start event.
	   *
	   * @type number
	   */
	  this.touchStartY = 0;
	
	  /**
	   * ID of the last touch, retrieved from Touch.identifier.
	   *
	   * @type number
	   */
	  this.lastTouchIdentifier = 0;
	
	  /**
	   * Touchmove boundary, beyond which a click will be cancelled.
	   *
	   * @type number
	   */
	  this.touchBoundary = 10;
	
	  /**
	   * The FastClick layer.
	   *
	   * @type Element
	   */
	  this.layer = layer;
	
	  if (FastClick.notNeeded(layer)) {
	    return;
	  }
	
	  // Some old versions of Android don't have Function.prototype.bind
	  function bind(method, context) {
	    return function () {
	      return method.apply(context, arguments);
	    };
	  }
	
	  // Set up event handlers as required
	  if (deviceIsAndroid) {
	    layer.addEventListener('mouseover', bind(this.onMouse, this), true);
	    layer.addEventListener('mousedown', bind(this.onMouse, this), true);
	    layer.addEventListener('mouseup', bind(this.onMouse, this), true);
	  }
	
	  layer.addEventListener('click', bind(this.onClick, this), true);
	  layer.addEventListener('touchstart', bind(this.onTouchStart, this), false);
	  layer.addEventListener('touchmove', bind(this.onTouchMove, this), false);
	  layer.addEventListener('touchend', bind(this.onTouchEnd, this), false);
	  layer.addEventListener('touchcancel', bind(this.onTouchCancel, this), false);
	
	  // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	  // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	  // layer when they are cancelled.
	  if (!Event.prototype.stopImmediatePropagation) {
	    layer.removeEventListener = function (type, callback, capture) {
	      var rmv = Node.prototype.removeEventListener;
	      if (type === 'click') {
	        rmv.call(layer, type, callback.hijacked || callback, capture);
	      } else {
	        rmv.call(layer, type, callback, capture);
	      }
	    };
	
	    layer.addEventListener = function (type, callback, capture) {
	      var adv = Node.prototype.addEventListener;
	      if (type === 'click') {
	        adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
	          if (!event.propagationStopped) {
	            callback(event);
	          }
	        }), capture);
	      } else {
	        adv.call(layer, type, callback, capture);
	      }
	    };
	  }
	
	  // If a handler is already declared in the element's onclick attribute, it will be fired before
	  // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	  // adding it as listener.
	  if (typeof layer.onclick === 'function') {
	
	    // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
	    // - the old one won't work if passed to addEventListener directly.
	    oldOnClick = layer.onclick;
	    layer.addEventListener('click', function (event) {
	      oldOnClick(event);
	    }, false);
	    layer.onclick = null;
	  }
	}
	
	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
	
	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
	
	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
	
	/**
	 * iOS 6.0(+?) requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
	
	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function (target) {
	  'use strict';
	
	  switch (target.nodeName.toLowerCase()) {
	
	    // Don't send a synthetic click to disabled inputs (issue #62)
	    case 'button':
	    case 'select':
	    case 'textarea':
	      if (target.disabled) {
	        return true;
	      }
	
	      break;
	    case 'input':
	
	      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
	      if (deviceIsIOS && target.type === 'file' || target.disabled) {
	        return true;
	      }
	
	      break;
	    case 'label':
	    case 'video':
	      return true;
	  }
	
	  return (/\bneedsclick\b/.test(target.className)
	  );
	};
	
	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function (target) {
	  'use strict';
	
	  switch (target.nodeName.toLowerCase()) {
	    case 'textarea':
	      return true;
	    case 'select':
	      return !deviceIsAndroid;
	    case 'input':
	      switch (target.type) {
	        case 'button':
	        case 'checkbox':
	        case 'file':
	        case 'image':
	        case 'radio':
	        case 'submit':
	          return false;
	      }
	
	      // No point in attempting to focus disabled inputs
	      return !target.disabled && !target.readOnly;
	    default:
	      return (/\bneedsfocus\b/.test(target.className)
	      );
	  }
	};
	
	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function (targetElement, event) {
	  'use strict';
	
	  var clickEvent, touch;
	
	  // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	  if (document.activeElement && document.activeElement !== targetElement) {
	    document.activeElement.blur();
	  }
	
	  touch = event.changedTouches[0];
	
	  // Synthesise a click event, with an extra attribute so it can be tracked
	  clickEvent = document.createEvent('MouseEvents');
	  clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	  clickEvent.forwardedTouchEvent = true;
	  targetElement.dispatchEvent(clickEvent);
	};
	
	FastClick.prototype.determineEventType = function (targetElement) {
	  'use strict';
	
	  //Issue #159: Android Chrome Select Box does not open with a synthetic click event
	
	  if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
	    return 'mousedown';
	  }
	
	  return 'click';
	};
	
	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function (targetElement) {
	  'use strict';
	
	  var length;
	
	  // Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
	    length = targetElement.value.length;
	    targetElement.setSelectionRange(length, length);
	  } else {
	    targetElement.focus();
	  }
	};
	
	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function (targetElement) {
	  'use strict';
	
	  var scrollParent, parentElement;
	
	  scrollParent = targetElement.fastClickScrollParent;
	
	  // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	  // target element was moved to another parent.
	  if (!scrollParent || !scrollParent.contains(targetElement)) {
	    parentElement = targetElement;
	    do {
	      if (parentElement.scrollHeight > parentElement.offsetHeight) {
	        scrollParent = parentElement;
	        targetElement.fastClickScrollParent = parentElement;
	        break;
	      }
	
	      parentElement = parentElement.parentElement;
	    } while (parentElement);
	  }
	
	  // Always update the scroll top tracker if possible.
	  if (scrollParent) {
	    scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	  }
	};
	
	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {
	  'use strict';
	
	  // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	
	  if (eventTarget.nodeType === Node.TEXT_NODE) {
	    return eventTarget.parentNode;
	  }
	
	  return eventTarget;
	};
	
	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function (event) {
	  'use strict';
	
	  var targetElement, touch, selection;
	
	  // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	  if (event.targetTouches.length > 1) {
	    return true;
	  }
	
	  targetElement = this.getTargetElementFromEventTarget(event.target);
	  touch = event.targetTouches[0];
	
	  if (deviceIsIOS) {
	
	    // Only trusted events will deselect text on iOS (issue #49)
	    selection = window.getSelection();
	    if (selection.rangeCount && !selection.isCollapsed) {
	      return true;
	    }
	
	    if (!deviceIsIOS4) {
	
	      // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
	      // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
	      // with the same identifier as the touch event that previously triggered the click that triggered the alert.
	      // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
	      // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
	      if (touch.identifier === this.lastTouchIdentifier) {
	        event.preventDefault();
	        return false;
	      }
	
	      this.lastTouchIdentifier = touch.identifier;
	
	      // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
	      // 1) the user does a fling scroll on the scrollable layer
	      // 2) the user stops the fling scroll with another tap
	      // then the event.target of the last 'touchend' event will be the element that was under the user's finger
	      // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
	      // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
	      this.updateScrollParent(targetElement);
	    }
	  }
	
	  this.trackingClick = true;
	  this.trackingClickStart = event.timeStamp;
	  this.targetElement = targetElement;
	
	  this.touchStartX = touch.pageX;
	  this.touchStartY = touch.pageY;
	
	  // Prevent phantom clicks on fast double-tap (issue #36)
	  if (event.timeStamp - this.lastClickTime < 200) {
	    event.preventDefault();
	  }
	
	  return true;
	};
	
	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function (event) {
	  'use strict';
	
	  var touch = event.changedTouches[0],
	      boundary = this.touchBoundary;
	
	  if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
	    return true;
	  }
	
	  return false;
	};
	
	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function (event) {
	  'use strict';
	
	  if (!this.trackingClick) {
	    return true;
	  }
	
	  // If the touch has moved, cancel the click tracking
	  if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
	    this.trackingClick = false;
	    this.targetElement = null;
	  }
	
	  return true;
	};
	
	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function (labelElement) {
	  'use strict';
	
	  // Fast path for newer browsers supporting the HTML5 control attribute
	
	  if (labelElement.control !== undefined) {
	    return labelElement.control;
	  }
	
	  // All browsers under test that support touch events also support the HTML5 htmlFor attribute
	  if (labelElement.htmlFor) {
	    return document.getElementById(labelElement.htmlFor);
	  }
	
	  // If no for attribute exists, attempt to retrieve the first labellable descendant element
	  // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	  return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};
	
	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function (event) {
	  'use strict';
	
	  var forElement,
	      trackingClickStart,
	      targetTagName,
	      scrollParent,
	      touch,
	      targetElement = this.targetElement;
	
	  if (!this.trackingClick) {
	    return true;
	  }
	
	  // Prevent phantom clicks on fast double-tap (issue #36)
	  if (event.timeStamp - this.lastClickTime < 200) {
	    this.cancelNextClick = true;
	    return true;
	  }
	
	  // Reset to prevent wrong click cancel on input (issue #156).
	  this.cancelNextClick = false;
	
	  this.lastClickTime = event.timeStamp;
	
	  trackingClickStart = this.trackingClickStart;
	  this.trackingClick = false;
	  this.trackingClickStart = 0;
	
	  // On some iOS devices, the targetElement supplied with the event is invalid if the layer
	  // is performing a transition or scroll, and has to be re-detected manually. Note that
	  // for this to function correctly, it must be called *after* the event target is checked!
	  // See issue #57; also filed as rdar://13048589 .
	  if (deviceIsIOSWithBadTarget) {
	    touch = event.changedTouches[0];
	
	    // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
	    targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
	    targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	  }
	
	  targetTagName = targetElement.tagName.toLowerCase();
	  if (targetTagName === 'label') {
	    forElement = this.findControl(targetElement);
	    if (forElement) {
	      this.focus(targetElement);
	      if (deviceIsAndroid) {
	        return false;
	      }
	
	      targetElement = forElement;
	    }
	  } else if (this.needsFocus(targetElement)) {
	
	    // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
	    // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
	    if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === 'input') {
	      this.targetElement = null;
	      return false;
	    }
	
	    this.focus(targetElement);
	    this.sendClick(targetElement, event);
	
	    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
	    if (!deviceIsIOS4 || targetTagName !== 'select') {
	      this.targetElement = null;
	      event.preventDefault();
	    }
	
	    return false;
	  }
	
	  if (deviceIsIOS && !deviceIsIOS4) {
	
	    // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
	    // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
	    scrollParent = targetElement.fastClickScrollParent;
	    if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
	      return true;
	    }
	  }
	
	  // Prevent the actual click from going though - unless the target node is marked as requiring
	  // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	  if (!this.needsClick(targetElement)) {
	    event.preventDefault();
	    this.sendClick(targetElement, event);
	  }
	
	  return false;
	};
	
	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function () {
	  'use strict';
	
	  this.trackingClick = false;
	  this.targetElement = null;
	};
	
	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function (event) {
	  'use strict';
	
	  // If a target element was never set (because a touch event was never fired) allow the event
	
	  if (!this.targetElement) {
	    return true;
	  }
	
	  if (event.forwardedTouchEvent) {
	    return true;
	  }
	
	  // Programmatically generated events targeting a specific element should be permitted
	  if (!event.cancelable) {
	    return true;
	  }
	
	  // Derive and check the target element to see whether the mouse event needs to be permitted;
	  // unless explicitly enabled, prevent non-touch click events from triggering actions,
	  // to prevent ghost/doubleclicks.
	  if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
	
	    // Prevent any user-added listeners declared on FastClick element from being fired.
	    if (event.stopImmediatePropagation) {
	      event.stopImmediatePropagation();
	    } else {
	
	      // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	      event.propagationStopped = true;
	    }
	
	    // Cancel the event
	    event.stopPropagation();
	    event.preventDefault();
	
	    return false;
	  }
	
	  // If the mouse event is permitted, return true for the action to go through.
	  return true;
	};
	
	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function (event) {
	  'use strict';
	
	  var permitted;
	
	  // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	  if (this.trackingClick) {
	    this.targetElement = null;
	    this.trackingClick = false;
	    return true;
	  }
	
	  // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	  if (event.target.type === 'submit' && event.detail === 0) {
	    return true;
	  }
	
	  permitted = this.onMouse(event);
	
	  // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	  if (!permitted) {
	    this.targetElement = null;
	  }
	
	  // If clicks are permitted, return true for the action to go through.
	  return permitted;
	};
	
	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function () {
	  'use strict';
	
	  var layer = this.layer;
	
	  if (deviceIsAndroid) {
	    layer.removeEventListener('mouseover', this.onMouse, true);
	    layer.removeEventListener('mousedown', this.onMouse, true);
	    layer.removeEventListener('mouseup', this.onMouse, true);
	  }
	
	  layer.removeEventListener('click', this.onClick, true);
	  layer.removeEventListener('touchstart', this.onTouchStart, false);
	  layer.removeEventListener('touchmove', this.onTouchMove, false);
	  layer.removeEventListener('touchend', this.onTouchEnd, false);
	  layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};
	
	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function (layer) {
	  'use strict';
	
	  var metaViewport;
	  var chromeVersion;
	
	  // Devices that don't support touch don't need FastClick
	  if (typeof window.ontouchstart === 'undefined') {
	    return true;
	  }
	
	  // Chrome version - zero for other browsers
	  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
	
	  if (chromeVersion) {
	
	    if (deviceIsAndroid) {
	      metaViewport = document.querySelector('meta[name=viewport]');
	
	      if (metaViewport) {
	        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
	        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
	          return true;
	        }
	        // Chrome 32 and above with width=device-width or less don't need FastClick
	        if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
	          return true;
	        }
	      }
	
	      // Chrome desktop doesn't need FastClick (issue #15)
	    } else {
	      return true;
	    }
	  }
	
	  // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	  if (layer.style.msTouchAction === 'none') {
	    return true;
	  }
	
	  return false;
	};
	
	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.attach = function (layer) {
	  'use strict';
	
	  return new FastClick(layer);
	};
	
	if (true) {
	
	  // AMD. Register as an anonymous module.
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    'use strict';
	
	    return FastClick;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = FastClick.attach;
	  module.exports.FastClick = FastClick;
	} else {
	  window.FastClick = FastClick;
	}
	
	(function (document, window, index) {
	
	  "use strict";
	
	  var responsiveNav = function responsiveNav(el, options) {
	
	    var computed = !!window.getComputedStyle;
	
	    // getComputedStyle polyfill
	    if (!computed) {
	      window.getComputedStyle = function (el) {
	        this.el = el;
	        this.getPropertyValue = function (prop) {
	          var re = /(\-([a-z]){1})/g;
	          if (prop === "float") {
	            prop = "styleFloat";
	          }
	          if (re.test(prop)) {
	            prop = prop.replace(re, function () {
	              return arguments[2].toUpperCase();
	            });
	          }
	          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	        };
	        return this;
	      };
	    }
	    /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */
	    // fn arg can be an object or a function, thanks to handleEvent
	    // read more at: http://www.thecssninja.com/javascript/handleevent
	    var addEvent = function addEvent(el, evt, fn, bubble) {
	      if ("addEventListener" in el) {
	        // BBOS6 doesn't support handleEvent, catch and polyfill
	        try {
	          el.addEventListener(evt, fn, bubble);
	        } catch (e) {
	          if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	            el.addEventListener(evt, function (e) {
	              // Bind fn as this and set first arg as event object
	              fn.handleEvent.call(fn, e);
	            }, bubble);
	          } else {
	            throw e;
	          }
	        }
	      } else if ("attachEvent" in el) {
	        // check if the callback is an object and contains handleEvent
	        if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	          el.attachEvent("on" + evt, function () {
	            // Bind fn as this
	            fn.handleEvent.call(fn);
	          });
	        } else {
	          el.attachEvent("on" + evt, fn);
	        }
	      }
	    },
	        removeEvent = function removeEvent(el, evt, fn, bubble) {
	      if ("removeEventListener" in el) {
	        try {
	          el.removeEventListener(evt, fn, bubble);
	        } catch (e) {
	          if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	            el.removeEventListener(evt, function (e) {
	              fn.handleEvent.call(fn, e);
	            }, bubble);
	          } else {
	            throw e;
	          }
	        }
	      } else if ("detachEvent" in el) {
	        if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	          el.detachEvent("on" + evt, function () {
	            fn.handleEvent.call(fn);
	          });
	        } else {
	          el.detachEvent("on" + evt, fn);
	        }
	      }
	    },
	        getChildren = function getChildren(e) {
	      if (e.children.length < 1) {
	        throw new Error("The Nav container has no containing elements");
	      }
	      // Store all children in array
	      var children = [];
	      // Loop through children and store in array if child != TextNode
	      for (var i = 0; i < e.children.length; i++) {
	        if (e.children[i].nodeType === 1) {
	          children.push(e.children[i]);
	        }
	      }
	      return children;
	    },
	        setAttributes = function setAttributes(el, attrs) {
	      for (var key in attrs) {
	        el.setAttribute(key, attrs[key]);
	      }
	    },
	        addClass = function addClass(el, cls) {
	      if (el.className.indexOf(cls) !== 0) {
	        el.className += " " + cls;
	        el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
	      }
	    },
	        removeClass = function removeClass(el, cls) {
	      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
	      el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
	    },
	
	
	    // forEach method that passes back the stuff we need
	    forEach = function forEach(array, callback, scope) {
	      for (var i = 0; i < array.length; i++) {
	        callback.call(scope, i, array[i]);
	      }
	    };
	
	    var nav,
	        opts,
	        navToggle,
	        styleElement = document.createElement("style"),
	        htmlEl = document.documentElement,
	        hasAnimFinished,
	        isMobile,
	        navOpen;
	
	    var ResponsiveNav = function ResponsiveNav(el, options) {
	      var i;
	
	      // Default options
	      this.options = {
	        animate: true, // Boolean: Use CSS3 transitions, true or false
	        transition: 284, // Integer: Speed of the transition, in milliseconds
	        label: "Menu", // String: Label for the navigation toggle
	        insert: "before", // String: Insert the toggle before or after the navigation
	        customToggle: "", // Selector: Specify the ID of a custom toggle
	        closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
	        openPos: "relative", // String: Position of the opened nav, relative or static
	        navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
	        navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
	        jsClass: "js", // String: 'JS enabled' class which is added to <html> element
	        init: function init() {}, // Function: Init callback
	        open: function open() {}, // Function: Open callback
	        close: function close() {} // Function: Close callback
	      };
	
	      // User defined options
	      for (i in options) {
	        this.options[i] = options[i];
	      }
	
	      // Adds "js" class for <html>
	      addClass(htmlEl, this.options.jsClass);
	
	      // Wrapper
	      this.wrapperEl = el.replace("#", "");
	
	      // Try selecting ID first
	      if (document.getElementById(this.wrapperEl)) {
	        this.wrapper = document.getElementById(this.wrapperEl);
	
	        // If element with an ID doesn't exist, use querySelector
	      } else if (document.querySelector(this.wrapperEl)) {
	        this.wrapper = document.querySelector(this.wrapperEl);
	
	        // If element doesn't exists, stop here.
	      } else {
	        throw new Error("The nav element you are trying to select doesn't exist");
	      }
	
	      // Inner wrapper
	      this.wrapper.inner = getChildren(this.wrapper);
	
	      // For minification
	      opts = this.options;
	      nav = this.wrapper;
	
	      // Init
	      this._init(this);
	    };
	
	    ResponsiveNav.prototype = {
	
	      // Public methods
	      destroy: function destroy() {
	        this._removeStyles();
	        removeClass(nav, "closed");
	        removeClass(nav, "opened");
	        removeClass(nav, opts.navClass);
	        removeClass(nav, opts.navClass + "-" + this.index);
	        removeClass(htmlEl, opts.navActiveClass);
	        nav.removeAttribute("style");
	        nav.removeAttribute("aria-hidden");
	
	        removeEvent(window, "resize", this, false);
	        removeEvent(document.body, "touchmove", this, false);
	        removeEvent(navToggle, "touchstart", this, false);
	        removeEvent(navToggle, "touchend", this, false);
	        removeEvent(navToggle, "mouseup", this, false);
	        removeEvent(navToggle, "keyup", this, false);
	        removeEvent(navToggle, "click", this, false);
	
	        if (!opts.customToggle) {
	          navToggle.parentNode.removeChild(navToggle);
	        } else {
	          navToggle.removeAttribute("aria-hidden");
	        }
	      },
	
	      toggle: function toggle() {
	        if (hasAnimFinished === true) {
	          if (!navOpen) {
	            this.open();
	          } else {
	            this.close();
	          }
	        }
	      },
	
	      open: function open() {
	        if (!navOpen) {
	          removeClass(nav, "closed");
	          addClass(nav, "opened");
	          addClass(htmlEl, opts.navActiveClass);
	          addClass(navToggle, "active");
	          nav.style.position = opts.openPos;
	          setAttributes(nav, { "aria-hidden": "false" });
	          navOpen = true;
	          opts.open();
	        }
	      },
	
	      close: function close() {
	        if (navOpen) {
	          addClass(nav, "closed");
	          removeClass(nav, "opened");
	          removeClass(htmlEl, opts.navActiveClass);
	          removeClass(navToggle, "active");
	          setAttributes(nav, { "aria-hidden": "true" });
	
	          if (opts.animate) {
	            hasAnimFinished = false;
	            setTimeout(function () {
	              nav.style.position = "absolute";
	              hasAnimFinished = true;
	            }, opts.transition + 10);
	          } else {
	            nav.style.position = "absolute";
	          }
	
	          navOpen = false;
	          opts.close();
	        }
	      },
	
	      resize: function resize() {
	        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
	
	          isMobile = true;
	          setAttributes(navToggle, { "aria-hidden": "false" });
	
	          // If the navigation is hidden
	          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
	            setAttributes(nav, { "aria-hidden": "true" });
	            nav.style.position = "absolute";
	          }
	
	          this._createStyles();
	          this._calcHeight();
	        } else {
	
	          isMobile = false;
	          setAttributes(navToggle, { "aria-hidden": "true" });
	          setAttributes(nav, { "aria-hidden": "false" });
	          nav.style.position = opts.openPos;
	          this._removeStyles();
	        }
	      },
	
	      handleEvent: function handleEvent(e) {
	        var evt = e || window.event;
	
	        switch (evt.type) {
	          case "touchstart":
	            this._onTouchStart(evt);
	            break;
	          case "touchmove":
	            this._onTouchMove(evt);
	            break;
	          case "touchend":
	          case "mouseup":
	            this._onTouchEnd(evt);
	            break;
	          case "click":
	            this._preventDefault(evt);
	            break;
	          case "keyup":
	            this._onKeyUp(evt);
	            break;
	          case "resize":
	            this.resize(evt);
	            break;
	        }
	      },
	
	      // Private methods
	      _init: function _init() {
	        this.index = index++;
	
	        addClass(nav, opts.navClass);
	        addClass(nav, opts.navClass + "-" + this.index);
	        addClass(nav, "closed");
	        hasAnimFinished = true;
	        navOpen = false;
	
	        this._closeOnNavClick();
	        this._createToggle();
	        this._transitions();
	        this.resize();
	
	        // IE8 hack
	        var self = this;
	        setTimeout(function () {
	          self.resize();
	        }, 20);
	
	        addEvent(window, "resize", this, false);
	        addEvent(document.body, "touchmove", this, false);
	        addEvent(navToggle, "touchstart", this, false);
	        addEvent(navToggle, "touchend", this, false);
	        addEvent(navToggle, "mouseup", this, false);
	        addEvent(navToggle, "keyup", this, false);
	        addEvent(navToggle, "click", this, false);
	
	        // Init callback
	        opts.init();
	      },
	
	      _createStyles: function _createStyles() {
	        if (!styleElement.parentNode) {
	          styleElement.type = "text/css";
	          document.getElementsByTagName("head")[0].appendChild(styleElement);
	        }
	      },
	
	      _removeStyles: function _removeStyles() {
	        if (styleElement.parentNode) {
	          styleElement.parentNode.removeChild(styleElement);
	        }
	      },
	
	      _createToggle: function _createToggle() {
	        if (!opts.customToggle) {
	          var toggle = document.createElement("a");
	          toggle.innerHTML = opts.label;
	          setAttributes(toggle, {
	            "href": "#",
	            "class": "nav-toggle"
	          });
	
	          if (opts.insert === "after") {
	            nav.parentNode.insertBefore(toggle, nav.nextSibling);
	          } else {
	            nav.parentNode.insertBefore(toggle, nav);
	          }
	
	          navToggle = toggle;
	        } else {
	          var toggleEl = opts.customToggle.replace("#", "");
	
	          if (document.getElementById(toggleEl)) {
	            navToggle = document.getElementById(toggleEl);
	          } else if (document.querySelector(toggleEl)) {
	            navToggle = document.querySelector(toggleEl);
	          } else {
	            throw new Error("The custom nav toggle you are trying to select doesn't exist");
	          }
	        }
	      },
	
	      _closeOnNavClick: function _closeOnNavClick() {
	        if (opts.closeOnNavClick && "querySelectorAll" in document) {
	          var links = nav.querySelectorAll("a"),
	              self = this;
	          forEach(links, function (i, el) {
	            addEvent(links[i], "click", function () {
	              if (isMobile) {
	                self.toggle();
	              }
	            }, false);
	          });
	        }
	      },
	
	      _preventDefault: function _preventDefault(e) {
	        if (e.preventDefault) {
	          e.preventDefault();
	          e.stopPropagation();
	        } else {
	          e.returnValue = false;
	        }
	      },
	
	      _onTouchStart: function _onTouchStart(e) {
	        e.stopPropagation();
	        if (opts.insert === "after") {
	          addClass(document.body, "disable-pointer-events");
	        }
	        this.startX = e.touches[0].clientX;
	        this.startY = e.touches[0].clientY;
	        this.touchHasMoved = false;
	        removeEvent(navToggle, "mouseup", this, false);
	      },
	
	      _onTouchMove: function _onTouchMove(e) {
	        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
	          this.touchHasMoved = true;
	        }
	      },
	
	      _onTouchEnd: function _onTouchEnd(e) {
	        this._preventDefault(e);
	        if (!this.touchHasMoved) {
	          if (e.type === "touchend") {
	            this.toggle();
	            if (opts.insert === "after") {
	              setTimeout(function () {
	                removeClass(document.body, "disable-pointer-events");
	              }, opts.transition + 300);
	            }
	            return;
	          } else {
	            var evt = e || window.event;
	            // If it isn't a right click
	            if (!(evt.which === 3 || evt.button === 2)) {
	              this.toggle();
	            }
	          }
	        }
	      },
	
	      _onKeyUp: function _onKeyUp(e) {
	        var evt = e || window.event;
	        if (evt.keyCode === 13) {
	          this.toggle();
	        }
	      },
	
	      _transitions: function _transitions() {
	        if (opts.animate) {
	          var objStyle = nav.style,
	              transition = "max-height " + opts.transition + "ms";
	
	          objStyle.WebkitTransition = transition;
	          objStyle.MozTransition = transition;
	          objStyle.OTransition = transition;
	          objStyle.transition = transition;
	        }
	      },
	
	      _calcHeight: function _calcHeight() {
	        var savedHeight = 0;
	        for (var i = 0; i < nav.inner.length; i++) {
	          savedHeight += nav.inner[i].offsetHeight;
	        }
	        var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important}";
	
	        if (styleElement.styleSheet) {
	          styleElement.styleSheet.cssText = innerStyles;
	        } else {
	          styleElement.innerHTML = innerStyles;
	        }
	
	        innerStyles = "";
	      }
	
	    };
	
	    return new ResponsiveNav(el, options);
	  };
	
	  window.responsiveNav = responsiveNav;
	})(document, window, 0);
	
	(function (document, window, index) {
	
	  "use strict";
	
	  var responsiveNav = function responsiveNav(el, options) {
	
	    var computed = !!window.getComputedStyle;
	
	    // getComputedStyle polyfill
	    if (!computed) {
	      window.getComputedStyle = function (el) {
	        this.el = el;
	        this.getPropertyValue = function (prop) {
	          var re = /(\-([a-z]){1})/g;
	          if (prop === "float") {
	            prop = "styleFloat";
	          }
	          if (re.test(prop)) {
	            prop = prop.replace(re, function () {
	              return arguments[2].toUpperCase();
	            });
	          }
	          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	        };
	        return this;
	      };
	    }
	    /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */
	    // fn arg can be an object or a function, thanks to handleEvent
	    // read more at: http://www.thecssninja.com/javascript/handleevent
	    var addEvent = function addEvent(el, evt, fn, bubble) {
	      if ("addEventListener" in el) {
	        // BBOS6 doesn't support handleEvent, catch and polyfill
	        try {
	          el.addEventListener(evt, fn, bubble);
	        } catch (e) {
	          if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	            el.addEventListener(evt, function (e) {
	              // Bind fn as this and set first arg as event object
	              fn.handleEvent.call(fn, e);
	            }, bubble);
	          } else {
	            throw e;
	          }
	        }
	      } else if ("attachEvent" in el) {
	        // check if the callback is an object and contains handleEvent
	        if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	          el.attachEvent("on" + evt, function () {
	            // Bind fn as this
	            fn.handleEvent.call(fn);
	          });
	        } else {
	          el.attachEvent("on" + evt, fn);
	        }
	      }
	    },
	        removeEvent = function removeEvent(el, evt, fn, bubble) {
	      if ("removeEventListener" in el) {
	        try {
	          el.removeEventListener(evt, fn, bubble);
	        } catch (e) {
	          if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	            el.removeEventListener(evt, function (e) {
	              fn.handleEvent.call(fn, e);
	            }, bubble);
	          } else {
	            throw e;
	          }
	        }
	      } else if ("detachEvent" in el) {
	        if ((typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) === "object" && fn.handleEvent) {
	          el.detachEvent("on" + evt, function () {
	            fn.handleEvent.call(fn);
	          });
	        } else {
	          el.detachEvent("on" + evt, fn);
	        }
	      }
	    },
	        getChildren = function getChildren(e) {
	      if (e.children.length < 1) {
	        throw new Error("The Nav container has no containing elements");
	      }
	      // Store all children in array
	      var children = [];
	      // Loop through children and store in array if child != TextNode
	      for (var i = 0; i < e.children.length; i++) {
	        if (e.children[i].nodeType === 1) {
	          children.push(e.children[i]);
	        }
	      }
	      return children;
	    },
	        setAttributes = function setAttributes(el, attrs) {
	      for (var key in attrs) {
	        el.setAttribute(key, attrs[key]);
	      }
	    },
	        addClass = function addClass(el, cls) {
	      if (el.className.indexOf(cls) !== 0) {
	        el.className += " " + cls;
	        el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
	      }
	    },
	        removeClass = function removeClass(el, cls) {
	      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
	      el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
	    },
	
	
	    // forEach method that passes back the stuff we need
	    forEach = function forEach(array, callback, scope) {
	      for (var i = 0; i < array.length; i++) {
	        callback.call(scope, i, array[i]);
	      }
	    };
	
	    var nav,
	        opts,
	        navToggle,
	        styleElement = document.createElement("style"),
	        htmlEl = document.documentElement,
	        hasAnimFinished,
	        isMobile,
	        navOpen;
	
	    var ResponsiveNav = function ResponsiveNav(el, options) {
	      var i;
	
	      // Default options
	      this.options = {
	        animate: true, // Boolean: Use CSS3 transitions, true or false
	        transition: 284, // Integer: Speed of the transition, in milliseconds
	        label: "Menu", // String: Label for the navigation toggle
	        insert: "before", // String: Insert the toggle before or after the navigation
	        customToggle: "", // Selector: Specify the ID of a custom toggle
	        closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
	        openPos: "relative", // String: Position of the opened nav, relative or static
	        navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
	        navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
	        jsClass: "js", // String: 'JS enabled' class which is added to <html> element
	        init: function init() {}, // Function: Init callback
	        open: function open() {}, // Function: Open callback
	        close: function close() {} // Function: Close callback
	      };
	
	      // User defined options
	      for (i in options) {
	        this.options[i] = options[i];
	      }
	
	      // Adds "js" class for <html>
	      addClass(htmlEl, this.options.jsClass);
	
	      // Wrapper
	      this.wrapperEl = el.replace("#", "");
	
	      // Try selecting ID first
	      if (document.getElementById(this.wrapperEl)) {
	        this.wrapper = document.getElementById(this.wrapperEl);
	
	        // If element with an ID doesn't exist, use querySelector
	      } else if (document.querySelector(this.wrapperEl)) {
	        this.wrapper = document.querySelector(this.wrapperEl);
	
	        // If element doesn't exists, stop here.
	      } else {
	        throw new Error("The nav element you are trying to select doesn't exist");
	      }
	
	      // Inner wrapper
	      this.wrapper.inner = getChildren(this.wrapper);
	
	      // For minification
	      opts = this.options;
	      nav = this.wrapper;
	
	      // Init
	      this._init(this);
	    };
	
	    ResponsiveNav.prototype = {
	
	      // Public methods
	      destroy: function destroy() {
	        this._removeStyles();
	        removeClass(nav, "closed");
	        removeClass(nav, "opened");
	        removeClass(nav, opts.navClass);
	        removeClass(nav, opts.navClass + "-" + this.index);
	        removeClass(htmlEl, opts.navActiveClass);
	        nav.removeAttribute("style");
	        nav.removeAttribute("aria-hidden");
	
	        removeEvent(window, "resize", this, false);
	        removeEvent(document.body, "touchmove", this, false);
	        removeEvent(navToggle, "touchstart", this, false);
	        removeEvent(navToggle, "touchend", this, false);
	        removeEvent(navToggle, "mouseup", this, false);
	        removeEvent(navToggle, "keyup", this, false);
	        removeEvent(navToggle, "click", this, false);
	
	        if (!opts.customToggle) {
	          navToggle.parentNode.removeChild(navToggle);
	        } else {
	          navToggle.removeAttribute("aria-hidden");
	        }
	      },
	
	      toggle: function toggle() {
	        if (hasAnimFinished === true) {
	          if (!navOpen) {
	            this.open();
	          } else {
	            this.close();
	          }
	        }
	      },
	
	      open: function open() {
	        if (!navOpen) {
	          removeClass(nav, "closed");
	          addClass(nav, "opened");
	          addClass(htmlEl, opts.navActiveClass);
	          addClass(navToggle, "active");
	          nav.style.position = opts.openPos;
	          setAttributes(nav, { "aria-hidden": "false" });
	          navOpen = true;
	          opts.open();
	        }
	      },
	
	      close: function close() {
	        if (navOpen) {
	          addClass(nav, "closed");
	          removeClass(nav, "opened");
	          removeClass(htmlEl, opts.navActiveClass);
	          removeClass(navToggle, "active");
	          setAttributes(nav, { "aria-hidden": "true" });
	
	          if (opts.animate) {
	            hasAnimFinished = false;
	            setTimeout(function () {
	              nav.style.position = "absolute";
	              hasAnimFinished = true;
	            }, opts.transition + 10);
	          } else {
	            nav.style.position = "absolute";
	          }
	
	          navOpen = false;
	          opts.close();
	        }
	      },
	
	      resize: function resize() {
	        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
	
	          isMobile = true;
	          setAttributes(navToggle, { "aria-hidden": "false" });
	
	          // If the navigation is hidden
	          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
	            setAttributes(nav, { "aria-hidden": "true" });
	            nav.style.position = "absolute";
	          }
	
	          this._createStyles();
	          this._calcHeight();
	        } else {
	
	          isMobile = false;
	          setAttributes(navToggle, { "aria-hidden": "true" });
	          setAttributes(nav, { "aria-hidden": "false" });
	          nav.style.position = opts.openPos;
	          this._removeStyles();
	        }
	      },
	
	      handleEvent: function handleEvent(e) {
	        var evt = e || window.event;
	
	        switch (evt.type) {
	          case "touchstart":
	            this._onTouchStart(evt);
	            break;
	          case "touchmove":
	            this._onTouchMove(evt);
	            break;
	          case "touchend":
	          case "mouseup":
	            this._onTouchEnd(evt);
	            break;
	          case "click":
	            this._preventDefault(evt);
	            break;
	          case "keyup":
	            this._onKeyUp(evt);
	            break;
	          case "resize":
	            this.resize(evt);
	            break;
	        }
	      },
	
	      // Private methods
	      _init: function _init() {
	        this.index = index++;
	
	        addClass(nav, opts.navClass);
	        addClass(nav, opts.navClass + "-" + this.index);
	        addClass(nav, "closed");
	        hasAnimFinished = true;
	        navOpen = false;
	
	        this._closeOnNavClick();
	        this._createToggle();
	        this._transitions();
	        this.resize();
	
	        // IE8 hack
	        var self = this;
	        setTimeout(function () {
	          self.resize();
	        }, 20);
	
	        addEvent(window, "resize", this, false);
	        addEvent(document.body, "touchmove", this, false);
	        addEvent(navToggle, "touchstart", this, false);
	        addEvent(navToggle, "touchend", this, false);
	        addEvent(navToggle, "mouseup", this, false);
	        addEvent(navToggle, "keyup", this, false);
	        addEvent(navToggle, "click", this, false);
	
	        // Init callback
	        opts.init();
	      },
	
	      _createStyles: function _createStyles() {
	        if (!styleElement.parentNode) {
	          styleElement.type = "text/css";
	          document.getElementsByTagName("head")[0].appendChild(styleElement);
	        }
	      },
	
	      _removeStyles: function _removeStyles() {
	        if (styleElement.parentNode) {
	          styleElement.parentNode.removeChild(styleElement);
	        }
	      },
	
	      _createToggle: function _createToggle() {
	        if (!opts.customToggle) {
	          var toggle = document.createElement("a");
	          toggle.innerHTML = opts.label;
	          setAttributes(toggle, {
	            "href": "#",
	            "class": "nav-toggle"
	          });
	
	          if (opts.insert === "after") {
	            nav.parentNode.insertBefore(toggle, nav.nextSibling);
	          } else {
	            nav.parentNode.insertBefore(toggle, nav);
	          }
	
	          navToggle = toggle;
	        } else {
	          var toggleEl = opts.customToggle.replace("#", "");
	
	          if (document.getElementById(toggleEl)) {
	            navToggle = document.getElementById(toggleEl);
	          } else if (document.querySelector(toggleEl)) {
	            navToggle = document.querySelector(toggleEl);
	          } else {
	            throw new Error("The custom nav toggle you are trying to select doesn't exist");
	          }
	        }
	      },
	
	      _closeOnNavClick: function _closeOnNavClick() {
	        if (opts.closeOnNavClick && "querySelectorAll" in document) {
	          var links = nav.querySelectorAll("a"),
	              self = this;
	          forEach(links, function (i, el) {
	            addEvent(links[i], "click", function () {
	              if (isMobile) {
	                self.toggle();
	              }
	            }, false);
	          });
	        }
	      },
	
	      _preventDefault: function _preventDefault(e) {
	        if (e.preventDefault) {
	          e.preventDefault();
	          e.stopPropagation();
	        } else {
	          e.returnValue = false;
	        }
	      },
	
	      _onTouchStart: function _onTouchStart(e) {
	        e.stopPropagation();
	        if (opts.insert === "after") {
	          addClass(document.body, "disable-pointer-events");
	        }
	        this.startX = e.touches[0].clientX;
	        this.startY = e.touches[0].clientY;
	        this.touchHasMoved = false;
	        removeEvent(navToggle, "mouseup", this, false);
	      },
	
	      _onTouchMove: function _onTouchMove(e) {
	        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
	          this.touchHasMoved = true;
	        }
	      },
	
	      _onTouchEnd: function _onTouchEnd(e) {
	        this._preventDefault(e);
	        if (!this.touchHasMoved) {
	          if (e.type === "touchend") {
	            this.toggle();
	            if (opts.insert === "after") {
	              setTimeout(function () {
	                removeClass(document.body, "disable-pointer-events");
	              }, opts.transition + 300);
	            }
	            return;
	          } else {
	            var evt = e || window.event;
	            // If it isn't a right click
	            if (!(evt.which === 3 || evt.button === 2)) {
	              this.toggle();
	            }
	          }
	        }
	      },
	
	      _onKeyUp: function _onKeyUp(e) {
	        var evt = e || window.event;
	        if (evt.keyCode === 13) {
	          this.toggle();
	        }
	      },
	
	      _transitions: function _transitions() {
	        if (opts.animate) {
	          var objStyle = nav.style,
	              transition = "max-height " + opts.transition + "ms";
	
	          objStyle.WebkitTransition = transition;
	          objStyle.MozTransition = transition;
	          objStyle.OTransition = transition;
	          objStyle.transition = transition;
	        }
	      },
	
	      _calcHeight: function _calcHeight() {
	        var savedHeight = 0;
	        for (var i = 0; i < nav.inner.length; i++) {
	          savedHeight += nav.inner[i].offsetHeight;
	        }
	        var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important}";
	
	        if (styleElement.styleSheet) {
	          styleElement.styleSheet.cssText = innerStyles;
	        } else {
	          styleElement.innerHTML = innerStyles;
	        }
	
	        innerStyles = "";
	      }
	
	    };
	
	    return new ResponsiveNav(el, options);
	  };
	
	  window.responsiveNav = responsiveNav;
	})(document, window, 0);
	
	window.smoothScroll = function (window, document, undefined) {
	
	  'use strict';
	
	  // Default settings
	  // Private {object} variable
	
	  var _defaults = {
	    speed: 500,
	    easing: 'easeInOutCubic',
	    updateURL: false,
	    callbackBefore: function callbackBefore() {},
	    callbackAfter: function callbackAfter() {}
	  };
	
	  // Merge default settings with user options
	  // Private method
	  // Returns an {object}
	  var _mergeObjects = function _mergeObjects(original, updates) {
	    for (var key in updates) {
	      original[key] = updates[key];
	    }
	    return original;
	  };
	
	  // Calculate the easing pattern
	  // Private method
	  // Returns a decimal number
	  var _easingPattern = function _easingPattern(type, time) {
	    if (type == 'easeInQuad') return time * time; // accelerating from zero velocity
	    if (type == 'easeOutQuad') return time * (2 - time); // decelerating to zero velocity
	    if (type == 'easeInOutQuad') return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
	    if (type == 'easeInCubic') return time * time * time; // accelerating from zero velocity
	    if (type == 'easeOutCubic') return --time * time * time + 1; // decelerating to zero velocity
	    if (type == 'easeInOutCubic') return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
	    if (type == 'easeInQuart') return time * time * time * time; // accelerating from zero velocity
	    if (type == 'easeOutQuart') return 1 - --time * time * time * time; // decelerating to zero velocity
	    if (type == 'easeInOutQuart') return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * --time * time * time * time; // acceleration until halfway, then deceleration
	    if (type == 'easeInQuint') return time * time * time * time * time; // accelerating from zero velocity
	    if (type == 'easeOutQuint') return 1 + --time * time * time * time * time; // decelerating to zero velocity
	    if (type == 'easeInOutQuint') return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * --time * time * time * time * time; // acceleration until halfway, then deceleration
	    return time; // no easing, no acceleration
	  };
	
	  // Calculate how far to scroll
	  // Private method
	  // Returns an integer
	  var _getEndLocation = function _getEndLocation(anchor, headerHeight) {
	    var location = 0;
	    if (anchor.offsetParent) {
	      do {
	        location += anchor.offsetTop;
	        anchor = anchor.offsetParent;
	      } while (anchor);
	    }
	    location = location - headerHeight;
	    if (location >= 0) {
	      return location;
	    } else {
	      return 0;
	    }
	  };
	
	  // Convert data-options attribute into an object of key/value pairs
	  // Private method
	  // Returns an {object}
	  var _getDataOptions = function _getDataOptions(options) {
	
	    if (options === null || options === undefined) {
	      return {};
	    } else {
	      var settings = {}; // Create settings object
	      options = options.split(';'); // Split into array of options
	
	      // Create a key/value pair for each setting
	      options.forEach(function (option) {
	        option = option.trim();
	        if (option !== '') {
	          option = option.split(':');
	          settings[option[0]] = option[1].trim();
	        }
	      });
	
	      return settings;
	    }
	  };
	
	  // Update the URL
	  // Private method
	  // Runs functions
	  var _updateURL = function _updateURL(anchor, url) {
	    if ((url === true || url === 'true') && history.pushState) {
	      history.pushState({ pos: anchor.id }, '', anchor);
	    }
	  };
	
	  // Start/stop the scrolling animation
	  // Public method
	  // Runs functions
	  var animateScroll = function animateScroll(toggle, anchor, options, event) {
	
	    // Options and overrides
	    options = _mergeObjects(_defaults, options || {}); // Merge user options with defaults
	    var overrides = _getDataOptions(toggle ? toggle.getAttribute('data-options') : null);
	    var speed = overrides.speed || options.speed;
	    var easing = overrides.easing || options.easing;
	    var updateURL = overrides.updateURL || options.updateURL;
	
	    // Selectors and variables
	    var headerHeight = 55;
	    var startLocation = window.pageYOffset; // Current location on the page
	    var endLocation = _getEndLocation(document.querySelector(anchor), headerHeight); // Scroll to location
	    var animationInterval; // interval timer
	    var distance = endLocation - startLocation; // distance to travel
	    var timeLapsed = 0;
	    var percentage, position;
	
	    // Prevent default click event
	    if (toggle && toggle.tagName === 'A' && event) {
	      event.preventDefault();
	    }
	
	    // Update URL
	    _updateURL(anchor, updateURL);
	
	    // Stop the scroll animation when it reaches its target (or the bottom/top of page)
	    // Private method
	    // Runs functions
	    var _stopAnimateScroll = function _stopAnimateScroll(position, endLocation, animationInterval) {
	      var currentLocation = window.pageYOffset;
	      if (position == endLocation || currentLocation == endLocation || window.innerHeight + currentLocation >= document.body.scrollHeight) {
	        clearInterval(animationInterval);
	        options.callbackAfter(toggle, anchor); // Run callbacks after animation complete
	      }
	    };
	
	    // Loop scrolling animation
	    // Private method
	    // Runs functions
	    var _loopAnimateScroll = function _loopAnimateScroll() {
	      timeLapsed += 16;
	      percentage = timeLapsed / speed;
	      percentage = percentage > 1 ? 1 : percentage;
	      position = startLocation + distance * _easingPattern(easing, percentage);
	      window.scrollTo(0, Math.floor(position));
	      _stopAnimateScroll(position, endLocation, animationInterval);
	    };
	
	    // Set interval timer
	    // Private method
	    // Runs functions
	    var _startAnimateScroll = function _startAnimateScroll() {
	      options.callbackBefore(toggle, anchor); // Run callbacks before animating scroll
	      animationInterval = setInterval(_loopAnimateScroll, 16);
	    };
	
	    // Reset position to fix weird iOS bug
	    // https://github.com/cferdinandi/smooth-scroll/issues/45
	    if (window.pageYOffset === 0) {
	      window.scrollTo(0, 0);
	    }
	
	    // Start scrolling animation
	    _startAnimateScroll();
	  };
	
	  // Initialize Smooth Scroll
	  // Public method
	  // Runs functions
	  var init = function init(options) {
	
	    // Feature test before initializing
	    if ('querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
	
	      // Selectors and variables
	      options = _mergeObjects(_defaults, options || {}); // Merge user options with defaults
	      var toggles = document.querySelectorAll('[data-scroll]'); // Get smooth scroll toggles
	
	      // When a toggle is clicked, run the click handler
	      Array.prototype.forEach.call(toggles, function (toggle, index) {
	        toggle.addEventListener('click', animateScroll.bind(null, toggle, toggle.getAttribute('href'), options), false);
	      });
	    }
	  };
	
	  // Return public methods
	  return {
	    init: init,
	    animateScroll: animateScroll
	  };
	}(window, document);

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map