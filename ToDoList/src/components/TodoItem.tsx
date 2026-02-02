import { useMemo, useState } from "react";
import {TODO_STATUSES, type Todo, type TodoStatus } from "../types/todo";
import styles from "./TodoItem.module.css";

type Props = {
    todo: Todo;
    onUpdateStatus: (id: string, status: TodoStatus) => Promise<{ ok: boolean }>;
    onUpdate: (id: string, patch: { title?: string; description?: string }) => Promise<{ ok: boolean }>;
    onDelete: (id: string) => Promise<{ ok: boolean }>;
    disabled?: boolean;
};

export default function TodoItem({ todo, onUpdateStatus, onUpdate, onDelete, disabled = false }: Props) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const statusClass = useMemo(() => {
        switch (todo.status) {
            case "Ej påbörjad":
                return styles.statusNotStarted;
            case "Pågående":
                return styles.statusDoing;
            case "Avklarad":
                return styles.statusDone;
        }
    }, [todo.status]);

    async function handleStatusChange(next: TodoStatus) {
        setError(null);
        const res = await onUpdateStatus(todo._id, next);
        if (!res.ok) setError("Kunde inte uppdatera status.");
    }

    function validateEdit(): string | null {
        if (title.trim().length < 3) return "Titeln måste vara minst 3 tecken.";
        if (description.length > 200) return "Beskrivningen får max vara 200 tecken.";
        return null;
    }

    async function saveEdit() {
        const msg = validateEdit();
        if (msg) {
            setError(msg);
            return;
        }
        setSaving(true);
        setError(null);
        const res = await onUpdate(todo._id, { title: title.trim(), description: description.trim() });
        setSaving(false);
        if (!res.ok) {
            setError("Kunde inte spara ändringar.");
            return;
        }
        setEditing(false);
    }

    function cancelEdit() {
        setEditing(false);
        setTitle(todo.title);
        setDescription(todo.description ?? "");
        setError(null);
    }

    async function remove() {
        if (!confirm(`Ta bort "${todo.title}"?`)) return;
        setDeleting(true);
        setError(null);
        const res = await onDelete(todo._id);
        setDeleting(false);
        if (!res.ok) setError("Kunde inte ta bort uppgift.");
    }

    const isDisabled = disabled || saving || deleting;

    return (
    <article className={styles.card}>
      <header className={styles.header}>
        {editing ? (
          <input
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isDisabled}
            aria-label="Titel"
          />
        ) : (
          <h3 className={styles.title}>{todo.title}</h3>
        )}
        <span className={`${styles.status} ${statusClass}`}>{todo.status}</span>
      </header>

      {editing ? (
        <textarea
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isDisabled}
          aria-label="Beskrivning"
        />
      ) : todo.description ? (
        <p className={styles.description}>{todo.description}</p>
      ) : (
        <p className={styles.descriptionEmpty}>Ingen beskrivning</p>
      )}

      <div className={styles.controls}>
        <label className={styles.control}>
          Status
          <select
            className={styles.select}
            value={todo.status}
            onChange={(e) => handleStatusChange(e.target.value as TodoStatus)}
            disabled={isDisabled}
          >
            {TODO_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.actions}>
          {editing ? (
            <>
              <button className={styles.button} onClick={saveEdit} disabled={isDisabled}>
                {saving ? "Sparar..." : "Spara"}
              </button>
              <button className={styles.buttonSecondary} onClick={cancelEdit} disabled={isDisabled}>
                Avbryt
              </button>
            </>
          ) : (
            <button className={styles.buttonSecondary} onClick={() => setEditing(true)} disabled={isDisabled}>
              Redigera
            </button>
          )}
          <button className={styles.buttonDanger} onClick={remove} disabled={isDisabled}>
            {deleting ? "Tar bort..." : "Ta bort"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </article>
  );
}