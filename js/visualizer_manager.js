class VisualizerManager {
  constructor(braid, add_threads_element, remove_threads_element, number_of_beads_element, colour_picker_element) {
    this.braid = braid;
    this.add_threads_element = add_threads_element;
    this.remove_threads_element = remove_threads_element;
    this.number_of_beads_element = number_of_beads_element;
    this.colour_picker_element = colour_picker_element;
    this.visualizers = [];

    this.setup_add_threads_listener();
    this.setup_remove_threads_listener();
    this.setup_number_of_beads_listener();
  }

  setup_add_threads_listener() {
    var this_  = this;
    this.add_threads_element.addEventListener('click', function() {
      if (this_.braid.numThreads <= 24) {
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

  register_visualizer(visualizer) {
    this.visualizers.push(visualizer);
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
      bead_svg.element.addEventListener('click', function() {
        bead_svg.bead.colour = this_.colour_picker_element.value;
        this_.render();
      });
    });
  }
}
