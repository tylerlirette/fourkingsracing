import { DisableDraftMode } from "@tylerlirette/pagebuilder/preview";
import { draftMode } from "next/headers";

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
        {isDraftMode ? <DisableDraftMode /> : null}
      </body>
    </html>
  );
}
