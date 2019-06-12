class VisualizerManager {
  constructor(braid, controls) {
    this.braid = braid;
    this.add_threads_element = controls.add_threads;
    this.remove_threads_element = controls.remove_threads;
    this.number_of_beads_element = controls.bead_number;
    this.colour_picker_element = controls.bead_colour;

    this.two_d_initial_vertical_position_element = controls['2d_initial_vertical_position'];
    this.two_d_vertical_step_element = controls['2d_vertical_step'];
    this.two_d_horizontal_step_element = controls['2d_horizontal_step'];

    this.three_d_radius_element = controls['3d_radius'];
    this.three_d_bead_step_element = controls['3d_bead_step'];
    this.three_d_vertical_step_element = controls['3d_vertical_step'];

    this.visualizers = [];

    this.setup_parameters_listener();
    this.setup_two_d_parameters_listener();
    this.setup_three_d_parameters_listener();
  }

  setup_parameters_listener() {
    var this_  = this;
    this.add_threads_element.addEventListener('click', function() {
      if (this_.braid.parameters.num_threads <= 28) {
        this_.braid.add_threads(4);
      }
      this_.render();
    });

    this.remove_threads_element.addEventListener('click', function() {
      if (this_.braid.parameters.num_threads > 4) {
        this_.braid.remove_threads(4);
      }
      this_.render();
    });

    this.number_of_beads_element.addEventListener('change', function() {
      this_.braid.set_beads(parseInt(this_.number_of_beads_element.value, 10));
      this_.render();
    });
  }

  setup_two_d_parameters_listener() {
    var this_ = this;
    this.two_d_initial_vertical_position_element.addEventListener('change', function() {
      this_.braid.two_d_parameters.initial_vertical_position = parseFloat(this_.two_d_initial_vertical_position_element.value, 10);
      this_.render();
    });

    this.two_d_vertical_step_element.addEventListener('change', function() {
      this_.braid.two_d_parameters.vertical_step = parseFloat(this_.two_d_vertical_step_element.value, 10);
      this_.render();
    });

    this.two_d_horizontal_step_element.addEventListener('change', function() {
      this_.braid.two_d_parameters.horizontal_step = parseFloat(this_.two_d_horizontal_step_element.value, 10);
      this_.render();
    });
  }

  setup_three_d_parameters_listener() {
    var this_ = this;
    this.three_d_radius_element.addEventListener('change', function() {
      this_.braid.three_d_parameters.radius = parseFloat(this_.three_d_radius_element.value, 10);
      this_.render();
    });

    this.three_d_bead_step_element.addEventListener('change', function() {
      this_.braid.three_d_parameters.bead_step = parseFloat(this_.three_d_bead_step_element.value, 10);
      this_.render();
    });

    this.three_d_vertical_step_element.addEventListener('change', function() {
      this_.braid.three_d_parameters.vertical_step = parseFloat(this_.three_d_vertical_step_element.value, 10);
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
    visualizer.bead_svgs.forEach(function(bead_svg) {
      bead_svg.element.addEventListener('mousemove', function(event) {
        /*
          The left mouse button is depressed if the rightmost bit is 1.
          Mask the buttons attribute with 0001 to flip all of the irrelevant
          bits first, and then we can just check to see if the result is 1.
        */
        if (event.buttons & 1 === 1) {
          bead_svg.bead.colour = this_.colour_picker_element.value;
          this_.render();
        }
      });

      bead_svg.element.addEventListener('click', function(event) {
        bead_svg.bead.colour = this_.colour_picker_element.value;
        this_.render();
      });
    });
  }
}
