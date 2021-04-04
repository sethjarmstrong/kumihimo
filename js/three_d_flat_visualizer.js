class ThreeDFlatVisualizer extends ThreeDVisualizer {
  _controls_class() {
    return new ThreeDFlatControls(this);
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
    this.remove_beads_from_scene();

    // y is the up/down axis
    // x is the front/back axis
    // z is the left/right axis
    let y = 0, x = 0, z = 0;

    let bead;

    let positives = this.spirals.positives;
    let negatives = this.spirals.negatives;

    let angle;

    for (var i = 0; i < positives.length; i++) {
      angle = (this.bead_angle(i) + Math.PI) % (2 * Math.PI);
      angle = angle < -Math.PI ? angle + Math.PI : angle;
      z = this.radius * angle;
      bead = this.bead(positives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      this.scene.add(bead.outline_mesh);
      y -= this.vertical_step;
    }

    y = 0;
    for (var i = 0; i < negatives.length; i++) {
      angle = this.bead_angle(i);
      angle = angle < -Math.PI ? angle + (2 * Math.PI) : angle;
      z = this.radius * angle;
      bead = this.bead(negatives[i], x, y, z);
      this.beads.push(bead);
      this.scene.add(bead.mesh);
      this.scene.add(bead.outline_mesh);
      y -= this.vertical_step;
    }

    this.cached_parameters = this.all_parameters;
    this.braid.calculate_neighbours();
  }

  _create_camera() {
    super._create_camera();
    this.camera.rotation.x = Math.PI / 2;
  }
}

class ThreeDFlatControls extends ThreeDControls {
  constructor(visualizer) {
    super(visualizer);

    this.functions.pan_left = this.pan_left();
    this.functions.pan_right = this.pan_right();

    visualizer.left_button.removeEventListener('click', this.functions.rotate_left);
    visualizer.right_button.removeEventListener('click', this.functions.rotate_right);

    visualizer.left_button.addEventListener('click', this.functions.pan_down);
    visualizer.right_button.addEventListener('click', this.functions.pan_up);

    visualizer.up_button.removeEventListener('click', this.functions.pan_up);
    visualizer.down_button.removeEventListener('click', this.functions.pan_down);

    visualizer.up_button.addEventListener('click', this.functions.pan_left);
    visualizer.down_button.addEventListener('click', this.functions.pan_right);
  }

  pan_horizontal(amount) {
    return function() {
      var v = new THREE.Vector3(0, 0, amount);
      v.multiplyScalar(this.pan_step);
      this.camera.position.add(v);
    }.bind(this);
  }
  pan_left() { return this.pan_horizontal(1); }
  pan_right() { return this.pan_horizontal(-1); }

  zoom(amount) {
    return function() {
      var v = new THREE.Vector3(amount, 0, 0);
      v.multiplyScalar(this.pan_step);
      this.camera.position.add(v);
    }.bind(this);
  }
  zoom_in() { return this.zoom(-1); }
  zoom_out() { return this.zoom(1); }
}
