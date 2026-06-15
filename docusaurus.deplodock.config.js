// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Deplodock',
  tagline: 'Benchmark and deploy optimized LLM models on GPU servers',
  favicon: 'img/favicon.ico',

  url: 'https://deplodock.docs.cloudrift.ai',
  baseUrl: '/',

  organizationName: 'CloudRift',
  projectName: 'Deplodock',

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
          path: 'docs-deplodock',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.deplodock.js'),
          editUrl: 'https://github.com/CloudRift/rift-docs',
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
      image: 'img/cloudrift-social-card.webp',
      metadata: [
        {name: 'description', content: 'Deplodock documentation - Benchmark and deploy optimized LLM models on GPU servers with vLLM or SGLang.'},
        {name: 'keywords', content: 'Deplodock, LLM deployment, vLLM, SGLang, GPU benchmarking, model optimization, CloudRift'},
        {property: 'og:type', content: 'website'},
        {property: 'og:site_name', content: 'Deplodock Documentation'},
        {property: 'og:description', content: 'Benchmark and deploy optimized LLM models on GPU servers with vLLM or SGLang.'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:title', content: 'Deplodock Documentation'},
        {name: 'twitter:description', content: 'Benchmark and deploy optimized LLM models on GPU servers with vLLM or SGLang.'},
      ],
      navbar: {
        title: 'Deplodock',
        logo: {
          alt: 'CloudRift Logo',
          src: 'img/cloudrift_vector.svg',
        },
        items: [
          {
            href: 'https://www.cloudrift.ai/',
            label: 'CloudRift.ai',
            position: 'left',
          },
          {
            href: 'https://docs.cloudrift.ai',
            label: 'CloudRift Docs',
            position: 'left',
          },
          {
            href: 'https://x.com/CloudRiftAI',
            label: 'Follow on X',
            position: 'right',
            className: 'header-x-link',
            'aria-label': 'Follow CloudRift on X',
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
        path: "../../.env",
        safe: false,
        systemvars: false,
        silent: false,
        expand: false,
        defaults: false,
        ignoreStub: true
      }
    ]
  ],
};

module.exports = config;
