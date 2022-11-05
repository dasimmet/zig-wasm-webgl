const gl = @import("webgl.zig");
const std = @import("std");

const allocator = std.heap.page_allocator;

const positions = [_]f32 {0, 0, 0, 0.5, 0.7, 0};

var program_id: c_uint = undefined;
var positionAttributeLocation: c_int = undefined;
var offsetUniformLocation: c_int = undefined;
var positionBuffer: c_uint = undefined;

export fn onInit() void {
  gl.glClearColor(0.1, 0.1, 0.5, 1.0);
  gl.glEnable(gl.GL_DEPTH_TEST);
  gl.glDepthFunc(gl.GL_LEQUAL);
  gl.glClear(gl.GL_COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);

  const vertex_shader_id = gl.compileShader(&gl.vertexShader[0], gl.vertexShader.len, gl.GL_VERTEX_SHADER);
  const fsId = gl.compileShader(&gl.fragmentShader[0], gl.fragmentShader.len, gl.GL_FRAGMENT_SHADER);

  program_id = gl.linkShaderProgram(vertex_shader_id, fsId);

  const a_position = "a_position";
  const u_offset = "u_offset";

  positionAttributeLocation = gl.glGetAttribLocation(program_id, &a_position[0], a_position.len);
  offsetUniformLocation = gl.glGetUniformLocation(program_id, &u_offset[0], u_offset.len);

  positionBuffer = gl.glCreateBuffer();
  gl.glBindBuffer(gl.GL_ARRAY_BUFFER, positionBuffer);
  gl.glBufferData(gl.GL_ARRAY_BUFFER, &positions[0], 6, gl.GL_STATIC_DRAW);
}

var previous: c_int = 0;
var x: f32 = 0;
var y: f32 = 0;

export fn onAnimationFrame(timestamp: c_int) void {
  const delta = if(previous > 0) timestamp - previous else 0;
  const tsf = @intToFloat(f32, timestamp)/1000;

  x = std.math.sin(std.math.pi * tsf);

  y = std.math.cos(std.math.pi * tsf);

  const log = std.fmt.allocPrint(allocator,"TSF: {d:.5} Delta: {} X: {d:.5} Y: {d:.5}", .{tsf,delta, x, y}) catch "";
  defer allocator.free(log);
  
  gl.consoleLogStr(log);

  gl.glClear(gl.GL_COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);

  gl.glUseProgram(program_id);
  gl.glEnableVertexAttribArray(@intCast(c_uint, positionAttributeLocation));
  gl.glBindBuffer(gl.GL_ARRAY_BUFFER, positionBuffer);
  gl.glVertexAttribPointer(@intCast(c_uint, positionAttributeLocation), 2, gl.GL_f32, 0, 0, 0);
  gl.glUniform4fv(offsetUniformLocation, x, y, 0.0, 0.0);
  gl.glDrawArrays(gl.GL_TRIANGLES, 0, 3);
  previous = timestamp;
}
