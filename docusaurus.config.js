// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CloudRift',
  tagline: 'Run your code on any cloud or on your own hardware',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://rift-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub docs deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub docs deployment config.
  // If you aren't using GitHub docs, you don't need these.
  organizationName: 'CloudRift', // Usually your GitHub org/user name.
  projectName: 'CloudRift', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Serve the docs at the site's root
          routeBasePath: '/',

          sidebarPath: require.resolve('./sidebars.js'),

          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/faircompute/fair-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'CloudRift',
        logo: {
          alt: 'CloudRift Logo',
          src: 'img/fair-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs Home',
          },
          {
            href: 'https://cloudrift.ai/rapidoc',
            label: 'API',
            position: 'left',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  plugins: [
    [
      'docusaurus-plugin-dotenv',
      {
        path: "../../.env", // The path to your environment variables.
        safe: false, // If false ignore safe-mode, if true load './.env.example', if a string load that file as the sample
        systemvars: false, // Set to true if you would rather load all system variables as well (useful for CI purposes)
        silent: false, //  If true, all warnings will be suppressed
        expand: false, // Allows your variables to be "expanded" for reusability within your .env file
        defaults: false, //  Adds support for dotenv-defaults. If set to true, uses ./.env.defaults
        ignoreStub: true
      }
    ]
  ],
};

module.exports = config;
