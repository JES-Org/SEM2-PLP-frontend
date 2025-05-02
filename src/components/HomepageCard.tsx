import React, { ReactNode } from 'react'
interface props{
    title: string, 
    description: string, 
    icon: React.ReactNode
}
const HomepageCard = ({title, description, icon}: props) => {
  return (
    <div>
       <a
        className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-blue-300/10 hover:shadow-blue-300/10"
        href="#"
      >
        <div className="size-10 text-blue-300">
         {icon}
        </div>

        <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>

        <p className="mt-1 text-sm text-gray-300">
         {description}
        </p>
      </a>
    </div>
  )
}

export default HomepageCard
