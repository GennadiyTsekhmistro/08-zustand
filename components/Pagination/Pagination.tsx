import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePageChange: ReactPaginateProps["onPageChange"] = (event) => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={handlePageChange}
      previousLabel="←"
      nextLabel="→"
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.page}
      nextClassName={css.page}
      disabledClassName={css.disabled}
    />
  );
}

export default Pagination;