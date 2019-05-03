class ThreeDVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
    this.beads = [];
    this.cached_parameters = {};
    this.cached_width = 0;
    this.cached_height = 0;
    this.scene = null;
  }

  get spirals() {
    return { positives: this.loom.beads[0], negatives: this.loom.beads[1] };
  }

  get beads_per_row() {
    return this.braid.two_d_parameters.beads_per_row - 0.5;
  }

  get radius() {
    return this.braid.three_d_parameters.radius;
  }

  get bead_step() {
    return this.braid.three_d_parameters.bead_step;
  }

  get vertical_step() {
    return this.braid.three_d_parameters.vertical_step;
  }

  get all_parameters() {
    return Object.assign(
      Object.assign({}, this.braid.parameters),
      this.braid.three_d_parameters
    );
  }

  fresh_render() {
    if (this.scene === null) {
      this.setScene();
    }

    // If the scene is null then setScene failed to run. This can happen
    // normally when the window containing the visualization has not been
    // created, or when it has a width and height of zero.
    // In any case, abort!
    if (this.scene === null) {
      return;
    }

    this.loom.weave();

    while(this.beads.length !== 0) {
      this.scene.remove(this.beads.pop().mesh);
    }

    var xorigin = 0;
    var zorigin = 0;
    var y = 0;

    var positives = this.spirals.positives;
    var negatives = this.spirals.negatives;

    for (var i = 0; i < positives.length; i++) {
      var x = xorigin - this.radius * Math.cos(this.bead_angle(i));
      var z = zorigin - this.radius * Math.sin(this.bead_angle(i));
      var bead = this.bead(positives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      y -= this.vertical_step * 2;
    }

    y = 0;
    for (var i = 0; i < negatives.length; i++) {
      x = xorigin + this.radius * Math.cos(this.bead_angle(i));
      z = zorigin + this.radius * Math.sin(this.bead_angle(i));
      bead = this.bead(negatives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      y -= this.vertical_step * 2;
    }

    this.cached_parameters = this.all_parameters;
  }

  resize() {
    this.cached_width = this.element.clientWidth;
    this.cached_height = this.element.clientHeight;
    this.camera.aspect = this.cached_width / this.cached_height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.cached_width, this.cached_height);
  }

  colour_render() {
    this.beads.forEach(function(bead) {
      bead.mesh.material.color.set(bead.bead.colour);
    });
  }

  render() {
    if (this.scene === null || this.parameters_changed) {
      this.fresh_render();
    } else if (this.cached_width !== this.element.clientWidth || this.cached_height !== this.element.clientHeight) {
      this.resize();
    } else {
      this.colour_render();
    }
  }

  get parameters_changed() {
    var _all_parameters = this.all_parameters; // all_parameters is a method, so cache it
    for(var parameter in _all_parameters) {
      if (_all_parameters[parameter] !== this.cached_parameters[parameter]) {
        return true;
      }
    }
    return false;
  }

  destroy() {
    if (this.scene === null) {
      return;
    }

    cancelAnimationFrame(this.id);

    while(this.beads.length !== 0) {
      this.scene.remove(this.beads.pop().mesh);
    }

    this.beads = null;
    this.scene = null;
    this.camera = null;
    this.light = null;
    this.renderer = null;

    super.destroy();
  }

  bead_angle(bead_number) {
    var bead_step = this.braid.three_d_parameters.bead_step;
    return -2 * Math.PI * bead_step * bead_number / 360;
  }

  bead(bead, x, y, z) {
    var material = new THREE.MeshBasicMaterial({ color: bead.colour });
    var mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.set(x, y, z);
    return { bead: bead, mesh: mesh};
  }

  setScene() {
    if (this.element.clientWidth === 0 || this.element.clientHeight === 0) {
      return;
    }

    this._set_viewport_size();
    this._create_scene();
    this._create_camera();
    this._create_light();
    this._create_renderer();
    this._create_controls();
    this._create_geometry();
    this._animate();
  }

  _set_viewport_size() {
    this.cached_width = this.element.clientWidth;
    this.cached_height = this.element.clientHeight;
  }

  _create_scene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe1e1e1);
  }

  _create_camera() {
    this.camera = new THREE.PerspectiveCamera(75, this.element.clientWidth / this.element.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(0, 0, 0);
  }

  _create_light() {
    this.light = new THREE.PointLight( 0xffffff, 0.8 );
    this.camera.add(this.light);
  }

  _create_renderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.element.appendChild(this.renderer.domElement);
  }

  _create_controls() {
    var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    controls.enablePan = false;
  }

  _create_geometry() {
    this.geometry = new THREE.SphereBufferGeometry(1, 32, 32);
  }

  _animate() {
    var this_ = this;
    function animate() {
      this_.id = requestAnimationFrame(animate);
      this_.renderer.render(this_.scene, this_.camera);
    }

    animate();
  }
}
