"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
  });

  const formAction = async (formData: FormData): Promise<void> => {
    const title = formData.get("title");
    const content = formData.get("content");
    const tag = formData.get("tag");

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof tag !== "string"
    ) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        title,
        content,
        tag: tag as NoteTag,
      });

      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    } catch {
      return;
    }
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={(event) => {
            setDraft({
              title: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          maxLength={500}
          onChange={(event) => {
            setDraft({
              content: event.target.value,
            });
          }}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          required
          onChange={(event) => {
            setDraft({
              tag: event.target.value as NoteTag,
            });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {createMutation.isError && (
        <p className={css.error}>Failed to create the note.</p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}