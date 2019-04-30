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
      var _positives = [];
      var _negatives = [];
      for (var i = 0; i < this.loom.beads.length; i++) {
        var row = this.loom.beads[i];
        _positives = _positives.concat(row.slice(0, row.length / 2));
        _negatives = _negatives.concat(row.slice(row.length / 2, row.length));
      }

      // Now that we've got our positives and negatives, let's subdivide them
      // into the rows that we need.
      var positives = [];
      var negatives = [];
      while (_positives.length > 0 && _negatives.length > 0) {
        positives.push(_positives.splice(0, this.braid.beadsPerRow / 2));
        negatives.push(_negatives.splice(0, this.braid.beadsPerRow / 2));
      }

      // Now we need to apply wrapping. In actuality this is a view problem, not
      // a data problem, but it is much easier to take care of here.
      for (i = 0; i < positives.length; i++) {
        var positives_row = positives[i];
        var negatives_row = negatives[i];

        // We want to wrap one bead for every two rows.
        for (var j = 0; j < Math.floor(i / 2); j++) {
          positives_row.push(negatives_row.shift());
          negatives_row.push(positives_row.shift());
        }
      }

      this._beads = {positives: positives, negatives: negatives};
    }
    return this._beads;
  }

  render() {
    this._beads = undefined;
    this.loom.weave();
    super.render();
  }

  svgs() {
    var elements = [];
    var beads_to_wrap = 0;
    var this_ = this;

    var draw_spiral = function(dataset, offset) {
      var results = [];
      for (var i = 0; i < dataset.length; i++) {
        var row = dataset[i];
        for (var j = 0; j < row.length; j++) {
          var y = (this_.row_height * i + j * this_.braid.beadVerticalStep * this_.row_height + this_.row_mid) + '%';
          //var y = (this_.row_height * i + j * 0 * this_.row_height + this_.row_mid) + '%';
          var x = offset + this_.px_per_bead * j + this_.px_per_bead / 2 + (i % 2 === 0 ? this_.px_per_bead / 2 : 0);
          results.push(this_.bead_svg(row[j], x, y));
        }
      }
      return results;
    };

    elements = elements.concat(draw_spiral(this.beads.positives, 0));
    elements = elements.concat(draw_spiral(this.beads.negatives, this.px_per_bead * this.braid.beadsPerRow / 2));

    return elements;
  }
}
