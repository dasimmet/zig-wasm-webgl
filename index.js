import Canvas from "./gl.js"

const canvas = document.getElementById("canvas");
const glCanvas = new Canvas(canvas);
glCanvas.gl.viewport(0, 0, canvas.width, canvas.height);

function fetchAndInstantiate(url, importObject) {
  return fetch(url).then(response =>
    response.arrayBuffer()
  ).then(bytes =>
    WebAssembly.instantiate(bytes, importObject)
  ).then(results =>
    results.instance
  );
}

console.log(glCanvas.env());
fetchAndInstantiate('zig-out/lib/main.wasm', {env:glCanvas.env()}).then(function(instance) {
  glCanvas.memory = instance.exports.memory;
  instance.exports.onInit();

  glCanvas.onAnimationFrame = instance.exports.onAnimationFrame;

  const logArray = new Int32Array(glCanvas.memory.buffer, 0, 100);

  function step(timestamp) {
    glCanvas.onAnimationFrame(timestamp);
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
});