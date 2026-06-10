import { useParams } from 'react-router-dom'
import { useJudgment } from '@/hooks/useTalosData'
import { ErrorState, Loading } from '@/components/Feedback'
import { JudgmentDay } from '@/views/JudgmentDay/JudgmentDay'

function JudgmentLoader({ jiraKey }: { jiraKey: string }) {
  const { data, loading, error } = useJudgment(jiraKey)
  if (loading || !data) return error ? <ErrorState message={error.message} /> : <Loading />
  return <JudgmentDay review={data} />
}

export function JudgmentDayContainer() {
  const { jiraKey } = useParams()
  if (!jiraKey) return <ErrorState message="Falta el issue key." />
  return <JudgmentLoader jiraKey={jiraKey} />
}
