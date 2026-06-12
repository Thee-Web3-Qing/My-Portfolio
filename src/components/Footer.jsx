export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="font-display text-2xl font-bold">
          Let's move <span className="text-electric">communities</span>.
        </p>
        <div className="flex gap-4 font-mono text-sm uppercase">
          <a href="mailto:qinglidah@gmail.com" className="hover:text-electric transition-colors">Email</a>
          <a href="https://x.com/QingTheCreator_" target="_blank" rel="noreferrer" className="hover:text-electric transition-colors">X (Main)</a>
          <a href="https://x.com/MsQingg" target="_blank" rel="noreferrer" className="hover:text-electric transition-colors">X (Alt)</a>
          <a href="https://www.linkedin.com/in/giwa-sheedah-164621279" target="_blank" rel="noreferrer" className="hover:text-electric transition-colors">LinkedIn</a>
        </div>
      </div>
      <p className="text-center font-mono text-xs text-mid pb-6">
        © {new Date().getFullYear()} — built for loud ideas, shipped everywhere.
      </p>
    </footer>
  )
}