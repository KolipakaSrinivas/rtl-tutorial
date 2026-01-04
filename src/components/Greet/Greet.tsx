type GreetTpes = {
  name?: string;
};

export default function Greet(props: GreetTpes) {
  return (
    <div>
      <h1>hello {props.name}</h1>
    </div>
  );
}
