import type TodoInterface from "../interfaces/TodoInterface"

const Todo = ({todo, todoUpdate } : {todo: TodoInterface, todoUpdate: Function}) => {

    const statusColor = todo.status === "Ej påbörjad" ? "red" : todo.status === "Avklarad" ? "green" : "orange"

    const updateTodo = async (e : any) => {
        const newStatus = e.target.value;

        const newTodo = {
            ...todo,
            status: newStatus
        }
        try {
            const res = await fetch("http://localhost:5000/todos/" + todo._id, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newTodo)
            })

            if(res.ok) {
                todoUpdate();
            }
        } catch (error) {
            console.log("Det blev ett fel"); //Går att göra states för error likt vi gjorde tidigare
        }
    }

    return (
        <section>
        <h2>{todo.title}</h2>
        <p>{todo.description}</p>
        <p style={{color: statusColor}}><strong>{todo.status}</strong></p>
        <form>
            <label htmlFor="Ändra status:"></label>
            <br />
            <select name="status" id="status" defaultValue={todo.status}
            onChange={updateTodo}>
                <option>Påbörjad</option>
                <option>Avklarad</option>
                <option>Ej påbörjad</option>
            </select>
        </form>
        </section>
    )
}

export default Todo