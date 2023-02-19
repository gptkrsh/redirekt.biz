import { fetcher } from '@/lib/fetcher'
import { Domain, Redirect } from '@prisma/client'
import { createRef, useState } from 'react'
import useSwr, { mutate } from 'swr'

export default function Redirects() {
  const {
    data: domains,
    error: domainError,
    isLoading: areDomainsLoading
  }: {
    data?: {
      db: Domain[]
    }
    error: any,
    isLoading: boolean
  } = useSwr('/api/domains', fetcher)

  const [addingRedirect, setAddingRedirect] = useState(false)
  const targetUrlInput = createRef<HTMLInputElement>()
  const domainSelectInput = createRef<HTMLSelectElement>()

  const {
    data: redirects,
    error,
    isLoading
  }: {
    data?: Redirect[]
    error: any,
    isLoading: boolean
  } = useSwr('/api/redirects', fetcher)

  return (
    <div className="w-full flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Redirects</h1>
      <div className="w-full flex flex-col space-y-4">
        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load redirects.</p>}
        {redirects?.length ? redirects.map(redirect => (
          <div className="w-full flex flex-col space-y-4" key={redirect.id}>
            <h2 className="text-2xl font-bold">{redirect.domainUrl} - {redirect.targetUrl}</h2>
          </div>
        )) : <p>No redirects found.</p>}
        <div className="w-full flex flex-col space-y-4">
          {!addingRedirect ? <div>
            <button
              role="button"
              className="bg-slate-900 hover:bg-slate-700 hover:text-white font-bold py-3 px-6 rounded transition-all text-xl"
              onClick={() => setAddingRedirect(true)}>
              Add a redirect
            </button>
          </div> : <form onSubmit={
            async (e) => {
              e.preventDefault()
              const targetUrl = targetUrlInput.current?.value
              const domain = domainSelectInput.current?.value
              if (!targetUrl || !domain) return
              const res = await fetch(`/api/redirect?targetUrl=${targetUrl}&domain=${domain}`, {
                method: 'POST'
              })
              console.log(await res.json())
              if (res.status === 200) {
                setAddingRedirect(false)
              }
              mutate('/api/redirects')
            }
          }>
            <select ref={domainSelectInput} name="domains" className='bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded transition-all text-xl'>
              {domains?.db.map((d) => (
                <option key={d.id}>{d.domain}</option>
              ))}
            </select>
            <input ref={targetUrlInput} type="text" placeholder="https://targeturl.com" className='bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded transition-all text-xl' />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700 hover:text-white font-bold py-3 px-6 rounded transition-all text-xl">
              Add
            </button>
          </form>}
        </div>
      </div>
    </div>
  )
}