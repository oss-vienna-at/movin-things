import { Config } from "@stencil/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const config: Config = {
  namespace: "MovinThings",
  globalStyle: "src/global/app.css",
  globalScript: "src/global/app.ts",
  taskQueue: "async",
  extras: {
    scriptDataOpts: true,
  },
  outputTargets: [
    {
      type: "www",
      copy: [
        {
          src: 'assets',
          dest: 'build/assets',
        },
        {
          src: 'assets',
        },
        {
          src: '../node_modules/leaflet/dist/images',
          dest: 'images',
        }
      ],
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: "https://myapp.local/",
    },
    {
      type: "dist",
      copy: [
        { src: 'assets' }
      ]
    },
  ],
};
