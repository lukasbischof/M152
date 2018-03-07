<script src="<?php echo SITE_FILE('KEGL.js'); ?>" charset="utf-8" type="text/javascript"></script>
<script src="<?php echo SITE_FILE('gl.js'); ?>" charset="utf-8"></script>
<style type="text/css" media="all">
    @charset "UTF-8";
    @import url("<?php echo SITE_FILE('style.css'); ?>");
</style>

<script id="fragShad" type="x-shader/x-fragment">
    precision mediump float;

    varying vec2 textureCoordinates;
    varying vec3 transformedNormal;
    varying vec4 position;

    uniform sampler2D sampler;
    uniform samplerCube skyboxSampler;

    uniform float materialShininess;

    uniform vec3 ambientColor;
    uniform vec3 pointLightOrigin;
    uniform vec3 diffuseLightColor;
    uniform vec3 specularLightColor;
    varying vec3 skyboxTextureCoords;

    uniform bool lightEnabled;
    uniform bool ambientLightEnabled;
    uniform bool textureEnabled;
    uniform bool specularLightsEnabled;
    uniform bool diffuseLightEnabled;
    uniform bool isSkybox;

    float calculateSpecularLightWeight(vec3 normal, vec3 lightDirection) {
        if (!specularLightsEnabled) {
            return 0.0;
        }
        return pow(max(dot(reflect(-lightDirection, normal), normalize(-position.xyz)), 0.0), materialShininess);
    }

    void main(void){
        if (!isSkybox) {
            vec4 fragmentColor = vec4(0.7, 0.7, 0.7, 0.7);
            vec3 lightWeight = vec3(1.0, 1.0, 1.0);

            if (textureEnabled) {
                fragmentColor = texture2D(sampler, vec2(textureCoordinates.s, textureCoordinates.t));
            }

            if (lightEnabled) {
                vec3 lightDirection = normalize( pointLightOrigin - position.xyz );
                vec3 normal = normalize( transformedNormal );

                float specularLightWeight = calculateSpecularLightWeight(normal, lightDirection);
                float diffuseLightWeight = 0.0;
                if (diffuseLightEnabled) {
                    diffuseLightWeight = max( dot( normal, lightDirection ), 0.0 );
                }
                lightWeight = ((ambientLightEnabled) ? ambientColor : vec3(0.0, 0.0, 0.0))
                              + diffuseLightColor * diffuseLightWeight
                              + specularLightColor * specularLightWeight;
            }

            gl_FragColor = vec4(fragmentColor.rgb * lightWeight.rgb, fragmentColor.a);
        } else {
            vec3 tCoords = normalize(skyboxTextureCoords);
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
            //vec4 color = textureCube(skyboxSampler, tCoords);
        }
    }
</script>

<script id="vertShad" type="x-shader/x-vertex">
    attribute vec2 staticTextureCoords;
    attribute vec3 vertexNormals;
    attribute vec4 pos;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;

    varying vec2 textureCoordinates;
    varying vec3 transformedNormal;
    varying vec4 position;
    varying vec3 skyboxTextureCoords;

    void main(){
        skyboxTextureCoords = pos.xyz;
        position = modelViewMatrix * pos;
        gl_Position = projectionMatrix * position;

        textureCoordinates = staticTextureCoords;
        transformedNormal = normalize(normalMatrix * vertexNormals);
    }
</script>
