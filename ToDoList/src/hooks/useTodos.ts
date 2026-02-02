import {useCallback, useEffect, useMemo, useState } from "react";
import {createTodo, deleteTodo, getTodos, toErrorMessage, updateTodo } from "../api/todos";
import type {CreateTodoInput, Todo, TodoStatus, UpdateTodoInput } from "../types/todo";

type BusyOp = "fetch" | "create" | "update" | "delete" | null;

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<String | null>(null);
    const [busy, setBusy] = useState<BusyOp>("fetch");

    const isLoading = busy === "fetch";

    const refresh = useCallback(async () => {
        try {
            setBusy("fetch");
            setError(null);
            const data = await getTodos();
            setTodos(data);
        } catch (err) {
            setError(toErrorMessage(err));
        } finally {
            setBusy((prev) => (prev === "fetch" ? null : prev));
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

    const update = useCallback(async (id: string, patch: UpdateTodoInput) => {
       const before = todos;
    setTodos((prev) => prev.map((t) => (t._id === id ? ({ ...t, ...patch } as Todo) : t)));
    try {
      setBusy("update");
      setError(null);
      const updated = await updateTodo(id, patch);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return { ok: true as const };
    } catch (err) {
      setTodos(before);
      setError(toErrorMessage(err));
      return { ok: false as const };
    } finally {
      setBusy((prev) => (prev === "update" ? null : prev));
    }
  }, [todos]);

  const remove = useCallback(async (id: string) => {
    const before = todos;
    setTodos((prev) => prev.filter((t) => t._id !== id));
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
    async (id: string, status: TodoStatus) => update(id, {status }),
    [update]
  );

  const isBusy = useMemo(() => busy !== null, [busy]);

  return {todos, error, isLoading, isBusy, busy, refresh, add, update, updateStatus, remove };
}