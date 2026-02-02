import { useCallback, useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, getTodos, toErrorMessage, updateTodo } from "../api/todos";
import type { CreateTodoInput, Todo, TodoStatus, UpdateTodoInput } from "../types/todo";

type BusyOp = "fetch" | "create" | "update" | "delete" | null;

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<BusyOp>("fetch");

    const isLoading = busy === "fetch";

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const MIN_SPINNER_MS = 600;

    const refresh = useCallback(async () => {
        setError(null);
        setBusy("fetch");

        try {
            const [data] = await Promise.all([
                getTodos(),
                delay(MIN_SPINNER_MS),
            ]);

            setTodos(data);
        } catch (err) {
            setError(toErrorMessage(err));
        } finally {
            setBusy(null);
        }
    }, []);



    useEffect(() => {
        void refresh();
    }, [refresh]);

    const add = useCallback(async (input: CreateTodoInput) => {
        try {
            setBusy("create");
            setError(null);
            const created = await createTodo(input);
            setTodos((prev) => [created, ...prev]);
            return { ok: true as const };
        } catch (err) {
            setError(toErrorMessage(err));
            return { ok: false as const };
        } finally {
            setBusy((prev) => (prev === "create" ? null : prev));
        }
    }, []);

    const update = useCallback(async (id: number, patch: UpdateTodoInput) => {
        const before = todos;
        setTodos((prev) => prev.map((t) => (t.id === id ? ({ ...t, ...patch } as Todo) : t)));
        try {
            setBusy("update");
            setError(null);
            const updated = await updateTodo(id, patch);
            setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
            return { ok: true as const };
        } catch (err) {
            setTodos(before);
            setError(toErrorMessage(err));
            return { ok: false as const };
        } finally {
            setBusy((prev) => (prev === "update" ? null : prev));
        }
    }, [todos]);

    const remove = useCallback(async (id: number) => {
        const before = todos;
        setTodos((prev) => prev.filter((t) => t.id !== id));
        try {
            setBusy("delete");
            setError(null);
            await deleteTodo(id);
            return { ok: true as const };
        } catch (err) {
            setTodos(before);
            setError(toErrorMessage(err));
            return { ok: false as const };
        } finally {
            setBusy((prev) => (prev === "delete" ? null : prev));
        }
    }, [todos]);

    const updateStatus = useCallback(
        async (id: number, status: TodoStatus) => update(id, { status }),
        [update]
    );

    const isBusy = useMemo(() => busy !== null, [busy]);

    return { todos, error, isLoading, isBusy, busy, refresh, add, update, updateStatus, remove };
}