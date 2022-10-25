function Canvas(element){

    let memory;

    this.readCharStr = (ptr, len) => {
        const bytes = new Uint8Array(this.memory.buffer, ptr, len);
        return new TextDecoder("utf-8").decode(bytes);
    }

    this.gl = element.getContext('webgl') || element.getContext('experimental-webgl');
    
    this.shaders = [];
    this.glPrograms = [];
    this.glBuffers = [];
    this.glUniformLocations = [];

    this.consoleLog = (sourcePtr, sourceLen) => {
        const source = readCharStr(sourcePtr, sourceLen);
        console.log(source);
    }

    this.glUniform4fv = (locationId, x, y, z, w) => this.gl.uniform4fv(this.glUniformLocations[locationId], [x, y, z, w]);
    this.glCreateBuffer = () => {
        this.glBuffers.push(this.gl.createBuffer());
        return this.glBuffers.length - 1;
    }


    this.glGetAttribLocation = (programId, namePtr, nameLen) => this.gl.getAttribLocation(this.glPrograms[programId], this.readCharStr(namePtr, nameLen));

    this.glUseProgram = (programId) => this.gl.useProgram(this.glPrograms[programId]);
    this.glBindBuffer = (type, bufferId) => this.gl.bindBuffer(type, this.glBuffers[bufferId]);
    this.glBufferData = (type, dataPtr, count, drawType) => {
        const floats = new Float32Array(this.memory.buffer, dataPtr, count);
        this.gl.bufferData(type, floats, drawType);
    }          


    this.glGetUniformLocation = (programId, namePtr, nameLen) =>  {
        this.glUniformLocations.push(this.gl.getUniformLocation(this.glPrograms[programId], this.readCharStr(namePtr, nameLen)));
        return this.glUniformLocations.length - 1;
    }

    this.linkShaderProgram = (vertexShaderId, fragmentShaderId) => {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, this.shaders[vertexShaderId]);
        this.gl.attachShader(program, this.shaders[fragmentShaderId]);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw ("Error linking program:" + gl.getProgramInfoLog (program));
        }
        this.glPrograms.push(program);
        return this.glPrograms.length - 1;
    }

    
    this.compileShader = (sourcePtr, sourceLen, type) => {
        const source = this.readCharStr(sourcePtr, sourceLen);
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw "Error compiling shader:" + this.gl.getShaderInfoLog(shader);
        }
        this.shaders.push(shader);
        return this.shaders.length - 1;
    }
            
    this.env = () => {
        return {        
            compileShader: this.compileShader,
            linkShaderProgram: this.linkShaderProgram,
            glClearColor: (r,g,b,a) => this.gl.clearColor(r,g,b,a),
            glEnable: (x) => this.gl.enable(x),
            glDepthFunc: (x) => this.gl.depthFunc(x),
            glClear: (x) => this.gl.clear(x),
            glGetAttribLocation: this.glGetAttribLocation,
            glGetUniformLocation: this.glGetUniformLocation,
            glUniform4fv: this.glUniform4fv,
            glCreateBuffer: this.glCreateBuffer,
            glBindBuffer: this.glBindBuffer,
            glBufferData: this.glBufferData,
            glUseProgram: this.glUseProgram,
            glEnableVertexAttribArray: (x) => this.gl.enableVertexAttribArray(x),
            glVertexAttribPointer: (attribLocation, size, type, normalize, stride, offset) => 
                this.gl.vertexAttribPointer(attribLocation, size, type, normalize, stride, offset),
            glDrawArrays: (type, offset, count) => this.gl.drawArrays(type, offset, count),
            consoleLog: this.consoleLog,
        }
    };
}

export default Canvas