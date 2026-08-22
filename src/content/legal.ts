export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  updatedLabel: string;
  updated: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  updatedLabel: "Last updated:",
  updated: "Jun 17, 2026",
  sections: [
    {
      heading: "Overview",
      body: [
        "This Privacy Policy explains how TeraSoft AI collects, uses, and protects information when you use TeraCode (\u201cthe Service\u201d). By using the Service, you agree to the practices described here.",
      ],
    },
    {
      heading: "Information We Collect",
      body: [
        "We collect account information such as your name, email, and company. Where you connect a source control provider, we access repository content solely to perform the reviews and tasks you ask for. We store the model provider API keys you supply, encrypted at rest, and use them only to make requests on your behalf. We collect usage information such as runs performed and features used, and device information such as browser type and IP address.",
      ],
    },
    {
      heading: "How We Use Information",
      body: [
        "We use the information we collect to provide and improve the Service, run the agents you configure, respond to support requests, send important account notifications, and monitor for security and abuse.",
      ],
    },
    {
      heading: "Data Sharing",
      body: [
        "We do not sell your data. Requests made with your API keys go directly to the model provider you chose, and are subject to that provider\u2019s terms. We may otherwise share information with service providers who help us operate the Service, subject to confidentiality obligations, or when required by law.",
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We use industry standard safeguards, including encryption in transit and at rest, to protect your data. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Data Retention",
      body: [
        "We retain your information for as long as your account is active or as needed to provide the Service. Upon cancellation, data is deleted from our systems within 30 days, except where retention is required by law.",
      ],
    },
    {
      heading: "Your Rights",
      body: [
        "Depending on your location, you may have the right to access, correct, export, or delete your personal information. To exercise these rights, contact us using the information below.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "We use cookies and similar technologies to keep you logged in, remember preferences, and understand how the Service is used. You can control cookies through your browser settings.",
      ],
    },
    {
      heading: "Children's Privacy",
      body: [
        "TeraCode is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.",
      ],
    },
    {
      heading: "International Transfers",
      body: [
        "Your information may be transferred to and processed in countries other than your own. We take steps to ensure appropriate safeguards are in place for such transfers.",
      ],
    },
    {
      heading: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised policy.",
      ],
    },
    {
      heading: "Contact",
      body: ["Questions about this Privacy Policy can be sent to contact@teracode.ai"],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms and Conditions",
  updatedLabel: "Last updated:",
  updated: "Jun 21, 2026",
  sections: [
    {
      heading: "Acceptance of Terms",
      body: [
        "By accessing or using TeraCode (“the Service”), provided by TeraSoft AI, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.",
      ],
    },
    {
      heading: "Description of Service",
      body: [
        "TeraCode provides a platform for authoring, running and scoring AI agents, together with agents built on it — including TeraCode Review, which reviews pull requests in connected repositories. Inference is performed by the model provider whose API key you supply. The Service is currently offered in private beta, and features and availability may change at any time without notice.",
      ],
    },
    {
      heading: "Accounts",
      body: [
        "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use.",
      ],
    },
    {
      heading: "Acceptable Use",
      body: [
        "You agree not to: use the Service for unlawful purposes; attempt to reverse engineer, decompile, or gain unauthorized access to the Service; upload data you do not have the right to share; interfere with the normal operation of the Service.",
      ],
    },
    {
      heading: "Data and Integrations",
      body: [
        "You retain ownership of your code and of any data you connect. By connecting a repository or supplying an API key, you grant us permission to access and process that data solely to provide the Service. You are responsible for ensuring you hold the rights to connect any repository or third party account, and for complying with the terms of the model provider whose key you supply.",
      ],
    },
    {
      heading: "Subscription and Billing",
      body: [
        "TeraCode does not currently charge a platform fee or a per-seat licence, and does not resell inference. Model usage is billed to you directly by your own model provider under your agreement with them, and we add no margin to it. If we introduce paid plans, we will give reasonable advance notice.",
      ],
    },
    {
      heading: "Termination",
      body: [
        "We may suspend or terminate your access if you violate these Terms. You may cancel your subscription at any time. Upon cancellation, your data will be available for export for a limited period before deletion.",
      ],
    },
    {
      heading: "Disclaimers",
      body: [
        "The Service is provided “as is” without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error free, or that any review, finding, code change or diagnosis produced by an agent will be accurate or complete. Output is advisory: you remain responsible for reviewing and testing any change before it reaches production.",
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, TeraSoft AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
      ],
    },
    {
      heading: "Changes to Terms",
      body: [
        "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.",
      ],
    },
  ],
};
