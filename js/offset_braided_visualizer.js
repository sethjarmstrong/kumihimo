class OffsetBraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
    this._beads = undefined;
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

  // Since the number of beads per row is now configurable, we need to unpack
  // the beads returned by the loom (which is an array of rows) a more
  // appropriate data structure.
  // Each bead will still have an opposite, so ideally we will have two arrays,
  // one with all of the beads on one side, and one with all of those beads'
  // opposites. The braid can then be pieced together by spiralling the two
  // arrays of beads together.
  get beads() {
    if (this._beads === undefined) {
      // The first half of each row will be our "positive" beads, and the second
      // half of each row will be their opposites, our "negative" beads.
      // Row length is assumed to always be even.
      var positives = [];
      var negatives = [];

      for (var i = 0; i < this.loom.beads.length; i++) {
        var row = this.loom.beads[i];
        positives = positives.concat(row.slice(0, row.length / 2));
        negatives = negatives.concat(row.slice(row.length / 2, row.length));
      }

      this._beads = [positives, negatives];
    }
    return this._beads;
  }

  wrap_beads(beads, beads_to_wrap) {
    for (var i = 0; i < beads_to_wrap; i++) {
      beads.push(beads.shift());
    }
    return beads;
  }

  render() {
    this._beads = undefined;
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];
    var beads_to_wrap = 0;
    var positives = this.beads[0];
    var negatives = this.beads[1];

    for (var i = 0; i < positives.length; i++) {
      var y = (this.row_height * i * this.braid.beadStep + this.row_mid) + '%';
      var x = this.px_per_bead * (i % (this.braid.beadsPerRow / 2)) + this.px_per_bead / 2;
      elements.push(this.bead_svg(positives[i], x, y));
    }

    for (var i = 0; i < negatives.length; i++) {
      y = (this.row_height * i * this.braid.beadStep + this.row_mid) + '%';
      x = this.px_per_bead * this.braid.beadsPerRow / 2 + this.px_per_bead * (i % (this.braid.beadsPerRow / 2)) + this.px_per_bead / 2;
      elements.push(this.bead_svg(negatives[i], x, y));
    }

    return elements;

    //////

    var elements = [];
    var beads_to_wrap = 0;

    for (var i = 0; i < this.loom.beads.length; i++) {
      var y = this.row_height * i + this.row_mid;
      var row = this.wrap_beads(this.loom.beads[i], beads_to_wrap);
      var row_svgs = this.row_svg(row, y, i % 2 === 0);
      elements = elements.concat(row_svgs);

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
