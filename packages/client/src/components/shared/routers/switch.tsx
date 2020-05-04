import { useEffect, useHistory } from 'hooks'

const SwitchRouter = ({
  loading, condition, redirect, children,
} : {
    loading: boolean,
    condition: boolean,
    redirect: string,
    children: any
}) => {
  const history = useHistory()

  useEffect(() => {
    if (!loading && condition && typeof window !== 'undefined') {
      window.setTimeout(() => {
        history.push(redirect)
      }, 0)
    }
  }, [loading, condition])

  return (!condition && !loading) ? children : null
}

export default SwitchRouter
