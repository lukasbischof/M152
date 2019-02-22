<h1>Portfolio</h1>
<div class="uk-card uk-card-default uk-card-body uk-card-hover" style="width: 260px; text-align: center">
	<a href="/m152/files/portfolio.pdf"><span uk-icon="icon: cloud-download"></span> Download PDF</a>
</div>
<h2>Copyright</h2>
<p>
	Grundsätzlich ist das Material im Internet wie bspw. Bilder, Videos und Audios urheberrechtlich geschützt. Man kann sie also nicht ohne
	Bewilligung des Urhebers verändern, modifizieren oder republizieren. Aus diesem Grund ist, wenn man ein Bild auf der eigenen Website einfügen möchte, immer die Quelle anzugeben mit dem entsprechenden Hinweis auf die Wiederverwendung.
	Einfacher ist es jedoch Material zu verwenden, welches nicht urheberrechtlich geschütz ist.
	Dies sind beispielsweise die eigenen Werke oder Material, welches ausdrücklich zur wiederverwendung im Internet gekennzeichnet wurde.
</p>

<h2>Bilder</h2>
<h3>PPI</h3>
<p>
	PPI steht für Pixels per Inch und gibt an, was für eine Pixeldichte das Bild hat. Je höher der Wert ist, desto höher ist die Auflösung des Bildes
	und desto meht Details können in den Bildinformationen gespeichert werden.
</p>
<h3>Dateiformate</h3>
<table class="uk-table uk-table-striped">
	<thead>
		<tr style="text-align: left">
			<th>Format</th>
			<th>Vorteile</th>
			<th>Nachteile</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>JPG</td>
			<td>
				<ul>
					<li>Gute Komprimierung</li>
					<li>Gut geeignet für Web, da kleinere Dateie</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Kein Alpha-Kanal (Keine Transparenz)</li>
					<li>Keine Bewegtbilder</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>PNG</td>
			<td>
				<ul>
					<li>Unterstüzung für durchsichtige Bilder</li>
					<li>Verlustfreie Kompression</li>
					<li>Alpha-Transparenz in allen Browsern ausser bei dem Microsoft Internet Explorer 7 unterstützt</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Keine Bewegtbilder, bzw. nur mit MotionPNG</li>
					<li>Keine Unterstützung für CMYK</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>GIF</td>
			<td>
				<ul>
					<li>Transparenz</li>
					<li>Animationenen</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Sehr alt</li>
					<li>Eher grosse Datei, verglichen mit PNG</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>
Mehr Informationen in <a href="https://de.wikipedia.org/wiki/Portable_Network_Graphics#Vorteile">Wikipedia</a>

<h3>EXIF Informationen</h3>
<p>
	JPEG bietet in ihren Metadaten sogenannte EXIF Daten an. Das sind Daten, wie der Kameratyp, der Objktivtyp, die Belichtungszeit, die Blendenöffnung, usw.
	Man kann diese Daten mit <code>exif_read_data</code> auslesen und dementsprechend verwenden. In meiner Galerie bspw. erscheint ein Pop-Up mit dem Kameratyp, wenn man mit der Maus drüberfährt.
</p>

<h3>Wasserzeichen</h3>
<p>
	Das Wasserzeichen wird bei mir dynamisch in dem PHP Code hinzugefügt. Dazu waren einige Zeilen Code nötig:
	<details>
		<summary>
			Code anzeigen
		</summary>
		<pre>
			<code class="php">
				$stamp = imagecreatefrompng($watermark);
				$im = imagecreatefromjpeg($img);

				// Ränder für Wasserzeichen festlegen, dessen Höhe und Breite bestimmen
				$marge_right = 10;
				$marge_bottom = 10;
				$sx = imagesx($stamp);
				$sy = imagesy($stamp);

				// Wasserzeichen auf das Foto kopieren, die Position berechnet sich dabei aus
				// den Rändern und der Bildbreite
				imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, imagesy($im) - $sy - $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));

				// Ausgeben und aufräumen
				imagepng($im, $img);
				imagedestroy($im);
			</code>
		</pre>
		<a href="https://secure.php.net/manual/de/image.examples-watermark.php">Quelle</a>
	</details>

	<br / />
	Dabei handelt es sich um ein sichtbares Wasserzeichen, welches in das Bild hineingefügt wird. Es gibt aber auch noch die Möglichkeit des unsichtbaren Wasserzeichen,
	welches ein lediglicher Eintrag in die Metadaten ist, sodass der Urheber mittels Software danach ausgelesen werden kann.
</p>

