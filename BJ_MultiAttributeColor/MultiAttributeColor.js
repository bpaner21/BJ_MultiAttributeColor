// MultiAttributeColor.js
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' + // Varying variable
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = 20.0;\n' +
    ' v_Color = a_Color;\n' +   // Pass the data to the fragment shader
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' + // Precision qualifier (See Chapter 6) [What does this do???]
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    ' gl_FragColor = v_Color;\n' +	// Receive the data from the vertex shader
    '}\n';

function main()
{
    // Retrieve <canvas> element 
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl)
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Set the positions of the vertices
    var n = initVertexBuffers(gl);
    if (n < 0)
    {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw three points
    gl.drawArrays(gl.POINTS, 0, n);	// n is 3
}

function initVertexBuffers(gl)
{
    var verticesColors = new Float32Array
        ([
             0.0,  0.5, 1.0, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 0.0,
             0.5, -0.5, 0.0, 0.0, 1.0,
        ]);
    var n = 3;	// The number of vertices

    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer)
    {
        console.log('Failed to create a vertex size buffer object');
        return false;
    }

    // Write vertex coordinates and colors to the buffer and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    // Get the storage location of a_Position, allocate buffer, & enable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0)
    {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0)
    {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}