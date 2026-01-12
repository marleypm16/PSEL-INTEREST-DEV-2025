import { useNavigate } from 'react-router-dom';

import { Button } from '../components/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="error-code">404</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <h1 className="error-title">Página não encontrada</h1>
        
        <p className="error-desc">
          Ops! Parece que a página que você está procurando não existe ou foi movida.
        </p>

        <Button onClick={() => navigate('/teams')}>
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
};