import { PluginConfig } from "@botonic/core";

export const plugins: PluginConfig<any>[] = [
  {
    id: "intent-classification",
    resolve: require("@botonic/plugin-intent-classification"),
    options: {
      locales: ["en"],
    },
  },
];
