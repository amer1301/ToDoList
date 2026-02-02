import { type FormEvent, useMemo, useState } from "react";
import { TODO_STATUSES, type CreateTodoInput, type TodoStatus } from "../types/todo";
import styles from "./TodoForm.module.css";

type Props = {
    onCreate: (input: CreateTodoInput) => Promise<{ ok: boolean}>;
    disabled?: boolean;
};

type Errors = Partial<Record<keyof CreateTodoInput, string>>;

export default function TodoForm({ onCreate, disabled = false }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TodoStatus>("Ej påbörjad");
    const [errors, setErrors] = useState<Errors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const {submitting, setSubmitting} = useState(false);

    const remaining = useMemo(() => 200 - description.length, [description.length]);

    function validate(): boolean {
        const next: Errors = {}

        const t = title.trim();
        if (t.length < 3) next.title = "Titeln måste vara minst 3 tecken.";
        if (description.length > 200) next.description = "Beskrivningen får max vara 200 tecken.";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitError(null);
        if (!validate()) return;

    setSubmitting(true);
    const res = await onCreate({
        title: title.trim(),
        description: description.trim(),
        status,
    });
    setSubmitting(false);

    if(!res.ok) {
        setSubmitError("Kunde inte skapa uppgift. Försök igen.");
        return;
    }

    // återställ
    setTitle("");
    setDescription("");
    setStatus("Ej påbörjad");
    setErrors({});
    }

    const isDisabled = disabled || submitting;

    return (
    <section className={styles.card}>
      <h2 className={styles.heading}>Lägg till ny todo</h2>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.label}>
          Titel <span className={styles.required}>*</span>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isDisabled}
            aria-invalid={!!errors.title}
            placeholder="t.ex. Handla mat"
          />
        </label>
        {errors.title && <p className={styles.error}>{errors.title}</p>}

        <label className={styles.label}>
          Beskrivning
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isDisabled}
            aria-invalid={!!errors.description}
            placeholder="Valfritt (max 200 tecken)"
          />
        </label>
        <div className={styles.metaRow}>
          <small className={remaining < 0 ? styles.metaBad : styles.meta}>{remaining} tecken kvar</small>
        </div>
        {errors.description && <p className={styles.error}>{errors.description}</p>}

        <label className={styles.label}>
          Status <span className={styles.required}>*</span>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as TodoStatus)}
            disabled={isDisabled}
          >
            {TODO_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button className={styles.button} type="submit" disabled={isDisabled}>
          {submitting ? "Skapar..." : "Lägg till"}
        </button>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </form>
    </section>
  );
}