import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'

const QuickOption = () => {
  const intl = useIntl()
  const moneyOptions = [
    intl.formatMessage({ id: 'product.moneyOption1' }),
    intl.formatMessage({ id: 'product.moneyOption2' }),
    intl.formatMessage({ id: 'product.moneyOption3' })
  ];
  const [selected, setSelected] = useState(null);
  const [borrow, setBorrow] = useState('');

  const handleClick = (value) => {
    setSelected(value);
  };

  // let selected associate to input
  useEffect(() => {
    if (selected !== null) {
      setBorrow(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (borrow !== selected) {
      setSelected(borrow);
    }
  }, [borrow]);

  //   className= ${selected === value ? style.selected : ""}`}
  //   onClick={() => handleClick(value)}
  // 可綁回下方div的input讓option連動
  return (
    <>
      <div className="moneyOptionsPart">
        {moneyOptions.map((value) => (
          <div
            key={value}
            className="eachMoney"
          >
            {value}
            <div></div>
          </div>
        ))}
      </div>
    </>
  )
}

export default QuickOption