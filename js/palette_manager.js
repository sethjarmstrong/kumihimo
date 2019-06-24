class PaletteManager extends Visualizer {
  constructor(braid, element, control_elements) {
    super(braid, element, control_elements);
    this.colours = [];

    this.control_elements.add_to_palette.addEventListener('click', function() {
      this.add(this.control_elements.bead_colour.value);
    }.bind(this));
  }

  add(colour) {
    if (this.find_index(colour) === -1) {
      this.colours.push(new PaletteColour(colour, this, this.set_colour));
      this.sort();
      this.render();
    }
  }

  remove(colour) {
    var index = this.find_index(colour);
    if (index === -1) { return; }
    this.colours.splice(index, 1);
    this.render();
  }

  load_from_braid() {
    this.colours.length = 0;
    this.braid.colours.forEach(function(colour) {
      this.add(colour);
    }.bind(this));
  }

  find_index(colour) {
    return this.colours.findIndex(function(element) {
      return element.colour === colour;
    });
  }

  sort() {
    this.colours.sort(function(a, b) {
      var x = a.colour_name.toLowerCase();
      var y = b.colour_name.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  render() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }

    this.colours.forEach(function(colour) {
      this.element.appendChild(colour.render());
    }.bind(this));
  }

  set_colour() {
    this.parent.control_elements.bead_colour.value = this.colour;
    document.getElementById('colour_name').value = this.colour_name;
  }
}


class PaletteColour {
  constructor(colour, parent, action_method) {
    this.colour = colour;
    this.parent = parent;
    this.action_method = action_method.bind(this);
    this.removal_method = this.remove.bind(this);
    this.element = undefined;
    this.colour_button = undefined;
    this.removal_button = undefined;
  }

  render() {
    this.destroy();

    this.colour_button = document.createElement('button');
    this.colour_button.setAttribute('type', 'button');
    this.colour_button.setAttribute('style', this.styles.join('; '));
    this.colour_button.innerHTML = this.colour_name;
    this.colour_button.addEventListener('click', this.action_method);

    this.removal_button = document.createElement('button');
    this.removal_button.setAttribute('type', 'button');
    this.removal_button.innerHTML = 'Remove';
    this.removal_button.addEventListener('click', this.removal_method);

    this.element = document.createElement('div');
    this.element.appendChild(this.colour_button);
    this.element.appendChild(this.removal_button);
    return this.element;
  }

  destroy() {
    if (this.colour_button !== undefined) {
      this.colour_button.removeEventListener('click', this.action_method);
    }

    if (this.removal_button !== undefined) {
      this.removal_button.removeEventListener('click', this.removal_method);
    }
  }

  remove() {
    this.destroy();
    this.parent.element.removeChild(this.element);
    this.parent.remove(this.colour);
  }

  get colour_name() {
    return ntc.name(this.colour).name;
  }

  get styles() {
    return [
      'border-width: 2px',
      'border-color: ' + this.colour
    ];
  }
}
