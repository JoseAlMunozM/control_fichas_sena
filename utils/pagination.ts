export type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  const safeTotalPages = Math.max(0, Math.trunc(totalPages));

  if (safeTotalPages === 0) {
    return [];
  }

  const safeCurrentPage = Math.min(
    Math.max(1, Math.trunc(currentPage)),
    safeTotalPages,
  );
  const safeSiblingCount = Math.max(0, Math.trunc(siblingCount));
  const pages = new Set<number>([1, safeTotalPages]);

  for (
    let page = safeCurrentPage - safeSiblingCount;
    page <= safeCurrentPage + safeSiblingCount;
    page += 1
  ) {
    if (page > 1 && page < safeTotalPages) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((first, second) => first - second);
  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage !== undefined) {
      const gap = page - previousPage;

      if (gap === 2) {
        items.push(previousPage + 1);
      } else if (gap > 2) {
        items.push(
          previousPage === 1 ? "ellipsis-start" : "ellipsis-end",
        );
      }
    }

    items.push(page);
  });

  return items;
}
