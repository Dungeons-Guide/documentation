import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Dungeons Guide',
  tagline: 'The most intelligent Skyblock Mod',
  favicon: 'img/favicon.ico', 

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-conf ig#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.dungeons.guide',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Dungeons-Guide', // Usually your GitHub org/user name.
  projectName: 'documentation', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Dungeons-Guide/documentation/tree/main',
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Dungeons Guide',
      logo: {
        alt: 'Dungeons Guide Logo',
        srcDark: 'img/darklogo.png',
        src: 'img/lightlogo.png'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://dungeons.guide/discord',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://store.dungeons.guide/',
          label: 'Store',
          position: 'right',
        },
        {
          href: 'https://github.com/Dungeons-Guide/Skyblock-Dungeons-Guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/category/pathfinding-and-routes',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Discord',
              href: 'https://dungeons.guide/discord',
            },
            {
              label: 'Store',
              href: 'https://store.dungeons.guide/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Dungeons-Guide/Skyblock-Dungeons-Guide',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dungeons Guide. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
