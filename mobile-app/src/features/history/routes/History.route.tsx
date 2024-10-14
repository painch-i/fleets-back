import { useNavigate } from 'react-router';

export const History: React.FC = () => {
  const navigate = useNavigate();

  const hasFleet: boolean = true;

  const navigateToDestination = () => {
    navigate('/fleet');
  };

  return (
    <div>
      {hasFleet && (
        <button onClick={navigateToDestination}>GO TO CURRENT FLEET</button>
      )}
    </div>
  );
};
