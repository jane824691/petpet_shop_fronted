import React from 'react'

import { ChangeEvent } from 'react'

interface TagCheckboxProps {
  value: string
  handleChecked: (e: ChangeEvent<HTMLInputElement>) => void
  tags: string[]
}

function TagCheckbox(props: TagCheckboxProps) {
  const { value, handleChecked, tags } = props
  return (
    <>
      <div className="checkbox mx-3">
        <label className="option-fcolor">
          <input
            type="checkbox"
            className="form-check-input mb-3 item-select"
            value={value}
            checked={tags && tags.includes(value)}
            onChange={handleChecked}
          />{' '}
          {value}
        </label>
      </div>
    </>
  )
}

export default TagCheckbox
