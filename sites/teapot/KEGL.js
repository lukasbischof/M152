/* 
	not for commercial use.
*/

"use strict";

var LKWebGLHelper = 
(function(){
	return function(){
	
		window.requestAnimFrame = (function(){
			window.LK_FPS_$ = window.LK_FPS_$ ? (1000 / window.LK_FPS_$) : (1000 / 60);
	      return  window.requestAnimationFrame       ||
	              window.webkitRequestAnimationFrame ||
	              window.mozRequestAnimationFrame    ||
	              window.oRequestAnimationFrame      ||
	              window.msRequestAnimationFrame     ||
	              function(callback, element){
	                window.setTimeout(callback, window.LK_FPS_$);
	              };
	    })();
	
		this.initGL = function(selector, colorMask){
			try {
			    var can = document.querySelector(selector);
			    var __WEB_GL_OES__ = can.getContext('experimental-webgl');
			    __WEB_GL_OES__.viewportWidth = can.width;
			    __WEB_GL_OES__.viewportHeight = can.height;
			    __WEB_GL_OES__.viewport(0, 0, can.width, can.height);
			    __WEB_GL_OES__.TRUE = true;
			    __WEB_GL_OES__.FALSE = false;
			    var _$_$_$_ = colorMask ? colorMask : [true, true, true, true];
			    if (_$_$_$_.length !== 4) return false;
			    __WEB_GL_OES__.colorMask(_$_$_$_[0], _$_$_$_[1], _$_$_$_[2], _$_$_$_[3]);
			    if (!window.gl)
				    window.gl = __WEB_GL_OES__;
			    return __WEB_GL_OES__;
			} catch(e) {
			    alert("couldn't find WebGL Context." + e.message ? (" error: " + e.message) : '');
			    throw e;
			    return undefined;
			}
		};
		
		this.animate = function(loop) {
			if (!loop) return false;
			var l = function(){
				if (loop() !== false) {
					requestAnimFrame(l);
				}
			};
	    
			l();
		}
		
		this.getShader = function(gl, id){
			if (!gl || !id || !document.getElementById(id) || gl === undefined) 
				return null;
			
			var shaderScript = document.getElementById(id);
			if (!shaderScript)
			    return null;
			
			var str = new String();
			var k = shaderScript.firstChild;
			while (k) {
			    if (k.nodeType == 3)
			        str += k.textContent;
	
			    k = k.nextSibling;
			}
			
			var shader;
			if (shaderScript.type == "x-shader/x-fragment")
			    shader = gl.createShader(gl.FRAGMENT_SHADER);
			else if (shaderScript.type == "x-shader/x-vertex")
			    shader = gl.createShader(gl.VERTEX_SHADER);
			else
			    return null;
	
			
			gl.shaderSource(shader, str);
			gl.compileShader(shader);
			
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			    alert(gl.getShaderInfoLog(shader));
			    gl.deleteShader(shader);
			    return null;
			}
			
			return shader;
		};
		
		this.degToRad = function(deg) {
			return deg * Math.PI / 180;
		};
		
		this.projectionMatrix = function(viewAngle, zNear, zFar, aspectRatio){
			viewAngle = viewAngle * Math.PI / 180;
			return new Float32Array([aspectRatio/Math.tan(viewAngle), 0, 0, 0, 0, 1/Math.tan(viewAngle), 0, 0, 0, 0, (zNear+zFar)/(zNear-zFar), -1, 0, 0, 2*zNear*zFar/(zNear-zFar), 0]);
		};
		
		this.orthoMatrix = function(right, left, top, bottom, zNear, zFar){
			return new Float32Array([2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, 0, 0, -2 / (zNear - zFar), 0, -(right + left) / (right - left), -(top + bottom) / (top - bottom) ,-(zFar + zNear) / (zFar - zNear) , 1]);
		};
		
		this.matrix4 = function(){
			return new Float32Array(16);
		};
		
		this.matrix3 = function(){
			return new Float32Array(9);
		};
		
		this.matrix2 = function(){
			return new Float32Array(4);
		};
		
		this.matrix3Transpose = function(mat, dest) {
		    if (!dest || mat === dest) {
		        var a01 = mat[1], a02 = mat[2],
		            a12 = mat[5];
		
		        mat[1] = mat[3];
		        mat[2] = mat[6];
		        mat[3] = a01;
		        mat[5] = mat[7];
		        mat[6] = a02;
		        mat[7] = a12;
		        return mat;
		    }
		
		    dest[0] = mat[0];
		    dest[1] = mat[3];
		    dest[2] = mat[6];
		    dest[3] = mat[1];
		    dest[4] = mat[4];
		    dest[5] = mat[7];
		    dest[6] = mat[2];
		    dest[7] = mat[5];
		    dest[8] = mat[8];
		    return dest;
		};
		
		this.matrix3Identity = function(dest) {
		    if (!dest) 
		    	dest = this.matrix3();
		    dest[0] = dest[4] = dest[8] = 1;
		    dest[1] = dest[2] = dest[3] = dest[5] = dest[6] = dest[7] = 0;
		    return dest;
		}
		
		this.matrix4ConvertToInversedMatrix3 = function(mat, dest) {
		    var a00 = mat[0], a01 = mat[1], a02 = mat[2],
		        a10 = mat[4], a11 = mat[5], a12 = mat[6],
		        a20 = mat[8], a21 = mat[9], a22 = mat[10],
		
		        b01 =  a22 * a11 - a12 * a21,
		        b11 = -a22 * a10 + a12 * a20,
		        b21 =  a21 * a10 - a11 * a20,
		
		        d = a00 * b01 + a01 * b11 + a02 * b21,
		        id;
		
		    if (!d) 
		    	return null;
		    id = 1 / d;
		
		    if (!dest) 
		    	dest = this.matrix3();
		
		    dest[0] = b01 * id;
		    dest[1] = (-a22 * a01 + a02 * a21) * id;
		    dest[2] = (a12 * a01 - a02 * a11) * id;
		    dest[3] = b11 * id;
		    dest[4] = (a22 * a00 - a02 * a20) * id;
		    dest[5] = (-a12 * a00 + a02 * a10) * id;
		    dest[6] = b21 * id;
		    dest[7] = (-a21 * a00 + a01 * a20) * id;
		    dest[8] = (a11 * a00 - a01 * a10) * id;
		
		    return dest;
		};
		
		this.matrix4ScalarMultiplication = function(factor, mat, dest) {
			if (!dest) 
				dest = this.matrix4();
				
			for (var i = 0; i < mat.length; ++i) {
				dest[i] = factor * mat[i];
			}
			
			return dest;
		};
		
		this.matrix4Translate = function(a, b, c) {
			var d = b[0], e = b[1]; b = b[2];
			if (!c || a == c){
			    a[12] = a[0] * d + a[4] * e + a[8] * b + a[12];
			    a[13] = a[1] * d + a[5] * e + a[9] * b + a[13];
			    a[14] = a[2] * d + a[6] * e + a[10] * b + a[14];
			    a[15] = a[3] * d + a[7] * e + a[11] * b + a[15];
			    return a;
			}
			c[0] = a[0];
			c[1] = a[1];
			c[2] = a[2];
			c[3] = a[3];
			c[4] = a[4];
			c[5] = a[5];
			c[6] = a[6];
			c[7] = a[7];
			c[8] = a[8];
			c[9] = a[9];
			c[10] = a[10];
			c[11] = a[11];
			c[12] = a[0] * d + a[4] * e + a[8] * b + a[12];
			c[13] = a[1] * d + a[5] * e + a[9] * b + a[13];
			c[14] = a[2] * d + a[6] * e + a[10] * b + a[14];
			c[15] = a[3] * d + a[7] * e + a[11] * b + a[15];
			return c;
		};
		
	   this.matrix4Rotate = function(mat, angle, axis, dest) {
	        var x = axis[0], y = axis[1], z = axis[2],
	            len = Math.sqrt(x * x + y * y + z * z),
	            s, c, t,
	            a00, a01, a02, a03,
	            a10, a11, a12, a13,
	            a20, a21, a22, a23,
	            b00, b01, b02,
	            b10, b11, b12,
	            b20, b21, b22;
	    
	        if (!len) 
	        	return null;
	        if (len !== 1) {
	            len = 1 / len;
	            x *= len;
	            y *= len;
	            z *= len;
	        }
	    
	        s = Math.sin(angle);
	        c = Math.cos(angle);
	        t = 1 - c;
	    
	        a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
	        a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
	        a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
	    
	        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
	        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
	        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
	    
	        if (!dest) {
	            dest = mat;
	        } else if (mat !== dest) {
	            dest[12] = mat[12];
	            dest[13] = mat[13];
	            dest[14] = mat[14];
	            dest[15] = mat[15];
	        }
	    
	        dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
	        dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
	        dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
	        dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
	    
	        dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
	        dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
	        dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
	        dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
	    
	        dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
	        dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
	        dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
	        dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
	        return dest;
	    };
	    
	    this.transposeMatrix4 = function(mat, dest) {
		    if (!dest || mat === dest) {
		        var a01 = mat[1], a02 = mat[2], a03 = mat[3],
		            a12 = mat[6], a13 = mat[7],
		            a23 = mat[11];
		
		        mat[1] = mat[4];
		        mat[2] = mat[8];
		        mat[3] = mat[12];
		        mat[4] = a01;
		        mat[6] = mat[9];
		        mat[7] = mat[13];
		        mat[8] = a02;
		        mat[9] = a12;
		        mat[11] = mat[14];
		        mat[12] = a03;
		        mat[13] = a13;
		        mat[14] = a23;
		        return mat;
		    }
		
		    dest[0] = mat[0];
		    dest[1] = mat[4];
		    dest[2] = mat[8];
		    dest[3] = mat[12];
		    dest[4] = mat[1];
		    dest[5] = mat[5];
		    dest[6] = mat[9];
		    dest[7] = mat[13];
		    dest[8] = mat[2];
		    dest[9] = mat[6];
		    dest[10] = mat[10];
		    dest[11] = mat[14];
		    dest[12] = mat[3];
		    dest[13] = mat[7];
		    dest[14] = mat[11];
		    dest[15] = mat[15];
		    return dest;
		};
	    
	    this.matrix4Identity = function(a) {
		    a[0] = a[5] = a[10] = a[15] = 1;
		    a[1] = a[2] = a[3] = a[4] = a[6] = a[7] = a[8] = a[9] = a[11] = a[12] = a[13] = a[14] = 0;
		    
		    return a;
		};
		
		this.matrix4Copy = function(matrix) {
			var re = this.matrix4();
			re[0] = matrix[0];
			re[1] = matrix[1];
			re[2] = matrix[2];
			re[3] = matrix[3];
			re[4] = matrix[4];
			re[5] = matrix[5];
			re[6] = matrix[6];
			re[7] = matrix[7];
			re[8] = matrix[8];
			re[9] = matrix[9];
			re[10] = matrix[10];
			re[11] = matrix[11];
			re[12] = matrix[12];
			re[13] = matrix[13];
			re[14] = matrix[14];
			re[15] = matrix[15];
			
			return re;
		};
		
		this.matrix4Determinant = function(mat) {
		    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
		        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
		        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
		        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
		
		    return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
		            a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
		            a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
		            a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
		            a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
		            a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
		};
		
		this.matrix4Inverse = function(mat, dest) {
		    if (!dest) 
		    	dest = mat;
		
		    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
		        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
		        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
		        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
		        b00 = a00 * a11 - a01 * a10,
		        b01 = a00 * a12 - a02 * a10,
		        b02 = a00 * a13 - a03 * a10,
		        b03 = a01 * a12 - a02 * a11,
		        b04 = a01 * a13 - a03 * a11,
		        b05 = a02 * a13 - a03 * a12,
		        b06 = a20 * a31 - a21 * a30,
		        b07 = a20 * a32 - a22 * a30,
		        b08 = a20 * a33 - a23 * a30,
		        b09 = a21 * a32 - a22 * a31,
		        b10 = a21 * a33 - a23 * a31,
		        b11 = a22 * a33 - a23 * a32,
		        invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
		
		    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
		    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
		    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
		    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
		    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
		    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
		    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
		    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
		    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
		    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
		    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
		    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
		    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
		    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
		    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
		    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
		
		    return dest;
		};
		
		this.matrix4MultiplyWithMatrix = function(mat, mat2, dest) {
		    if (!dest) 
		    	dest = mat;
		
		    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
		        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
		        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
		        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
		        b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
		        b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
		        b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
		        b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
		
		    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
		    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
		    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
		    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
		
		    return dest;
		};
		
		this.matrix4ScaleWithVector = function(mat, vec, dest) {
		    var x = vec[0], y = vec[1], z = vec[2];
		
		    if (!dest || mat === dest) {
		        mat[0] *= x;
		        mat[1] *= x;
		        mat[2] *= x;
		        mat[3] *= x;
		        mat[4] *= y;
		        mat[5] *= y;
		        mat[6] *= y;
		        mat[7] *= y;
		        mat[8] *= z;
		        mat[9] *= z;
		        mat[10] *= z;
		        mat[11] *= z;
		        return mat;
		    }
		
		    dest[0] = mat[0] * x;
		    dest[1] = mat[1] * x;
		    dest[2] = mat[2] * x;
		    dest[3] = mat[3] * x;
		    dest[4] = mat[4] * y;
		    dest[5] = mat[5] * y;
		    dest[6] = mat[6] * y;
		    dest[7] = mat[7] * y;
		    dest[8] = mat[8] * z;
		    dest[9] = mat[9] * z;
		    dest[10] = mat[10] * z;
		    dest[11] = mat[11] * z;
		    dest[12] = mat[12];
		    dest[13] = mat[13];
		    dest[14] = mat[14];
		    dest[15] = mat[15];
		    return dest;
		};
		
		this.matrix4LookAtPoint = function(eye, center, up, dest) {
		    if (!dest) 
		    	dest = this.matrix4();
		
		    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
		        eyex = eye[0],
		        eyey = eye[1],
		        eyez = eye[2],
		        upx = up[0],
		        upy = up[1],
		        upz = up[2],
		        centerx = center[0],
		        centery = center[1],
		        centerz = center[2];
		
		    if (eyex === centerx && eyey === centery && eyez === centerz) {
		        return this.matrix4Identity(dest);
		    }
		
		    z0 = eyex - center[0];
		    z1 = eyey - center[1];
		    z2 = eyez - center[2];
		
		    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
		    z0 *= len;
		    z1 *= len;
		    z2 *= len;
		
		    x0 = upy * z2 - upz * z1;
		    x1 = upz * z0 - upx * z2;
		    x2 = upx * z1 - upy * z0;
		    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
		    if (!len) {
		        x0 = 0;
		        x1 = 0;
		        x2 = 0;
		    } else {
		        len = 1 / len;
		        x0 *= len;
		        x1 *= len;
		        x2 *= len;
		    }
		
		    y0 = z1 * x2 - z2 * x1;
		    y1 = z2 * x0 - z0 * x2;
		    y2 = z0 * x1 - z1 * x0;
		
		    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
		    if (!len) {
		        y0 = 0;
		        y1 = 0;
		        y2 = 0;
		    } else {
		        len = 1 / len;
		        y0 *= len;
		        y1 *= len;
		        y2 *= len;
		    }
		
		    dest[0] = x0;
		    dest[1] = y0;
		    dest[2] = z0;
		    dest[3] = 0;
		    dest[4] = x1;
		    dest[5] = y1;
		    dest[6] = z1;
		    dest[7] = 0;
		    dest[8] = x2;
		    dest[9] = y2;
		    dest[10] = z2;
		    dest[11] = 0;
		    dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
		    dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
		    dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
		    dest[15] = 1;
		
		    return dest;
		};
		
		this.vector3Normalize = function(vec, dest) {
		    if (!dest) 
		    	dest = vec;
		
		    var x = vec[0], y = vec[1], z = vec[2],
		        len = Math.sqrt(x * x + y * y + z * z);
		
		    if (!len) {
		        dest[0] = 0;
		        dest[1] = 0;
		        dest[2] = 0;
		        return dest;
		    } else if (len === 1) {
		        dest[0] = x;
		        dest[1] = y;
		        dest[2] = z;
		        return dest;
		    }
		
		    len = 1 / len;
		    dest[0] = x * len;
		    dest[1] = y * len;
		    dest[2] = z * len;
		    return dest;
		};
		
		this.vector4Create = function(vec) {
			var vector = new Float32Array(4);
			if (!vec)
				return vector;
				
			vector[0] = vec[0];
			vector[1] = vec[1];
			vector[2] = vec[2];
			vector[3] = vec[3];
			
			return vector;
		};
		
		this.vector3Create = function() {
			return new Float32Array(3);
		};
			
		this.vector3Substract = function(vec, vec2, dest) {
		    if (!dest || vec === dest) {
		        vec[0] -= vec2[0];
		        vec[1] -= vec2[1];
		        vec[2] -= vec2[2];
		        return vec;
		    }
		
		    dest[0] = vec[0] - vec2[0];
		    dest[1] = vec[1] - vec2[1];
		    dest[2] = vec[2] - vec2[2];
		    return dest;
		};
		
		this.vector3LengthOf = function(vector) {
			var x = vector[0], y = vector[1], z = vector[2];
			return Math.sqrt(x * x + y * y + z * z);
		};
		
		this.vector3Dot = function (vec, vec2) {
	    	return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
		};
		
		this.vector3Scale = function (vec, val, dest) {
		    if (!dest || vec === dest) {
		        vec[0] *= val;
		        vec[1] *= val;
		        vec[2] *= val;
		        return vec;
		    }
		
		    dest[0] = vec[0] * val;
		    dest[1] = vec[1] * val;
		    dest[2] = vec[2] * val;
		    return dest;
		};
		
	}
})();

/* LKEGL may contain functions form gl-matrix.js */