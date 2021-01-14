/*Beginning of scrapped code
Called by: ng-click="MakeMove(matrix, tile, X, Y); GetLegalMoves(matrix, tile, X, Y)" in index.html

  //DONE: Implement Turns!
  $scope.turn = "White";
  $scope.moved = false;
  // Variables which dictate the validity of the castling move
  $scope.w_K_moved = false;
  $scope.b_K_moved = false;
  $scope.w_r_moved = [false, false];
  $scope.b_r_moved = [false, false];

  // A function to clear all additional tags
  $scope.Clear = function () {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if ($scope.matrix[i][j].Available) {
          $scope.matrix[i][j].Available = false;
        }
        if ($scope.matrix[i][j].Selected) {
          $scope.matrix[i][j].Selected = false;
        }
        if ($scope.matrix[i][j].Castle) {
          $scope.matrix[i][j].Castle = false;
        }
      }
    }
  };

  // Function which returns which figures to be highlighted
  $scope.GetLegalMoves = function (matrix, tile, x, y) {
    // A variable check which manages the Clear() function
    if ($scope.moved) {
      $scope.moved = false;
    } else {
      if (tile.Selected) {
        $scope.Clear();
      } else {
        $scope.Clear();
        // Proceed only if the tile is not empty and the turn is correct
        if (tile.isEmpty == false && tile.Color == $scope.turn) {
          matrix[x][y].Selected = true;

          // Pawn moves
          if (tile.Type == "Pawn") {
            var color = tile.Color;
            var dir;
            if (color == "Black") {
              dir = [1, 1];
            } else {
              dir = [6, -1];
            }
            if (x == dir[0]) {
              if (
                matrix[x + 2 * dir[1]][y].isEmpty &&
                matrix[x + dir[1]][y].isEmpty
              ) {
                matrix[x + 2 * dir[1]][y].Available = true;
              }
            }
            if (x + dir[1] <= 7 && x + dir[1] >= 0) {
              if (matrix[x + dir[1]][y].isEmpty) {
                matrix[x + dir[1]][y].Available = true;
              }
              try {
                if (matrix[x + dir[1]][y + 1].Color == color) {
                  matrix[x + dir[1]][y + 1].Available = true;
                }
              } catch {}
              try {
                if (matrix[x + dir[1]][y - 1].Color == color) {
                  matrix[x + dir[1]][y - 1].Available = true;
                }
              } catch {}
            }
          }

          // Knight's moves
          if (tile.indexOf("_k") != -1) {
            var knight_arr = [1, -1, 2, -2];
            for (var i in knight_arr) {
              for (var j in knight_arr) {
                try {
                  if (Math.abs(knight_arr[i]) != Math.abs(knight_arr[j])) {
                    if (matrix[x + knight_arr[i]][y + knight_arr[j]] == "e") {
                      matrix[x + knight_arr[i]][y + knight_arr[j]] += "_av";
                    }
                    if (
                      tile.indexOf("b_") != -1 &&
                      matrix[x + knight_arr[i]][y + knight_arr[j]].indexOf(
                        "w_"
                      ) != -1
                    ) {
                      matrix[x + knight_arr[i]][y + knight_arr[j]] += "_av";
                    }
                    if (
                      tile.indexOf("w_") != -1 &&
                      matrix[x + knight_arr[i]][y + knight_arr[j]].indexOf(
                        "b_"
                      ) != -1
                    ) {
                      matrix[x + knight_arr[i]][y + knight_arr[j]] += "_av";
                    }
                  }
                } catch {}
              }
            }
          }

          // Rook's moves
          if (tile.indexOf("_r") != -1) {
            var rmoves = [-1, 0, 1];
            for (var i in rmoves) {
              for (var j in rmoves) {
                if (Math.abs(rmoves[i]) + Math.abs(rmoves[j]) == 1) {
                  var p1 = rmoves[i];
                  var p2 = rmoves[j];
                  while (
                    x + p1 >= 0 &&
                    x + p1 <= 7 &&
                    y + p2 >= 0 &&
                    y + p2 <= 7
                  ) {
                    if (matrix[x + p1][y + p2] == "e") {
                      matrix[x + p1][y + p2] += "_av";
                    }
                    if (
                      tile.indexOf("b_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("w_") != -1
                    ) {
                      matrix[x + p1][y + p2] += "_av";
                      break;
                    }
                    if (
                      tile.indexOf("w_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("b_") != -1
                    ) {
                      matrix[x + p1][y + p2] += "_av";
                      break;
                    }
                    if (
                      tile.indexOf("w_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("w_") != -1
                    ) {
                      break;
                    }
                    if (
                      tile.indexOf("b_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("b_") != -1
                    ) {
                      break;
                    }
                    p1 += rmoves[i];
                    p2 += rmoves[j];
                  }
                }
              }
            }
          }

          // Bishop's moves
          if (tile.indexOf("_b") != -1) {
            var rmoves = [-1, 0, 1];
            for (var i in rmoves) {
              for (var j in rmoves) {
                if (Math.abs(rmoves[i]) + Math.abs(rmoves[j]) == 2) {
                  var p1 = rmoves[i];
                  var p2 = rmoves[j];
                  while (
                    x + p1 >= 0 &&
                    x + p1 <= 7 &&
                    y + p2 >= 0 &&
                    y + p2 <= 7
                  ) {
                    if (matrix[x + p1][y + p2] == "e") {
                      matrix[x + p1][y + p2] += "_av";
                    }
                    if (
                      tile.indexOf("b_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("w_") != -1
                    ) {
                      matrix[x + p1][y + p2] += "_av";
                      break;
                    }
                    if (
                      tile.indexOf("w_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("b_") != -1
                    ) {
                      matrix[x + p1][y + p2] += "_av";
                      break;
                    }
                    if (
                      tile.indexOf("w_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("w_") != -1
                    ) {
                      break;
                    }
                    if (
                      tile.indexOf("b_") != -1 &&
                      matrix[x + p1][y + p2].indexOf("b_") != -1
                    ) {
                      break;
                    }
                    p1 += rmoves[i];
                    p2 += rmoves[j];
                  }
                }
              }
            }
          }

          // Queen's moves
          if (tile.indexOf("_q") != -1) {
            var rmoves = [-1, 0, 1];
            for (var i in rmoves) {
              for (var j in rmoves) {
                var p1 = rmoves[i];
                var p2 = rmoves[j];
                while (
                  x + p1 >= 0 &&
                  x + p1 <= 7 &&
                  y + p2 >= 0 &&
                  y + p2 <= 7
                ) {
                  if (matrix[x + p1][y + p2] == "e") {
                    matrix[x + p1][y + p2] += "_av";
                  }
                  if (
                    tile.indexOf("b_") != -1 &&
                    matrix[x + p1][y + p2].indexOf("w_") != -1
                  ) {
                    matrix[x + p1][y + p2] += "_av";
                    break;
                  }
                  if (
                    tile.indexOf("w_") != -1 &&
                    matrix[x + p1][y + p2].indexOf("b_") != -1
                  ) {
                    matrix[x + p1][y + p2] += "_av";
                    break;
                  }
                  if (
                    tile.indexOf("w_") != -1 &&
                    matrix[x + p1][y + p2].indexOf("w_") != -1
                  ) {
                    break;
                  }
                  if (
                    tile.indexOf("b_") != -1 &&
                    matrix[x + p1][y + p2].indexOf("b_") != -1
                  ) {
                    break;
                  }
                  p1 += rmoves[i];
                  p2 += rmoves[j];
                }
              }
            }
          }

          // King's moves
          if (tile.indexOf("_K") != -1) {
            var moves = [-1, 0, 1];
            for (var i in moves) {
              for (var j in moves) {
                try {
                  if (matrix[x + moves[i]][y + moves[j]] == "e") {
                    matrix[x + moves[i]][y + moves[j]] += "_av";
                  }
                  if (
                    tile.indexOf("b_") != -1 &&
                    matrix[x + moves[i]][y + moves[j]].indexOf("w_") != -1
                  ) {
                    matrix[x + moves[i]][y + moves[j]] += "_av";
                  }
                  if (
                    tile.indexOf("w_") != -1 &&
                    matrix[x + moves[i]][y + moves[j]].indexOf("b_") != -1
                  ) {
                    matrix[x + moves[i]][y + moves[j]] += "_av";
                  }
                } catch {}
              }
            }

            // Adding the _castl tag to the rooks (only if neither the king, nor the rook have moved)
            for (var i = -1; i <= 1; i += 2) {
              var ofs = i;
              while (
                y + ofs <= 6 &&
                y + ofs >= 1 &&
                matrix[x][y + ofs].indexOf("e") != -1
              ) {
                ofs += ofs / Math.abs(ofs);
              }
              if (matrix[x][y + ofs].indexOf("_r") != -1) {
                if (
                  tile.indexOf("w_") != -1 &&
                  matrix[x][y + ofs].indexOf("w_") != -1 &&
                  $scope.w_K_moved == false
                ) {
                  var p;
                  if (ofs / Math.abs(ofs) == -1) {
                    p = 0;
                  } else {
                    p = 1;
                  }
                  if ($scope.w_r_moved[p] == false) {
                    matrix[x][y + ofs] += "_castl";
                  }
                } else if (
                  tile.indexOf("b_") != -1 &&
                  matrix[x][y + ofs].indexOf("b_") != -1 &&
                  $scope.b_K_moved == false
                ) {
                  var p;
                  if (ofs / Math.abs(ofs) == -1) {
                    p = 0;
                  } else {
                    p = 1;
                  }
                  if ($scope.b_r_moved[p] == false) {
                    matrix[x][y + ofs] += "_castl";
                  }
                }
              }
            }
          }
          
        }
      }
    }
  };

  // Function which returns the coordinates and the tile of the element with _sel tag
  $scope.FindSelected = (matrix) => {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (matrix[i][j].$scopeSelected) {
          return [i, j, matrix[i][j]];
        }
      }
    }
  };

  $scope.MakeMove = (matrix, tile, x, y) => {
    if (tile.Available) {
      var temp = $scope.FindSelected(matrix);
      var xs = temp[0];
      var ys = temp[1];
      var tp = temp[2];
      // A check if the rooks or the king have moved
      if (tp.Type == "King") {
        if (tp.Color == "White" && $scope.w_K_moved == false) {
          $scope.w_K_moved = true;
        }
        if (tp.Color == "Black" && $scope.b_K_moved == false) {
          $scope.b_K_moved = true;
        }
      } else if (tp.Type == "Rook") {
      }
      if (
        tp.Color == "White" &&
        $scope.w_r_moved[parseInt(tp[tp.indexOf("r") + 1])] == false
      ) {
        $scope.w_r_moved[parseInt(tp[tp.indexOf("r") + 1])] = true;
      }
      if (
        tp.indexOf("b_r") != -1 &&
        $scope.b_r_moved[parseInt(tp[tp.indexOf("r") + 1])] == false
      ) {
        $scope.b_r_moved[parseInt(tp[tp.indexOf("r") + 1])] = true;
      }
      matrix[x][y] = matrix[xs][ys].replace("_sel", "");
      matrix[xs][ys] = "e";
      $scope.Clear();
      $scope.moved = true;
      if ($scope.turn == "White") {
        $scope.turn = "Black";
      } else {
        $scope.turn = "White";
      }
    } else if (tile.indexOf("_castl") != -1) {
      // Castling move
      var temp = $scope.FindSelected(matrix);
      var xs = temp[0];
      var ys = temp[1];
      var direction = (y - ys) / Math.abs(y - ys);
      matrix[xs][ys + 2 * direction] = matrix[xs][ys].replace("_sel", "");
      matrix[xs][ys] = "e";
      matrix[xs][ys + direction] = matrix[x][y];
      matrix[x][y] = "e";
      $scope.Clear();
      $scope.moved = true;
      if ($scope.turn == "White") {
        $scope.turn = "Black";
        $scope.w_K_moved = true;
      } else {
        $scope.turn = "White";
        $scope.b_K_moved = true;
      }
    }
  };

  End of scrapped code*/
