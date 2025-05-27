'use client'

import { useDispatch, useSelector } from 'react-redux'
import {
  closeDialog,
  selectStudentDialog,
} from '@/store/features/studentDialogSlice'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

import { useDeleteStudentAccountMutation } from '@/store/student/studentApi'

const StudentDeleteDialog = () => {
  const dispatch = useDispatch()
  const { isOpen, activeDialog } = useSelector(selectStudentDialog)
  const [deleteStudentAccount, { isLoading }] = useDeleteStudentAccountMutation()

  const onDelete = async () => {
    try {
      await deleteStudentAccount().unwrap()
      toast.success('Account deleted successfully')
      dispatch(closeDialog())
      window.location.href = '/' // or use router.push('/')
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  return (
    <Dialog
      open={isOpen && activeDialog === 'deleteAccount'}
      onOpenChange={() => dispatch(closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StudentDeleteDialog
