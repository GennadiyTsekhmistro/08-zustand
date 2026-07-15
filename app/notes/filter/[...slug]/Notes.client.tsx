"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

import css from "./NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <main className={css.main}>
      <div className={css.toolbar}>
        <SearchBox onChange={setSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </main>
  );
}