class VisualizerManager {
  constructor(braid, controls) {
    this.braid = braid;
    this.add_threads_element = controls.add_threads_button;
    this.remove_threads_element = controls.remove_threads_button;
    this.number_of_beads_element = controls.bead_number_input;
    this.colour_picker_element = controls.bead_colour_picker;
    this.beads_per_row_element = controls.beads_per_row_input;
    this.bead_step_element = controls.bead_step_input;

    this.visualizers = [];

    this.setup_add_threads_listener();
    this.setup_remove_threads_listener();
    this.setup_number_of_beads_listener();
  }

  setup_add_threads_listener() {
    var this_  = this;
    this.add_threads_element.addEventListener('click', function() {
      if (this_.braid.numThreads <= 28) {
        this_.braid.add_threads(4);
      }
      this_.render();
    });
  }

  setup_remove_threads_listener() {
    var this_  = this;
    this.remove_threads_element.addEventListener('click', function() {
      if (this_.braid.numThreads > 4) {
        this_.braid.remove_threads(4);
      }
      this_.render();
    });
  }

  setup_number_of_beads_listener() {
    var this_ = this;
    this.number_of_beads_element.addEventListener('change', function() {
      this_.braid.set_beads(parseInt(this_.number_of_beads_element.value, 10));
      this_.render();
    });
  }

  setup_beads_per_row_listener() {
    var this_ = this;
    this.beads_per_row_element.addEventListener('change', function() {
      this_.render();
    });
  }

  setup_bead_step_listener() {
    var this_ = this;
    this.bead_step_element.addEventListener('change', function() {
      this_.render();
    });
  }

  register_visualizer(visualizer) {
    this.visualizers.push(visualizer);
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
