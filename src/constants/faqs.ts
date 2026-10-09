export interface FaqItem {
  question: string;
  /** Plain text. A "\n" starts a new paragraph. */
  answer: string;
}

export const FAQS: readonly FaqItem[] = [
  {
    question: 'What is the BT Asset Hub?',
    answer:
      'The BT Asset Hub is a platform designed to host multiple asset tokenization projects. It offers a marketplace for various asset- backed tokens, initially in Australia, and is set to expand globally.The Hub provides a user - friendly interface for both asset managers and investors, ensuring compliance, security, and seamless API connections for automated KYC / KYB and tax reporting.',
  },
  {
    question: 'Who can invest in the BT Asset Hub?',
    answer:
      "Retail, wholesale, and institutional investors can invest, each fund has its own approved investor qualification which can be found in the fund's detail page.\nRetail Investor - An individual investing their own funds without meeting specific wealth or income thresholds.\nWholesale Investor - An individual or entity that meets certain financial thresholds, such as having net assets of over AUD 2.5 million or a gross income of at least AUD 250,000 per annum.",
  },
  {
    question: 'What types of assets can be tokenized on the BT Asset Hub?',
    answer:
      'The platform supports the tokenization of various asset classes, including real estate projects, mixed asset funds, lending and development funds, businesses, and other financial instruments. Each tokenized asset is backed by real-world value, offering investors diverse investment opportunities.',
  },
  {
    question: 'What payment methods are accepted for investments?',
    answer:
      'BT funds accept payments in B4RC2, AUDD, USDT tokens, and Fiat Currency. This provides flexibility for investors to use different types of digital currencies for their transactions on the platform.',
  },
  {
    question: 'How do I start investing on the BT Asset Hub?',
    answer:
      'To start investing, create an account on the platform, complete the KYC/KYB process, and link your digital wallet. You can then browse available tokenized assets, select your investment, and apply to invest. Once approved, submit your buy order and make a payment using B4RC2, AUDD, USDT tokens, or Fiat via our payment gateway.\nWholesale and institutional investors can contact our over-the-counter service for direct investment assistance.',
  },
  {
    question: 'What are the fees associated with the BT Asset Hub?',
    answer:
      'Investors – Creating an account on the BT Asset Hub is FREE. The platform charges 0.5% on all trades (Buy, Sell, Receive, Send) and a one-time KYC/KYB fee of $250 AUD (charged at the time your first investment is initiated).\nAsset Managers – There is an asset listing fee; full details are provided at the time of initial application.',
  },
  {
    question: 'Are the investment managers on the BT Asset Hub licensed?',
    answer:
      'Yes, each fund listed on the BT Asset Hub has its own fully licensed investment manager. These professionals are responsible for managing the fund, ensuring compliance, and maximizing returns for investors.',
  },
  {
    question: 'What is the difference between an asset manager and an investment manager?',
    answer:
      'Asset Manager - Manages the physical and financial performance of the assets, including maintenance, operations, and value enhancement.\nInvestment Manager - Manages the investment portfolio, making strategic decisions to achieve the best returns for investors.',
  },
  {
    question: 'What is the BT Asset Hub Referral Program?',
    answer:
      'The BT Asset Hub Referral Program rewards both referring partners and individual referrers for sharing our platform. Each fund maintains a 10% reward allocation for referrals. This reward can be shared between a referring partner and an individual referrer, with a maximum of 5% each.',
  },
  {
    question: 'How does the BT Asset Hub ensure security?',
    answer:
      'The BT Asset Hub employs advanced cybersecurity measures, including data encryption, multi-factor authentication, and regular security audits. The platform is built on a secure infrastructure with continuous monitoring to protect investor data and transactions.',
  },
  {
    question: 'Can I track my investments on the BT Asset Hub?',
    answer:
      'Yes, investors have access to a comprehensive dashboard where they can track their portfolio performance, view transaction history, manage distributions, and access tax reporting tools. This dashboard provides real-time insights into your investments.',
  },
  {
    question: 'What should I do if I have a complaint or need support?',
    answer:
      'If you have any issues or need assistance, you can contact our customer support team via email, phone, or the in-platform messaging system. We also have a customer dispute resolution policy to ensure all complaints are handled promptly and fairly.',
  },
];
