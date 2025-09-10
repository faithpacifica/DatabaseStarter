"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// import modifySearchParams helper utility
import { modifySearchParams } from "@/lib/utils";

export default function Pagination() {
  const searchParams = Object.fromEntries(useSearchParams()) as any; //1. convert our searchParams to an object
  const router = useRouter();

  const page = parseInt(searchParams.page) || 1;

  // function will navigate to the next or previous page when the buttons are clicked.
  // modifySearchParams utility to update the page number in the search params. It then uses the router.push function to navigate to the new search results page.

  const handlePageChange = (newPage: number) => {
    const query = modifySearchParams(searchParams, {
      ...searchParams,
      page: newPage,
    });
    router.push(`/search?${query}`);
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        className="text-black"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        Previous Page
      </button>
      <button
        onClick={() => handlePageChange(page + 1)}
        className="text-black disabled:text-gray-400"
      >
        Next Page
      </button>
    </div>
  );
}
