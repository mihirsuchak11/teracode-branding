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
  updated: "Aug 22, 2026",
  sections: [
    {
      heading: "Overview",
      body: [
        "This Privacy Policy explains how TeraCodeAI collects, uses, and protects information when you use the TeraCodeAI service — a bring-your-own-key multi-agent pull request review product (GitHub App and dashboard). By using the Service, you agree to the practices described here.",
      ],
    },
    {
      heading: "Information We Collect",
      body: [
        "Account information. When you sign in with GitHub we receive the identity GitHub shares for that OAuth flow — typically your GitHub user id, login, and email. We use that to create a session and to know which installations and repositories you may see.",
        "Repository content. To review a pull request we receive the forge webhook, then — unless the project turns checkout off — shallow-clone the pull request head into an ephemeral sandbox so agents can read files, search, and list directories. We also receive the diff, metadata (title, author, SHAs), review comments, and check-run results. Nothing from the repository is executed in the sandbox: no install, no build, no tests.",
        "Credentials you supply. Model provider API keys (Anthropic or OpenRouter) are stored encrypted at rest and used only to call that provider from the host process. The key does not enter the sandbox. GitLab project access tokens, if you connect a GitLab project, are stored the same way and used to read the project and post the review.",
        "Review artifacts. We store review runs, agent findings, comments posted, check outcomes, and what became of each finding (resolved, deleted, or left open) so the dashboard can show a journal and a keep-rate.",
        "Usage information. We record that a review ran, which agents ran, token counts or cost the provider reported, and similar operational events. We collect ordinary device information such as browser type and IP address on the dashboard.",
      ],
    },
    {
      heading: "How We Use Information",
      body: [
        "We use this information to run the reviewers you configured, post findings and status checks on the pull request, show the dashboard, enforce the repository meter, respond to support requests, send account notifications you asked for, and monitor for security and abuse. We do not build a knowledge graph of third-party business data sources, and we do not use your repositories to train a public model.",
      ],
    },
    {
      heading: "Data Sharing",
      body: [
        "We do not sell your data. Prompts and code excerpts needed for a review are sent to the model provider whose key you supplied, and are subject to that provider's terms. We may share information with infrastructure providers who host the dashboard, database, and sandboxes, under confidentiality obligations, or when required by law. GitHub or GitLab receive the comments and checks the Service posts because that is the product.",
      ],
    },
    {
      heading: "Sandboxes and keys",
      body: [
        "Repo-aware review boots a sandbox, clones the pull request head, and gives agents read-only file tools. Egress from the sandbox is allow-listed to the forge. The model is called from the host, not the sandbox, so your provider key never enters the VM. A sandbox that fails to start degrades that review to the diff only; it does not fail the review silently.",
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We use industry-standard safeguards, including encryption in transit and at rest for stored keys and tokens. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Data Retention",
      body: [
        "We retain account, project, and review history for as long as the organization uses the Service. Disconnecting a repository is intended to stop new reviews; billing history is kept so an invoice can still be explained. Upon account cancellation, data is deleted from our systems within 30 days, except where retention is required by law.",
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
        "We use cookies and similar technologies to keep you logged in to the dashboard, remember the active organization, and understand how the Service is used. You can control cookies through your browser settings.",
      ],
    },
    {
      heading: "Children's Privacy",
      body: [
        "TeraCodeAI is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.",
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
      body: ["Questions about this Privacy Policy can be sent to contact@teracodeai.com."],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms and Conditions",
  updatedLabel: "Last updated:",
  updated: "Aug 22, 2026",
  sections: [
    {
      heading: "Acceptance of Terms",
      body: [
        "By accessing or using TeraCodeAI (“the Service”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.",
      ],
    },
    {
      heading: "Description of Service",
      body: [
        "TeraCodeAI is a bring-your-own-key multi-agent pull request review service. A GitHub App (and, where you connect one, a GitLab project webhook) receives pull requests; several review agents you configure run on the diff — and, by default, on a shallow clone of the pull request head in a sandbox — then post findings and one status check each. Inference is performed by the model provider whose API key you supply. Features and availability may change; we will not describe a different product on this site than the one the dashboard runs.",
      ],
    },
    {
      heading: "Accounts",
      body: [
        "You sign in with GitHub. You are responsible for the GitHub account you use, for the installations you authorize, and for all activity under your organization on the Service. Notify us immediately of any unauthorized use.",
      ],
    },
    {
      heading: "Acceptable Use",
      body: [
        "You agree not to: use the Service for unlawful purposes; attempt to reverse engineer, decompile, or gain unauthorized access to the Service; connect a repository or supply a key you do not have the right to use; interfere with the normal operation of the Service.",
      ],
    },
    {
      heading: "Code, clones, keys, and sandboxes",
      body: [
        "You retain ownership of your code and of any data you connect. By installing the GitHub App, connecting a repository, or supplying an API key, you grant us permission to access, clone, and process that material solely to provide the Service — including shallow-cloning a pull request into a sandbox with read-only file tools, sending prompts and excerpts to your chosen model provider, and posting comments and checks on the pull request.",
        "You are responsible for ensuring you hold the rights to connect any repository, and for complying with the terms of GitHub, GitLab, and the model provider whose key you supply. Repository code is not executed in the sandbox. Your provider key is not placed in the sandbox.",
      ],
    },
    {
      heading: "Subscription and Billing",
      body: [
        "The Service is metered at $20 (USD) or ₹1,699 (INR) per extra connected repository per month. The first repository in an organization is free, forever. There is no per-seat licence and no second meter for queries or data sources. Model usage is billed to you by your own provider under your agreement with them; we add no margin to it. Paid quantity is billed in advance through Razorpay hosted checkout; TeraCodeAI remains the seller (including GST, where applicable). Disconnecting a repository drops quantity at the next boundary; we do not promise a pro-rata refund. We may change pricing with reasonable advance notice.",
      ],
    },
    {
      heading: "Reviews are advisory",
      body: [
        "Findings, comments, and check runs are advisory. A passing check is not a warranty that the change is safe, complete, or compliant. You remain responsible for reviewing, testing, and deciding what merges.",
      ],
    },
    {
      heading: "Termination",
      body: [
        "We may suspend or terminate your access if you violate these Terms. You may disconnect repositories and cancel a paid subscription at any time. Upon cancellation, review history remains available for a limited period before deletion, except billing records we must keep.",
      ],
    },
    {
      heading: "Disclaimers",
      body: [
        "The Service is provided “as is” without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error free, or that any review, finding, or check produced by an agent will be accurate or complete.",
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, TeraCodeAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
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
