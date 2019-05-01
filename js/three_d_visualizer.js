class ThreeDVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
    this.beads = [];
    this.numThreads = 0;
    this.numBeads = 0;
    this.cached_width = 0;
    this.cached_height = 0;
    this.scene = null;
  }

  fresh_render() {
    this.setScene();

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
    var y = this.loom.beads.length;

    for (var i = 0; i < this.loom.beads.length; i++) {
      var row = this.loom.beads[i];
      var angle_offset = -(this.bead_angle(1) / 2 * (i % (this.beads_per_row * 2)));

      for (var j = 0; j < row.length; j++) {
        var x = xorigin + this.weave_radius * Math.cos(this.bead_angle(j) + angle_offset);
        var z = zorigin + this.weave_radius * Math.sin(this.bead_angle(j) + angle_offset);
        var bead = this.bead(row[j], x, y, z);
        this.beads.push(bead);
        this.scene.add(bead.mesh);
      }

      y -= 2;
    }

    this.numThreads = this.braid.numThreads;
    this.numBeads = this.braid.numBeads;
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
    if (this.scene === null || this.numThreads !== this.braid.numThreads || this.numBeads !== this.braid.numBeads) {
      this.fresh_render();
    } else if (this.cached_width !== this.element.clientWidth || this.cached_height !== this.element.clientHeight) {
      this.resize();
    } else {
      this.colour_render();
    }
  }

  destroy() {
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
    if (this.scene === null || this.scene === undefined) {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xe1e1e1);
    }
  }

  _create_camera() {
    if (this.camera === null || this.camera === undefined) {
      this.camera = new THREE.PerspectiveCamera(75, this.element.clientWidth / this.element.clientHeight, 0.1, 1000);
      this.camera.position.set(0, 0, 50);
      this.camera.lookAt(0, 0, 0);
    }
  }

  _create_light() {
    if (this.light === null || this.light === undefined) {
      this.light = new THREE.PointLight( 0xffffff, 0.8 );
      this.camera.add(this.light);
    }
  }

  _create_renderer() {
    if (this.renderer === null || this.renderer === undefined) {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
      this.element.appendChild(this.renderer.domElement);
    }
  }

  _create_controls() {
    if (this.controls === null || this.controls === undefined) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
    }
  }

  _create_geometry() {
    if (this.geometry === null || this.geometry === undefined) {
      this.geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    }
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
