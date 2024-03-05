import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const increaseGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    setTotal(updatedGood + neutral + bad);
  };

  const increaseNeutral = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(neutral + 1);
    setTotal(updatedNeutral + good + bad);
  };

  const increaseBad = () => {
    const updatedBad = bad + 1;
    setBad(bad + 1);
    setTotal(updatedBad + good + neutral);
  };

  return (
    <>
      <Feedback
        increaseGood={increaseGood}
        increaseNeutral={increaseNeutral}
        increaseBad={increaseBad}
      />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </>
  );
};

const Feedback = ({ increaseGood, increaseNeutral, increaseBad }) => {
  return (
    <>
      <h1>Give Feedback</h1>
      <Button name="good" func={increaseGood} />
      <Button name="neutral" func={increaseNeutral} />
      <Button name="bad" func={increaseBad} />
    </>
  );
};

const Button = ({ name, func }) => {
  return <button onClick={func}>{name}</button>;
};

const Statistics = ({ good, neutral, bad, total }) => {
  return (
    <>
      <h1>Statistics</h1>
      {total ? (
        <>
          <table>
            <tbody>
              <tr>
                <StatisticsLine name="good" value={good} />
              </tr>
              <tr>
                <StatisticsLine name="neutral" value={neutral} />
              </tr>
              <tr>
                <StatisticsLine name="bad" value={bad} />
              </tr>
              <tr>
                <StatisticsLine name="total" value={total} />
              </tr>
              <tr>
                <StatisticsLine
                  name="average"
                  value={(good + bad * -1) / total}
                />
              </tr>
              <tr>
                <StatisticsLine
                  name="positive"
                  value={(good / total) * 100 + "%"}
                />
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

const StatisticsLine = ({ name, value }) => {
  return (
    <>
      <td>{name}</td>
      <td>{value}</td>
    </>
  );
};

export default App;
