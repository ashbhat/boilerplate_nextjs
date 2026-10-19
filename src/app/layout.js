import '../styles/global.css';

export const metadata = {
  title: 'Home',
  description: 'Hello World!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
