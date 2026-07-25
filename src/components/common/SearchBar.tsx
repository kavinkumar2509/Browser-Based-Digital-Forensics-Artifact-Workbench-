import React from 'react';

/**
 * Props for the SearchBar component.
 *
 * Extends standard HTML `<input>` attributes. The three most common props
 * (`value`, `onChange`, `placeholder`) are surfaced explicitly for clarity,
 * but every native input prop (onFocus, onBlur, aria-*, etc.) is also accepted.
 */
interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Controlled input value. */
  value?: string;
  /** Change handler fired on every keystroke. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Placeholder hint. Defaults to a DFIR-relevant prompt. */
  placeholder?: string;
}

/**
 * Inline magnifying-glass icon (16 × 16).
 * Rendered as a pure SVG to avoid external icon dependencies.
 */
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * PWNDORA forensic search bar.
 *
 * Designed for querying IP addresses, SHA-256 hashes, domain names,
 * and other IOCs. Features a dark, high-contrast input field with a
 * glowing cyan focus ring and inline search icon.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 *
 * <SearchBar
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   placeholder="Search IOC, SHA-256, IP..."
 * />
 * ```
 */
const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Query IP, SHA-256, domain…',
      className = '',
      ...rest
    },
    ref,
  ) => {
    return (
      <div className="group relative w-full">
        {/* ── Search icon ── */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <SearchIcon className="h-4 w-4 text-slate-500 transition-colors duration-200 group-focus-within:text-cyan-400" />
        </div>

        {/* ── Input field ── */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          className={[
            // Layout
            'w-full rounded-md py-2.5 pl-10 pr-4',
            // Colours
            'border border-slate-700/60 bg-slate-950 text-slate-200 placeholder:text-slate-600',
            // Typography
            'font-mono text-sm tracking-wide',
            // Focus
            'outline-none ring-0 transition-all duration-200',
            'focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-400/50',
            'focus:shadow-[0_0_12px_rgba(34,211,238,0.12)]',
            // Hover (when not focused)
            'hover:border-slate-600',
            // Consumer overrides
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {/* ── Subtle bottom glow on focus ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
        />
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
export type { SearchBarProps };
