import "./globals.css";
export const metadata = { title: "Realistic Mart", description: "Discover everyday essentials at Realistic Mart." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