<h3>Verschiedene Präsentationsvarianten auf Webauftritten</h3>
<p>
	Es gibt viele Methoden, um Bilder in Websiten zu integrieren. Die häufigsten sind jedoch das Karusell und die Galerie.
	<table>
		<tbody>
			<tr>
				<th></th>
				<th>
					Karusell
				</th>
				<th>
					Galerie
				</th>
			</tr>
			<tr>
				<td>
					Vorteile
				</td>
				<td>
					<ul>
						<li>
							Eine Selektion von guten Bildern wird automatisch dargestellt
						</li>
						<li>
							Lenkt die Aufmerksamkeit des Nutzers auf sich
						</li>
					</ul>
				</td>
				<td>
					<ul>
						<li>
							Kann eine grosse Menge an Bildern darstellen
						</li>
						<li>
							Sehr übersichtlich
						</li>
					</ul>
				</td>
			</tr>
			<tr>
				<td>
					Nachteile
				</td>
				<td>
					<ul>
						<li>
							Unübersichtlich
						</li>
						<li>
							Nicht für viele Bilder geeignet
						</li>
					</ul>
				</td>
				<td>
					<ul>
						<li>
							Stellt Inhalte nicht so prominent dar
						</li>
						<li>
							Kann viele Klicke erfordern, bis man am Ziel ist
						</li>
					</ul>
				</td>
			</tr>
		</tbody>
	</table>
</p>

<h2>Banner</h2>
<p>
	Banner können beispielsweise für Werbung verwendet werden. Dabei haben sie meistens eine Standardgrösse.
	Eine Übersicht von Google Ad Words Banner Sizes findet man <a href="https://support.google.com/adsense/answer/6002621?hl=en" target="_blank">hier</a>.
	Früher waren die Banner meistens mit Flash erstellt worden, um dynamische Inhalte zu erstellen.
	Jedoch ist Flash mittlerweile veraltet, weshalb die meisten Banner auf HTML5 mit einem Canvas umgestiegen sind.
</p>

<h2>JavaScript</h2>
<p>Ich habe vor ca. 6 Jahren mit JavaScript begonnen und diverse Projekte vor dem Eintritt in die BBW erstellt.
	So habe ich das Teapot-Projekt schon vorher gemacht, da mich 3D Grafiken interresiert haben.
</p>
<h2>HTML5</h2>
<h3>Komptibilität</h3>
<p>
	HTML5 wird heute von so ziemlich allen Browsern unterstützt. Jedoch unterstützen einige Browser nicht alle Tags restlos.
	Um herauszufinden, welche HTML5 Funktionalität wo unterstützt wird, finde ich die Site <a href="http://caniuse.com" target="_blank">Can i use?</a> sehr nützlich.
	Dort kann man einen Tag im Suchfeld eingeben und sieht unten, ab welcher Browserversion es unterstütz wird.
</p>
<p>
	So kann man bspw. herausfinden, dass Audio Tracks in allen Browsern ausser Mozilla Firefox, Google Chrome für Desktop und Android und Opera unterstützt wird.
	Man kann aber auch gleich ganze Technologien auf Browserkompatibilität überpfüfen. So wird bspw. die Web Audio API von allen Brwosern, ausser dem Microsoft Internet Explorer unterstützt.
</p>
<h3>LocalStorage</h3>
<p>
	In HTML5 gibt es die Möglichkeit, via LocalStorage über JavaScript Daten auf dem Client (wie Notizen) zu speichern.
	Dabei kann man mit <code>localStorage.setItem()</code> etwas speichern, und mit <code>localStorage.getItem()</code> den Eintrag wieder zurückbekommen.
</p>

<h3>CSS3</h3>
<p>
	CSS3 wird nun von (fast) allen Browsern unterstützt. Sehr nützlich in CSS3 finde ich die <code>calc()</code>-Funktion, was Berechnungen wie <code>calc(50% - 3em + 20px)</code> ermöglicht.
</p>
<p>
	Ich habe CSS3 in dem Projekt <a href="?r=clock">3D Uhr</a> verwendet, um HTML5 Elemente so zu transformieren, dass es so aussieht, als ob sie in einem 3D Raum fliegen würden. Ermöglicht wird dies durch die CSS3 Regel <code>-webkit-perspective</code>. </p>
</p>


<h2>Canvas</h2>
<h3>WebGL</h3>
<p>
	<cite>WebGL ist ein Bestandteil vieler moderner Webbrowser, mit dessen Hilfe 3D-Grafiken hardwarebeschleunigt ohne zusätzliche Erweiterungen dargestellt werden können</cite>
	<br />
	<i>- <a href="https://de.wikipedia.org/wiki/WebGL">Wikipedia</a></i>
