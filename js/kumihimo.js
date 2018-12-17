class Bead {
  constructor(colour = 'red') {
    this.colour = colour;
  }

  svg(x, y, r) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    circle.setAttribute('fill', this.colour);
    return circle;
  }
}

class Thread {
  constructor(numBeads) {
    this.beads = [];

    for (var i = 0; i < numBeads; i++) {
      this.beads.push(new Bead());
    }
  }

  svg(x) {
    var elements = [];

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('x2', x);
    line.setAttribute('y1', '0%');
    line.setAttribute('y2', '100%');
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '3');
    elements.push(line);

    var segment_length = 100 / this.beads.length;
    var segment_mid = segment_length / 2;

    for (var i = 0; i < this.beads.length; i++) {
      var y = (segment_length * i + segment_mid) + '%';
      var r = 8;
      elements.push(this.beads[i].svg(x, y, r));
    }

    return elements;
  }
}

class Braid {
  constructor(numThreads, numBeads) {
    this.numThreads = numThreads;
    this.numBeads = numBeads;

    this.threads = [];

    for (var i = 0; i < numThreads; i++) {
      this.threads.push(new Thread(numBeads));
    }
  }

  svg() {
    var elements = [];

    var column_width = 100 / this.threads.length;
    var column_mid = column_width / 2;

    for (var i = 0; i < this.threads.length; i++) {
      var x = (column_width * i + column_mid) + '%';
      var thread_svgs = this.threads[i].svg(x);

      for (var j = 0; j < thread_svgs.length; j++) {
        elements.push(thread_svgs[j]);
      }
    }

    return elements;
  }
}

class UnbraidedVisualizer {
  constructor(braid, element) {
    this.braid = braid;
    this.element = element;
    this.px_per_bead = 20;
  }

  render() {
    this.clean_element();

    var svgs = this.braid.svg();
    var element = this.element;
    element.setAttribute('style', 'height: ' + this.height());

    svgs.forEach(function(svg) {
      element.appendChild(svg);
    });
  }

  clean_element() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  height() {
    return (this.braid.numBeads * this.px_per_bead) + 'px';
  }
}
