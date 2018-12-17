class UnbraidedVisualizer extends Visualizer {
  svgs() {
    var elements = [];

    var column_width = 100 / this.braid.threads.length;
    var column_mid = column_width / 2;

    for (var i = 0; i < this.braid.threads.length; i++) {
      var x = (column_width * i + column_mid) + '%';
      var thread_svgs = this.thread_svg(this.braid.threads[i], x);

      for (var j = 0; j < thread_svgs.length; j++) {
        elements.push(thread_svgs[j]);
      }
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

    var segment_length = 100 / thread.beads.length;
    var segment_mid = segment_length / 2;

    for (var i = 0; i < thread.beads.length; i++) {
      var y = (segment_length * i + segment_mid) + '%';
      var r = 8;
      elements.push(this.bead_svg(thread.beads[i], x, y, r));
    }

    return elements;
  }

  bead_svg(bead, x, y, r) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    circle.setAttribute('fill', bead.colour);
    return circle;
  }
}
