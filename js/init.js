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
          title: 'Stringing Guide (Names)',
          type: 'component',
          componentName: 'printable-stringing-visualizer',
          componentState: {}
        },
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
    return get_colour_from_value(document.getElementById('bead_colour').value);
  }

  function get_colour_from_value(colour_value) {
    var colour = ntc.name(colour_value);
    colour.rgb = colour_value.toUpperCase();
    return colour;
  }

  function get_colours_from_values(colour_values) {
    var colours = [];
    colour_values.forEach(function(colour_value) {
      colours.push(get_colour_from_value(colour_value));
    });
    return colours;
  }

  function get_colour_name() {
    document.getElementById('colour_name').value = get_current_colour().name;
  }

  function save_colour(colour) {
    var matched_colour_entry = ntc.names[colour.index];

    if (colour.exactmatch) {
      ntc.names[colour.index] = colour.raw;
      matched_colour_entry[1] = colour.name;
    } else if (colour.raw[0] < matched_colour_entry[0]) {
      ntc.names.splice(colour.index, 0, colour.raw);
    } else {
      ntc.names.splice(colour.index + 1, 0, colour.raw);
    }
  }

  function init_colour_picker(manager) {
    document.getElementById('bead_colour').addEventListener('change', get_colour_name);
    get_colour_name();

    document.getElementById('save_colour_name').addEventListener('click', function() {
      var colour = get_current_colour();

      if (colour.index === -1) { return; }

      var new_colour_name = document.getElementById('colour_name').value;
      colour.name = new_colour_name;
      save_colour(colour);

      manager.render();
    });
  }

  function init_save_load_controls(manager, palette_manager) {
    document.getElementById('save_braid').addEventListener('click', function() {
      var filename = document.getElementById('save_braid_filename').value.trim();

      if (filename === '') { return; }

      var link = document.getElementById('save_braid_link');
      link.href = window.URL.createObjectURL(
        new Blob(
          [JSON.stringify({ braid: manager.braid, colours: get_colours_from_values(manager.braid.colours) })],
          { type: 'octet/stream' }
        )
      );
      link.target = '_blank';
      link.download = filename;
      link.click();
    });

    document.getElementById('load_braid').addEventListener('click', function(event) {
      var file_upload = document.getElementById('load_braid_file');

      if (file_upload.value.trim() === '') { return; }

      var reader = new FileReader();
      reader.onload = function(event) {
        loaded_data = JSON.parse(event.target.result);

        if (loaded_data.braid === undefined) {
          // Version 1 of save/load
          manager.braid.copy(loaded_data);
        } else {
          manager.braid.copy(loaded_data.braid);

          loaded_data.colours.forEach(function(colour) {
            var matched_colour = get_colour_from_value(colour.rgb);

            if (colour.index === -1) { return; }

            matched_colour.name = colour.name;
            save_colour(matched_colour);
          });
        }

        palette_manager.load_from_braid();
        get_colour_name();
        manager.controls.bead_number.value = manager.braid.parameters.num_beads;
        manager.record_history();
        manager.render(true);
      };
      reader.readAsText(file_upload.files[0]);
    });
  }

  function init() {
    var controls = {};
    [
      'undo',
      'redo',
      'add_threads',
      'remove_threads',
      'bead_number',
      'bead_location_top',
      'bead_location_bottom',
      'bead_colour',
      'add_to_palette',
      '3d_radius',
      '3d_bead_step',
      '3d_vertical_step',
    ].forEach(function(id) { controls[id] = document.getElementById(id); });

    var parameters = {
      num_threads: 12,
      num_beads: parseInt(controls.bead_number.value, 10)
    };
    var three_d_parameters = {
      radius: parseFloat(controls['3d_radius'].value, 10),
      bead_step: parseFloat(controls['3d_bead_step'].value, 10),
      vertical_step: parseFloat(controls['3d_vertical_step'].value, 10)
    };
    var braid = new Braid(parameters, three_d_parameters);
    //braid.load_demo();

    var manager = new VisualizerManager(braid, controls);
    var palette_manager = new PaletteManager(braid, document.getElementById('palette'), controls);
    manager.register_visualizer(palette_manager);
    manager.render();

    var layout = new window.GoldenLayout(config, $('#layout-container'));

    function registration_function(visualization_class) {
      return function(container, state) {
        var visualizer = new visualization_class(braid, container.getElement().get(0), controls);
        manager.register_visualizer(visualizer);
        container.on('destroy', function(container) { manager.deregister_visualizer(visualizer); });
        container.on('resize', function(container) { manager.render(); });
        container.on('tabClick', function(container) { manager.render(); });
        manager.render();
      };
    }

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

    add_menu_item('3d-braided-visualizer', '3D Braided View');
    add_menu_item('unbraided-visualizer', 'Unbraided View');
    add_menu_item('stringing-visualizer', 'Stringing Guide (Colours)');
    add_menu_item('printable-stringing-visualizer', 'Stringing Guide (Names)');

    init_colour_picker(manager);
    init_save_load_controls(manager, palette_manager);
  }

  window.addEventListener('load', init);
})();
