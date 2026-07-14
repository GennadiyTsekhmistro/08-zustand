import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] ?? "all";

  return {
    title: tag === "all" ? "All Notes | NoteHub" : `${tag} Notes | NoteHub`,
    description:
      tag === "all"
        ? "Browse and manage all your notes in NoteHub."
        : `Browse and manage notes from the ${tag} category in NoteHub.`,
    openGraph: {
      title: tag === "all" ? "All Notes | NoteHub" : `${tag} Notes | NoteHub`,
      description:
        tag === "all"
          ? "Browse and manage all your notes in NoteHub."
          : `Browse and manage notes from the ${tag} category in NoteHub.`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub application preview",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const selectedTag =
    slug[0] === "all" ? undefined : (slug[0] as NoteTag);

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