export default function PageShell({ chip, title, lead, children, align = 'left' }) {
  return (
    <section className="section">
      <div className="container">
        <div style={{
          maxWidth: align === 'center' ? 820 : 1000,
          margin: align === 'center' ? '0 auto' : '0',
          textAlign: align,
        }}>
          {chip && <p className="eyebrow no-line" style={{ marginBottom: 20 }}>{chip}</p>}
          <h1 className="display display-lg" dangerouslySetInnerHTML={{ __html: title }} />
          {lead && <p className="lead" style={{ marginTop: 22, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{lead}</p>}
        </div>
        {children && <div style={{ marginTop: 56 }}>{children}</div>}
      </div>
    </section>
  );
}
