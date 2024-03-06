const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => (
        <div key={course.id}>
          <Header course={course} />
          <Content parts={course.parts} />
          <Total course={course} />
        </div>
      ))}
    </>
  );
};

const Header = ({ course }) => {
  return <h1>{course.name}</h1>;
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  );
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ course }) => {
  const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );

  return <p>total of {totalExercises} exercises</p>;
};
export default Course;
