import React from 'react'
import { Users } from 'lucide-react'
import { Card, CardContent } from './ui/card'
interface props {
     name: string;
}
const AdminCard = ({name}:props) => {
  return (
    <div>
      <Card className='flex items-center  font-bold pt-4'>
        <CardContent className='flex space-x-2'>   
                <Users />
                <span>{name}</span>
        </CardContent>
        
        
      </Card>
    </div>
  )
}

export default AdminCard
