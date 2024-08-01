declare const VerifyOTPEmail: {
    ({ code, email, expiry }: {
        code: string;
        email: string;
        expiry: number;
    }): JSX.Element;
    PreviewProps: {
        code: string;
        email: string;
        expiresAt: number;
    };
};
export default VerifyOTPEmail;
