import React, { useState } from 'react'
import AdminNavBar from '../../components/AdminNavBar'

export default function AdminActionPage() {
  const [contentMessage, setContentMessage] = useState('')
  const [auditLogs, setAuditLogs] = useState([])
  const [loadingAction, setLoadingAction] = useState(null)

  function addLog(text) {
    const entry = { text, time: new Date().toLocaleString() }
    setAuditLogs((s) => [entry, ...s])
  }

  function runAction(key, contentText, logText) {
    setLoadingAction(key)
    setTimeout(() => {
      setContentMessage(contentText)
      addLog(logText)
      setLoadingAction(null)
      setTimeout(() => setContentMessage(''), 5000)
    }, 800)
  }

  function handleDisable() {
    runAction('disable', 'Account has been disabled.', 'Disable account performed')
  }

  function handleRemove() {
    runAction('remove', 'Selected content has been removed.', 'Remove content performed')
  }

  function handleRetrieve() {
    runAction('retrieve', 'Account data retrieved.', 'Retrieve account performed')
  }

  function handleReset() {
    runAction('reset', 'Password reset link has been sent.', 'Password reset initiated')
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 flex flex-col items-center">
      <div className="w-full">
        <AdminNavBar />
      </div>

      {/* Center Wrapper */}
      <div className="w-full max-w-4xl mt-8 px-6 flex flex-col items-center" style={{ '--action-h': '80px', '--box-h': '300px' }}>

        {/* Action Box */}
        <div className="bg-gray-200 text-gray-900 rounded-2xl p-8 shadow-lg max-w-4xl w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Action</h2>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full justify-items-center max-w-3xl mx-auto">

            {/* Left Buttons */}
            <div className="flex flex-col items-start space-y-4">
              <button onClick={handleDisable} disabled={!!loadingAction} className="flex items-center gap-4 bg-white py-4 px-3 rounded shadow-md w-full justify-start" style={{ height: 'var(--action-h)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded">
                  {loadingAction === 'disable' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636zM12 12v.01" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold">Disable Account</span>
              </button>

              <button onClick={handleRemove} disabled={!!loadingAction} className="flex items-center gap-4 bg-white py-4 px-3 rounded shadow-md w-full justify-start" style={{ height: 'var(--action-h)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded">
                  {loadingAction === 'remove' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 2a1 1 0 00-1 1v1H5a1 1 0 000 2h14a1 1 0 100-2h-3V3a1 1 0 00-1-1H9z" />
                      <path d="M4 7h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold">Remove Content</span>
              </button>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col items-start space-y-4">
              <button onClick={handleRetrieve} disabled={!!loadingAction} className="flex items-center gap-4 bg-white py-4 px-3 rounded shadow-md w-full justify-start" style={{ height: 'var(--action-h)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded">
                  {loadingAction === 'retrieve' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 10-8 0v3H5l7 7 7-7h-3V7z" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold">Retrieve Account</span>
              </button>

              <button onClick={handleReset} disabled={!!loadingAction} className="flex items-center gap-4 bg-white py-4 px-3 rounded shadow-md w-full justify-start" style={{ height: 'var(--action-h)' }}>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded">
                  {loadingAction === 'reset' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3 1.343 3 3v1H9v-1c0-1.657 1.343-3 3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold">Reset Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Boxes */}
        <div className="mt-12 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div>
            <h3 className="text-gray-200 mb-3 font-semibold">Content</h3>
            <div className="bg-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center justify-center" style={{ height: 'var(--box-h)' }}>
              {contentMessage ? (
                <div className="flex flex-col items-center">
                  <p className="text-gray-800 font-medium mb-2">{contentMessage}</p>
                  <button onClick={() => setContentMessage('')} className="mt-2 text-sm px-3 py-1 bg-gray-800 text-white rounded">Dismiss</button>
                </div>
              ) : (
                <p className="text-gray-600">No recent activity</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-gray-200 mb-3 font-semibold">Audit Log</h3>
            <div className="bg-gray-300 rounded-lg shadow-md p-4 overflow-auto text-left" style={{ height: 'var(--box-h)' }}>
              {auditLogs.length === 0 ? (
                <p className="text-gray-600">No audit entries</p>
              ) : (
                <ul className="space-y-3">
                  {auditLogs.map((l, i) => (
                    <li key={i}>
                      <div className="font-medium text-gray-800">{l.text}</div>
                      <div className="text-sm text-gray-600">{l.time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
