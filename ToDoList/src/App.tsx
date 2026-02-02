import type TodoInterface from "./interfaces/TodoInterface"
import { BeatLoader } from "react-spinners";
import Todo from "./components/Todo";
import useGet from "./hooks/useGet";

function App() {
  const {data: todos, error, loading, fetchData} = useGet<TodoInterface[]>("http://localhost:5000/todos");
  
  return (
    <main>
      <h1>Att göra lista:</h1>
      {error && <p>{error}</p>}
      {loading && <BeatLoader />}

      {todos.map((todo) => (
      <Todo todo={todo} key={todo._id} todoUpdate={fetchData}/>
      ))}
    </main>
  )
}

export default App
