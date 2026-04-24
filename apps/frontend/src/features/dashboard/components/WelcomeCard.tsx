import { Button } from '../../../design-system/components';
import './WelcomeCard.css';

interface WelcomeCardProps {
  userName: string;
  onAddTransaction?: () => void;
  onLinkCouple?: () => void;
}

export const WelcomeCard = ({ userName, onAddTransaction, onLinkCouple }: WelcomeCardProps) => {
  return (
    <div className="welcome-card">
      <div className="welcome-card__content">
        <div>
          <h2 className="welcome-card__title">Bem-vindo, {userName}!</h2>
          <p className="welcome-card__subtitle">
            Gerencie suas finanças pessoais e compartilhadas em um só lugar
          </p>
        </div>
        <div className="welcome-card__actions">
          <Button variant="primary" onClick={onAddTransaction}>
            Novo Gasto
          </Button>
          <Button variant="secondary" onClick={onLinkCouple}>
            Vincular Parceiro
          </Button>
        </div>
      </div>
      <div className="welcome-card__decoration" />
    </div>
  );
};
