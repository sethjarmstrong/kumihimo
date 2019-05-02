class ThreeDVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
    this.beads = [];
    this.cached_num_threads = 0;
    this.cached_num_beads = 0;
    this.cached_beads_per_row = 0;
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
    var y = this.beads_per_row;

    var positives = this.spirals.positives;
    var negatives = this.spirals.negatives;
    var vertical_step = this.braid.two_d_parameters.vertical_step;

    for (var i = 0; i < positives.length; i++) {
      var angle_offset = -(this.bead_angle(1) / 2 * (Math.floor(i / this.beads_per_row) % (this.beads_per_row * 2)));
      var x = xorigin - this.weave_radius * Math.cos(this.bead_angle(i % this.beads_per_row) + angle_offset);
      var z = zorigin - this.weave_radius * Math.sin(this.bead_angle(i % this.beads_per_row) + angle_offset);
      var bead = this.bead(positives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      y -= vertical_step * 2;
    }

    y = this.beads_per_row;
    for (var i = 0; i < negatives.length; i++) {
      angle_offset = -(this.bead_angle(1) / 2 * (Math.floor(i / this.beads_per_row) % (this.beads_per_row * 2)));
      x = xorigin + this.weave_radius * Math.cos(this.bead_angle(i % this.beads_per_row) + angle_offset);
      z = zorigin + this.weave_radius * Math.sin(this.bead_angle(i % this.beads_per_row) + angle_offset);
      bead = this.bead(negatives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      y -= vertical_step * 2;
    }

    this.cached_num_threads = this.braid.parameters.num_threads;
    this.cached_num_beads = this.braid.parameters.num_beads;
    this.cached_beads_per_row = this.braid.two_d_parameters.beads_per_row;
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
    if (this.scene === null ||
        this.cached_num_threads !== this.braid.parameters.num_threads ||
        this.cached_num_beads !== this.braid.parameters.num_beads ||
        this.cached_beads_per_row !== this.braid.two_d_parameters.beads_per_row) {
      this.fresh_render();
    } else if (this.cached_width !== this.element.clientWidth || this.cached_height !== this.element.clientHeight) {
      this.resize();
    } else {
      this.colour_render();
    }
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

  get weave_radius() {
    /*
      The circumference of the bead circle is equal to the sum of the diameters
      of all the beads on the circle (roughly). C = 2 * PI * r, so the radius of
      the bead circle is C / (2 * PI). Assuming each bead has a diameter of 2,
      this gives us this calculation for the radius of the bead circle.
     */
    return this.beads_per_row / Math.PI;
  }

  bead_angle(bead_number) {
    return -2 * Math.PI / this.beads_per_row * bead_number;
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
