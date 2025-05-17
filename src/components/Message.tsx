// Message.tsx
import { forwardRef } from "react";
import { MessageType } from "@/types/Message";
import MarkdownRenderer from "./MarkdownRenderer";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface MessageProps extends MessageType {
  className?: string;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ text, sender, senderName, timestamp, className }, ref) => {
    const formattedTime = timestamp ? format(new Date(timestamp), 'h:mm a') : '';
    
    return (
      <div
        className={cn(
          'flex flex-col gap-1 w-full',
          {
            'items-start': sender === 'other',
            'items-end': sender === 'me',
          },
          className
        )}
      >
        {sender === 'other' && (
          <span className="text-xs text-gray-500 font-medium">
            {senderName}
          </span>
        )}
        <div
          ref={ref}
          className={cn(
            'rounded-lg p-3 text-sm md:max-w-lg w-fit',
            {
              'bg-gray-100': sender === 'other',
              'bg-primary text-white': sender === 'me',
            }
          )}
        >
          <MarkdownRenderer content={text} />
        </div>
        <span className={cn(
          'text-xs',
          {
            'text-gray-500': sender === 'other',
            'text-primary': sender === 'me',
          }
        )}>
          {formattedTime}
        </span>
      </div>
    );
  }
);

Message.displayName = 'Message';

export default Message;
