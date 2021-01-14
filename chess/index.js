var app = angular.module("Chess_Engine", ["ngAnimate"]);

app.controller("Main", ($scope) => {});

app.controller("board", ($scope) => {
  $scope.Generate_Board = () => {
    $scope.Board = new $scope.Board();
  };

  $scope.Board = class {
    constructor() {
      this.matrix = new Array(8);
      for (var i = 0; i < 8; i++) {
        this.matrix[i] = new Array(8);
        for (var j = 0; j < 8; j++) {
          if (i <= 5 && i >= 2) {
            this.matrix[i][j] = new $scope.Tile(null, null, i, j);
          } else {
            var Color;
            var Type;
            if (i < 2) {
              Color = "Black";
            } else {
              Color = "White";
            }
            if (i == 1 || i == 6) {
              Type = "Pawn";
            } else {
              if (j == 0 || j == 7) {
                Type = "Rook";
              }
              if (j == 1 || j == 6) {
                Type = "Knight";
              }
              if (j == 2 || j == 5) {
                Type = "Bishop";
              }
              if ((j == 3 && i == 0) || (j == 4 && i == 7)) {
                Type = "King";
              }
              if ((j == 3 && i == 7) || (j == 4 && i == 0)) {
                Type = "Queen";
              }
            }
            this.matrix[i][j] = new $scope.Tile(Type, Color, i, j);
          }
        }
      }
      this.Turn = "White";
      this.State = "static";
      this.Selected = [null, null, null];
    }

    Show_Pawn_Moves(tile, x, y) {
      var dir;
      if (tile.Color == "Black") {
        dir = [1, 1];
      } else {
        dir = [6, -1];
      }
      if (x == dir[0]) {
        if (
          this.matrix[x + 2 * dir[1]][y].isEmpty &&
          this.matrix[x + dir[1]][y].isEmpty
        ) {
          this.matrix[x + 2 * dir[1]][y].Available = true;
        }
      }
      if (x + dir[1] <= 7 && x + dir[1] >= 0) {
        if (this.matrix[x + dir[1]][y].isEmpty) {
          this.matrix[x + dir[1]][y].Available = true;
        }
        try {
          if (
            this.matrix[x + dir[1]][y + 1].isEmpty == false &&
            this.matrix[x + dir[1]][y + 1].Color != tile.Color
          ) {
            this.matrix[x + dir[1]][y + 1].Available = true;
          }
        } catch {}
        try {
          if (
            this.matrix[x + dir[1]][y - 1].isEmpty == false &&
            this.matrix[x + dir[1]][y - 1].Color != tile.Color
          ) {
            this.matrix[x + dir[1]][y - 1].Available = true;
          }
        } catch {}
      }
    }

    Show_Rook_Moves(tile, x, y) {
      var Rook_Array = [-1, 0, 1];
      for (var i in Rook_Array) {
        for (var j in Rook_Array) {
          if (Math.abs(Rook_Array[i]) + Math.abs(Rook_Array[j]) == 1) {
            var p1 = Rook_Array[i];
            var p2 = Rook_Array[j];
            while (
              x + p1 >= 0 &&
              x + p1 <= 7 &&
              y + p2 >= 0 &&
              y + p2 <= 7 &&
              this.matrix[x + p1][y + p2].isEmpty
            ) {
              this.matrix[x + p1][y + p2].Available = true;
              p1 += Rook_Array[i];
              p2 += Rook_Array[j];
            }
            try {
              if (tile.Color != this.matrix[x + p1][y + p2].Color) {
                this.matrix[x + p1][y + p2].Available = true;
              }
            } catch {}
          }
        }
      }
    }

    Show_Knight_Moves(tile, x, y) {
      var Knight_Array = [1, -1, 2, -2];
      for (var i in Knight_Array) {
        for (var j in Knight_Array) {
          var p1 = Knight_Array[i];
          var p2 = Knight_Array[j];
          if (Math.abs(p1) != Math.abs(p2)) {
            try {
              if (
                this.matrix[x + p1][y + p2].isEmpty ||
                tile.Color != this.matrix[x + p1][y + p2].Color
              ) {
                this.matrix[x + p1][y + p2].Available = true;
              }
            } catch {}
          }
        }
      }
    }

    Show_Bishop_Moves(tile, x, y) {
      var Bishop_Array = [-1, 1];
      for (var i in Bishop_Array) {
        for (var j in Bishop_Array) {
          var p1 = Bishop_Array[i];
          var p2 = Bishop_Array[j];
          while (
            x + p1 >= 0 &&
            x + p1 <= 7 &&
            y + p2 >= 0 &&
            y + p2 <= 7 &&
            this.matrix[x + p1][y + p2].isEmpty
          ) {
            this.matrix[x + p1][y + p2].Available = true;
            p1 += Bishop_Array[i];
            p2 += Bishop_Array[j];
          }
          try {
            if (tile.Color != this.matrix[x + p1][y + p2].Color) {
              this.matrix[x + p1][y + p2].Available = true;
            }
          } catch {}
        }
      }
    }

    Show_Queen_Moves(tile, x, y) {
      var Queen_Array = [-1, 0, 1];
      for (var i in Queen_Array) {
        for (var j in Queen_Array) {
          var p1 = Queen_Array[i];
          var p2 = Queen_Array[j];
          while (
            x + p1 >= 0 &&
            x + p1 <= 7 &&
            y + p2 >= 0 &&
            y + p2 <= 7 &&
            this.matrix[x + p1][y + p2].isEmpty
          ) {
            this.matrix[x + p1][y + p2].Available = true;
            p1 += Queen_Array[i];
            p2 += Queen_Array[j];
          }
          try {
            if (tile.Color != this.matrix[x + p1][y + p2].Color) {
              this.matrix[x + p1][y + p2].Available = true;
            }
          } catch {}
        }
      }
    }

    Castle_Check(tile, x, y) {
      for (var i = -1; i <= 1; i += 2) {
        var offset = i;
        while (this.matrix[x][y + offset].isEmpty) {
          offset += Math.sign(offset);
        }
        if (
          this.matrix[x][y + offset].Type == "Rook" &&
          this.matrix[x][y + offset].Can_Castle
        ) {
          this.matrix[x][y + offset].Castle = true;
        }
      }
    }

    Show_King_Moves(tile, x, y) {
      var King_Array = [-1, 0, 1];
      for (var i in King_Array) {
        for (var j in King_Array) {
          var p1 = King_Array[i];
          var p2 = King_Array[j];
          try {
            if (this.matrix[x + p1][y + p2].isEmpty) {
              this.matrix[x + p1][y + p2].Available = true;
            } else if (tile.Color != this.matrix[x + p1][y + p2].Color) {
              this.matrix[x + p1][y + p2].Available = true;
            }
          } catch {}
        }
      }
      if (tile.Can_Castle) {
        this.Castle_Check(tile, x, y);
      }
    }
  };

  $scope.Tile = class {
    constructor(Type, Color, x, y) {
      this.isEmpty = false;
      if (Type == null) {
        this.isEmpty = true;
      } else if (Type == "Rook" || Type == "King") {
        this.Can_Castle = true;
      }
      if (Type == "King") {
        this.Check = false;
      }
      this.Type = Type;
      this.Color = Color;
      this.Available = false;
      this.Selected = false;
      this.Castle = false;
      this.x = x;
      this.y = y;
    }
  };

  //! Utility functions

  //? Simplest function no changes needed. Maybe should be in the class itself.
  $scope.Change_Turn = () => {
    if ($scope.Board.Turn == "White") {
      $scope.Board.Turn = "Black";
    } else {
      $scope.Board.Turn = "White";
    }
  };

  //? Clears All temporary variables. In some cases is way to broad!
  $scope.Clear = () => {
    $scope.Board.Selected = [null, null, null];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        $scope.Board.matrix[i][j].Available = false;
        $scope.Board.matrix[i][j].Selected = false;
        $scope.Board.matrix[i][j].Castle = false;
      }
    }
  };

  //? Finds the king of the needed color within the board. Eventually to be raplaced with a built in property of the class.
  $scope.Find_King = (turn) => {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (
          $scope.Board.matrix[i][j].Type == "King" &&
          turn != $scope.Board.matrix[i][j].Color
        ) {
          return [i, j];
        }
      }
    }
  };

  $scope.Make_Temp_Move = (x_old, y_old, x_new, y_new) => {
    $scope.Board.matrix[x_new][y_new] = $scope.Board.matrix[x_old][y_old];
    $scope.Board.matrix[x_old][y_old] = new $scope.Tile(null, null);
  };

  //? Returns an array with all available tiles. Should be replaced at some point with build in property of the board class.
  $scope.Get_All_Available = () => {
    var av = [];
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if ($scope.Board.matrix[i][j].Available) {
          av.push([$scope.Board.matrix[i][j], i, j]);
        }
      }
    }
    return av;
  };

  //! Main Logic

  //? The main function which is executed after every click on the board. Efficiency is deffinitely lacking. Refactoring for second part is also needed.
  $scope.Chess_Logic = (tile, x, y) => {
    switch ($scope.Board.State) {
      case "static": {
        if (tile.isEmpty == false) {
          if (tile.Color == $scope.Board.Turn) {
            $scope.Highlight(tile, x, y);
            $scope.Board.State = "highlighted";
          }
        }
        break;
      }

      case "highlighted": {
        if (tile.Selected || (tile.isEmpty && tile.Available == false)) {
          $scope.Clear();
          $scope.Board.State = "static";
        } else if (tile.Available) {
          $scope.Board.State = "static";
          $scope.Make_Move(tile, x, y);
          $scope.Change_Turn();
          $scope.Clear();
        } else if (tile.Castle) {
          $scope.Board.State = "static";
          $scope.Execute_Castle(tile, x, y);
          $scope.Change_Turn();
          $scope.Clear();
        } else {
          $scope.Clear();
          if (tile.Color == $scope.Board.Turn) {
            $scope.Highlight(tile, x, y);
          }
        }
        break;
      }

      case "checked": {
        if (tile.isEmpty == false) {
          if (tile.Color == $scope.Board.Turn) {
            $scope.Checked_Highlight(tile, x, y);
          }
          $scope.Board.State = "checked_highlighted";
        }
        break;
      }

      case "checked_highlighted": {
        if (tile.Selected || (tile.isEmpty && tile.Available == false)) {
          $scope.Clear();
          $scope.Board.State = "checked";
        } else if (tile.Available) {
          $scope.Board.State = "static";
          $scope.Make_Move(tile, x, y);
          $scope.Change_Turn();
          $scope.Clear();
          var king = $scope.Find_King($scope.Board.Turn);
          $scope.Board.matrix[king[0]][king[1]].Check = false;
        } else if (tile.Castle) {
          $scope.Board.State = "static";
          $scope.Execute_Castle(tile, x, y);
          $scope.Change_Turn();
          $scope.Clear();
        } else {
          $scope.Clear();
          if (tile.Color == $scope.Board.Turn) {
            $scope.Checked_Highlight(tile, x, y);
          }
        }
        break;
      }
    }
  };

  //! Highlight functions

  //? Shows all available moves if the king is not checked
  $scope.Highlight = (tile, x, y) => {
    tile.Selected = true;
    $scope.Board.Selected = [tile, x, y];
    switch (tile.Type) {
      case "Pawn": {
        $scope.Board.Show_Pawn_Moves(tile, x, y);
        break;
      }
      case "Rook": {
        $scope.Board.Show_Rook_Moves(tile, x, y);
        break;
      }
      case "Knight": {
        $scope.Board.Show_Knight_Moves(tile, x, y);
        break;
      }
      case "Bishop": {
        $scope.Board.Show_Bishop_Moves(tile, x, y);
        break;
      }
      case "Queen": {
        $scope.Board.Show_Queen_Moves(tile, x, y);
        break;
      }
      case "King": {
        $scope.Board.Show_King_Moves(tile, x, y);
        break;
      }
    }
  };

  //? Shows only the moves which would free the king for it's checked state. 100% needs serious refactoring!!! Has bugs derived from its clear function!
  $scope.Checked_Highlight = (tile, x, y) => {
    //? 1. Show all available options before filter
    $scope.Highlight(tile, x, y);
    //? 2. Add them to an array
    var toAdd = [];
    var av = $scope.Get_All_Available();
    $scope.Clear();
    for (var i = 0; i < av.length; i++) {
      //? 3. Find the king and disable its checked state
      for (var s = 0; s < 8; s++) {
        for (var j = 0; j < 8; j++) {
          if (
            $scope.Board.matrix[s][j].Color == $scope.Board.Turn &&
            $scope.Board.matrix[s][j].Type == "King"
          ) {
            $scope.Board.matrix[s][j].Check = false;
          }
        }
      }
      //? 4. Make a temporary move and check if the king would be checked in it
      var t = av[i];
      $scope.Make_Temp_Move(x, y, t[1], t[2]);
      for (var s = 0; s < 8; s++) {
        for (var j = 0; j < 8; j++) {
          if ($scope.Board.matrix[s][j].Color != $scope.Board.Turn) {
            $scope.Highlight($scope.Board.matrix[s][j], s, j);
          }
        }
      }
      //? 5. If the king is highlighted, add the checked property
      for (var s = 0; s < 8; s++) {
        for (var j = 0; j < 8; j++) {
          if (
            $scope.Board.matrix[s][j].Color == $scope.Board.Turn &&
            $scope.Board.matrix[s][j].Type == "King"
          ) {
            if ($scope.Board.matrix[s][j].Available) {
              $scope.Board.matrix[s][j].Available = false;
              $scope.Board.matrix[s][j].Check = true;
            }
          }
        }
      }
      //? 6. Clear
      $scope.Clear();
      //? 7. If the king hasnt been checked add the move to the available options
      for (var s = 0; s < 8; s++) {
        for (var j = 0; j < 8; j++) {
          if (
            $scope.Board.matrix[s][j].Color == $scope.Board.Turn &&
            $scope.Board.matrix[s][j].Type == "King"
          ) {
            if ($scope.Board.matrix[s][j].Check == false) {
              toAdd.push([t[1], t[2]]);
            }
          }
        }
      }
      //? 8. Reverse the temporary move
      $scope.Board.matrix[x][y] = tile;
      $scope.Board.matrix[t[1]][t[2]] = t[0];
      //? 9. Add back the checked state of the king
      for (var s = 0; s < 8; s++) {
        for (var j = 0; j < 8; j++) {
          if (
            $scope.Board.matrix[s][j].Color == $scope.Board.Turn &&
            $scope.Board.matrix[s][j].Type == "King"
          ) {
            $scope.Board.matrix[s][j].Check = true;
          }
        }
      }
    }
    //? 10. Show the final moves
    for (var i = 0; i < toAdd.length; i++) {
      $scope.Board.matrix[toAdd[i][0]][toAdd[i][1]].Available = true;
    }
    //? 11. Add back the selection
    $scope.Board.matrix[x][y].Selected = true;
    $scope.Board.Selected = [tile, x, y];
  };

  //! Execute move functions

  //? Executes a standart move. Checks if the king is in danger.
  $scope.Make_Move = (tile, x, y) => {
    if (
      $scope.Board.Selected[0].Type == "Rook" ||
      $scope.Board.Selected[0].Type == "King"
    ) {
      $scope.Board.matrix[$scope.Board.Selected[1]][
        $scope.Board.Selected[2]
      ].Can_Castle = false;
    }
    $scope.Board.matrix[x][y] = $scope.Board.Selected[0];
    $scope.Board.matrix[$scope.Board.Selected[1]][
      $scope.Board.Selected[2]
    ] = new $scope.Tile(null, null);
    $scope.Board_Check($scope.Board.matrix[x][y], x, y);
  };

  //? Executes a castling move. Checks if the king is in danger. Needs some refactoring!
  $scope.Execute_Castle = (tile, x, y) => {
    $scope.Board.matrix[$scope.Board.Selected[1]][
      $scope.Board.Selected[2]
    ].Can_Castle = false;

    var Direction = Math.sign(y - $scope.Board.Selected[2]);

    $scope.Board.matrix[$scope.Board.Selected[1]][
      $scope.Board.Selected[2] + 2 * Direction
    ] = $scope.Board.matrix[$scope.Board.Selected[1]][$scope.Board.Selected[2]];

    $scope.Board.matrix[$scope.Board.Selected[1]][
      $scope.Board.Selected[2]
    ] = new $scope.Tile(null, null);

    $scope.Board.matrix[$scope.Board.Selected[1]][
      $scope.Board.Selected[2] + Direction
    ] = tile;

    $scope.Board.matrix[x][y] = new $scope.Tile(null, null);

    $scope.Board_Check(
      $scope.Board.matrix[$scope.Board.Selected[1]][
        $scope.Board.Selected[2] + Direction
      ],
      $scope.Board.Selected[1],
      $scope.Board.Selected[2] + Direction
    );

    $scope.Board_Check(
      $scope.Board.matrix[$scope.Board.Selected[1]][
        $scope.Board.Selected[2] + 2 * Direction
      ],
      $scope.Board.Selected[1],
      $scope.Board.Selected[2] + 2 * Direction
    );
  };

  //! Additional functions
  //? A function which checks whether the king is in check after every move. Needs a better clear method! Current Solution is only Temporary!

  $scope.Board_Check = (tile, x, y) => {
    $scope.Highlight(tile, x, y);
    var King_Coordinates = $scope.Find_King($scope.Board.Turn);
    if (
      $scope.Board.matrix[King_Coordinates[0]][King_Coordinates[1]].Available
    ) {
      $scope.Board.matrix[King_Coordinates[0]][
        King_Coordinates[1]
      ].Available = false;
      $scope.Board.matrix[King_Coordinates[0]][
        King_Coordinates[1]
      ].Check = true;
      $scope.Board.State = "checked";
    }
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        $scope.Board.matrix[i][j].Available = false;
        $scope.Board.matrix[i][j].Selected = false;
        $scope.Board.matrix[i][j].Castle = false;
      }
    }
  };
});
