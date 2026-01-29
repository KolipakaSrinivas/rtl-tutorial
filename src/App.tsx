import { Application } from "./components/application/Application";
import Greet from "./components/Greet/Greet";
import "./App.css";
import Counter from "./components/counter/Counter"

function App() {
  return (
    <div className="App">
      <Application />
      <Greet />
      <p>learn react</p>
      <Counter/>
    </div>
  );
}

export default App;
