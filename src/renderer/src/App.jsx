import { useEffect, useState } from 'react'

export default function App() {
  const [version, setVersion] = useState('...')
  const [status, setStatus] = useState('Waiting...')
  const [updateReady, setUpdateReady] = useState(false)

  useEffect(() => {
    if (!window.appInfo) {
      setVersion('1.0.0')
      setStatus('Open this screen inside the Electron window.')
      return
    }

    window.appInfo.version().then(setVersion)

    const stopStatus = window.appInfo.onStatus(setStatus)
    const stopReady = window.appInfo.onUpdateReady(() => setUpdateReady(true))

    return () => {
      stopStatus()
      stopReady()
    }
  }, [])

  return (
    <main>
      <p className="eyebrow">FLYXTO</p>
      <h1>Version R2</h1>
      <p className="version">Installed version {version}</p>
      <p className="status">{status}</p>
      {updateReady && (
        <button type="button" onClick={() => window.appInfo.installUpdate()}>
          Restart to update
        </button>
      )}
    </main>
  )
}
