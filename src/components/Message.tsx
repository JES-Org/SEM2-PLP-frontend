import { forwardRef } from "react";
import { MessageType } from "@/types/Message";
import MarkdownRenderer from "./MarkdownRenderer";
import { cn } from "@/lib/utils";

interface MessageProps extends MessageType {
  className?: string;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({ text, sender, className }, ref) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-2', 
        {
          'items-start': sender === 'other',
          'items-end': sender === 'me',
        },
        className
      )}
    >
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-3 text-sm md:max-w-lg', 
          {
            'bg-gray-100': sender === 'other',
            'bg-primary text-white': sender === 'me',
          },
          className
        )}
      >
        <MarkdownRenderer content={text}></MarkdownRenderer>
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default Message;
