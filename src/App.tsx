import { BeatLoader } from "react-spinners";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";
import styles from "./App.module.css";

function App() {

  const { todos, error, isLoading, isBusy, add, update, updateStatus, remove, refresh } = useTodos();
  
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Att göra-lista</h1>
          <p className={styles.subtitle}>React + TypeScript + CRUD mot backend-API</p>
        </div>
<button className={styles.refresh} onClick={refresh} disabled={isBusy}>
  {isBusy ? <BeatLoader size={8} /> : "Uppdatera"}
</button>
      </header>

      {error && (
        <div className={styles.banner} role="alert">
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className={styles.loading}>
          <BeatLoader />
          <p>Laddar todos...</p>
        </div>
      )}

      <div className={styles.grid}>
        <TodoForm onCreate={add} disabled={isBusy} />
        <TodoList todos={todos} disabled={isBusy} onUpdateStatus={updateStatus} onUpdate={update} onDelete={remove} />
      </div>
    </main>
  )
}

export default App