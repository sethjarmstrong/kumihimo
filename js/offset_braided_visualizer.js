class OffsetBraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  // This is to add the extra height needed to render all the rows, as with each
  // bead we place we will be applying a small vertical offset.
  // The offset is equivalent to a twelth of a bead's height per bead after
  // the first in each row.
  get rows() {
    return this.braid.numBeads * 2 + (this.beads_per_row - 2) / 2;
  }

  get columns() {
    return this.braid.numThreads / 2;
  }

  get width() {
    return ((this.columns + 0.5) * this.px_per_bead) + 'px';
  }

  // This is the percentage of vertical space that each row takes up.
  get row_height() {
    return 50 / this.rows;
  }

  // The mid point is the line along which beads will be placed.
  get row_mid() {
    return this.row_height / 2;
  }

  wrap_beads(beads, beads_to_wrap) {
    for (var i = 0; i < beads_to_wrap; i++) {
      beads.push(beads.shift());
    }
    return beads;
  }

  render() {
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];

    var beads_to_wrap = 0;

    for (var i = 0; i < this.loom.beads.length; i++) {
      var y = this.row_height * i + this.row_mid;
      var row = this.wrap_beads(this.loom.beads[i], beads_to_wrap);
      var row_svgs = this.row_svg(row, y, i % 2 === 0);

      row_svgs.forEach(function(svg) {
        elements.push(svg);
      });

      if (i % 2 === 1) {
        beads_to_wrap = (beads_to_wrap + 1) % this.beads_per_row;
      }
    }

    return elements;
  }

  row_svg(row, y, use_offset) {
    var elements = [];

    var column_width = this.px_per_bead;
    var column_mid = column_width / 2;
    var beads_per_grouping = row.length / 2;

    // The y position of the next bead should increase half a bead's height,
    // Resetting when half the beads in the row have been placed.
    for (var i = 0; i < row.length; i++) {
      var offset_x = (use_offset ? column_mid : 0);
      var x = column_width * i + column_mid + offset_x;
      var offset_y = y + this.row_height / 2 * (i % beads_per_grouping);
      elements.push(this.bead_svg(row[i], x, offset_y + '%'));
    }

    return elements;
  }
}
