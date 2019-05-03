class BraidedVisualizer extends Visualizer {
  constructor(braid, element) {
    super(braid, element);
    this.loom = new Loom(this.braid);
  }

  get total_beads() {
    return this.braid.parameters.num_beads * this.braid.parameters.num_threads;
  }

  get beads_per_row() {
    return this.braid.parameters.num_threads / 2;
  }

  // This is to add the extra height needed to render all the rows.
  get rows() {
    return Math.ceil(this.total_beads / this.beads_per_row + ((this.beads_per_row / 2) - 1) * 0.5);
  }

  get columns() {
    return this.beads_per_row;
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
    var beads_per_row = this.braid.parameters.num_threads / 2;
    var initial_vertical_position = this.braid.two_d_parameters.initial_vertical_position;
    var vertical_step = this.braid.two_d_parameters.vertical_step;
    var horizontal_step = this.braid.two_d_parameters.horizontal_step;

    var left_hand_beads_are_positive_flag = true;
    var beads_per_hand = this.beads_per_row / 2;

    var wrap_beads = function(left_hand_beads, right_hand_beads, amount) {
      for (var i = 0; i < amount; i++) {
        left_hand_beads.push(right_hand_beads.shift());
        right_hand_beads.push(left_hand_beads.shift());
      }
    };

    var draw_row = function(row, row_number, vertical_offset, horizontal_offset) {
      var results = [];
      for (var i = 0; i < row.length; i++) {
        var y = vertical_offset + (this_.row_height * row_number + i * vertical_step * this_.row_height + this_.row_mid) + '%';
        var x = horizontal_offset + this_.px_per_bead * i * horizontal_step + this_.px_per_bead / 2 + (row_number % 2 === 0 ? this_.px_per_bead / 2 : 0);
        results.push(this_.bead_svg(row[i], x, y));
      }
      return results;
    };

    var i = 0;
    while(elements.length < this.total_beads) {
      var left_hand_beads = left_hand_beads_are_positive_flag ?
          this.beads.positives.slice(i * beads_per_hand, (i + 1) * beads_per_hand) :
          this.beads.negatives.slice(i * beads_per_hand, (i + 1) * beads_per_hand);
      var right_hand_beads = left_hand_beads_are_positive_flag ?
          this.beads.negatives.slice(i * beads_per_hand, (i + 1) * beads_per_hand) :
          this.beads.positives.slice(i * beads_per_hand, (i + 1) * beads_per_hand);

      wrap_beads(left_hand_beads, right_hand_beads, beads_to_wrap);

      elements = elements.concat(draw_row(left_hand_beads, i, initial_vertical_position, 0));
      elements = elements.concat(draw_row(right_hand_beads, i, initial_vertical_position, horizontal_step * this.px_per_bead * beads_per_row / 2));

      if (i % 2 === 1) {
        beads_to_wrap = (beads_to_wrap + 1) % this.beads_per_row;
      }

      left_hand_beads_are_positive_flag = !left_hand_beads_are_positive_flag;
      i++;
    }

    return elements;
  }
}
