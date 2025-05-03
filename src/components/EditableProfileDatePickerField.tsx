import React from 'react'

import { profileFieldItems } from '@/types/profileFieldItems'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface Props {
	ProfileFieldItems: profileFieldItems
}
const EditableProfileDatePickerField = ({ ProfileFieldItems }: Props) => {
	const [date, setDate] = React.useState<Date | null>(null);
  
	const handleDateSelect = (selectedDate: Date | undefined) => {
	  if (selectedDate) {
		setDate(selectedDate);
		ProfileFieldItems.onChange(format(selectedDate, 'yyyy-MM-dd')); // Passing the formatted date to parent
	  }
	};
  
	const handlePresetDateSelect = (value: string) => {
	  const daysToAdd = parseInt(value);
	  const newDate = addDays(new Date(), daysToAdd);
	  setDate(newDate);
	  ProfileFieldItems.onChange(format(newDate, 'yyyy-MM-dd')); // Passing the formatted preset date to parent
	};
  
	return (
	  <div className="flex flex-col space-y-3 md:w-5/12 w-11/12">
		<div className="flex items-center space-x-2">
		  <span>{ProfileFieldItems.icon}</span>
		  <span className="flex-grow whitespace-nowrap">{ProfileFieldItems.text}:</span>
		</div>
		<Popover>
		  <PopoverTrigger asChild>
			<Button
			  variant="outline"
			  className={cn('justify-start text-left font-normal py-7 w-full', !date && 'text-muted-foreground')}
			>
			  <CalendarIcon className="mr-2 h-4 w-4" />
			  {date ? format(date, 'PPP') : <span>{ProfileFieldItems.value}</span>}
			</Button>
		  </PopoverTrigger>
		  <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
			<Select onValueChange={handlePresetDateSelect}>
			  <SelectTrigger>
				<SelectValue placeholder="Select" />
			  </SelectTrigger>
			  <SelectContent position="popper">
				<SelectItem value="0">Today</SelectItem>
				<SelectItem value="1">Tomorrow</SelectItem>
				<SelectItem value="3">In 3 days</SelectItem>
				<SelectItem value="7">In a week</SelectItem>
			  </SelectContent>
			</Select>
			<div className="rounded-md border">
			  <Calendar mode="single" selected={date || undefined} onSelect={handleDateSelect} />
			</div>
		  </PopoverContent>
		</Popover>
	  </div>
	);
  };
  

export default EditableProfileDatePickerField
