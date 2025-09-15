import "./globals.css";

export const metadata = {
  title: "Juxa — Open to hello",
  description: "Meet people right next to you—safely, with double-opt-in.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
