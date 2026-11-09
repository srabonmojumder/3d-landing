import '@/styles/globals.scss';
import { SettingsProvider } from '@/context/SettingsContext';
import { ProductProvider } from '@/context/ProductContext';

export const metadata = {
  title: 'AEROVOID // TECHWEAR — 450 GSM Drop Shoulder Cyber Hoodie',
  description:
    'An architectural 450 GSM heavyweight drop-shoulder hoodie engineered with DWR hydrophobic shielding and an internal graphene thermal equilibrium matrix. Interactive 3D experience.',
  keywords: [
    'AEROVOID',
    'Techwear Hoodie',
    'Drop Shoulder Hoodie',
    '450 GSM',
    'Streetwear Bangladesh',
    '3D Clothing',
    'WebGL Fashion',
    'Three.js Scrollytelling',
  ],
  authors: [{ name: 'AEROVOID Studio' }],
  openGraph: {
    title: 'AEROVOID // TECHWEAR — 450 GSM Drop Shoulder Cyber Hoodie',
    description:
      'An architectural 450 GSM heavyweight drop-shoulder hoodie engineered with DWR hydrophobic shielding and graphene thermal matrix.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SettingsProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
