function Canvas(element){

    this.element = element;
    this.gl = element.getContext('webgl') || element.getContext('experimental-webgl');

    this.memory = null;
    this.aspectRatio = null;
    this.width = null;
    this.height = null;

    this.step = (timestamp) => {
        const rect = this.gl.canvas.getBoundingClientRect();
        const w = this.width  != null ? this.width  : rect.width;
        const h = this.height != null ? this.height : rect.height;
    
        if (this.aspectRatio != null){
            const calcWidth = Math.min(h * this.aspectRatio, w);
            const calcHeigth = Math.min(w / this.aspectRatio, h);
            const calcWOffset = (w - calcWidth) / 2
            const calcHOffset = (h - calcHeigth) / 2
            // console.log([calcWOffset, calcHOffset, calcWidth, calcHeigth, w, h]);
            this.element.width = calcWidth;
            this.element.height = calcHeigth;
            this.gl.viewport(calcWOffset, calcHOffset, calcWidth, calcHeigth);
    
        } else {
            // console.log([w,h]);
            this.element.width = w;
            this.element.height = h;
            this.gl.viewport(0, 0, w, h);
        }
    }

    this.readCharStr = (ptr, len) => {
        const bytes = new Uint8Array(this.memory.buffer, ptr, len);
        return new TextDecoder("utf-8").decode(bytes);
    }
    
    this.shaders = [];
    this.Programs = [];
    this.glBuffers = [];
    this.UniformLocations = [];

    this.consoleLog = (sourcePtr, sourceLen) => {
        const source = this.readCharStr(sourcePtr, sourceLen);
        console.log(source);
    }

    this.Uniform4fv = (locationId, x, y, z, w) => this.gl.uniform4fv(this.UniformLocations[locationId], [x, y, z, w]);
    this.glCreateBuffer = () => {
        this.glBuffers.push(this.gl.createBuffer());
        return this.glBuffers.length - 1;
    }


    this.glGetAttribLocation = (programId, namePtr, nameLen) => this.gl.getAttribLocation(this.Programs[programId], this.readCharStr(namePtr, nameLen));

    this.UseProgram = (programId) => this.gl.useProgram(this.Programs[programId]);
    this.BufferDataBuffer = (type, bufferId) => this.gl.bindBuffer(type, this.glBuffers[bufferId]);
    this.BufferData = (type, dataPtr, count, drawType) => {
        const floats = new Float32Array(this.memory.buffer, dataPtr, count);
        this.gl.bufferData(type, floats, drawType);
    }          


    this.glGetUniformLocation = (programId, namePtr, nameLen) =>  {
        this.UniformLocations.push(this.gl.getUniformLocation(this.Programs[programId], this.readCharStr(namePtr, nameLen)));
        return this.UniformLocations.length - 1;
    }

    this.linkShaderProgram = (vertexShaderId, fragmentShaderId) => {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, this.shaders[vertexShaderId]);
        this.gl.attachShader(program, this.shaders[fragmentShaderId]);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw ("Error linking program:" + gl.getProgramInfoLog (program));
        }
        this.Programs.push(program);
        return this.Programs.length - 1;
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
            Uniform4fv: this.Uniform4fv,
            glCreateBuffer: this.glCreateBuffer,
            BufferDataBuffer: this.BufferDataBuffer,
            BufferData: this.BufferData,
            UseProgram: this.UseProgram,
            glEnableVertexAttribArray: (x) => this.gl.enableVertexAttribArray(x),
            glVertexAttribPointer: (attribLocation, size, type, normalize, stride, offset) => 
                this.gl.vertexAttribPointer(attribLocation, size, type, normalize, stride, offset),
            glDrawArrays: (type, offset, count) => this.gl.drawArrays(type, offset, count),
            consoleLog: this.consoleLog,
        }
    };
}

export default Canvas