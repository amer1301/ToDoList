export const TODO_STATUSES = ["Ej påbörjad", "Pågående", "Avklarad"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];

export interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
}

export interface CreateTodoInput {
    title: string;
    description?: string;
    status?: TodoStatus; // default för backend är "ej påbörjad"
}

export interface UpdateTodoInput {
    title?: string;
    description?: string;
    status?: TodoStatus;
}