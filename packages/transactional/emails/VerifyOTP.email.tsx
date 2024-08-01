import {
  Body, Container,
  Font, Head,
  Heading, Html, Tailwind, Text,
} from '@react-email/components';
import React from 'react';

const VerifyOTPEmail = ({ code, email, expiry }: {
  code: string;
  email: string;
  expiry: number;
}) => {
  const minutesLeft = Math.ceil((expiry - Date.now()) / 60000);
  const logoSrc = 'https://web.fleets-app.com/assets/logos/logo.png'; // Remplacez par votre logo encodé en base64
  const headerText = "Vérifiez votre adresse email";
  const bodyText = 'Utilisez ce code pour vérifier votre adresse email sur Fleets.';
  const infoText = `Ce code a été envoyé à ${email}, il expirera dans ${minutesLeft} minutes.`;
  const footerText = "Si vous n'avez pas demandé cet email, vous pouvez l'ignorer en toute sécurité.";

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body className="bg-gray-100 flex items-center justify-center">
          <Container className="bg-white p-6 rounded-lg shadow-lg text-center">
            <img src={logoSrc} alt="Logo" className="mx-auto mb-4" width={100} />
            <Heading className="text-2xl font-bold mb-2">{headerText}</Heading>
            <Text className="mb-4 text-gray-700">{bodyText}</Text>
            <div className="text-2xl font-mono tracking-widest my-4">
              {code.split('').map((digit, index) => (
                <span key={index} className="inline-block mx-1">{digit}</span>
              ))}
            </div>
            <Text className="mb-4 text-gray-700">{infoText}</Text>
            <Text className="text-gray-500">{footerText}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyOTPEmail;

const expiresAt = Date.now() + 10 * 60 * 1000;

VerifyOTPEmail.PreviewProps = {
  code: '123456',
  email: 'painch_i@etna-alternance.net',
  expiresAt,
};
