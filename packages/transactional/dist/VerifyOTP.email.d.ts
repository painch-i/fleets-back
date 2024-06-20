declare const VerifyOTPEmail: {
    ({ otp, email }: {
        otp: any;
        email: any;
    }): JSX.Element;
    PreviewProps: {
        otp: string;
        email: string;
    };
};
export default VerifyOTPEmail;
