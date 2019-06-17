class StringingVisualizer extends TwoDVisualizer {
  elements() {
    var elements = [];
    elements.push(this.totals_element());
    for (var i = 0; i < this.braid.threads.length; i++) {
      elements.push(this.thread_element(this.braid.threads[i], i + 1));
    }
    return elements;
  }

  create_container(thread_number) {
    var container = document.createElement('div');
    container.setAttribute('class', 'stringing_row');
    var label = document.createElement('div');
    label.appendChild(document.createTextNode('String ' + thread_number + ':'));
    label.setAttribute('class', 'left');
    container.appendChild(label);
    return container;
  }

  group_colours(thread) {
    var colours = [];
    for (var i = 0; i < thread.beads.length; i++) {
      var bead = thread.beads[i];
      if (colours.length === 0 || bead.colour !== colours[colours.length - 1].bead.colour) {
        colours.push({ bead: bead, count: 1 });
      } else {
        colours[colours.length - 1].count++;
      }
    }
    return colours;
  }

  create_colour_descriptor(colour, last_colour) {
    var colour_descriptor = document.createElement('div');
    colour_descriptor.appendChild(this.bead_svg(colour.bead));

    var count_indicator = document.createElement('div');
    count_indicator.appendChild(document.createTextNode('x' + colour.count));
    count_indicator.setAttribute('class', 'left');
    colour_descriptor.appendChild(count_indicator);

    return colour_descriptor;
  }

  totals_element() {
    function pluralize(string, amount) {
      return (Math.abs(amount) > 1 ? string + 's' : string);
    }

    var colours = this.colour_totals();
    var colour_strings = [];

    for (var colour in colours) {
      colour_strings.push(colours[colour] + ' ' + ntc.name(colour).name + ' ' + pluralize('bead', colours[colour]));
    }

    var container = document.createElement('div');
    container.setAttribute('class', 'stringing_row');
    container.appendChild(document.createTextNode(colour_strings.join(', ')));
    return container;
  }

  colour_totals() {
    var colours = {};
    for (var i = 0; i < this.braid.threads.length; i++) {
      for (var j = 0; j < this.braid.threads[i].beads.length; j++) {
        var bead = this.braid.threads[i].beads[j];
        if (!(bead.colour in colours)) { colours[bead.colour] = 0; }
        colours[bead.colour]++;
      }
    }
    return colours;
  }

  thread_element(thread, number) {
    var container = this.create_container(number);
    var colours = this.group_colours(thread);

    for (var i = 0; i < colours.length; i++) {
      container.appendChild(this.create_colour_descriptor(colours[i], i === colours.length - 1));
    }

    return container;
  }

  bead_svg(bead) {
    var size = this.px_per_bead + 'px';
    var svg_element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg_element.setAttribute('style', 'height: ' + size + '; ' + 'width: ' + size);
    svg_element.appendChild(super.bead_svg(bead, '50%', '50%'));
    svg_element.setAttribute('class', 'left');
    return svg_element;
  }
}
