import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

function SearchBox({ onChange }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
}

export default SearchBox;
