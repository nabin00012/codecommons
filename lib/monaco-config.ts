import { loader } from "@monaco-editor/react";

// Configure Monaco Editor loader
loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
  },
  "vs/nls": {
    availableLanguages: {
      "*": "en",
    },
  },
});
