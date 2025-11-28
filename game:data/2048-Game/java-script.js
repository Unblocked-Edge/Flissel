 var board;
        var score = 0;
        var rows = 4;
        var column = 4;

        window.onload = function() {
            setGame();
        }

        function setGame() {
            board = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < column; c++) {
                    let tile = document.createElement("div");
                    tile.id = r.toString() + "-" + c.toString();
                    let num = board[r][c];
                    updateTile(tile, num);
                    document.getElementById("board").append(tile);
                }
            }
            setTwo();
            setTwo();
        }

        function hasEmptyTile() {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < column; c++) {
                    if (board[r][c] == 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function setTwo() {
            if (!hasEmptyTile()) return;

            let found = false;
            while (!found) {
                let r = Math.floor(Math.random() * rows);
                let c = Math.floor(Math.random() * column);

                if (board[r][c] == 0) {
                    board[r][c] = 2;
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    tile.innerText = "2";
                    tile.classList.add("x2");
                    tile.classList.add("new");
                    setTimeout(() => tile.classList.remove("new"), 200);
                    found = true;
                }
            }
        }

        function updateTile(tile, num, wasMerged = false) {
            tile.innerText = "";
            tile.classList.value = "";
            tile.classList.add("tile");
            if (num > 0) {
                tile.innerText = num;
                if (num <= 4096) {
                    tile.classList.add("x" + num.toString());
                } else {
                    tile.classList.add("x8192");
                }
                if (wasMerged) {
                    tile.classList.add("merged");
                    setTimeout(() => tile.classList.remove("merged"), 200);
                }
            }
        }

        function animateScore() {
            let scoreElement = document.getElementById("score");
            scoreElement.classList.add("bump");
            setTimeout(() => scoreElement.classList.remove("bump"), 300);
        }

        document.addEventListener("keyup", (e) => {
            let moved = false;
            if (e.code == "ArrowLeft") {
                moved = slideLeft();
            } else if (e.code == "ArrowRight") {
                moved = slideRight();
            } else if (e.code == "ArrowUp") {
                moved = slideUp();
            } else if (e.code == "ArrowDown") {
                moved = slideDown();
            }

            if (moved) {
                setTimeout(() => {
                    setTwo();
                    checkWin();
                }, 150);
            }
            document.getElementById("score").innerText = score;
        })

        function filterZero(row) {
            return row.filter(num => num != 0);
        }

        function slide(row) {
            row = filterZero(row);
            let merged = [];

            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] == row[i + 1]) {
                    row[i] *= 2;
                    row[i + 1] = 0;
                    score += row[i];
                    merged.push(i);
                    animateScore();
                }
            }
            row = filterZero(row);

            while (row.length < column) {
                row.push(0);
            }
            return { row: row, merged: merged };
        }

        function slideLeft() {
            let moved = false;
            for (let r = 0; r < rows; r++) {
                let originalRow = [...board[r]];
                let result = slide(board[r]);
                board[r] = result.row;

                if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
                    moved = true;
                }

                for (let c = 0; c < column; c++) {
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    let wasMerged = result.merged.includes(c);
                    updateTile(tile, num, wasMerged);
                }
            }

            if (moved && !checkWin()) {
                setTimeout(() => {
                    if (isGameOver()) alert("💀 Game Over!");
                }, 200);
            }
            return moved;
        }

        function slideRight() {
            let moved = false;
            for (let r = 0; r < rows; r++) {
                let originalRow = [...board[r]];
                let row = board[r];
                row.reverse();
                let result = slide(row);
                result.row.reverse();
                board[r] = result.row;

                if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
                    moved = true;
                }

                for (let c = 0; c < column; c++) {
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    let wasMerged = result.merged.length > 0;
                    updateTile(tile, num, wasMerged);
                }
            }

            if (moved && !checkWin()) {
                setTimeout(() => {
                    if (isGameOver()) alert("💀 Game Over!");
                }, 200);
            }
            return moved;
        }

        function slideUp() {
            let moved = false;
            for (let c = 0; c < column; c++) {
                let originalCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
                let row = [...originalCol];
                let result = slide(row);

                if (JSON.stringify(originalCol) !== JSON.stringify(result.row)) {
                    moved = true;
                }

                for (let r = 0; r < rows; r++) {
                    board[r][c] = result.row[r];
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    let wasMerged = result.merged.includes(r);
                    updateTile(tile, num, wasMerged);
                }
            }

            if (moved && !checkWin()) {
                setTimeout(() => {
                    if (isGameOver()) alert("💀 Game Over!");
                }, 200);
            }
            return moved;
        }

        function slideDown() {
            let moved = false;
            for (let c = 0; c < column; c++) {
                let originalCol = [board[0][c], board[1][c], board[2][c], board[3][c]];
                let row = [...originalCol];
                row.reverse();
                let result = slide(row);
                result.row.reverse();

                if (JSON.stringify(originalCol) !== JSON.stringify(result.row)) {
                    moved = true;
                }

                for (let r = 0; r < rows; r++) {
                    board[r][c] = result.row[r];
                    let tile = document.getElementById(r.toString() + "-" + c.toString());
                    let num = board[r][c];
                    let wasMerged = result.merged.length > 0;
                    updateTile(tile, num, wasMerged);
                }
            }

            if (moved && !checkWin()) {
                setTimeout(() => {
                    if (isGameOver()) alert("💀 Game Over!");
                }, 200);
            }
            return moved;
        }

        function isGameOver() {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < column; c++) {
                    if (board[r][c] === 0) {
                        return false;
                    }
                }
            }

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < column - 1; c++) {
                    if (board[r][c] === board[r][c + 1]) {
                        return false;
                    }
                }
            }

            for (let r = 0; r < rows - 1; r++) {
                for (let c = 0; c < column; c++) {
                    if (board[r][c] === board[r + 1][c]) {
                        return false;
                    }
                }
            }

            return true;
        }

        function checkWin() {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < column; c++) {
                    if (board[r][c] === 2048) {
                        alert("🎉 Congratulations! You reached 2048! 🎉");
                        return true;
                    }
                }
            }
            return false;
        }
