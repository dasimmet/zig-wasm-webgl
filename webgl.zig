// Shaders
pub extern fn compileShader(source: *const u8 , len:  c_uint, type: c_uint) c_uint;
pub extern fn linkShaderProgram(vertexShaderId: c_uint, fragmentShaderId: c_uint) c_uint;

// GL
pub extern fn ClearColor(_: f32, _: f32, _: f32, _: f32) void;
pub extern fn Enable(_: c_uint) void;
pub extern fn DepthFunc(_: c_uint) void;
pub extern fn Clear(_: c_uint) void;
pub extern fn GetAttribLocation(_: c_uint, _: *const u8, _: c_uint) c_int ;
pub extern fn GetUniformLocation(_: c_uint, _: *const u8, _: c_uint) c_int;
pub extern fn Uniform4fv(_: c_int, _: f32, _: f32, _: f32, _: f32) void;
pub extern fn CreateBuffer() c_uint;
pub extern fn BufferDataBuffer(_: c_uint, _: c_uint) void;
pub extern fn BufferData(_: c_uint, _: *const f32,  _:c_uint, _: c_uint) void;
pub extern fn UseProgram(_: c_uint) void;
pub extern fn EnableVertexAttribArray(_: c_uint) void;
pub extern fn VertexAttribPointer(_: c_uint, _: c_uint, _: c_uint, _: c_uint, _: c_uint, _: c_uint) void;
pub extern fn DrawArrays(_: c_uint, _: c_uint, _: c_uint) void;

// Identifier constants pulled from WebGLRenderingContext
pub const GL_VERTEX_SHADER: c_uint = 35633;
pub const GL_FRAGMENT_SHADER: c_uint = 35632;
pub const GL_ARRAY_BUFFER: c_uint = 34962;
pub const GL_TRIANGLES: c_uint = 4;
pub const GL_STATIC_DRAW: c_uint = 35044;
pub const GL_f32: c_uint = 5126;
pub const GL_DEPTH_TEST: c_uint = 2929;
pub const GL_LEQUAL: c_uint = 515;
pub const GL_COLOR_BUFFER_BIT: c_uint = 16384;
pub const GL_DEPTH_BUFFER_BIT: c_uint = 256;

// js helper
pub extern fn consoleLog(sourcePtr: *const u8, sourceLen: c_uint) void;

pub fn consoleLogStr(string : []const u8) void {
  return consoleLog(&string[0], string.len);
}

pub const vertexShader = 
  \\attribute vec4 a_position;
  \\uniform vec4 u_offset;
  \\void main() {
  \\  gl_Position = a_position + u_offset;
  \\}
;

pub const fragmentShader =
  \\precision mediump float;
  \\void main() {
  \\ gl_FragColor = vec4(1.3, 0.3, 0.3, 1.0);
  \\}
;