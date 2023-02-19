import { fetcher } from '@/lib/fetcher'
import { Domain } from '@prisma/client'
import { createRef, useRef, useState } from 'react'
import useSwr, { mutate } from 'swr'

export default function Domains() {
  const {
    data: domains,
    error,
    isLoading
  }: {
    data?: {
      db: Domain[]
    }
    error: any,
    isLoading: boolean
  } = useSwr('/api/domains', fetcher)

  const [addingDomain, setAddingDomain] = useState(false)
  const newDomainInput = createRef<HTMLInputElement>()

  return (
    <div className="w-full flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Domains</h1>
      <div className="w-full flex flex-col space-y-4">
        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load domains.</p>}
        {domains?.db.length ? domains.db.map(domain => (
          <div className="w-full flex flex-col space-y-4" key={domain.id}>
            <h2 className="text-2xl font-bold">{domain.domain}</h2>
          </div>
        )) : <p>No domains found.</p>}
        <div className="w-full flex flex-col space-y-4">
          {!addingDomain ? <div>
            <button
              role="button"
              className="bg-slate-900 hover:bg-slate-700 hover:text-white font-bold py-3 px-6 rounded transition-all text-xl"
              onClick={() => setAddingDomain(true)}>
              Add a domain
            </button>
          </div> : <form onSubmit={
            async (e) => {
              e.preventDefault()
              const domain = newDomainInput.current?.value
              if (!domain) return
              const res = await fetch(`/api/domain?domain=${domain}`, {
                method: 'POST'
              })
              console.log(await res.json())
              if (res.status === 200) {
                setAddingDomain(false)
              }
              mutate('/api/domains')
            }
          }>
            <input ref={newDomainInput} type="text" placeholder="cooldomain.com" className='bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded transition-all text-xl' />
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