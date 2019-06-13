class VisualizerManager {
  constructor(braid, controls) {
    this.braid = braid;

    this.visualizers = [];

    this.controls = controls;
    this.setup_parameters_listener();
    this.setup_three_d_parameters_listener();
  }

  setup_parameters_listener() {
    var this_  = this;
    this.controls.add_threads.addEventListener('click', function() {
      if (this_.braid.parameters.num_threads <= 28) {
        this_.braid.add_threads(4);
      }
      this_.render();
    });

    this.controls.remove_threads.addEventListener('click', function() {
      if (this_.braid.parameters.num_threads > 4) {
        this_.braid.remove_threads(4);
      }
      this_.render();
    });

    this.controls.bead_number.addEventListener('change', function() {
      if (this_.controls.bead_location_top.checked) {
        this_.braid.set_beads_from_the_top(parseInt(this_.controls.bead_number.value, 10));
      } else if (this_.controls.bead_location_bottom.checked) {
        this_.braid.set_beads_from_the_bottom(parseInt(this_.controls.bead_number.value, 10));
      }
      this_.render();
    });
  }

  setup_three_d_parameters_listener() {
    var this_ = this;
    this.controls['3d_radius'].addEventListener('change', function() {
      this_.braid.three_d_parameters.radius = parseFloat(this_.controls['3d_radius'].value, 10);
      this_.render();
    });

    this.controls['3d_bead_step'].addEventListener('change', function() {
      this_.braid.three_d_parameters.bead_step = parseFloat(this_.controls['3d_bead_step'].value, 10);
      this_.render();
    });

    this.controls['3d_vertical_step'].addEventListener('change', function() {
      this_.braid.three_d_parameters.vertical_step = parseFloat(this_.controls['3d_vertical_step'].value, 10);
      this_.render();
    });
  }

  register_visualizer(visualizer) {
    this.visualizers.push(visualizer);
    visualizer.manager = this;
  }

  deregister_visualizer(visualizer) {
    var index = this.visualizers.indexOf(visualizer);

    if (index > -1) {
      this.visualizers.splice(index, 1);
    }

    visualizer.destroy();
  }

  render() {
    for (var i = 0; i < this.visualizers.length; i++) {
      this.visualizers[i].render();
      this.add_listeners(this.visualizers[i]);
    }
  }

  add_listeners(visualizer) {
    var this_ = this;
    function update_colour(bead_svg) {
      bead_svg.bead.colour = this_.controls.bead_colour.value;
      this_.render();
    }

    visualizer.bead_svgs.forEach(function(bead_svg) {
      bead_svg.element.addEventListener('mousemove', function(event) {
        /*
          The left mouse button is depressed if the rightmost bit is 1.
          Mask the buttons attribute with 0001 to flip all of the irrelevant
          bits first, and then we can just check to see if the result is 1.
        */
        if (event.buttons & 1 === 1) {
          update_colour(bead_svg);
        }
      });

      bead_svg.element.addEventListener('click', function() { update_colour(bead_svg);});
    });
  }
}
