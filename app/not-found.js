import MarketingPage from "./components/MarketingPage";

export default function NotFound() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-thank-you"><div className="marketing-container marketing-content-narrow"><p className="marketing-eyebrow">404 — Page Not Found</p><h1>This route is not available</h1><p className="marketing-lead">The page may have moved during the URL cleanup. Use the links below to continue.</p><div className="marketing-actions"><a className="marketing-button marketing-button-primary" href="/">Go to Home</a><a className="marketing-button marketing-button-secondary" href="/quote/">Get a Shipping Quote</a></div></div></section>
    </MarketingPage>
  );
}
