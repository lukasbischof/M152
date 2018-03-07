var gl;
var pMatrix, mvMatrix, matrixBuffer = new Array();
var teapotVertexBuffer, teapotIndexBuffer, teapotTexturePositionBuffer, teapotNormalsBuffer;
var teapotVerticies, teapotIndicies, teapotTextureCoords, teapotVertexNormals;
var skyboxVertexBuffer, skyboxIndexBuffer;
var skyboxVerticies, skyboxIndicies;
var program;
var zoom = -27, startTime;
var glHelper, woodTexture, skyboxTexture;
var texturesEnabled = true, textureFilters = new Object();
var lightningOptions;

lightningOptions = {
	enabled: true,
	diffuseEnabled: true,
	ambient: {
		R: 0.2,
		G: 0.2,
		B: 0.2,
		enabled: true
	},
	point: {
		R: 0.8,
		G: 0.8,
		B: 0.8,
		X: 2.5,
		Y: -1.25,
		Z: -10
	},
	specular: {
		R: 1.0,
		G: 1.0,
		B: 1.0,
		shininess: 40.0,
		enabled: 1
	}
};

window.onunload = function(){
	destroyWebGLComponents();
};

skyboxIndicies = new Uint16Array([
	0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
]);

skyboxVerticies = new Float32Array([
	// Front face
    -30.0, -30.0,  30.0,
     30.0, -30.0,  30.0,
     30.0,  30.0,  30.0,
    -30.0,  30.0,  30.0,

    // Back face
    -30.0, -30.0, -30.0,
    -30.0,  30.0, -30.0,
     30.0,  30.0, -30.0,
     30.0, -30.0, -30.0,

    // Top face
    -30.0,  30.0, -30.0,
    -30.0,  30.0,  30.0,
     30.0,  30.0,  30.0,
     30.0,  30.0, -30.0,

    // Bottom face
    -30.0, -30.0, -30.0,
     30.0, -30.0, -30.0,
     30.0, -30.0,  30.0,
    -30.0, -30.0,  30.0,

    // Right face
     30.0, -30.0, -30.0,
     30.0,  30.0, -30.0,
     30.0,  30.0,  30.0,
     30.0, -30.0,  30.0,

    // Left face
    -30.0, -30.0, -30.0,
    -30.0, -30.0,  30.0,
    -30.0,  30.0,  30.0,
    -30.0,  30.0, -30.0
]);

window.onload = function(){
	var can = document.querySelector("#can");
	can.width = window.innerWidth;
	can.height = window.innerHeight - 80;
	glHelper = new LKWebGLHelper();
	glHelper.initGL('#can');
	if (null === gl){
		alert("anscheinend unterstüzt dein Browser kein WebGL.\n\nBitte lade einen modernen Browser wie z.B. Safari von Apple, Opera Next, Firefox von Mozilla oder Chrome herunter.");
		destroyWebGLComponents();
		throw "no Context found";
	} else
		window.LK_FPS_$ = 26;

	startTime = new Date();

	pMatrix = glHelper.projectionMatrix(25, 0.01, 1000, window.innerHeight / window.innerWidth);
	mvMatrix = glHelper.matrix4();
	rotationMatrix = glHelper.matrix4();
	glHelper.matrix4Identity(mvMatrix);
	glHelper.matrix4Translate(mvMatrix, [ 0.0, 0.0, zoom]);
	glHelper.matrix4Rotate(mvMatrix, glHelper.degToRad(45), [1, 0, 0]);

	initShaders();
	loadTeapot();

	/*document.getElementById("can").addEventListener("mousewheel", function(e) {
		zoom += ((zoom > -686.0999999999995 || e.wheelDeltaY > 0) && (zoom < -18.10000000000016 || e.wheelDeltaY < 0)) ? e.wheelDeltaY / 10 : 0;
		e.preventDefault();
		return 0;
	});*/

	gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
};

