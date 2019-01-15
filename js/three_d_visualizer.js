class ThreeDVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
    this.beads = [];
    this.numThreads = 0;
    this.numBeads = 0;
    this.setScene();
  }

  render() {
    if (this.numThreads != this.braid.numThreads || this.numBeads != this.braid.numBeads) {
      this.loom.weave();

      while(this.beads.length != 0) {
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
    } else {
      this.beads.forEach(function(bead) {
        bead.mesh.material.color.set(bead.bead.colour);
      });
    }
  }

  get beads_per_row() {
    return this.braid.numThreads / 2;
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
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: bead.colour });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return { bead: bead, mesh: mesh};
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    var camera = new THREE.PerspectiveCamera(75, this.element.clientWidth / this.element.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add(light);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.element.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    var scene = this.scene;
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  }
}
