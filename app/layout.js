import './globals.css';

export const metadata = {
  title: 'Cookie Mini Website Builder Pro',
  description: 'Build and publish simple business websites.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="projectOwnerFooter" aria-label="Cookie Mini Website Builder ownership footer">
          <div className="ownerFooterBadge" aria-hidden="true">C</div>
          <div className="ownerFooterText">
            <strong>Owned and operated by Cookies Digital Creations</strong>
            <span>Cookie Mini Website Builder Pro helps creators, entrepreneurs, and small businesses build, launch, and grow their websites online.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
