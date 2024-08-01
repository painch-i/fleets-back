"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = require("@react-email/components");
const react_1 = __importDefault(require("react"));
const VerifyOTPEmail = ({ code, email, expiry }) => {
    const minutesLeft = Math.ceil((expiry - Date.now()) / 60000);
    const logoSrc = 'https://web.fleets-app.com/assets/logos/logo.png';
    const headerText = "Vérifiez votre adresse email";
    const bodyText = 'Utilisez ce code pour vérifier votre adresse email sur Fleets.';
    const infoText = `Ce code a été envoyé à ${email}, il expirera dans ${minutesLeft} minutes.`;
    const footerText = "Si vous n'avez pas demandé cet email, vous pouvez l'ignorer en toute sécurité.";
    return (react_1.default.createElement(components_1.Html, null,
        react_1.default.createElement(components_1.Head, null,
            react_1.default.createElement(components_1.Font, { fontFamily: "Roboto", fallbackFontFamily: "Verdana", webFont: {
                    url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    format: "woff2",
                }, fontWeight: 400, fontStyle: "normal" })),
        react_1.default.createElement(components_1.Tailwind, null,
            react_1.default.createElement(components_1.Body, { className: "bg-gray-100 flex items-center justify-center" },
                react_1.default.createElement(components_1.Container, { className: "bg-white p-6 rounded-lg shadow-lg text-center" },
                    react_1.default.createElement("img", { src: logoSrc, alt: "Logo", className: "mx-auto mb-4", width: 100 }),
                    react_1.default.createElement(components_1.Heading, { className: "text-2xl font-bold mb-2" }, headerText),
                    react_1.default.createElement(components_1.Text, { className: "mb-4 text-gray-700" }, bodyText),
                    react_1.default.createElement("div", { className: "text-2xl font-mono tracking-widest my-4" }, code.split('').map((digit, index) => (react_1.default.createElement("span", { key: index, className: "inline-block mx-1" }, digit)))),
                    react_1.default.createElement(components_1.Text, { className: "mb-4 text-gray-700" }, infoText),
                    react_1.default.createElement(components_1.Text, { className: "text-gray-500" }, footerText))))));
};
exports.default = VerifyOTPEmail;
const expiresAt = Date.now() + 10 * 60 * 1000;
VerifyOTPEmail.PreviewProps = {
    code: '123456',
    email: 'painch_i@etna-alternance.net',
    expiresAt,
};
//# sourceMappingURL=VerifyOTP.email.js.map