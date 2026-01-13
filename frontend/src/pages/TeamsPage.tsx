import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/button/Button';
import { Team } from '../types/teams';

 const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setTeams([
        { id: '1', name: 'Equipe Alpha', leader: { id: 'u1', name: 'Alice' }, members: [{ id: 'u1', name: 'Alice' }, { id: 'u2', name: 'Bob' }] },
      ])
    } catch (error) {
      console.error("Erro ao carregar times", error);
    }
  };

  return (
    <div className='page-container'>
      <header className='page-header'>
        <div>
          <h1 className='page-title'>Equipes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie seus times e líderes</p>
        </div>
        <Button onClick={() => console.log('Abrir Modal')}>
          
          Nova Equipe
        </Button>
      </header>

      <div className='teams-grid'>
        {teams.map((team) => (
          <div 
            key={team.id} 
            className='team-card'
            onClick={() => navigate(`/teams/${team.id}`)}
          >
            <div className='team-card-header'>
              <h3 className='team-name'>{team.name}</h3>
            </div>

            {/* Destaque do Líder */}
            <div className='leader-badge'>
              <span>Líder: {team.leader?.name || 'Não definido'}</span>
            </div>

            <div className='card-stats'>
              <span>{team.members?.length || 0} membros</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;