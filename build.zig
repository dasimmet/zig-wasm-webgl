const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    const mode = b.standardReleaseOptions();
    const lib = b.addSharedLibrary("main", "main.zig", b.version(0, 0, 1));
    lib.setBuildMode(mode);
    lib.setTarget(.{.cpu_arch = .wasm32, .os_tag = .freestanding});
    lib.install();
    b.default_step.dependOn(&lib.step);
}