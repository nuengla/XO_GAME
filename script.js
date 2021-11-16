$('#btn_create').click(function createboard() {
    var valueSelect = document.getElementById('select');
    let value = valueSelect.value;
    let cal = value * value;

    var board = document.createElement("DIV");
    board.setAttribute("ID", "board");
    board.style.cssText = 'display:grid;width:fit-content;grid-template-columns:repeat(' + value + ', 1fr);';
    document.getElementById("big_board").appendChild(board);
    for (let x = 0; x < cal; x++) {
        var div = document.createElement("DIV");
        div.setAttribute("CLASS", "cell");
        div.setAttribute("ID", "cell_id" + x);
        document.getElementById("board").appendChild(div);


        var Input = document.createElement("INPUT");
        Input.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Solid_brown.svg/1200px-Solid_brown.svg.png");
        Input.setAttribute("TYPE", "image");
        Input.setAttribute("ID", x);
        Input.setAttribute("CLASS", "pic");
        document.getElementById("cell_id" + x).appendChild(Input);
    }


    for (let i = 0; i < cal; i++) {

        $('#' + i).click(function (e) {
            e.preventDefault();
            turn(this)

        });
    }


    let val1 = valueSelect.value * valueSelect.value
    let gameTable = [];
    const player1 = ['X', "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/1200px-Red_X.svg.png"];
    const player2 = ['O', "https://upload.wikimedia.org/wikipedia/commons/2/2d/O-Jolle_insigna.png"];
    var curPlay = player1;
    for (let k = 0; k < val1; k++) {
        gameTable.push(k);
    }




    // X
    var winCon = [];
    var valueArr = parseFloat(value);
    for (let row = 0; row < value; row++) {
        winCon[row] = []
        for (var col = 0; col < value; col++) {

            if (row > 0) {


                winCon[row][col] = valueArr;
                valueArr = valueArr + 1;

            } else {
                winCon[row][col] = col;
            }

        }
    }

    //Y
    var valueArr2 = parseFloat(value);
    var valueArrconst = parseFloat(value);

    for (var row2 = value; row2 < value * 2; row2++) {
        winCon[row2] = []
        var y1 = row2 - valueArrconst;
        for (var col2 = 0; col2 < value; col2++) {
            if (row2 > value) {

                winCon[row2][col2] = y1;
                y1 = y1 + valueArrconst
            } else {

                if (col2 > 0) {

                    winCon[row2][col2] = valueArr2;
                    valueArr2 = valueArr2 + valueArrconst;
                } else {
                    winCon[value][col2] = col2;
                }
            }

        }
    }


    var valueArr22 = parseFloat(value) + 1;
    var valueArr33 = parseFloat(value) + 1
    var valueArr44 = parseFloat(value) - 1;
    var valueArr55 = parseFloat(value) - 1;

    var valuePlus = value * 2
    for (var row3 = valuePlus; row3 < ((value * 2) + 2); row3++) {
        winCon[row3] = []

        for (var col3 = 0; col3 < value; col3++) {

            if (row3 == ((valuePlus) + 1)) {

                winCon[row3][col3] = valueArr44;
                valueArr44 = valueArr44 + valueArr55;
            } else {
                if (col3 > 0) {

                    winCon[row3][col3] = valueArr22;
                    valueArr22 = valueArr22 + valueArr33;

                } else {
                    winCon[row3][col3] = col3;
                }


            }

        }


    }


    /* pattern to win 
    var winCon = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]; */


    let abs = [];

    function checkwin() {
        var tmpArray = [];


        for (let f = 0; f < gameTable.length; f++) {
            if (curPlay == gameTable[f]) {
                tmpArray.push(f);

                abs.push(f)

            }
        }

        let winYong = false;
        for (const [index, win] of winCon.entries()) {
            let mycheck = true;
            win.forEach(innerWin => {
                if (tmpArray.indexOf(innerWin) > -1) {
                    mycheck = mycheck && true;

                } else {
                    mycheck = mycheck && false;
                }
            });
            if (mycheck) {
                winYong = true;
                break;
            }

        }


        if ((tmpArray.length > ((gameTable.length) / 2) && winYong == false) || (tmpArray.length == ((gameTable.length) / 2) && curPlay[0] == "O")) {
            $('#msg').html('Draw')
            setTimeout(() => {
                $("#btn_restart").css('display', 'block');
            }, 3500);

            $('input').prop('disabled', true);
            $("#endgame").css('display', 'flex');

            addTurn()
            add_draw()

        } else {

            return winYong;
        }

    }

    function endGame() {

        $('#msg').html(curPlay[0] + "' Win")
        $('input').prop('disabled', true);
        $("#endgame").css('display', 'flex');
        setTimeout(() => {
            $("#btn_restart").css('display', 'block');
        }, 3500);


        const insertdata = new Set(abs);
        insertdata.forEach((a) => {
            console.log(a)
        })

        add();
        addTurn();

    }

    function turn(btn) {
        gameTable[btn.id] = curPlay;
        btn.src = curPlay[1];
        btn.disabled = true;

        let gameStastus = checkwin();
        if (gameStastus) endGame();

        curPlay = curPlay == player1 ? player2 : player1;

    }

    function add() {

        curPlay = curPlay == player1 ? player2 : player1;
        db.collection('game')
            .orderBy('game_id', 'desc')
            .limit(1)
            .get()
            .then(function (snapshot) {
                snapshot.forEach(function (docs) {

                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    var hr = today.getHours();
                    var min = today.getMinutes();
                    var time = hr + ':' + min;
                    today = dd + '/' + mm + '/' + yyyy + ' ' + time;

                    db.collection('game').add({

                        date_save: (today),
                        game_id: ((docs.data().game_id) + 1),
                        player_win: curPlay[0],
                        size_board: value
                    })

                })
            })
    }
    function add_draw() {
        curPlay = curPlay == player1 ? player2 : player1;
        db.collection('game')
            .orderBy('game_id', 'desc')
            .limit(1)
            .get()
            .then(function (snapshot) {
                snapshot.forEach(function (docs) {

                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    var hr = today.getHours();
                    var min = today.getMinutes();
                    var time = hr + ':' + min;
                    today = dd + '/' + mm + '/' + yyyy + ' ' + time;
                    db.collection('game').add({

                        date_save: (today),
                        game_id: ((docs.data().game_id) + 1),
                        player_win: 'DRAW',
                        size_board: value
                    })
                })
            })
    }
    function addTurn() {
        setTimeout(() => {
            db.collection('game')
                .orderBy('game_id', 'desc')
                .limit(1)
                .get()
                .then(function (snapshot) {
                    snapshot.forEach(function (docs) {
                        let i = 1;
                        const insertdata = new Set(abs);
                        insertdata.forEach((a) => {

                            db.collection('turn').add({
                                game_id: ((docs.data().game_id)),
                                round: i,
                                position: a
                            })
                            i = i + 1;
                        })
                    })
                })
        }, 2500);

    }

    if (value !== '') {
        $('.boxStart').css('display', 'none');
        $('.container').css('height', 'auto');
        $('.container').css('justify-content', 'center');
        $('.big_board').css('height', '100vh');
    }
})
$('#btn_restart').click(function restart() {
    window.location.href = "index.html";

})



