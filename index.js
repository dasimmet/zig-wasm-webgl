import glCanvas from "./gl.js"

const canvas = document.getElementById("canvas");

var Canvas = new glCanvas(canvas);
Canvas.aspectRatio = 4/3;

function fetchAndInstantiate(url, importObject) {
  return fetch(url).then(response =>
    response.arrayBuffer()
  ).then(bytes =>
    WebAssembly.instantiate(bytes, importObject)
  ).then(results =>
    results.instance
  );
}

console.log(Canvas.env());
fetchAndInstantiate('zig-out/lib/main.wasm', {env:Canvas.env()}).then(function(instance) {
  Canvas.memory = instance.exports.memory;
  instance.exports.onInit();

  Canvas.onAnimationFrame = instance.exports.onAnimationFrame;

  const logArray = new Int32Array(Canvas.memory.buffer, 0, 100);

  function step(timestamp) {
    Canvas.step(timestamp);
    Canvas.onAnimationFrame(timestamp);
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
});