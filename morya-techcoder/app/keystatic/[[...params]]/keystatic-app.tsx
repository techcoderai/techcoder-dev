"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

if (typeof window !== "undefined") {
	const consoleKey = "__techcoderKeystaticConsolePatched";
	const browserConsole = console as typeof console & { [consoleKey]?: boolean };

	if (!browserConsole[consoleKey]) {
		const originalError = console.error;
		console.error = (...args: Parameters<typeof console.error>) => {
			if (
				args[0] === 'An empty string ("") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.' &&
				args[1] === "href" &&
				args[2] === "href"
			) {
				return;
			}

			originalError(...args);
		};
		browserConsole[consoleKey] = true;
	}
}

/**
 * The Keystatic editor itself. Must be a client component because the editor
 * runs entirely in the browser.
 *
 * Split out from `page.tsx` so the route can decide whether to mount it at all
 * — the page is a server component that 404s in production before this module
 * is ever imported.
 */
export default makePage(config);
