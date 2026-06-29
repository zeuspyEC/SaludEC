import { useState } from 'react'
import PropTypes from 'prop-types'
import './Accordion.css'

export function AccordionItem({ id, question, answer, isOpen, onToggle }) {
  const contentId = `accordion-content-${id}`
  const headingId = `accordion-heading-${id}`

  return (
    <div className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}>
      <h3 id={headingId} className="accordion-item__heading">
        <button
          type="button"
          className="accordion-item__trigger"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
        >
          <span>{question}</span>
          <span className="accordion-item__icon" aria-hidden="true">
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        className="accordion-item__panel"
        hidden={!isOpen}
      >
        <div className="accordion-item__body">
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      </div>
    </div>
  )
}

export default function Accordion({ items, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set())

  const toggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  return (
    <div className="accordion">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          {...item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

AccordionItem.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  })).isRequired,
  allowMultiple: PropTypes.bool,
}
