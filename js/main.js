/**
 * Created by TANTINTANG on 7/5/2017.
 */

let start;
let score, currentScore, currentPlayer;
function init() {
    start = true;
    score = 0;
    currentPlayer = 0;
    currentScore = [0, 0];
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}
init();
document.querySelector('.btn-new').addEventListener('click', init);

// nextPlayer() ->>>>>>>>>>
function nextPlayer() {
    if(currentPlayer ===1)
        currentPlayer =0;
    else currentPlayer =1;
    score= 0;
    document.getElementById('dice-1').style.display= 'none';
    document.getElementById("dice-2").style.display='none';
    document.getElementById('current-0').textContent='0';
    document.getElementById('current-1').textContent='0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

document.querySelector('.btn-roll').addEventListener('click',function () {

    if(start===true) {
        let dice1 = Math.floor((Math.random() * 6) + 1);
        let dice2 = Math.floor((Math.random() * 6) + 1);
        document.getElementById('dice-1').src = '../images/dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = '../images/dice-' + dice2 + '.png';
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        if (dice1 === 1 || dice2 === 1)
            nextPlayer();
        else {
            score += dice1 + dice2;
            document.querySelector('#current-' + currentPlayer).textContent = score;
        }
    }

});

document.querySelector('.btn-hold').addEventListener('click',function () {

    if(start) {
        currentScore[currentPlayer] +=  parseInt(document.querySelector('#current-'+currentPlayer).textContent);
        document.getElementById('score-'+currentPlayer).textContent = currentScore[currentPlayer];
        let finalScore = 100;
        if(currentScore[currentPlayer]>=finalScore){
            document.querySelector('#name-' + currentPlayer).textContent = 'Winner!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.player-' + currentPlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + currentPlayer + '-panel').classList.remove('active');
            start=false
        }
        else {
            nextPlayer();
        }
        console.log(document.querySelector('.final-score').value);

    }

});