function createProgram(vertShadID, fragShadID){
	var _program = gl.createProgram();

	var fShad = glHelper.getShader(gl, fragShadID);
	var vShad = glHelper.getShader(gl, vertShadID);

	if (!fShad || !vShad)
		destroyWebGLComponents();

	var fLog = gl.getShaderInfoLog(fShad), vLog = gl.getShaderInfoLog(vShad);
	if (fLog) {
		console.log("Fragment Shader Info Log: " + fLog);
	}
	if (vLog) {
		console.log("Vertex Shader Info Log: " + vLog);
	}

	gl.attachShader(_program, fShad);
	gl.attachShader(_program, vShad);

	gl.linkProgram(_program);

	var log = gl.getProgramInfoLog(_program);
	if (log) {
		destroyWebGLComponents();
		throw log;
	}

	_program.vertexShaderAttributeLocations = {
	    pos   		  	 	  :  gl.getAttribLocation(_program, "pos"),
	    textureCoords		  :  gl.getAttribLocation(_program, "staticTextureCoords"),
	    vertexNormals		  :  gl.getAttribLocation(_program, "vertexNormals"),

		/* 							     uniform 							     */
	    projectionMatrix 	  :  gl.getUniformLocation(_program, "projectionMatrix"),
	    modelViewMatrix  	  :  gl.getUniformLocation(_program, "modelViewMatrix"),
	    sampler			 	  :  gl.getUniformLocation(_program, "sampler"),
	    textureEnabled		  :  gl.getUniformLocation(_program, "textureEnabled"),
	    normalMatrix		  :  gl.getUniformLocation(_program, "normalMatrix"),
	    ambientColor		  :  gl.getUniformLocation(_program, "ambientColor"),
	    pointLightOrigin	  :  gl.getUniformLocation(_program, "pointLightOrigin"),
	    diffuseLightColor	  :  gl.getUniformLocation(_program, "diffuseLightColor"),
	    lightEnabled		  :  gl.getUniformLocation(_program, "lightEnabled"),
	    ambientLightEnabled	  :  gl.getUniformLocation(_program, "ambientLightEnabled"),
	    specularLightsEnabled :  gl.getUniformLocation(_program, "specularLightsEnabled"),
	    specularLightColor	  :  gl.getUniformLocation(_program, "specularLightColor"),
	    materialShininess	  :  gl.getUniformLocation(_program, "materialShininess"),
	    diffuseLightEnabled	  :  gl.getUniformLocation(_program, "diffuseLightEnabled"),
	    isSkybox			  :  gl.getUniformLocation(_program, "isSkybox"),
	    skyboxSampler		  :  gl.getUniformLocation(_program, "skyboxSampler")
	};

	return _program;
}

function initShaders(){
	program = createProgram("vertShad", "fragShad");
	gl.useProgram(program);
}

function handleLoadedTeapotData(data) {
	if (typeof data != "object")
		console.error("no object");

	teapotIndicies = data.indices;
	teapotTextureCoords = data.vertexTextureCoords;
	teapotVertexNormals = data.vertexNormals;
	teapotVerticies = data.vertexPositions;
	initBuffers();
	initTextures(function(){
		glHelper.animate((function(){
		    return function(){
		        	update();
		        	draw();
		        };
		})());
	});
}

function loadTeapot(){
	var xml = new XMLHttpRequest();
	xml.open("GET", "sites/teapot/teapot.vertJSON", true);
	xml.onreadystatechange = function(){
		if (xml.readyState == 4) {
			handleLoadedTeapotData(JSON.parse(xml.responseText));
		}
	};
	xml.send();
}

