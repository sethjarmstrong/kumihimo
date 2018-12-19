class UnbraidedVisualizer extends Visualizer {
  get rows() {
    return this.braid.numBeads;
  }

  get columns() {
    return this.braid.numThreads;
  }

  svgs() {
    var elements = [];

    var column_width = 100 / this.braid.threads.length;
    var column_mid = column_width / 2;

    for (var i = 0; i < this.braid.threads.length; i++) {
      var x = (column_width * i + column_mid) + '%';
      var thread_svgs = this.thread_svg(this.braid.threads[i], x);

      thread_svgs.forEach(function(svg) {
        elements.push(svg);
      });
    }

    return elements;
  }

  thread_svg(thread, x) {
    var elements = [];

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('x2', x);
    line.setAttribute('y1', '0%');
    line.setAttribute('y2', '100%');
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '3');
    elements.push(line);

    var segment_length = 100 / this.rows;
    var segment_mid = segment_length / 2;

    for (var i = 0; i < thread.beads.length; i++) {
      var y = (segment_length * i + segment_mid) + '%';
      elements.push(this.bead_svg(thread.beads[i], x, y));
    }

    return elements;
  }
}
