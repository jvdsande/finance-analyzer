import { useState, useCallback } from 'react'

const useFormEntry = ({
  initialValue = '',
  validate = null,
} : {
  initialValue?: string,
  validate?: ((...args: any[]) => any) | null
} = {}) : [
  string,
  { onChange: (Event: any) => void, onBlur: () => void, onFocus: () => void, value: string },
  { valid: boolean, dirty: boolean, touched: boolean, focus: boolean, update: (string: string) => void },
] => {
  const [valid, setValid] = useState<boolean>(true)
  const [dirty, setDirty] = useState<boolean>(false)
  const [touched, setTouched] = useState<boolean>(false)
  const [focus, setFocus] = useState<boolean>(false)
  const [value, setValue] = useState<string>(initialValue)

  const onChange = useCallback((e) => {
    setValue(e.target.value)
    setValid(validate ? validate(e.target.value) : true)
    setDirty(true)
    setTouched(false)
  }, [validate])

  const onBlur = useCallback(() => {
    setTouched(true)
    setFocus(false)
  }, [])

  const onFocus = useCallback(() => {
    setFocus(true)
  }, [])

  const update = useCallback((v) => {
    onChange({ target: { value: v } })
  }, [])

  return [
    value,
    {
      onChange,
      onBlur,
      onFocus,
      value,
    },
    {
      valid,
      dirty,
      touched,
      focus,
      update,
    },
  ]
}

export default useFormEntry
