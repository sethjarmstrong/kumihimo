class Bead {
  constructor(colour = '#ffffff') {
    this.colour = colour;
  }
}

class Thread {
  constructor(numBeads) {
    this.beads = [];
    this.current_bead = 0;
    this.set_beads(numBeads);
  }

  change_colour(colour) {
    this.beads.forEach(function(bead) {
      bead.colour = colour;
    });
  }

  next_bead() {
    if (this.current_bead == this.beads.length) {
      return null;
    }
    return this.beads[this.current_bead++];
  }

  add_bead() {
    this.beads.push(new Bead());
  }

  remove_bead() {
    this.beads.pop();
  }

  set_beads(amount) {
    while (this.beads.length > amount) {
      this.remove_bead();
    }

    while (this.beads.length < amount) {
      this.add_bead();
    }
  }
}

class Braid {
  constructor(numThreads, numBeads) {
    this.numThreads = 0;
    this.numBeads = numBeads;
    this.threads = [];

    this.add_threads(numThreads);
  }

  add_threads(amount) {
    this.numThreads += amount;

    while (this.threads.length < this.numThreads) {
      this.threads.push(new Thread(this.numBeads));
    }
  }

  remove_threads(amount) {
    this.numThreads -= amount;

    while (this.threads.length > this.numThreads) {
      this.threads.pop();
    }
  }

  set_beads(amount) {
    this.numBeads = amount;
    for (var i = 0; i < this.numThreads; i++) {
      this.threads[i].set_beads(amount);
    }
  }

  reset_beading() {
    this.threads.forEach(function(thread) {
      thread.current_bead = 0;
    });
  }
}

(function() {
  var config= {
    settings: {
      showPopoutIcon: false
    },
    labels: {
      close: 'close',
      maximize: 'maximize',
      minimize: 'minimize'
    },
    content: [{
      type: 'row',
      content: [
        {
          title: '2D Braided View',
          type: 'component',
          componentName: '2d-braided-visualizer',
          componentState: {}
        },
        {
          title: 'Offset 2D Braided View',
          type: 'component',
          componentName: 'offset-2d-braided-visualizer',
          componentState: {}
        }
        /*
        {
          title: '3D Braided View',
          type: 'component',
          componentName: '3d-braided-visualizer',
          componentState: {}
        }
        */
      ]
    }]
  };

  function get_colour_name() {
    var element = document.getElementById('colour_name');
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    var colour_value = document.getElementById('bead_colour').value;
    var colour_name = ntc.name(colour_value).name;
    var colour_text_node = document.createTextNode(colour_name);
    element.appendChild(colour_text_node);
  }

  function init_colour_picker() {
    document.getElementById('bead_colour').addEventListener('change', get_colour_name);
    get_colour_name();
  }

  function init() {
    var add_threads_button = document.getElementById('add_threads');
    var remove_threads_button = document.getElementById('remove_threads');
    var bead_number_input = document.getElementById('bead_number');
    var bead_colour_picker = document.getElementById('bead_colour');

    var braid = new Braid(12, parseInt(bead_number_input.value, 10));

    var manager = new VisualizerManager(
      braid,
      add_threads_button,
      remove_threads_button,
      bead_number_input,
      bead_colour_picker
    );

    var layout = new window.GoldenLayout(config, $('#layout-container'));

    function registration_function(visualization_class) {
      return function(container, state) {
        var visualizer = new visualization_class(braid, container.getElement().get(0));
        manager.register_visualizer(visualizer);
        container.on('destroy', function(container) { manager.deregister_visualizer(visualizer); });
        container.on('resize', function(container) { manager.render(); });
        container.on('tabClick', function(container) { manager.render(); });
        manager.render();
      };
    }

    layout.registerComponent('2d-braided-visualizer', registration_function(BraidedVisualizer));
    layout.registerComponent('offset-2d-braided-visualizer', registration_function(OffsetBraidedVisualizer));
    layout.registerComponent('3d-braided-visualizer', registration_function(ThreeDVisualizer));
    layout.registerComponent('unbraided-visualizer', registration_function(UnbraidedVisualizer));
    layout.registerComponent('stringing-visualizer', registration_function(StringingVisualizer));
    layout.registerComponent('printable-stringing-visualizer', registration_function(PrintableStringingVisualizer));

    layout.init();

    var add_menu_item = function(component_name, title) {
      var element = $('<li class="component">' + title + '</li>');
      $('#menu-container').append(element);

      var new_item_config = {
        title: title,
        type: 'component',
        componentName: component_name,
        componentState: {}
      };

      layout.createDragSource(element, new_item_config);
    };

    add_menu_item('2d-braided-visualizer', '2D Braided View');
    add_menu_item('offset-2d-braided-visualizer', 'Offset 2D Braided View');
    add_menu_item('3d-braided-visualizer', '3D Braided View');
    add_menu_item('unbraided-visualizer', 'Unbraided View');
    add_menu_item('stringing-visualizer', 'Stringing Guide (Colours)');
    add_menu_item('printable-stringing-visualizer', 'Stringing Guide (Names)');

    init_colour_picker();
  }

  window.addEventListener('load', init);
})();
