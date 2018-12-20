class StringingVisualizer extends Visualizer {
  style() {
    return '';
  }

  elements() {
    var elements = [];
    for (var i = 0; i < this.braid.threads.length; i++) {
      elements.push(this.thread_element(this.braid.threads[i], i + 1));
    }
    return elements;
  }

  thread_element(thread, number) {
    var container = document.createElement('div');
    container.setAttribute('class', 'stringing_row');
    var label = document.createElement('div');
    label.appendChild(document.createTextNode('String ' + number + ':'));
    label.setAttribute('class', 'left');
    container.appendChild(label);

    var colours = [];
    for (var i = 0; i < thread.beads.length; i++) {
      var bead = thread.beads[i];
      if (colours.length === 0 || bead.colour !== colours[colours.length - 1].bead.colour) {
        colours.push({ bead: bead, count: 1 });
      } else {
        colours[colours.length - 1].count++;
      }
    }

    for (var i = 0; i < colours.length; i++) {
      var colour = colours[i];
      container.appendChild(this.bead_svg(colour.bead));
      var count_indicator = document.createElement('div');
      count_indicator.appendChild(document.createTextNode('x' + colour.count));
      count_indicator.setAttribute('class', 'left');
      container.appendChild(count_indicator);
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
