import "./globals.css";
import Navbar from "../components/Navbar";
export const metadata = {
  title: "APAAR-Verify | AICTE Smart Automation Platform",
  description: "Autonomous student data integrity and instant APAAR verification for AICTE-approved institutions. SIH26263.",
  icons: { icon: "/favicon.ico" }
};
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Government of India top strip */}
        <div className="gov-strip">
          🇮🇳 &nbsp;Government of India &nbsp;|&nbsp; Ministry of Education &nbsp;|&nbsp; All India Council for Technical Education (AICTE) &nbsp;|&nbsp;
          <a href="https://www.aicte-india.org" target="_blank" rel="noopener">aicte-india.org</a>
        </div>

        {/* Site Header */}
        <header className="site-header">
          <div className="site-header-inner">
            {/* Ashoka Emblem - SVG replica */}
            <svg className="gov-emblem" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="26" fill="#003087"/>
              <circle cx="26" cy="26" r="20" fill="none" stroke="#FFB347" strokeWidth="1.5"/>
              <circle cx="26" cy="26" r="4" fill="#FFB347"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => (
                <line key={i}
                  x1="26" y1="26"
                  x2={26 + 14 * Math.sin(deg * Math.PI/180)}
                  y2={26 - 14 * Math.cos(deg * Math.PI/180)}
                  stroke="#FFB347" strokeWidth="1" opacity="0.7"
                />
              ))}
              <text x="26" y="48" textAnchor="middle" fontSize="5" fill="#FFD4A8" fontWeight="bold">AICTE</text>
            </svg>

            <div className="site-branding">
              <h1>APAAR-Verify</h1>
              <p>SIH26263 · Smart Automation · AICTE National Regulator</p>
            </div>

            <div className="site-header-right">
              <div className="live-badge">LIVE SYSTEM</div>
            </div>
          </div>
        </header>

        {/* Navigation Bar with Live Session & Logout */}
        <Navbar />

        <main>{children}</main>

        <footer>
          <div className="footer-top">
            <a href="https://www.aicte-india.org" target="_blank" rel="noopener">AICTE</a>
            <a href="https://www.education.gov.in" target="_blank" rel="noopener">Ministry of Education</a>
            <a href="/verify">Verify Credential</a>
            <a href="/login">Login</a>
          </div>
          <div>
            SIH 2026 — Problem Statement SIH26263 · Smart Automation Theme · AICTE National Education Regulator<br/>
            Synthetic demonstration data only. Not an official Government of India product.
          </div>
        </footer>
      </body>
    </html>
  );
}
