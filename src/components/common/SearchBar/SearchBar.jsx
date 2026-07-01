import { useState, useRef, useId } from 'react'
import PropTypes from 'prop-types'
import './SearchBar.css'

export default function SearchBar({ onSearch, placeholder = 'Buscar…', label = 'Buscar contenido' }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const inputId = useId()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form
      role="search"
      aria-label={label}
      className="search-bar"
      onSubmit={handleSubmit}
    >
      <div className="search-bar__inner">
        <span className="search-bar__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          id={inputId}
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="search-bar__input"
          aria-label={placeholder}
          autoComplete="on"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar__clear"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      <button type="submit" className="search-bar__btn">
        Buscar
      </button>
    </form>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
}