function initBuffers(){
	teapotIndexBuffer			   	= gl.createBuffer();
	teapotNormalsBuffer		    	= gl.createBuffer();
	teapotTexturePositionBuffer   	= gl.createBuffer();
	teapotVertexBuffer		    	= gl.createBuffer();
	skyboxIndexBuffer				= gl.createBuffer();
	skyboxVertexBuffer				= gl.createBuffer();

		// TEAPOT
	// normals-buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotNormalsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVertexNormals), gl.DYNAMIC_DRAW);
	teapotNormalsBuffer.itemSize = 3;
	teapotNormalsBuffer.numItems = teapotVertexNormals.length / teapotNormalsBuffer.itemSize;

	// vertex-buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotVerticies), gl.DYNAMIC_DRAW);
	teapotVertexBuffer.itemSize = 3;
	teapotVertexBuffer.numItems = teapotVerticies.length / teapotVertexBuffer.itemSize;

	// index-buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotIndicies), gl.STATIC_DRAW);
	teapotIndexBuffer.itemSize = 1;
	teapotIndexBuffer.numItems = teapotIndicies.length;

	// texturePosition-buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotTexturePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotTextureCoords), gl.STATIC_DRAW);
	teapotTexturePositionBuffer.itemSize = 2;
	teapotTexturePositionBuffer.numItems = teapotTextureCoords.length / teapotTexturePositionBuffer.itemSize;

		// SKYBOX
	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, skyboxVerticies, gl.STATIC_DRAW);
	skyboxVertexBuffer.itemSize = 3;
	skyboxVertexBuffer.numItems = skyboxVerticies.length / skyboxVertexBuffer.itemSize;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, skyboxIndicies, gl.STATIC_DRAW);
	skyboxIndexBuffer.itemSize = 1;
	skyboxIndexBuffer.numItems = skyboxIndicies.length;

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function initSkyboxTexture(){
	var base = "Skybox", ext = "jpg";
	var url = function(name) {
		return base + "/" + name + "." + ext;
	};

	skyboxTexture = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);

	var textures = [
		[url("sites/teapot/posx"), gl.TEXTURE_CUBE_MAP_POSITIVE_X],
		[url("sites/teapot/negx"), gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
		[url("sites/teapot/posy"), gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
		[url("sites/teapot/negy"), gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
		[url("sites/teapot/posz"), gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
		[url("sites/teapot/negz"), gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
	];

	textures.forEach(function(val, indx, arr) {
		var currentType = val[1];
		var image = new Image();
		image.onload = (function(type, texture){
			return function(){
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.texImage2D(type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
			};
		})(currentType, skyboxTexture);
		image.src = val[0];
	});

	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function initTextures(callback){
	// WOOD	— TEAPOT
	woodTexture = gl.createTexture();
	woodTexture.image = new Image();
	woodTexture.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, woodTexture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, gl.TRUE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, woodTexture.image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);

		if (callback)
			callback();
	};
	woodTexture.image.src = "sites/teapot/wood.jpg";

	initSkyboxTexture();
}

function draw(){
	if (!gl) return;

	var setPMVMatrix = function(){
		gl.uniformMatrix4fv(program.vertexShaderAttributeLocations.projectionMatrix, gl.FALSE, pMatrix);
		gl.uniformMatrix4fv(program.vertexShaderAttributeLocations.modelViewMatrix, gl.FALSE, mvMatrix);
	};

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	gl.clearColor(.0, .0, .0, 1.);
	gl.clearDepth(1.0);
	gl.clearStencil(1.0);


	// --- SKYBOX ---
	gl.depthMask(gl.FALSE);
	gl.disable(gl.DEPTH_TEST)
	gl.uniform1i(program.vertexShaderAttributeLocations.isSkybox, 1);

	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture);
	gl.uniform1i(program.vertexShaderAttributeLocations.skyboxSampler, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVertexBuffer);
	gl.vertexAttribPointer(program.vertexShaderAttributeLocations.pos, skyboxVertexBuffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(program.vertexShaderAttributeLocations.pos);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxIndexBuffer);
	gl.drawElements(gl.TRIANGLES, skyboxIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.depthMask(gl.TRUE);
	gl.enable(gl.DEPTH_TEST)


    // LIGHT
    var normalMatrix = glHelper.matrix3();
    glHelper.matrix4ConvertToInversedMatrix3(mvMatrix, normalMatrix);
    glHelper.matrix3Transpose(normalMatrix);

    // diffuse
    gl.uniform3fv(program.vertexShaderAttributeLocations.pointLightOrigin, [lightningOptions.point.X, lightningOptions.point.Y, lightningOptions.point.Z]);
    gl.uniform1i(program.vertexShaderAttributeLocations.lightEnabled, lightningOptions.enabled);
    gl.uniform3f(program.vertexShaderAttributeLocations.ambientColor, lightningOptions.ambient.R, lightningOptions.ambient.G, lightningOptions.ambient.B);
    gl.uniform3f(program.vertexShaderAttributeLocations.diffuseLightColor, lightningOptions.point.R, lightningOptions.point.G, lightningOptions.point.B);
    gl.uniform1i(program.vertexShaderAttributeLocations.ambientLightEnabled, lightningOptions.ambient.enabled);
    gl.uniformMatrix3fv(program.vertexShaderAttributeLocations.normalMatrix, false, normalMatrix);
    gl.uniform1i(program.vertexShaderAttributeLocations.diffuseLightEnabled, lightningOptions.diffuseEnabled);

    // specular
    gl.uniform1i(program.vertexShaderAttributeLocations.specularLightsEnabled, lightningOptions.specular.enabled);
    gl.uniform3f(program.vertexShaderAttributeLocations.specularLightColor, lightningOptions.specular.R, lightningOptions.specular.G, lightningOptions.specular.B);
    gl.uniform1f(program.vertexShaderAttributeLocations.materialShininess, lightningOptions.specular.shininess);

	// --- TEAPOT ---
	gl.uniform1i(program.vertexShaderAttributeLocations.isSkybox, 0);

	// TEXTURE
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, woodTexture);
	gl.uniform1i(program.vertexShaderAttributeLocations.sampler, 0);
	gl.uniform1i(program.vertexShaderAttributeLocations.textureEnabled, texturesEnabled);

    // BUFFERS
    //-> normals
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotNormalsBuffer);
    gl.vertexAttribPointer(program.vertexShaderAttributeLocations.vertexNormals, teapotNormalsBuffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(program.vertexShaderAttributeLocations.vertexNormals);

	//-> verticies
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexBuffer);
	gl.vertexAttribPointer(program.vertexShaderAttributeLocations.pos, teapotVertexBuffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(program.vertexShaderAttributeLocations.pos);

	//-> texture
	gl.bindBuffer(gl.ARRAY_BUFFER, teapotTexturePositionBuffer);
	gl.vertexAttribPointer(program.vertexShaderAttributeLocations.textureCoords, teapotTexturePositionBuffer.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(program.vertexShaderAttributeLocations.textureCoords);


	// POSITION & DRAWING
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotIndexBuffer);
	setPMVMatrix();
	gl.drawElements(gl.TRIANGLES, teapotIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function destroyWebGLComponents(){
	if (!gl) return gl.TRUE;

	try {
		gl.deleteBuffer(beachballVertexbuffer);
		gl.deleteBuffer(beachballTexturePositionBuffer);
		gl.deleteBuffer(beachballIndexBuffer);
		gl.deleteBuffer(beachballNormalsBuffer);
		gl.deleteProgram(program);
		gl.deleteShader(perFragmentFragmentShader);
		gl.deleteShader(perFragmentVertexShader);
		gl.deleteTexture(woodTexture);
		gl.deleteTexture(beachballTexture);

		delete beachballIndicies, beachballVerticies, beachballTextureCoords, beachballVertexNormals;

		return delete(gl);
	} catch(e) {
		return false;
	} finally {
		return null;
	}
}

// other
function update(){
	if (!gl) return;

	var currentTime = new Date();
	var delta = currentTime.getTime() - startTime.getTime();

	mvMatrix = glHelper.matrix4Identity(mvMatrix);
	glHelper.matrix4Translate(mvMatrix, [ 0.0, 0.0, zoom]);
	glHelper.matrix4Rotate(mvMatrix, glHelper.degToRad(45), [1, 0, 0]);

	glHelper.matrix4Rotate(mvMatrix, glHelper.degToRad(delta) / 23, [0.0, 1, 0]);
}

function saveCurrentMVMatrix(){
	var copy = glHelper.matrix4();
	for (var i in mvMatrix) {
		copy[i] = mvMatrix[i];
	}
	return matrixBuffer.push(copy);
}

function restoreLatestMVMatrix(){
	if (matrixBuffer.length == 0)
		return mvMatrix;
	var mat = matrixBuffer.pop();
	mvMatrix = mat;
	return mat;
}

/* created by Lukas Bischof. Informations form http://www.learningwebgl.com */
