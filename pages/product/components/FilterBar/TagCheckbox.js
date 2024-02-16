import React from 'react'

function TagCheckbox(props) {
  const { value, handleChecked, tags } = props
  return (
    <>
      <div className="checkbox mx-3">
        <label className="option-fcolor">
          <input
            type="checkbox"
            className="form-check-input mb-3 item-select"
            value={value}
            checked={tags.includes(value)}
            onChange={handleChecked}
          />{' '}
          {value}
        </label>
      </div>
    </>
  )
}

export default TagCheckbox
