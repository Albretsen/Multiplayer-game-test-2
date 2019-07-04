// Helper functions

// This function will return a vector which goes from point_a to point_b.
// No length modifications are made.
function find_vector(point_a, point_b) {
    return new createVector(point_b.x - point_a.x, point_b.y - point_a.y)
  }