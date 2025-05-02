import { LandingPageItem } from '@/types/LandingPageItems';
import { BookCheck, CandlestickChart, FolderKanban, MessageCircle, ShieldCheck, Waypoints } from 'lucide-react';





export const LandingPageItems: LandingPageItem[] = [
	{
		title: 'Personalized Learning Path',
		description:
			'Our platform generates tailor-made learning paths for each student based on their unique queries and needs. By leveraging AI, we ensure that every learner receives a customized education experience that aligns with their personal learning style and pace.',
		icon: <Waypoints />,
	},
	{
		title: 'Interactive Assessments',
		description:
			'Students can take assessments directly within their virtual classrooms, benefiting from instant feedback and progress tracking. Teachers can create recurring checkpoint quizzes with automatic grading, helping to efficiently evaluate and enhance student performance.',
		icon: <BookCheck />,
	},
	{
		title: 'Classroom Management',
		description:
			'Teachers have comprehensive control over their classrooms. They can create, manage, and delete classrooms, monitor student activities, and oversee the learning process. This robust management system ensures a structured and effective teaching environment.',
		icon: <FolderKanban />,
	},
	{
		title: 'Detailed Learning Analytics',
		description:
			'Teachers gain valuable insights into student performance through detailed classroom statistics. Metrics such as mean, maximum, and range scores on assessments help identify areas where students excel or need additional support.',
		icon: <CandlestickChart />,
	},
	{
		title: 'Administrative Oversight',
		description:
			'Administrators have the ability to oversee all classrooms, monitor student and teacher activities, and maintain a high level of organization within the educational system. They can also communicate privately with teachers.',
		icon: <ShieldCheck />,
	},
	{
		title: 'Collaborative Communication',
		description:
			'Students and teachers can engage in dynamic discussions through our integrated forum. This feature promotes collaboration, allowing for the exchange of ideas, resources, and support, enhancing the overall learning experience.',
		icon: <MessageCircle />,
	},
]