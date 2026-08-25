import { useEffect, useState } from 'react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vvniehpzrvgmjdatpxrl.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__XVIsG1KQFChirhMMii7rg_dGp-dpYN'

const rpc = async (name, payload) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

const statusCopy = {
  pending: 'Submitted for Qing’s review.',
  passed: 'Passed. The next lesson is unlocked.',
  failed: 'Please correct the task and submit it again.',
}

export default function Classroom() {
  const [credentials, setCredentials] = useState({ whatsapp: '', code: '' })
  const [classroom, setClassroom] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('qing-classroom-access')
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      setCredentials(parsed)
      void openClassroom(parsed)
    } catch {
      localStorage.removeItem('qing-classroom-access')
    }
  }, [])

  const openClassroom = async (details = credentials) => {
    setLoading(true)
    setMessage('')
    try {
      const data = await rpc('get_student_classroom', { p_whatsapp: details.whatsapp, p_code: details.code })
      setClassroom(data)
      localStorage.setItem('qing-classroom-access', JSON.stringify(details))
    } catch {
      setClassroom(null)
      setMessage('The WhatsApp number or access code is incorrect, or the payment has not been approved yet.')
    } finally {
      setLoading(false)
    }
  }

  const submitAssignment = async (lesson) => {
    const draft = drafts[lesson.id] || {}
    setLoading(true)
    setMessage('')
    try {
      const data = await rpc('submit_class_assignment', {
        p_whatsapp: credentials.whatsapp,
        p_code: credentials.code,
        p_lesson_id: lesson.id,
        p_repository_url: draft.repositoryUrl || lesson.submission?.repositoryUrl || '',
        p_commit_url: draft.commitUrl || lesson.submission?.commitUrl || '',
        p_notes: draft.notes || '',
      })
      setClassroom(data)
      setMessage('Your assignment has been submitted for review.')
    } catch (error) {
      const text = error.message || ''
      setMessage(text.includes('VALID_GITHUB_COMMIT_REQUIRED') ? 'Add a valid GitHub commit link.' : text.includes('VALID_GITHUB_REPOSITORY_REQUIRED') ? 'Add a valid GitHub repository link.' : 'The assignment could not be submitted. Please check the links and try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('qing-classroom-access')
    setClassroom(null)
    setCredentials({ whatsapp: '', code: '' })
  }

  if (!classroom) return (
    <div className="class-page relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-h-screen">
      <main className="max-w-xl mx-auto px-6 py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[.25em] text-red-500">Qing’s student classroom</p>
        <h1 className="class-display text-5xl sm:text-7xl font-bold mt-4">Build one product, lesson by lesson.</h1>
        <p className="text-[#b9afa3] mt-5 text-lg">The class begins on October 1, 2026. Approved students can enter with the WhatsApp number used during registration and the access code in their invitation.</p>
        <form onSubmit={(event) => { event.preventDefault(); void openClassroom() }} className="class-panel p-6 sm:p-8 mt-10 space-y-5">
          <label className="block"><span className="block text-sm mb-2">WhatsApp number</span><input className="class-field" required inputMode="tel" value={credentials.whatsapp} onChange={(event) => setCredentials((current) => ({ ...current, whatsapp: event.target.value }))} placeholder="0812 432 0659" /></label>
          <label className="block"><span className="block text-sm mb-2">Student access code</span><input className="class-field uppercase" required value={credentials.code} onChange={(event) => setCredentials((current) => ({ ...current, code: event.target.value.toUpperCase() }))} placeholder="QING1234" /></label>
          {message && <p className="text-sm text-red-300">{message}</p>}
          <button disabled={loading} className="w-full rounded-full bg-red-600 px-6 py-4 font-mono text-sm uppercase font-bold disabled:opacity-50">{loading ? 'Checking access…' : 'Enter classroom'}</button>
        </form>
      </main>
    </div>
  )

  const passed = classroom.lessons.filter((lesson) => lesson.submission?.status === 'passed').length
  return (
    <div className="class-page relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex flex-wrap justify-between gap-5 items-start"><div><p className="font-mono text-xs uppercase tracking-[.25em] text-red-500">Student classroom</p><h1 className="class-display text-4xl sm:text-6xl font-bold mt-3">Welcome, {classroom.student.name}.</h1><p className="text-[#b9afa3] mt-3">Complete each assignment to unlock the next lesson.</p></div><button onClick={logout} className="border border-[#f5eddf]/30 rounded-full px-5 py-2 text-sm">Log out</button></div>
        <div className="class-panel p-5 mt-8"><div className="flex justify-between text-sm"><span>{passed} of {classroom.lessons.length} lessons passed</span><span>Starts October 1, 2026</span></div><div className="h-2 bg-black mt-3"><span className="block h-full bg-red-600" style={{ width: `${classroom.lessons.length ? passed / classroom.lessons.length * 100 : 0}%` }} /></div></div>
        {message && <p className="border border-red-900 bg-red-950/30 p-4 mt-6">{message}</p>}
        {!classroom.lessons.length && <section className="class-panel p-8 mt-8"><h2 className="text-2xl font-bold">Lessons are being prepared.</h2><p className="text-[#b9afa3] mt-2">Your recorded lessons will appear here when Qing publishes them.</p></section>}
        <div className="space-y-6 mt-8">{classroom.lessons.map((lesson) => {
          const submission = lesson.submission
          const locked = lesson.locked
          const canResubmit = !submission || submission.status === 'failed'
          return <article key={lesson.id} className={`class-panel p-6 sm:p-8 ${locked ? 'opacity-55' : ''}`}>
            <div className="flex flex-wrap justify-between gap-4"><div><span className="font-mono text-xs text-red-500">LESSON {String(lesson.lessonNumber).padStart(2, '0')}</span><h2 className="text-2xl sm:text-3xl font-bold mt-2">{lesson.title}</h2></div><span className="font-mono text-xs uppercase border border-[#f5eddf]/20 px-3 py-2 h-fit">{locked ? 'Locked' : submission?.status || 'Open'}</span></div>
            <p className="text-[#b9afa3] mt-4">{lesson.summary}</p>
            {!locked && <>
              {lesson.videoUrl ? <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-[#f5eddf] text-black px-5 py-3 font-bold mt-5">Watch lesson</a> : <p className="text-sm text-[#948a7e] mt-5">The recorded lesson will be added before the class begins.</p>}
              <div className="border-t border-[#f5eddf]/15 mt-6 pt-6"><span className="font-mono text-xs text-red-500">ASSIGNMENT · {lesson.deadlineDays} {lesson.deadlineDays === 1 ? 'DAY' : 'DAYS'}</span><h3 className="text-xl font-bold mt-2">{lesson.assignmentTitle}</h3><p className="text-[#b9afa3] mt-2">{lesson.assignmentPrompt}</p></div>
              {submission && <div className={`mt-5 p-4 border ${submission.status === 'passed' ? 'border-green-800 bg-green-950/25' : submission.status === 'failed' ? 'border-red-800 bg-red-950/25' : 'border-amber-800 bg-amber-950/25'}`}><b>{statusCopy[submission.status]}</b>{submission.feedback && <p className="text-sm mt-2">Qing’s feedback: {submission.feedback}</p>}</div>}
              {canResubmit && <div className="grid gap-4 mt-5"><input className="class-field" placeholder="GitHub repository link" defaultValue={submission?.repositoryUrl || ''} onChange={(event) => setDrafts((current) => ({ ...current, [lesson.id]: { ...current[lesson.id], repositoryUrl: event.target.value } }))} />{lesson.submissionType === 'commit' && <input className="class-field" placeholder="Final GitHub commit link" defaultValue={submission?.commitUrl || ''} onChange={(event) => setDrafts((current) => ({ ...current, [lesson.id]: { ...current[lesson.id], commitUrl: event.target.value } }))} />}<textarea className="class-field min-h-24" placeholder="Optional notes about what you built" onChange={(event) => setDrafts((current) => ({ ...current, [lesson.id]: { ...current[lesson.id], notes: event.target.value } }))} /><button disabled={loading} onClick={() => void submitAssignment(lesson)} className="rounded-full bg-red-600 px-5 py-3 font-mono text-sm uppercase font-bold disabled:opacity-50">{submission?.status === 'failed' ? 'Resubmit corrected task' : 'Submit assignment'}</button></div>}
            </>}
          </article>
        })}</div>
      </main>
    </div>
  )
}
