class BraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  get rows() {
    return this.braid.numBeads * 2;
  }

  get columns() {
    return this.braid.numThreads / 2;
  }

  render() {
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];

    var row_width = 100 / this.rows;
    var row_mid = row_width / 2;

    for (var i = 0; i < this.loom.beads.length; i++) {
      var y = (row_width * i + row_mid) + '%';
      var row_svgs = this.row_svg(this.loom.beads[i], y);

      row_svgs.forEach(function(svg) {
        elements.push(svg);
      });
    }

    return elements;
  }

  row_svg(row, y) {
    var elements = [];

    var column_width = 100 / row.length;
    var column_mid = column_width / 2;

    for (var i = 0; i < row.length; i++) {
      var x = (column_width * i + column_mid) + '%';
      elements.push(this.bead_svg(row[i], x, y));
    }

    return elements;
  }
}
