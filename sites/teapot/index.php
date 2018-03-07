<h1>Modul 152 - Canvas: WebGL rendering</h1>
<div>
	<canvas id="can" width="620" height="620"></canvas>
</div>
<div id="controls">
	<section>
		<h3>Texture</h3><hr />
		<input type="checkbox" checked onchange="texturesEnabled = this.checked" />
		<label>&nbsp;Textures enabled</label><br />
	</section>
	<div style="height: 3px"></div>
	<section>
		<h3>Lightning</h3><hr />
		<input type="checkbox" checked onchange="lightningOptions.enabled = this.checked" />
		<label>&nbsp;Lights enabled</label><br />
		<input type="checkbox" checked onchange="lightningOptions.diffuseEnabled = this.checked" />
		<label>&nbsp;Diffuse Lights enabled</label>

		<h4>Ambient Light</h4>
		<div style="margin-left: 20px">
			<input type="checkbox" checked onchange="lightningOptions.ambient.enabled = this.checked" />
			<span>&nbsp;enabled</span>
			<br />

			<label>R:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.2" onchange="lightningOptions.ambient.R = this.value" />
			<label>G:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.2" onchange="lightningOptions.ambient.G = this.value" />
			<label>B:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.2" onchange="lightningOptions.ambient.B = this.value" />
		</div>
		<h4>Point Light</h4>
		<div style="margin-left: 20px">
			<label>R:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.8" onchange="lightningOptions.point.R = this.value" />
			<label>G:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.8" onchange="lightningOptions.point.G = this.value" />
			<label>B:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="0.8" onchange="lightningOptions.point.B = this.value" />
			<div style="height: 8px"></div>
			<label>X:&nbsp;</label>
			<input type="number" placeholder="X" step="0.05" onchange="lightningOptions.point.X = this.value;" value="2.5" />
			<label>Y:&nbsp;</label>
			<input type="number" placeholder="Y" step="0.05" onchange="lightningOptions.point.Y = this.value;" value="-1.25" />
			<label>Z:&nbsp;</label>
			<input type="number" placeholder="Z" step="0.05" onchange="lightningOptions.point.Z = this.value;" value="-10" />
		</div>
		<h4>Specular Light</h4>
		<div style="margin-left: 20px">
			<input type="checkbox" checked onchange="lightningOptions.specular.enabled = this.checked" />
			<span>&nbsp;enabled</span>
			<br />

			<label>R:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="1.0" onchange="lightningOptions.specular.R = this.value" />
			<label>G:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="1.0" onchange="lightningOptions.specular.G = this.value" />
			<label>B:&nbsp;</label>
			<input type="range" min="0" step="0.05" max="1" value="1.0" onchange="lightningOptions.specular.B = this.value" />
			<div style="height: 8px"></div>
			<label>shininess</label>
			<input type="range" min=0.1 value=40 max=600 onchange="lightningOptions.specular.shininess = parseFloat(this.value)" />
		</div>
	</section>
</div>
