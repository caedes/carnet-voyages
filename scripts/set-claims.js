import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(
  readFileSync(new URL('./service-account-key.json', import.meta.url), 'utf8'),
)

initializeApp({ credential: cert(serviceAccount) })

const db = getFirestore()
const auth = getAuth()

async function main() {
  const snapshot = await db.collection('family').get()

  if (snapshot.empty) {
    console.log('No family members found in Firestore.')
    return
  }

  for (const doc of snapshot.docs) {
    const { email, name } = doc.data()
    try {
      const user = await auth.getUserByEmail(email)
      await auth.setCustomUserClaims(user.uid, { familyMember: true })
      console.log(`✓ ${name} (${email}) — claim set`)
    } catch (error) {
      console.error(`✗ ${name} (${email}) — ${error.message}`)
    }
  }

  console.log('\nDone. Users must sign out and sign back in for claims to take effect.')
}

main()
