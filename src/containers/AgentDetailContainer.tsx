import { useParams } from 'react-router-dom'
import { isFigura, type Figura } from '@/domain/agents'
import { useAgentDetail } from '@/hooks/useTalosData'
import { ErrorState, Loading } from '@/components/Feedback'
import { AgentDetail } from '@/views/AgentDetail/AgentDetail'

function AgentDetailLoader({ id }: { id: Figura }) {
  const { data, loading, error } = useAgentDetail(id)
  if (loading || !data) return error ? <ErrorState message={error.message} /> : <Loading />
  return <AgentDetail detail={data} />
}

export function AgentDetailContainer() {
  const { figura } = useParams()
  if (!figura || !isFigura(figura)) {
    return <ErrorState message={`Figura desconocida: ${figura ?? '—'}`} />
  }
  return <AgentDetailLoader id={figura} />
}
