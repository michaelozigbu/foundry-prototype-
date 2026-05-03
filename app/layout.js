import "./globals.css";

export const metadata = {
  title: "Foundry Finance",
  description: "A financial decision dashboard for solo SaaS founders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
