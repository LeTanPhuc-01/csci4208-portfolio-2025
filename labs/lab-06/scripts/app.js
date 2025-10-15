import *  as http from "./http.js";
import * as view from "./view.js";
const GET_TRIVIA = `https://opentdb.com/api.php?amount=1&difficulty=easy`;
const GET_LEADERBOARD = `https://api.jsonbin.io/v3/b/68eef3f3d0ea881f40a35fa4/latest`;
const PUT_LEADERBOARD = `https://api.jsonbin.io/v3/b/68eef3f3d0ea881f40a35fa4`;
const state = {
    score: 0,
    timer: 20,
    intervalId: null,
    trivia: null,
    topScores: [],
};
// eventdispatcher can access it
window.playGame = async () => {

    const json = await http.sendGETRequest(GET_TRIVIA);

    [state.trivia] = json.results;
    view.PlayScene(state);
    console.log(json);
};
window.checkAnswer = (attempt) => {
    const answer = state.trivia.correct_answer;
    if (attempt == answer) {
        state.score += state.timer;
        state.timer += 10;
        playGame();
    }
    else {
        clearInterval(state.intervalId);
        view.GameoverScene(state);
    }
};
const countdown = () => {
    if (state.timer > 0) {
        state.timer--;
        view.PlayScene(state);
    }
    else {
        clearInterval(state.intervalId);
        view.GameoverScene(state);
    }
};
window.createGame = () => {

    state.intervalId = setInterval(countdown, 1000);
    playGame();
};
const getTop5 = async (newScore) => {
    const leaderboardJSON = await http.sendGETRequest(GET_LEADERBOARD);
    const top5 = leaderboardJSON.record;
    top5.push(newScore);
    top5.sort((a, b) => b.score - a.score);
    top5.pop();
    return top5;
};
window.start = async () => {
    state.score = 0;
    state.timer = 20;
    const leaderboardJSON = await http.sendGETRequest(GET_LEADERBOARD); //Fetch LeaderBoard
    state.topScores = leaderboardJSON.record; //data in record prop
    console.log(state.topScores);
    view.StartMenu(state);
};
window.updateLeaderboard = async () => {
    const name = document.getElementById('name').value;
    const currentScore = { name: name, score: state.score };
    const top5 = await getTop5(currentScore);
    await http.sendPUTRequest(PUT_LEADERBOARD, top5);
    // luu y
    window.start();
};
window.addEventListener('load', window.start);


