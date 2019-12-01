if (window._ew) throw 'skipping layered ew.js';

import './src/webxr-polyfill.module.js';
import './src/HelioWebXRPolyfill.js';
import './src/event-target-shim.mjs';

import core from './src/core.js';

import symbols from './src/symbols.js';
import THREE from './lib/three-min.js';

import GlobalContext from './src/GlobalContext.js';

import {XREngine, XREngineTemplate} from './src/xr-engine.js';
window.XREngine = XREngine;
window.XREngineTemplate = XREngineTemplate;

import utils from './src/utils.js';
const {_makeNullPromise} = utils;

GlobalContext.args = {};
GlobalContext.version = '';

const args = {};
core.setArgs(args);
core.setVersion('0.0.1');

const windows = [];
GlobalContext.windows = windows;
GlobalContext.loadPromise = _makeNullPromise();

const xrState = (() => {
  const _makeSab = size => {
    const sab = new ArrayBuffer(size);
    let index = 0;
    return (c, n) => {
      const result = new c(sab, index, n);
      index += result.byteLength;
      return result;
    };
  };
  const _makeTypedArray = _makeSab(32*1024);

  const result = {};
  result.isPresenting = _makeTypedArray(Uint32Array, 1);
  result.isPresentingReal = _makeTypedArray(Uint32Array, 1);
  result.renderWidth = _makeTypedArray(Float32Array, 1);
  result.renderWidth[0] = window.innerWidth * window.devicePixelRatio;
  result.renderHeight = _makeTypedArray(Float32Array, 1);
  result.renderHeight[0] = window.innerHeight * window.devicePixelRatio;
  result.metrics = _makeTypedArray(Uint32Array, 2);
  result.metrics[0] = window.innerWidth;
  result.metrics[1] = window.innerHeight;
  result.devicePixelRatio = _makeTypedArray(Float32Array, 1);
  result.devicePixelRatio[0] = window.devicePixelRatio;
  result.stereo = _makeTypedArray(Uint32Array, 1);
  // result.stereo[0] = 1;
  result.canvasViewport = _makeTypedArray(Float32Array, 4);
  result.canvasViewport.set(Float32Array.from([0, 0, window.innerWidth, window.innerHeight]));
  result.depthNear = _makeTypedArray(Float32Array, 1);
  result.depthNear[0] = 0.1;
  result.depthFar = _makeTypedArray(Float32Array, 1);
  result.depthFar[0] = 2000.0;
  result.position = _makeTypedArray(Float32Array, 3);
  result.orientation = _makeTypedArray(Float32Array, 4);
  result.orientation[3] = 1;
  result.leftViewMatrix = _makeTypedArray(Float32Array, 16);
  result.leftViewMatrix.set(Float32Array.from([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
  result.rightViewMatrix = _makeTypedArray(Float32Array, 16);
  result.rightViewMatrix.set(result.leftViewMatrix);
  // new THREE.PerspectiveCamera(110, 2, 0.1, 2000).projectionMatrix.toArray()
  result.leftProjectionMatrix = _makeTypedArray(Float32Array, 16);
  result.leftProjectionMatrix.set(Float32Array.from([0.3501037691048549, 0, 0, 0, 0, 0.7002075382097098, 0, 0, 0, 0, -1.00010000500025, -1, 0, 0, -0.200010000500025, 0]));
  result.rightProjectionMatrix = _makeTypedArray(Float32Array, 16);
  result.rightProjectionMatrix.set(result.leftProjectionMatrix);
  result.leftOffset = _makeTypedArray(Float32Array, 3);
  result.leftOffset.set(Float32Array.from([-0.625/2, 0, 0]));
  result.rightOffset = _makeTypedArray(Float32Array, 3);
  result.leftOffset.set(Float32Array.from([0.625/2, 0, 0]));
  result.leftFov = _makeTypedArray(Float32Array, 4);
  result.leftFov.set(Float32Array.from([45, 45, 45, 45]));
  result.rightFov = _makeTypedArray(Float32Array, 4);
  result.rightFov.set(result.leftFov);
  result.offsetEpoch = _makeTypedArray(Uint32Array, 1);
  const _makeGamepad = () => ({
    connected: _makeTypedArray(Uint32Array, 1),
    position: _makeTypedArray(Float32Array, 3),
    orientation: (() => {
      const result = _makeTypedArray(Float32Array, 4);
      result[3] = 1;
      return result;
    })(),
    /* direction: (() => { // derived
      const result = _makeTypedArray(Float32Array, 3);
      result[2] = -1;
      return result;
    })(), */
    transformMatrix: (() => { // derived
      const result = _makeTypedArray(Float32Array, 16);
      result.set(Float32Array.from([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
      return result;
    })(),
    gripPosition: _makeTypedArray(Float32Array, 3),
    gripOrientation: (() => {
      const result = _makeTypedArray(Float32Array, 4);
      result[3] = 1;
      return result;
    })(),
    /* gripDirection: (() => { // derived
      const result = _makeTypedArray(Float32Array, 3);
      result[2] = -1;
      return result;
    })(), */
    gripTransformMatrix: (() => { // derived
      const result = _makeTypedArray(Float32Array, 16);
      result.set(Float32Array.from([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
      return result;
    })(),
    buttons: (() => {
      const result = Array(10);
      for (let i = 0; i < result.length; i++) {
        result[i] = {
          pressed: _makeTypedArray(Uint32Array, 1),
          touched: _makeTypedArray(Uint32Array, 1),
          value: _makeTypedArray(Float32Array, 1),
        };
      }
      return result;
    })(),
    axes: _makeTypedArray(Float32Array, 10),
  });
  result.gamepads = (() => {
    const result = Array(2);
    for (let i = 0; i < result.length; i++) {
      result[i] = _makeGamepad();
    }
    return result;
  })();
  result.id = _makeTypedArray(Uint32Array, 1);
  result.hmdType = _makeTypedArray(Uint32Array, 1);
  result.tex = _makeTypedArray(Uint32Array, 1);
  result.depthTex = _makeTypedArray(Uint32Array, 1);
  result.msTex = _makeTypedArray(Uint32Array, 1);
  result.msDepthTex = _makeTypedArray(Uint32Array, 1);
  result.aaEnabled = _makeTypedArray(Uint32Array, 1);
  result.fakeVrDisplayEnabled = _makeTypedArray(Uint32Array, 1);
  // result.blobId = _makeTypedArray(Uint32Array, 1);

  return result;
})();
GlobalContext.xrState = xrState;

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localMatrix = new THREE.Matrix4();

customElements.define('xr-engine', XREngine);
customElements.define('xr-engine-template', XREngineTemplate, {
  extends: 'template',
});

['keydown', 'keyup', 'keypress', 'paste'].forEach(type => {
  window.addEventListener(type, e => {
    const event = {
      altKey: e.altKey,
      charCode: e.charCode,
      code: e.code,
      ctrlKey: e.ctrlKey,
      // detail: e.detail,
      key: e.key,
      keyCode: e.keyCode,
      location: e.location,
      metaKey: e.metaKey,
      repeat: e.repeat,
      shiftKey: e.shiftKey,
      which: e.which,
      // timeStamp: e.timeStamp,
      clipboardData: e.clipboardData,
      preventDefault() {
        e.preventDefault();
      },
      stopPropagation() {
        e.stopPropagation();
      },
    };
    for (let i = 0; i < windows.length; i++) {
      windows[i].emit(type, event);
    }
  });
});
window.addEventListener('resize', e => {
  xrState.metrics[0] = window.innerWidth;
  xrState.metrics[1] = window.innerHeight;
  xrState.devicePixelRatio[0] = window.devicePixelRatio;

  for (let i = 0; i < windows.length; i++) {
    windows[i].emit('resize', {});
  }
});
window.document.addEventListener('pointerlockchange', e => {
  const pointerLockElement = !!window.document.pointerLockElement;
  for (let i = 0; i < windows.length; i++) {
    windows[i].emit('pointerlockchange', {
      pointerLockElement,
    });
  }
});
window.document.addEventListener('drop', e => {
  const {
    clientX,
    clientY,
    pageX,
    pageY,
    offsetX,
    offsetY,
    screenX,
    screenY,
    movementX,
    movementY,
    ctrlKey,
    shiftKey,
    altKey,
    metaKey,
    button,
    dataTransfer,
  } = e;

  for (let i = 0; i < windows.length; i++) {
    windows[i].emit('drop', {
      clientX,
      clientY,
      pageX,
      pageY,
      offsetX,
      offsetY,
      screenX,
      screenY,
      movementX,
      movementY,
      ctrlKey,
      shiftKey,
      altKey,
      metaKey,
      button,
      dataTransfer,
    });
  }
});
/* window.addEventListener('contextmenu', e => {
  e.preventDefault();
}); */
window.addEventListener('vrdisplayconnect', e => {
  const {display} = e;
  const eyeParameters = ['left', 'right'].map(eye => display.getEyeParameters(eye));
  const width = Math.max(eyeParameters[0].renderWidth, eyeParameters[1].renderWidth);
  const height = Math.max(eyeParameters[0].renderHeight, eyeParameters[1].renderHeight);

  xrState.renderWidth[0] = width;
  xrState.renderHeight[0] = height;

  for (let i = 0; i < windows.length; i++) {
    const win = windows[i];
    if (win.canvas) {
      win.canvas.width = width;
      win.canvas.height = height;
    }
  }
});

/* const topVrPresentState = {
  hmdType: null,
  windowHandle: null,
  fbo: null,
  msFbo: 0,
  vrContext: null,
  vrSystem: null,
  vrCompositor: null,
  hasPose: false,
  mesher: null,
  planeTracker: null,
  handTracker: null,
  eyeTracker: null,
}; */

const requests = [];
const handleRequest = req => {
  if (!_handleRequestImmediate(req)) {
    requests.push(req);
  }
};
GlobalContext.handleRequest = handleRequest;
const _handleRequestImmediate = req => {
  const {type, keypath} = req;

  const windowId = keypath.pop();
  const win = windows.find(win => win.id === windowId);

  const _respond = (error, result) => {
    if (win) {
      win.runAsync({
        method: 'response',
        keypath,
        error,
        result,
      });
    } else {
      console.warn('cannot find window to respond request to', windowId, windows.map(win => win.id));
    }
  };

  switch (type) {
    case 'makeProxyContext': {
      const ctx = win.install();
      _respond(null, ctx);
      break;
    }
    case 'requestPresent': {
      xrState.isPresenting[0] = 1;
      const ctx = win.install();
      _respond(null, ctx);
      break;
    }
    case 'exitPresent': {
      // topVrPresentState.fbo = null;
      xrState.isPresenting[0] = 0;
      _respond(null, null);
      break;
    }
    case 'requestHitTest': {
      const {origin, direction, coordinateSystem} = req;

      /* if (topVrPresentState.hmdType === 'fake') {
        if (!topVrPresentState.mesher) {
          _startFakeMesher();
        }
        topVrPresentState.mesher.requestHitTest(origin, direction, coordinateSystem)
          .then(result => {
            _respond(null, result);
          })
          .catch(err => {
            _respond(err);
          });
      } else { */
        _respond(null, []);
      // }

      return true;
    }
    default:
      return false;
  }
};
/* const _waitHandleRequests = () => {
  for (let i = 0; i < requests.length; i++) {
    _waitHandleRequest(requests[i]);
  }
  requests.length = 0;
}; */
const handlePointerLock = () => {
  window.document.body.requestPointerLock();
};
GlobalContext.handlePointerLock = handlePointerLock;
const handleHapticPulse = ({index, value, duration}) => {
  /* if (topVrPresentState.hmdType === 'openvr') {
    value = Math.min(Math.max(value, 0), 1);
    const deviceIndex = topVrPresentState.vrSystem.GetTrackedDeviceIndexForControllerRole(index + 1);

    const startTime = Date.now();
    const _recurse = () => {
      if ((Date.now() - startTime) < duration) {
        topVrPresentState.vrSystem.TriggerHapticPulse(deviceIndex, 0, value * 4000);
        setTimeout(_recurse, 50);
      }
    };
    setTimeout(_recurse, 50);
  } else { */
    console.warn(`ignoring haptic pulse: ${index}/${value}/${duration}`);
    // TODO: handle the other HMD cases...
  // }
};
GlobalContext.handleHapticPulse = handleHapticPulse;
const handlePaymentRequest = () => {
  throw new Error('no payment request handler');
};
GlobalContext.handlePaymentRequest = handlePaymentRequest;

/* const _computeDerivedGamepadsData = () => {
  const _deriveGamepadData = gamepad => {
    localQuaternion.fromArray(gamepad.orientation);
    localVector
      .set(0, 0, -1)
      .applyQuaternion(localQuaternion)
      .toArray(gamepad.direction);
    localVector.fromArray(gamepad.position);
    localVector2.set(1, 1, 1);
    localMatrix
      .compose(localVector, localQuaternion, localVector2)
      .toArray(gamepad.transformMatrix);
  };
  for (let i = 0; i < xrState.gamepads.length; i++) {
    _deriveGamepadData(xrState.gamepads[i]);
  }
}; */
const _tickAnimationFrame = win => {
  win.clear();
  return win.runAsync({
    method: 'tickAnimationFrame',
    layered: true,
  });
};
const _tickAnimationFrames = () => {
  for (let i = 0; i < windows.length; i++) {
    const win = windows[i];
    if (win.loaded) {
      _tickAnimationFrame(win);
    }
  }
};
core.animate = (timestamp, frame, referenceSpace) => {
  const session = core.getSession();
  if (session) {
    // console.log('animate session', session, frame, referenceSpace);
    // debugger;
    const pose = frame.getViewerPose(referenceSpace);
    const {views} = pose;
    const {inputSources, renderState: {baseLayer: {framebuffer}}} = session;
    const gamepads = navigator.getGamepads();

    const _loadHmd = () => {
      xrState.leftViewMatrix.set(views[0].transform.inverse.matrix);
      xrState.leftProjectionMatrix.set(views[0].projectionMatrix);

      xrState.rightViewMatrix.set(views[1].transform.inverse.matrix);
      xrState.rightProjectionMatrix.set(views[1].projectionMatrix);

      localMatrix
        .fromArray(xrState.leftViewMatrix)
        .getInverse(localMatrix)
        .decompose(localVector, localQuaternion, localVector2)
      localVector.toArray(xrState.position);
      localQuaternion.toArray(xrState.orientation);
    };
    _loadHmd();
 
    // console.log('got gamepads', gamepads);
    // debugger;
    const _loadGamepad = i => {
      const handedness = i === 0 ? 'left' : 'right';
      const inputSource = inputSources.find(inputSource => inputSource.handedness === handedness);
      const xrGamepad = xrState.gamepads[i];

      let pose, gripPose, gamepad;
      if (inputSource && (pose = frame.getPose(inputSource.targetRaySpace, referenceSpace)) && (gripPose = frame.getPose(inputSource.gripSpace, referenceSpace)) && (gamepad = inputSource.gamepad || gamepads[i])) {
        {
          const {transform: {position, orientation, matrix}} = pose;
          xrGamepad.position[0] = position.x;
          xrGamepad.position[1] = position.y;
          xrGamepad.position[2] = position.z;

          xrGamepad.orientation[0] = orientation.x;
          xrGamepad.orientation[1] = orientation.y;
          xrGamepad.orientation[2] = orientation.z;
          xrGamepad.orientation[3] = orientation.w;

          xrGamepad.transformMatrix.set(matrix);
        }
        {
          const {transform: {position, orientation, matrix}} = gripPose;
          xrGamepad.gripPosition[0] = position.x;
          xrGamepad.gripPosition[1] = position.y;
          xrGamepad.gripPosition[2] = position.z;

          xrGamepad.gripOrientation[0] = orientation.x;
          xrGamepad.gripOrientation[1] = orientation.y;
          xrGamepad.gripOrientation[2] = orientation.z;
          xrGamepad.gripOrientation[3] = orientation.w;

          xrGamepad.gripTransformMatrix.set(matrix);
        }
        
        for (let j = 0; j < gamepad.buttons.length; j++) {
          const button = gamepad.buttons[j];
          const xrButton = xrGamepad.buttons[j];
          xrButton.pressed[0] = button.pressed;
          xrButton.touched[0] = button.touched;
          xrButton.value[0] = button.value;
        }
        
        for (let j = 0; j < gamepad.axes.length; j++) {
          xrGamepad.axes[j] = gamepad.axes[j];
        }
        
        xrGamepad.connected[0] = 1;
      } else {
        xrGamepad.connected[0] = 0;
      }
    };
    _loadGamepad(0);
    _loadGamepad(1);

    windows[0] && windows[0].ctx && (windows[0].ctx.xrFramebuffer = framebuffer);
  } else {
    const ctx = windows[0] && windows[0].ctx;
    const xrFramebuffer = ctx && ctx.xrFramebuffer;
    if (xrFramebuffer) {
      ctx.xrFramebuffer = null;
      for (const target in ctx.framebufferState) {
        if (ctx.framebufferState[target] === xrFramebuffer) {
          ctx.bindFramebuffer(target, null);
        }
      }
    }
  }
  
  // _computeDerivedGamepadsData();
  _tickAnimationFrames();
};
core.setSession(null);

export default {
  async register() {
    await navigator.serviceWorker.register('/sw.js');

    if (!navigator.serviceWorker.controller) {
      await new Promise((accept, reject) => {
        const _controllerchange = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.removeEventListener('controllerchange', _controllerchange);
            clearTimeout(timeout);
            accept();
          }
        };
        navigator.serviceWorker.addEventListener('controllerchange', _controllerchange);
        const timeout = setTimeout(() => {
          console.warn('ew timed out');
          debugger;
        }, 10 * 1000);
      });
    }

    console.log('got registration', window.registration);

    GlobalContext.loadPromise.resolve();
  },
  async unregister() {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let i = 0; i < registrations.length; i++) {
      await registrations[i].unregister();
    }
  },
};
