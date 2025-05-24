import {
  useDeleteLearningPathMutation,
} from '@/store/chatbot/chatbotApi';

import {
  closeDialog,
  selectLearningPathDialog,
} from '@/store/features/learningPathDialogSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const LearningPathDeleteDialog = () => {
  const dispatch = useDispatch();
  const { isOpen, activeDialog, learningPathId } = useSelector(selectLearningPathDialog);

  const [deleteLearningPath, { isLoading }] = useDeleteLearningPathMutation();

  const onDelete = async () => {
    try {
      await deleteLearningPath(learningPathId!).unwrap();
      toast.success('Learning path deleted successfully');
      dispatch(closeDialog());
    } catch (error) {
      toast.error('Failed to delete learning path');
    }
  };

  return (
    <Dialog
      open={isOpen && activeDialog === 'delete'}
      onOpenChange={() => dispatch(closeDialog())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Learning Path</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this learning path?
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='destructive'
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearningPathDeleteDialog;
