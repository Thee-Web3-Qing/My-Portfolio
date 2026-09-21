// Decorative clay objects. Information and actions remain in the surrounding text.
export default function ClayArtifact({ kind, className = '' }) {
  return (
    <span className={`clay-object clay-object-${kind} ${className}`} aria-hidden="true">
      <span className="clay-object-body"><i /><i /><i /><b /></span>
    </span>
  )
}
