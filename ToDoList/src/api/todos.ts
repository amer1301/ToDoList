import type { CreateTodoInput, Todo, UpdateTodoInput } from "--/types/todo";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000";

function toErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return "Okänt fel";
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...BASE_URL(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        let details = "";
        try {
            const text = await res.text();
            details = text ? `: ${text}` : "";
        } catch {

        }
        throw new Error(`API-fel (${res.status})${details}`);
    }

    // 204-fel
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
}

export async function getTodos(): Promise<Todo[]> {
    return http<Todo[]>("/todos");
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
    return http<Todo>("/todos", {
        method: "POST",
        body: JSON.stringify({
            title: input.title,
            description: input.description ?? "",
            status: input.status ?? "Ej påbörjad",
        }),
    });
}

export async function updateTodo(id: string, patch: UpdateTodoInput): Promise<Todo> {
    return http<Todo>(`/todos/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(patch),
        }
    );
}

export async function deleteTodo(id: string): Promise<void> {
    await http<void>(`/todos/${id}`, { method: "DELETE" });
}

export {toErrorMessage};