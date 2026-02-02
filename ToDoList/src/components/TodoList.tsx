import {useMemo, useState } from "react";
import type { Todo, TodoStatus } from "../types/todo";
import { TODO_STATUSES } from "../types/todo";
import TodoItem from "./TodoItem";
import styles from "./TodoList.module.css";

type SortKey = "newest" | "title" | "status";

type Props = {
    todos: Todo[];
    disabled?: boolean;
    onUpdateStatus: (id: string, status: TodoStatus) => Promise<{ ok: boolean }>;
    onUpdate: (id: string, patch: { title?: string; description?: string }) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => Promise<{ ok: boolean }>;
};

export default function TodoList({ todos, disabled = false, onUpdateStatus, onUpdate, onDelete }: Props) {
    const [filter, setFilter] = useState<TodoStatus | "Alla">("Alla");
    const [sort, setSort] = useState<SortKey>("newest");

    const visible = useMemo(() => {
        let items = [...todos];
        if (filter !== "Alla") items = items.filter((t) => t.status === filter);

        if (sort === "title") {
            items.sort((a, b) => a.title.localeCompare(b.title, "sv"));
        } else if (sort === "status") {
            const order: Record<TodoStatus, number> = {
                "Ej påbörjad": 0,
                "Pågående": 1,
                "Avklarad": 2,
            };
            items.sort((a, b) => order[a.status] - order[b.status]);
        }
        return items;
    }, [filter, sort, todos]);

    return (
    <section className={styles.section}>
      <div className={styles.topRow}>
        <h2 className={styles.heading}>Todos</h2>
        <div className={styles.tools}>
          <label className={styles.tool}>
            Filter
            <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="Alla">Alla</option>
              {TODO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.tool}>
            Sortering
            <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="newest">Senaste först</option>
              <option value="title">Titel</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>Inga todos att visa.</p>
      ) : (
        <div className={styles.list}>
          {visible.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdateStatus={onUpdateStatus}
              onUpdate={onUpdate}
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </section>
  );
}