import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0b0d12] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
