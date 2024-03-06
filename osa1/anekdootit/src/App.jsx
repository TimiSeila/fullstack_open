import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleNextAnecdote = (min, max) => {
    const randomDecimal = Math.random();
    const randomInRange = min + randomDecimal * (max - min + 1);
    setSelected(Math.floor(randomInRange));
  };

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  return (
    <>
      <div>{anecdotes[selected]}</div>
      <p>has {votes[selected]} votes</p>
      <button onClick={() => handleNextAnecdote(0, anecdotes.length - 1)}>
        next anecdote
      </button>
      <button onClick={handleVote}>vote</button>
      <MostVoted anecdotes={anecdotes} votes={votes} />
    </>
  );
};

const MostVoted = ({ anecdotes, votes }) => {
  const mostVotes = Math.max(...votes);

  const mostVoted = votes.indexOf(mostVotes);

  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVoted]}</p>
      <p>has {votes[mostVoted]} votes</p>
    </>
  );
};

export default App;