</p>
<h4>Funktionsweise</h4>
<p>
	Um mit WebGL 3D Grafiken in ein Canvas zu rendern, braucht man diverse Elemente, welche in der folgenden Tabelle beschrieben werden.

	<table class="uk-table uk-table-striped">
	    <thead>
	        <tr>
	            <th>Element</th>
	            <th>Erklärung</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr>
	            <td>Vertex-Shader</td>
	            <td>
					<p>
						Dies ist der Code, welcher auf der Grafikkarte für jeder einerlne Koordinationpunkt des Modells ausgeführt wird.
						Er transformiert diesen Vektor dann so, dass eine 3D Darstellung entsteht und so, dass das Modell gemäss den
						Simuationen und User-Inputs affin transformiert wird.
					</p>
					<ul uk-accordion>
						<li>
							<h3 class="uk-accordion-title">Vertex-Shader code</h3>
							<div class="uk-accordion-content">
								<p>
									Folgender Vertex-Shader habe ich für den Teapot verwendet:
									<pre>
										<code class="gsl">
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
}</code>
									</pre>
								</p>
							</div>
						</li>
					</ul>
				</td>
	        </tr>

			<tr>
				<td>Fragment-Shader</td>
				<td>
					<p>
						Der Fragment-Shader ist ein Stück Code, das auf der Grafikkarte für jedes einzelne Pixel des Modells ausgeführt wird.
						Seine Aufgabe ist es, die Farbe des Pixels in Form eines vier-dimensionalen Vektors (r,g,b,a) zu berechnen.
					</p>
					<p>
						Der Fragment-Shader, welcher ich für den Teapot verwendet habe:

						<ul uk-accordion>
							<li>
								<h3 class="uk-accordion-title">Fragment-Shader code</h3>
								<div class="uk-accordion-content">
									<pre>
										<code class="glsl">
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
										</code>
									</pre>
								</div>
							</li>
						</ul>
					</p>
				</td>
			</tr>

			<tr>
				<td>Vertex-Buffer</td>
				<td>
					Dieser Buffer enthält alle Positionsinformationen eines Modells. Er wird bei dem Rendern in einen Shared-Memory zwischen der Grafikkarte und der normalen CPU geladen, damit das Modell dann gerendert werden kann.
					Typischerweise werden in diesem Buffer auch noch die Normalen-Vektoren, die Indizes der einzelnen Koordinationvektoren, sowie die Texturkoordinaten übergeben.
					In meinem Beispiel lade ich jedoch die Normalen separat in einen zweiten Buffer, welche ich dann mit <code>attribute vec3 vertexNormals;</code> bekomme.
				</td>
			</tr>

			<tr>
				<td>Program</td>
				<td>Das Program ist ein OpenGL Objekt, welches den Vertex-Shader und den Fragment-Shader (in OpenGL 3+ auch den Geometry-Shader und den Tesselation-Shader) kompiliert hält.
					Es wird vor jedem Renderingaufruf verwendet, muss also jedes mal erneut gebunden werden, wenn das Programm vorher zu einem anderen gesetzt wurde.
				</td>
			</tr>

			<tr>
				<td>Renderbuffer</td>
				<td>In den Renderbuffer wird (Wie der Name schon sagt) hineingerendert. In OpenGL ES gibt es aber schon einen Standard-Buffer, weshalb man keinen eigenen machen muss, insofern man nicht offscreen rendert.
			</tr>

			<tr>
				<td>Framebuffer</td>
				<td>Der Framebuffer enthält alle Informationen der Szene. Wenn man in den Hauptframebuffer rendert, dann wird dessen Inhalt auf dem Screen dargestellt.</td>
			</tr>

			<tr>
				<td>Textur</td>
				<td>Eine Textur ist eine ansammlung von verschiedenen Daten. Typischerweise wird ein Bild in eine Textur geladen, damit eine grosse Detailiertheit des Modells erreicht werden kann.
					Man kann aber auch in Texturen rendern, um später dann diese wieder in einem neuen Rendering-Call zu verwenden. So können bspw. Effekte wie Reflektionen realisiert werden.
				</td>
			</tr>

			<tr>
				<td>Uniforms</td>
				<td>
					<p>
						Uniforms sind Variabeln, die man auf der CPU setzen kann, welche dann auf der GPU verfügbar sind. So kann man bspw. Lichtreflektionsinformationen eines Modells an die Grafikkarte, bzw. die Shaders, weitergeben,
						um das Licht zu berechnen.
					<p>
					<p>
						Mit dem Code
						<pre><code class="javascript">gl.uniform3f(program.vertexShaderAttributeLocations.diffuseLightColor, lightningOptions.point.R, lightningOptions.point.G, lightningOptions.point.B);</code></pre>
						kann man bspw. die diffusen Lichtfarben an den Fragmentshader weitergeben.
					</p>
				</td>
			</tr>
	    </tbody>
	</table>

	<h4>Die Grafikpipeline</h4>
	<img src="<?php echo SITE_FILE('gl_pipeline.gif'); ?>" />
	<br />
	<cite>
		<a href="http://www.songho.ca/opengl/files/gl_pipeline.gif">Quelle</a>
	</cite>
	<p>
		Die oben dargestelle Grafik zeigt die Funktionsweise von OpenGL auf. Für eine detaillierte Erklärung verweise ich gerne auf <a href="http://www.songho.ca/opengl/gl_pipeline.html">diese Erklärung.</a>
	</p>
</p>

<h3>2D Kontext</h3>
<p>
	Man kann auch in einem 2D Kontext in ein HTML5 Canvas rendern. Dazu wählt man einfach anstatt "experimental-webgl", den Kontext "2d" bei dem <code>canvas.getContext()</code> Aufruf aus.
	Die API sieht dann jedoch ein wenig anders aus.
	Man kann bspw. mit <code>ctx.lineTo();</code> eine Linie zeichnen, oder mit <code>ctx.arc();</code> einen Kreis.
</p>
