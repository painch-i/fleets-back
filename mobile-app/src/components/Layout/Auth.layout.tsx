import { IonContent, IonPage } from '@ionic/react';

import Button, { ButtonProps } from '@/components/Button/Button.global';
import Header, { HeaderProps } from '@/components/Header/Header.global';

interface AuthLayoutProps {
  children: React.ReactNode;
}

type AuthLayoutTextProps = {
  title: string;
  description: string;
};

const AuthLayoutRoot: React.FC<AuthLayoutProps> = ({ children }) => (
  <IonPage>
    <IonContent className="part-[background]:bg-primary">
      <div className="flex size-full flex-col rounded-t-[20px] bg-light p-5">
        {children}
      </div>
    </IonContent>
  </IonPage>
);

const AuthLayoutContent: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="flex size-full flex-col gap-[25px]">{children}</div>
);

const AuthLayoutHeader: React.FC<HeaderProps> = (props) => (
  <Header {...props} className="h-8 p-0 text-dark" />
);

export const AuthLayoutText: React.FC<AuthLayoutTextProps> = ({
  title,
  description,
}) => (
  <div className="flex w-full flex-col gap-2.5 py-2.5">
    <h1 className="text-lg leading-tight text-dark">{title}</h1>
    <p className="text-base font-light leading-normal text-label">
      {description}
    </p>
  </div>
);

const AuthLayoutButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} className="h-[60px] font-anybody font-bold" type="submit">
    SUIVANT
  </Button>
);

const AuthLayout = {
  Root: AuthLayoutRoot,
  Content: AuthLayoutContent,
  Header: AuthLayoutHeader,
  Text: AuthLayoutText,
  Button: AuthLayoutButton,
};

export default AuthLayout;
