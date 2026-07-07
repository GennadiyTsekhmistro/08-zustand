import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0] === "all" ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", selectedTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag: selectedTag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={selectedTag} />
    </HydrationBoundary>
  );
}