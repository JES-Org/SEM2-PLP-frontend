import { useState } from 'react'
import { useMakeAttachmentMutation } from '@/store/announcement/announcementApi'
import {
    closeDialog,
    selectAnnouncementDialog,
} from '@/store/features/announcementDialogSlice'
import { selectAnnouncementId } from '@/store/features/announcementSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { FileUp, X } from 'lucide-react' // Added X icon
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'

const AttachmentDialog = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [makeAttachment, { isLoading, isError, error }] = 
        useMakeAttachmentMutation()
    const dialogType = useSelector(selectAnnouncementDialog)
    const dispatch = useDispatch()
    const currClassroomId = useSelector(selectCurrClassroomId)
    const currAnnouncementId = useSelector(selectAnnouncementId)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const onFileUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one file')
            return
        }

        const formData = new FormData()
        selectedFiles.forEach(file => {
            formData.append('attachments', file) // Fixed typo from 'attachements' to 'attachments'
        })

        try {
            await makeAttachment({
                classRoomId: currClassroomId,
                id: currAnnouncementId,
                formData,
            }).unwrap()
            
            toast.success('Files uploaded successfully')
            setSelectedFiles([])
            dispatch(closeDialog())
        } catch (err) {
            toast.error('Failed to upload files')
            console.error('Upload error:', err)
        }
    }

    return (
        <Dialog
            open={dialogType === 'file'}
            onOpenChange={() => {
                setSelectedFiles([])
                dispatch(closeDialog())
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Attachment</DialogTitle>
                    <DialogDescription>
                        Upload your files here. Max size: 5MB each.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    {/* File Upload Area */}
                    <div className="flex flex-col items-center space-y-2 p-4 border-2 border-dashed border-muted-foreground rounded-lg">
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            multiple
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col gap-2 items-center justify-center cursor-pointer"
                        >
                            <FileUp className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Click to browse or drag and drop files
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, DOCX, PPTX, JPG, PNG
                            </p>
                        </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Selected Files:</h4>
                            <ul className="space-y-2 max-h-40 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <li 
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between p-2 bg-muted rounded"
                                    >
                                        <span className="text-sm truncate max-w-[80%]">
                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                        </span>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button 
                        onClick={onFileUpload} 
                        disabled={isLoading || selectedFiles.length === 0}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AttachmentDialog
