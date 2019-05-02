class OffsetBraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  // This is to add the extra height needed to render all the rows.
  get rows() {
    var numBeads = this.braid.numBeads;
    var numThreads = this.braid.numThreads;
    var beadsPerRow = this.braid.beadsPerRow;
    return Math.ceil(numBeads * numThreads / beadsPerRow + ((beadsPerRow / 2) - 1) * 0.5);
  }

  get columns() {
    return this.braid.beadsPerRow;
  }

  get width() {
    return ((this.columns + 0.5) * this.px_per_bead) + 'px';
  }

  // This is the percentage of vertical space that each row takes up.
  get row_height() {
    return 100 / this.rows;
  }

  // The mid point is the line along which beads will be placed.
  get row_mid() {
    return this.row_height / 2;
  }

  get beads() {
    return { positives: this.loom.beads[0], negatives: this.loom.beads[1] };
  }

  render() {
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];
    var beads_to_wrap = 0;
    var this_ = this;

    var draw_spiral = function(dataset, vertical_offset, horizontal_offset) {
      var results = [];
      for (var i = 0; i < dataset.length; i++) {
        var row = dataset.slice(i * this_.braid.beadsPerRow / 2, (i + 1) * this_.braid.beadsPerRow / 2);
        for (var j = 0; j < row.length; j++) {
          var y = vertical_offset + (this_.row_height * i + j * this_.braid.beadVerticalStep * this_.row_height + this_.row_mid) + '%';
          var x = horizontal_offset + this_.px_per_bead * j * this_.braid.beadHorizontalStep + this_.px_per_bead / 2 + (i % 2 === 0 ? this_.px_per_bead / 2 : 0);
          results.push(this_.bead_svg(row[j], x, y));
        }
      }
      return results;
    };

    elements = elements.concat(draw_spiral(this.beads.positives, this.braid.beadInitialVerticalPosition, 0));
    elements = elements.concat(draw_spiral(this.beads.negatives, this.braid.beadInitialVerticalPosition, this.braid.beadHorizontalStep * this.px_per_bead * this.braid.beadsPerRow / 2));

    return elements;
  }
}
