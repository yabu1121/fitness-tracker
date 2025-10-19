// 環境変数の検証
export function validateEnv() {
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or Vercel environment variables.'
    )
  }
}

// ビルド時に環境変数を検証
if (process.env.NODE_ENV !== 'development') {
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
  }
}

