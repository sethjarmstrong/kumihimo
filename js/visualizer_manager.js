class VisualizerManager {
  constructor(braid, controls) {
    this.braid = braid;
    this.braid_history = [];
    this.current_braid = -1;
    this.max_history = 50;
    this.record_history();

    this.visualizers = [];

    this.controls = controls;

    this.setup_editing_controls_listener();
    this.setup_parameters_listener();
    this.setup_three_d_parameters_listener();
  }

  record_history() {
    // If we're not pointing at the latest change, then we've gone back in time
    // and then changed things. The future no longer holds, so delete it!
    if (this.current_braid + 1 !== this.braid_history.length) { this.braid_history.length = this.current_braid + 1; }

    // We only want to record so much, so purge the oldest record.
    if (this.braid_history.length === this.max_history) { this.braid_history.shift(); }
    this.braid_history.push(this.braid.clone());
    this.current_braid = Math.min(this.current_braid + 1, this.max_history - 1);
  }

  rollback() {
    if (this.current_braid === 0) { return; }
    this.current_braid = Math.max(this.current_braid - 1, 0);
    this.braid.copy(this.braid_history[this.current_braid]);
    this.render(true);
  }

  rollforward() {
    if (this.current_braid === this.braid_history.length - 1) { return; }
    this.current_braid = Math.min(this.current_braid + 1, this.braid_history.length - 1);
    this.braid.copy(this.braid_history[this.current_braid]);
    this.render(true);
  }

  setup_editing_controls_listener() {
    this.controls.undo.addEventListener('click', this.rollback.bind(this));
    this.controls.redo.addEventListener('click', this.rollforward.bind(this));
  }

  setup_parameters_listener() {
    this.controls.add_threads.addEventListener('click', function() {
      if (this.braid.parameters.num_threads <= 28) {
        this.braid.add_threads(4);
        this.record_history();
        this.render();
      }
    }.bind(this));

    this.controls.remove_threads.addEventListener('click', function() {
      if (this.braid.parameters.num_threads > 4) {
        this.braid.remove_threads(4);
        this.record_history();
        this.render();
      }
    }.bind(this));

    this.controls.bead_number.addEventListener('change', function() {
      if (this.controls.bead_location_top.checked) {
        this.braid.set_beads_from_the_top(parseInt(this.controls.bead_number.value, 10));
      } else if (this.controls.bead_location_bottom.checked) {
        this.braid.set_beads_from_the_bottom(parseInt(this.controls.bead_number.value, 10));
      }
      this.record_history();
      this.render();
    }.bind(this));
  }

  setup_three_d_parameters_listener() {
    this.controls['3d_radius'].addEventListener('change', function() {
      this.braid.three_d_parameters.radius = parseFloat(this.controls['3d_radius'].value, 10);
      this.render();
    }.bind(this));

    this.controls['3d_bead_step'].addEventListener('change', function() {
      this.braid.three_d_parameters.bead_step = parseFloat(this.controls['3d_bead_step'].value, 10);
      this.render();
    }.bind(this));

    this.controls['3d_vertical_step'].addEventListener('change', function() {
      this.braid.three_d_parameters.vertical_step = parseFloat(this.controls['3d_vertical_step'].value, 10);
      this.render();
    }.bind(this));
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

  render(force) {
    for (var i = 0; i < this.visualizers.length; i++) {
      this.visualizers[i].render(force);
      this.add_listeners(this.visualizers[i]);
    }
  }

  add_listeners(visualizer) {
    var update_colour = function(event, bead_svg) {
      if (event.shiftKey) {
        this.braid.set_all_beads_of_colour_to(bead_svg.bead.colour, this.controls.bead_colour.value);
      } else {
        bead_svg.bead.colour = this.controls.bead_colour.value;
      }

        this.record_history();
      this.render();
    }.bind(this);

    visualizer.bead_svgs.forEach(function(bead_svg) {
      bead_svg.element.addEventListener('mousemove', function(event) {
        /*
          The left mouse button is depressed if the rightmost bit is 1.
          Mask the buttons attribute with 0001 to flip all of the irrelevant
          bits first, and then we can just check to see if the result is 1.
        */
        if (event.buttons & 1 === 1) { update_colour(event, bead_svg); }
      });

      bead_svg.element.addEventListener('click', function(event) { update_colour(event, bead_svg); });
    });
  }
}
