function showHistory() {

    db.collection('game')
        .where('game_id', '>', 0)
        .orderBy('game_id', 'desc')

        .get()
        .then(function (snapshot) {
            snapshot.forEach(function (docs) {

                var gameID = (docs.data().game_id);
                var winner = (docs.data().player_win);
                var size = (docs.data().size_board);



                var table = document.getElementById('table');

                var node = document.createElement("TR");
                var c1 = document.createElement("TD");
                var c2 = document.createElement("TD");
                var c3 = document.createElement("TD");
                var c4 = document.createElement("TD");

                var dateshow = document.createTextNode(docs.data().date_save);
                var gameidshow = document.createTextNode(docs.data().game_id);
                var Winner = document.createTextNode(docs.data().player_win);

                c1.appendChild(dateshow);
                c2.appendChild(Winner);
                c3.appendChild(gameidshow);


                var b = document.createElement("BUTTON");
                b.setAttribute("CLASS", "btn_view");
                b.innerHTML = 'view'
                b.addEventListener('click', function () {
                    viewData(gameID, winner, size);
                })
                c4.appendChild(b)
                node.appendChild(c1);
                node.appendChild(c2);
                node.appendChild(c3);
                node.appendChild(c4);

                table.appendChild(node);

            })
        })
}


function viewData(gameID, winner, size) {
    var board = document.createElement("DIV");
    board.setAttribute("ID", "board");
    board.style.cssText = 'display:grid;width:fit-content;grid-template-columns:repeat(' + size + ', 1fr);';
    document.getElementById("view_board").appendChild(board);
    for (let x = 0; x < (size * size); x++) {
        var div = document.createElement("DIV");
        div.setAttribute("CLASS", "cell_detail");
        div.setAttribute("ID", "cell_id" + x);
        document.getElementById("board").appendChild(div);


        var text = document.createElement("P");
        text.innerHTML = x;
        document.getElementById("cell_id" + x).appendChild(text);
    }

    var ul = document.getElementById('showData');
    var node = document.createElement("LI");
    var t1 = document.createTextNode('Game_id : ' + gameID);
    var t2 = document.createTextNode(' Winner : ' + winner);
    var t3 = document.createTextNode(' Size : ' + size + ' X ' + size);

    node.appendChild(t1);
    node.appendChild(t2);
    node.appendChild(t3);

    ul.appendChild(node)

    const player1 = 'O';
    const player2 = 'X';
    var curPlay = player1;
    db.collection('turn')
        .where('game_id', '==', gameID)
        .orderBy('round', 'asc')
        .get()
        .then(function (snapshot) {
            snapshot.forEach(function (docs) {

                curPlay = curPlay == player1 ? player2 : player1;
                var ul = document.getElementById('showData');
                var node = document.createElement("LI");
                var t1 = document.createTextNode(curPlay);
                /* var t1 = document.createTextNode('game_id : '+docs.data().game_id); */
                var t2 = document.createTextNode(' Round : ' + docs.data().round);
                var t3 = document.createTextNode(' Position : ' + docs.data().position);
                node.appendChild(t1);
                node.appendChild(t2);
                node.appendChild(t3);
                ul.appendChild(node)

            })
        })

    $('#container').css('display', 'none');
    $('#btn_back').css('display', 'block');


}
showHistory();