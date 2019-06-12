class ThreeDVisualizer extends Visualizer {
  constructor(braid, element, control_elements) {
    super(braid, element, control_elements);
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

  get radius() {
    return this.braid.three_d_parameters.radius;
  }

  get bead_step() {
    return this.braid.three_d_parameters.bead_step;
  }

  get vertical_step() {
    // The vertical step is meant to be the amount that we move down with each
    // bead, in terms of a percentage of bead height. Since the radius of each
    // bead is 1, the total height of any given bead is 2, and we can convert
    // the step percentage into a measurement by doubling it.
    return this.braid.three_d_parameters.vertical_step * 2;
  }

  get rotation_step() {
    return this.bead_step;
  }

  get pan_step() {
    return this.vertical_step * 4;
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
      this.scene.add(bead.outline_mesh);
      y -= this.vertical_step;
    }

    y = 0;
    for (var i = 0; i < negatives.length; i++) {
      x = xorigin + this.radius * Math.cos(this.bead_angle(i));
      z = zorigin + this.radius * Math.sin(this.bead_angle(i));
      bead = this.bead(negatives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      this.scene.add(bead.outline_mesh);
      y -= this.vertical_step;
    }

    this.cached_parameters = this.all_parameters;
  }

  resize() {
    this._set_visualization_size();
    this.camera.aspect = this.viewport_size.width / this.viewport_size.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport_size.width, this.viewport_size.height);
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

    this.controls.destroy();
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
    mesh.bead = bead;
    return { bead: bead, mesh: mesh, outline_mesh: this.create_outline(mesh) };
  }

  create_outline(mesh) {
    var outline_material = new THREE.MeshBasicMaterial({ color: 0, side: THREE.BackSide });
    var outline_mesh = new THREE.Mesh(this.geometry, outline_material);
    outline_mesh.position.copy(mesh.position);
    outline_mesh.scale.multiplyScalar(1.05);
    return outline_mesh;
  }

  setScene() {
    if (this.element.clientWidth === 0 || this.element.clientHeight === 0) {
      return;
    }

    this._set_visualization_size();
    this._create_scene();
    this._create_camera();
    this._create_light();
    this._create_renderer();
    this._create_controls();
    this._create_geometry();
    this._animate();
  }

  get viewport_size() {
    return {
      width: this.element.clientWidth,
      height: this.element.clientHeight - 240
    };
  }

  _set_visualization_size() {
    this.cached_width = this.element.clientWidth;
    this.cached_height = this.element.clientHeight;
  }

  _create_scene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe1e1e1);
  }

  get camera_radius() { return 50; }

  _create_camera() {
    this.camera = new THREE.PerspectiveCamera(75, this.viewport_size.width / this.viewport_size.height, 0.1, 1000);
    this.camera.position.set(this.camera_radius, 0, 0);
    this.camera.lookAt(0, 0, 0);
  }

  _create_light() {
    this.light = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(this.light);
  }

  _create_renderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.viewport_size.width, this.viewport_size.height);
    this.element.appendChild(this.renderer.domElement);
  }

  _create_controls() {
    function button_control(direction, size, kind) {
      var button = document.createElement('i');
      button.setAttribute('class', ['fas', 'fa-' + size, 'clickable', direction, kind + direction].join(' '));
      return button;
    }

    function arrow_control(direction) {
      return button_control(direction, '5x', 'fa-chevron-');
    }

    function zoom_control(direction) {
      return button_control(direction, '2x', 'fa-');
    }

    var buttons_container = document.createElement('div');
    buttons_container.setAttribute('class', 'movement-buttons');

    this.left_button = arrow_control('left');
    this.right_button = arrow_control('right');
    this.up_button = arrow_control('up');
    this.down_button = arrow_control('down');
    this.zoom_in_button = zoom_control('plus');
    this.zoom_out_button = zoom_control('minus');

    buttons_container.appendChild(this.left_button);
    buttons_container.appendChild(this.up_button);
    buttons_container.appendChild(this.down_button);
    buttons_container.appendChild(this.right_button);
    buttons_container.appendChild(this.zoom_in_button);
    buttons_container.appendChild(this.zoom_out_button);
    this.element.appendChild(buttons_container);
    this.controls = new ThreeDControls(this);
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

class ThreeDControls {
  /*
    The bead step could be used as the amount to rotate the camera left and
    right by, while the vertical step could be used as the amount to move the
    camera up and down by (probably quadrupled to make the amount more
    reasonable). That should keep the camera always focused on a bead.
  */

  constructor(visualizer) {
    this.visualizer = visualizer;
    this.radius = visualizer.camera_radius;
    this.angle = 0;

    this.functions = {
      rotate_left: this.rotate_left(),
      rotate_right: this.rotate_right(),
      pan_up: this.pan_up(),
      pan_down: this.pan_down(),
      zoom_in: this.zoom_in(),
      zoom_out: this.zoom_out(),
      draw: this.draw()
    };

    visualizer.left_button.addEventListener('click', this.functions.rotate_left);
    visualizer.right_button.addEventListener('click', this.functions.rotate_right);
    visualizer.up_button.addEventListener('click', this.functions.pan_up);
    visualizer.down_button.addEventListener('click', this.functions.pan_down);
    visualizer.zoom_in_button.addEventListener('click', this.functions.zoom_in);
    visualizer.zoom_out_button.addEventListener('click', this.functions.zoom_out);
    visualizer.renderer.domElement.addEventListener('click', this.functions.draw);
  }

  destroy () {
    this.visualizer.left_button.removeEventListener('click', this.functions.rotate_left);
    this.visualizer.right_button.removeEventListener('click', this.functions.rotate_right);
    this.visualizer.up_button.removeEventListener('click', this.functions.pan_up);
    this.visualizer.down_button.removeEventListener('click', this.functions.pan_down);
    this.visualizer.zoom_in_button.removeEventListener('click', this.functions.zoom_in);
    this.visualizer.zoom_out_button.removeEventListener('click', this.functions.zoom_out);
    visualizer.renderer.domElement.removeEventListener('click', this.functions.draw);
  }

  rotate(amount) {
    var this_ = this;
    return function() {
      this_.add_angle(amount);
      var x = this_.radius * Math.cos(this_.rotation_angle);
      var z = this_.radius * Math.sin(this_.rotation_angle);
      this_.camera.position.set(x, this_.camera.position.y, z);
      this_.camera.lookAt(0, this_.camera.position.y, 0);
    };
  }
  rotate_left() { return this.rotate(this.rotation_step); }
  rotate_right() { return this.rotate(-this.rotation_step); }

  pan(amount) {
    var this_ = this;
    return function() {
      var v = new THREE.Vector3(0, amount, 0);
      v.multiplyScalar(this_.pan_step);
      this_.camera.position.add(v);
    };
  }
  pan_up() { return this.pan(1); }
  pan_down() { return this.pan(-1); }

  zoom(amount) {
    var this_ = this;
    return function() {
      this_.radius += amount;
      this_.radius = Math.max(this_.radius, 10);
      this_.radius = Math.min(this_.radius, this_.visualizer.camera_radius);
      this_.rotate(0)();
    };
  }
  zoom_in() { return this.zoom(-5); }
  zoom_out() { return this.zoom(5); }

  draw() {
    var this_ = this;
    var raycaster = new THREE.Raycaster();
    var mouse_position = new THREE.Vector2();

    return function(event) {
      mouse_position.x = (event.offsetX / this_.visualizer.viewport_size.width) * 2 - 1;
      mouse_position.y = -(event.offsetY / this_.visualizer.viewport_size.height) * 2 + 1;

      raycaster.setFromCamera(mouse_position, this_.camera);

      var intersects = raycaster.intersectObjects(this_.visualizer.scene.children);

      if (intersects.length > 0) {
        intersects[0].object.bead.colour = this_.colour;
        this_.visualizer.manager.render();
      }
    };
  }

  // Utility methods

  get rotation_angle() { return 2 * Math.PI * this.angle / 360; }
  add_angle(amount) {
    this.angle += amount;
    if (this.angle < 0) { this.angle += 360; }
    if (this.angle >= 360) { this.angle -= 360; }
  }

  get camera() { return this.visualizer.camera; }
  get rotation_step() { return this.visualizer.rotation_step; }
  get pan_step() { return this.visualizer.pan_step; }

  get colour() { return this.visualizer.control_elements.bead_colour.value; }
}
