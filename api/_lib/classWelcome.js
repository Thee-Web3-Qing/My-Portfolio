import { createHash, randomUUID } from 'node:crypto'

export const CLASSROOM_URL = 'https://the-classroom-qing.vercel.app/'
export const TELEGRAM_GROUP_URL = 'https://t.me/+H9UCWQmbDAY2MjZk'
export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/Lq23lxSEAJKIJFiktwu5lx?s=cl&p=i&iam=2'

const makeId = prefix => prefix + '_' + randomUUID().replace(/-/g, '').slice(0, 20)
const activationCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `QING-${part()}-${part()}`
}
const hashCode = value => createHash('sha256').update(value.trim().toUpperCase()).digest('hex')
const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
}[character]))

async function ensureRegistrationAccess(sql, reference) {
  let rows = await sql`
    SELECT * FROM class_registrations WHERE payment_reference=${reference} LIMIT 1
  `
  if (!rows.length) return null
  let registration = rows[0]

  if (!registration.student_access_code) {
    const code = activationCode()
    const claimed = await sql`
      UPDATE class_registrations
      SET student_access_code=${code}, payment_status='confirmed', approved_at=COALESCE(approved_at,now()), updated_at=now()
      WHERE id=${registration.id} AND student_access_code IS NULL
      RETURNING *
    `
    registration = claimed[0] || (await sql`SELECT * FROM class_registrations WHERE id=${registration.id} LIMIT 1`)[0]
  }

  const existingProfiles = await sql`
    SELECT id,student_code FROM classroom_profiles
    WHERE lower(email)=lower(${registration.email}) OR phone=${registration.whatsapp}
    ORDER BY created_at ASC LIMIT 1
  `
  const proposedStudentId = existingProfiles[0]?.id || makeId('stu')
  const proposedStudentCode = existingProfiles[0]?.student_code || `QC-${randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`
  const identity = await sql`
    UPDATE class_registrations
    SET classroom_student_id=COALESCE(classroom_student_id,${proposedStudentId}),
        classroom_student_code=COALESCE(classroom_student_code,${proposedStudentCode}),
        payment_status='confirmed', approved_at=COALESCE(approved_at,now()), updated_at=now()
    WHERE id=${registration.id}
    RETURNING *
  `
  registration = identity[0]
  const studentId = registration.classroom_student_id
  const studentCode = registration.classroom_student_code

  await sql`
    INSERT INTO classroom_profiles (id,student_code,name,email,phone,status,created_at)
    VALUES (${studentId},${studentCode},${registration.full_name},${registration.email},${registration.whatsapp},'active',now())
    ON CONFLICT (id) DO UPDATE SET
      name=EXCLUDED.name,email=EXCLUDED.email,phone=EXCLUDED.phone,status='active'
  `
  await sql`
    INSERT INTO classroom_enrollments (id,student_id,course_id,status,approved_at)
    VALUES (${makeId('enr')},${studentId},'vibecoding-01','active',now())
    ON CONFLICT (student_id,course_id) DO UPDATE SET status='active',approved_at=COALESCE(classroom_enrollments.approved_at,now())
  `
  await sql`
    INSERT INTO classroom_access_codes
      (id,registration_id,student_id,code_hash,code_hint,status,expires_at,created_at)
    VALUES
      (${makeId('code')},${String(registration.id)},${studentId},${hashCode(registration.student_access_code)},
       ${registration.student_access_code.slice(-4)},'unused',now()+interval '14 days',now())
    ON CONFLICT (registration_id) DO UPDATE SET
      student_id=EXCLUDED.student_id,
      code_hash=CASE WHEN classroom_access_codes.status='redeemed' THEN classroom_access_codes.code_hash ELSE EXCLUDED.code_hash END,
      code_hint=CASE WHEN classroom_access_codes.status='redeemed' THEN classroom_access_codes.code_hint ELSE EXCLUDED.code_hint END,
      status=CASE WHEN classroom_access_codes.status='redeemed' THEN 'redeemed' ELSE 'unused' END,
      expires_at=CASE WHEN classroom_access_codes.status='redeemed' THEN classroom_access_codes.expires_at ELSE EXCLUDED.expires_at END
  `
  await sql`
    INSERT INTO classroom_lesson_progress (id,student_id,lesson_id,status)
    SELECT 'prg_' || substr(md5(${studentId} || ':l' || lesson_number::text),1,20),
           ${studentId}, 'l' || lesson_number::text,
           CASE WHEN lesson_number=1 THEN 'available' ELSE 'locked' END
    FROM generate_series(1,20) AS lessons(lesson_number)
    ON CONFLICT (student_id,lesson_id) DO NOTHING
  `
  return registration
}

