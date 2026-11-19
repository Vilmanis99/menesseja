"use client";

import dynamic from "next/dynamic";

// The notebook code is needed only when its article renders this section.
export const SeedGerminationTool = dynamic(() => import("./seed-germination-notebook").then((module) => module.SeedGerminationNotebook));
