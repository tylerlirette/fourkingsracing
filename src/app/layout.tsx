import {
  DisableDraftMode,
  VisualEditingControls,
} from "@tylerlirette/pagebuilder/preview";
import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <SanityLive />
        <VisualEditingControls />
        {isDraftMode ? <DisableDraftMode /> : null}
      </body>
    </html>
  );
}
