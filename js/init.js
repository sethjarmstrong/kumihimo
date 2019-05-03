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
          title: 'Unbraided View',
          type: 'component',
          componentName: 'unbraided-visualizer',
          componentState: {}
        },
        /*
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
        },
        */
        {
          title: '3D Braided View',
          type: 'component',
          componentName: '3d-braided-visualizer',
          componentState: {}
        }
      ]
    }]
  };

  function get_current_colour() {
    var colour_value = document.getElementById('bead_colour').value;
    var colour = ntc.name(colour_value);
    colour.rgb = document.getElementById('bead_colour').value.toUpperCase();
    return colour;
  }

  function get_colour_name() {
    var element = document.getElementById('colour_name');
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    document.getElementById('colour_name').value = get_current_colour().name;
  }

  function init_colour_picker() {
    document.getElementById('bead_colour').addEventListener('change', get_colour_name);
    get_colour_name();

    document.getElementById('save_colour_name').addEventListener('click', function() {
      var colour = get_current_colour();

      if (colour.index === -1) {
        return;
      }

      var new_colour_name = document.getElementById('colour_name').value;
      colour.name = new_colour_name;

      var matched_colour_entry = ntc.names[colour.index];

      if (colour.exactmatch) {
        ntc.names[colour.index] = colour.raw;
        matched_colour_entry[1] = new_colour_name;
      } else if (colour.raw[0] < matched_colour_entry[0]) {
        ntc.names.splice(colour.index, 0, colour.raw);
      } else {
        ntc.names.splice(colour.index + 1, 0, colour.raw);
      }
    });
  }

  function init() {
    var controls = {};
    [
      'add_threads',
      'remove_threads',
      'bead_number',
      'bead_colour',
      '2d_initial_vertical_position',
      '2d_vertical_step',
      '2d_horizontal_step',
      '3d_radius',
      '3d_bead_step',
      '3d_vertical_step',
    ].forEach(function(id) { controls[id] = document.getElementById(id); });

    var parameters = {
      num_threads: 12,
      num_beads: parseInt(controls.bead_number.value, 10)
    };
    var two_d_parameters = {
      initial_vertical_position: parseFloat(controls['2d_initial_vertical_position'].value, 10),
      vertical_step: parseFloat(controls['2d_vertical_step'].value, 10),
      horizontal_step: parseFloat(controls['2d_horizontal_step'].value, 10)
    };
    var three_d_parameters = {
      radius: parseFloat(controls['3d_radius'].value, 10),
      bead_step: parseFloat(controls['3d_bead_step'].value, 10),
      vertical_step: parseFloat(controls['3d_vertical_step'].value, 10)
    };
    var braid = new Braid(parameters, two_d_parameters, three_d_parameters);
    braid.load_demo();

    var manager = new VisualizerManager(braid, controls);

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
