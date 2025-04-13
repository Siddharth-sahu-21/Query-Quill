// src/app/layout.jsx
import './globals.css'; // Import global styles (if you have Tailwind CSS or others)
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Query Quill',
  description: 'Advanced GraphQL Query Generator using the MERN stack',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