function welcomeEmail(registration) {
  const name = escapeHtml(String(registration.full_name || '').trim().split(/\s+/)[0] || 'there')
  const code = escapeHtml(registration.student_access_code)
  const text = `Hi ${name},\n\nYour payment for The Classroom has been confirmed.\n\nYour access code: ${registration.student_access_code}\nClassroom: ${CLASSROOM_URL}\nTelegram group: ${TELEGRAM_GROUP_URL}\nWhatsApp group: ${WHATSAPP_GROUP_URL}\n\nPlease activate your code within 14 days. After joining the Telegram and WhatsApp groups, send Qing a message with your full name and the email you used for payment so she can confirm that you are fully set up.\n\nSee you in class,\nQing`
  const html = `<!doctype html><html><body style="margin:0;background:#fff8f6;color:#271c21;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:32px 20px"><div style="background:#731333;border-radius:24px;padding:28px;color:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;font-weight:700">THE CLASSROOM</p><h1 style="margin:0;font-family:Georgia,serif;font-size:34px">Your access is ready.</h1></div><div style="background:#fff;border:1px solid #ead7dd;border-radius:24px;padding:28px;margin-top:16px"><p style="font-size:17px;line-height:1.6">Hi ${name},</p><p style="font-size:17px;line-height:1.6">Your payment has been confirmed. Use the code below to activate your Classroom account.</p><div style="background:#fff0f4;border:1px solid #efcbd6;border-radius:16px;padding:22px;text-align:center;margin:24px 0"><span style="display:block;font-size:12px;letter-spacing:1.5px;font-weight:700;color:#731333;margin-bottom:8px">YOUR ACCESS CODE</span><strong style="font-family:monospace;font-size:27px;letter-spacing:2px;color:#731333">${code}</strong></div><p style="font-size:14px;color:#755f67;line-height:1.5">Activate this code within 14 days.</p><a href="${CLASSROOM_URL}" style="display:block;background:#731333;color:#fff;text-decoration:none;text-align:center;padding:16px;border-radius:12px;font-weight:700;margin:22px 0 12px">Open The Classroom</a><a href="${TELEGRAM_GROUP_URL}" style="display:block;background:#229ED9;color:#fff;text-decoration:none;text-align:center;padding:16px;border-radius:12px;font-weight:700">Join the Telegram group</a><a href="${WHATSAPP_GROUP_URL}" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;padding:16px;border-radius:12px;font-weight:700;margin-top:12px">Join the WhatsApp group</a><p style="font-size:16px;line-height:1.6;margin-top:24px">After joining the Telegram and WhatsApp groups, please send Qing a message with your full name and the email you used for payment so she can confirm that you are fully set up.</p><p style="font-size:16px;line-height:1.6;margin-bottom:0">See you in class,<br><strong>Qing</strong></p></div></div></body></html>`
  return { text, html }
}

async function deliverWelcomeEmail(registration) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is unavailable')
  const message = welcomeEmail(registration)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      from: process.env.CLASSROOM_EMAIL_FROM || 'The Classroom <classroom@qingthecreator.xyz>',
      to: [registration.email],
      reply_to: 'qinglidah@gmail.com',
      subject: 'Your Classroom access code is ready',
      html: message.html,
      text: message.text,
    }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.id) throw new Error(payload.message || `Resend returned ${response.status}`)
  return payload.id
}

export async function finalizeClassWelcome(sql, reference) {
  const registration = await ensureRegistrationAccess(sql, reference)
  if (!registration) return { accessReady: false, welcomeEmailSent: false }
  if (registration.welcome_email_sent_at) return { accessReady: true, welcomeEmailSent: true }

  const claimed = await sql`
    UPDATE class_registrations
    SET welcome_email_claimed_at=now(),welcome_email_error=NULL,updated_at=now()
    WHERE id=${registration.id} AND welcome_email_sent_at IS NULL
      AND (welcome_email_claimed_at IS NULL OR welcome_email_claimed_at < now()-interval '10 minutes')
    RETURNING id
  `
  if (!claimed.length) {
    const state = await sql`SELECT welcome_email_sent_at FROM class_registrations WHERE id=${registration.id}`
    return { accessReady: true, welcomeEmailSent: Boolean(state[0]?.welcome_email_sent_at) }
  }
  try {
    const emailId = await deliverWelcomeEmail(registration)
    await sql`
      UPDATE class_registrations SET welcome_email_sent_at=now(),welcome_email_id=${emailId},
        welcome_email_error=NULL,updated_at=now() WHERE id=${registration.id}
    `
    return { accessReady: true, welcomeEmailSent: true }
  } catch (error) {
    const detail = String(error?.message || error || 'Email delivery failed').slice(0, 500)
    await sql`
      UPDATE class_registrations SET welcome_email_claimed_at=NULL,welcome_email_error=${detail},updated_at=now()
      WHERE id=${registration.id}
    `
    console.error('Class welcome email failed', { reference, detail })
    return { accessReady: true, welcomeEmailSent: false }
  }
}
