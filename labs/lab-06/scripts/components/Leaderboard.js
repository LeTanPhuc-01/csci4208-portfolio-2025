const Leaderboard = (topScores) => (
    `<h2> Top Score: </h2>
    <section>
        <ol>
        ${ListItems(topScores)}
        </ol>
    </section>`
);
const ListItems = (topScores) => {
    let li = ``;
    const scores = topScores.sort((a, b) => b.scores - a.scores);
    for (let row of scores) {
        li += `<li>${row.name}: ${row.score}</li>`;
    }
    return li;
};
export default Leaderboard;