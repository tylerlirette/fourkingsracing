"use client";

import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schema, createStructure, presentationResolve } from "@tylerlirette/pagebuilder/schemas";
import { apiVersion, dataset, projectId } from "./src/sanity/env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure: createStructure() }),
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        preview: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    colorInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
