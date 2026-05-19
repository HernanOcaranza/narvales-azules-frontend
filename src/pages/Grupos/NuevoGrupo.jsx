import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { Button } from '../../components/ui';

function NuevoGrupo() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate(ROUTES.GRUPOS, { replace: true });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p className="text-text-secondary">Redirigiendo...</p>
      <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(ROUTES.GRUPOS)}>Volver a Grupos</Button>
    </div>
  );
}

export default NuevoGrupo;