import React from 'react'
import { UserRoundPlus } from 'lucide-react'
import AdminStudentList from '@/components/AdminStudentList'
const Page = () => {
  return (
    <div>
       <div className="flex justify-center item-center w-full space-x-3 my-6">
        <UserRoundPlus size={30} />
        <div className="mx-auto text-3xl font-bold">Teachers</div>
        </div>
        <AdminStudentList name='Shad'  department='Computer science'/>
    </div>
  )
}

export default Page
