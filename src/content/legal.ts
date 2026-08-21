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
        "This Privacy Policy explains how Strand collects, uses, and protects information when you use our Service. By using Strand, you agree to the practices described here.",
      ],
    },
    {
      heading: "Information We Collect",
      body: [
        "We collect account information such as your name, email, and company. We collect connected data from the third party sources you choose to integrate, solely to provide the Service. We collect usage information such as queries run and features used. We also collect device information such as browser type and IP address.",
      ],
    },
    {
      heading: "How We Use Information",
      body: [
        "We use the information we collect to provide and improve the Service, build and maintain your knowledge graph, respond to support requests, send important account notifications, and monitor for security and abuse.",
      ],
    },
    {
      heading: "Data Sharing",
      body: [
        "We do not sell your data. We may share information with service providers who help us operate Strand, subject to confidentiality obligations, or when required by law.",
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
        "Strand is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.",
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
      body: ["Questions about this Privacy Policy can be sent to privacy@strand.io"],
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
        "By accessing or using Strand (“the Service”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.",
      ],
    },
    {
      heading: "Description of Service",
      body: [
        "Strand provides an AI powered data intelligence platform that connects to third party data sources, builds a knowledge graph, and allows natural language querying of connected data. Features and availability may change at any time without notice.",
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
        "You retain ownership of the data you connect to Strand. By connecting a data source, you grant us permission to access, process, and store that data solely to provide the Service. You are responsible for ensuring you have the rights to connect any third party data source.",
      ],
    },
    {
      heading: "Subscription and Billing",
      body: [
        "Paid plans are billed in advance on a monthly or annual basis. Fees are non refundable except where required by law. We may change pricing with reasonable advance notice.",
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
        "The Service is provided “as is” without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error free, or that insights generated will be accurate or complete.",
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, Strand shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
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
