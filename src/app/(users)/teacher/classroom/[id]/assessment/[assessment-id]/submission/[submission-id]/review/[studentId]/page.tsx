// @ts-nocheck
'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Edit3, Save, MessageSquareText, ArrowLeft } from 'lucide-react'

import {
    useGetQuestionsQuery, // To get all assessment questions, types, model answers
    useSingleAssessmentScoreQuery, // To get student's submitted answers and current score
    // ---- NEW MUTATION NEEDED ----
    useGradeShortAnswersMutation, // You'll need to create this
} from '@/store/assessment/assessmentApi'
import { useGetStudentByStudentIdQuery } from '@/store/student/studentApi' // Assuming you have this
import { AssessmentQuestion, AssessmentAnswer as AnswerOptionType } from '@/types/assessment/assessment.type'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // For score input
import { Textarea } from '@/components/ui/textarea' // For displaying student's short answer
import Spinner from '@/components/Spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'


const ReviewStudentSubmissionPage = () => {
    const router = useRouter()
    const pathSegments = usePathname().split('/')
    const currClassroomId = pathSegments[pathSegments.indexOf('classroom') + 1]
    const currAssessmentId = pathSegments[pathSegments.indexOf('assessment') + 1]
    const studentId = pathSegments[pathSegments.indexOf('review') + 1]
    const submissionId = pathSegments[pathSegments.indexOf('submission') + 1];


    const { data: studentInfo, isLoading: isLoadingStudent } = useGetStudentByStudentIdQuery(studentId, { skip: !studentId });

    const {
        data: assessmentData, // Contains all questions, options, model_answers, weights
        isLoading: isLoadingAssessment,
        isError: isErrorAssessment,
    } = useGetQuestionsQuery(
        { classroomId: currClassroomId, assessmentId: currAssessmentId },
        { skip: !currClassroomId || !currAssessmentId }
    );

    const {
        data: submissionQueryData, // Contains student's answers map and auto-calculated score
        isLoading: isLoadingSubmission,
        isError: isErrorSubmission,
        refetch: refetchSubmission,
    } = useSingleAssessmentScoreQuery(
        { classroomId: currClassroomId, assessmentId: currAssessmentId, studentId },
        { skip: !currClassroomId || !currAssessmentId || !studentId }
    );

    const [gradeShortAnswers, { isLoading: isGrading }] = useGradeShortAnswersMutation();

    const fetchedQuestions: AssessmentQuestion[] = assessmentData?.data?.questions || [];
    const submissionData = submissionQueryData?.data; // This is CheckAnswerResponseData
    const studentAnswersMap: Record<string, string> = submissionData?.answers || {};

    const [manualScores, setManualScores] = useState<Record<string, number | null>>({});

    const baseMcqScore = useMemo(() => {
        if (!fetchedQuestions.length || Object.keys(studentAnswersMap).length === 0) {
            return 0;
        }
        let score = 0;
        fetchedQuestions.forEach(q => {
            if (q.question_type === 'multiple_choice') {
                const studentAnswerId = studentAnswersMap[q.id];
                const correctAnswer = q.answers.find(opt => opt.is_correct);
                if (correctAnswer && studentAnswerId === String(correctAnswer.id)) {
                    score += q.weight || 0;
                }
            }
        });
        // console.log("Calculated baseMcqScore:", score);
        return score;
    }, [fetchedQuestions, studentAnswersMap]);

    useEffect(() => {
        if (submissionData) {
            const initialManual: Record<string, number | null> = {};
            let calculatedMcqScore = 0;

            fetchedQuestions.forEach(q => {
                if (q.question_type === 'short_answer') {
                    initialManual[q.id] = submissionData.graded_details?.[q.id] ?? null;
                } else if (q.question_type === 'multiple_choice') {
                    const studentAnswerId = studentAnswersMap[q.id];
                    const correctAnswer = q.answers.find(opt => opt.is_correct);
                    if (correctAnswer && studentAnswerId === String(correctAnswer.id)) {
                        calculatedMcqScore += q.weight || 0;
                    }
                }
            });
            setManualScores(initialManual);

        } else if (fetchedQuestions.length > 0) {
            const initialNullScores: Record<string, number | null> = {};
            fetchedQuestions.forEach(q => {
                if (q.question_type === 'short_answer') {
                    initialNullScores[q.id] = null;
                }
            });
            setManualScores(initialNullScores);
        }
    }, [submissionData, fetchedQuestions]);


    const handleManualScoreChange = (questionId: string, score: string, maxWeight: number) => {
        const numericScore = parseInt(score, 10);
        if (!isNaN(numericScore) && numericScore >= 0 && numericScore <= maxWeight) {
            setManualScores(prev => ({ ...prev, [questionId]: numericScore }));
        } else if (score === '') {
            setManualScores(prev => ({ ...prev, [questionId]: null }));
        }
    };

    const calculatedTotalScore = useMemo(() => {
        let total = baseMcqScore;
        fetchedQuestions.forEach(q => {
            if (q.question_type === 'short_answer' && manualScores[q.id] !== null && manualScores[q.id] !== undefined) {
                total += manualScores[q.id]!;
            }
        });
        return total;
    }, [baseMcqScore, manualScores]);


    const handleSaveGrades = async () => {
        const scoresToSubmit: Record<string, number> = {};
        let allShortAnswersGradedOrZero = true;

        fetchedQuestions.forEach(q => {
            if (q.question_type === 'short_answer') {
                const score = manualScores[q.id];
                if (score === null || score === undefined) { 
                    scoresToSubmit[q.id] = 0;
                } else {
                    scoresToSubmit[q.id] = score;
                }
            }
        });

        try {
            const payload = {
                submissionId: submissionData?.id, // You need the submission ID
                classroomId: currClassroomId,
                assessmentId: currAssessmentId,
                studentId: studentId,
                question_scores: scoresToSubmit,
            };
            // console.log("Payload for grading:", payload);
            const result = await gradeShortAnswers(payload).unwrap();
            if (result.isSuccess) {
                toast.success("Grades saved successfully!");
                refetchSubmission(); // Refetch the submission to get the updated total score
            } else {
                toast.error(result.message || "Failed to save grades.");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Error saving grades.");
        }
    };

    const handleBackToAnalytics = () => {
        router.push(`/teacher/classroom/${currClassroomId}/analytics`);
    };


    if (isLoadingAssessment || isLoadingSubmission || isLoadingStudent || !assessmentData || !submissionData || !studentInfo) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }
    if (isErrorAssessment || isErrorSubmission) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error loading data.</div>;
    }

    const studentName = `${studentInfo.data?.first_name || ''} ${studentInfo.data?.last_name || ''}`.trim() || 'Student';

    return (
        <div className="ml-72 mr-10 mt-10 pb-20">
            <div className="mb-6">
                <Button variant="outline" onClick={handleBackToAnalytics}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assessment Analytics
                </Button>
            </div>
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Review Submission: {assessmentData?.data?.name}</CardTitle>
                            <CardDescription>Student: {studentName} (ID: {studentInfo.data.student_id})</CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Total Score</p>
                            <p className="text-3xl font-bold">{calculatedTotalScore} / {fetchedQuestions.reduce((sum, q) => sum + (q.weight || 0), 0)}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-8">
                {fetchedQuestions.map((question, index) => {
                    const studentResponse = studentAnswersMap[question.id];

                    return (
                        <Card key={question.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <span className="font-semibold mr-2 text-lg text-gray-700 dark:text-gray-300">Q{index + 1}.</span>
                                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{question.text}</p>
                                        </div>
                                        <Badge variant="outline" className="mr-2">
                                            {question.question_type === 'multiple_choice' ? 'MCQ' : 'Short Answer'}
                                        </Badge>
                                        <Badge variant="secondary">Weight: {question.weight || 0}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                {question.question_type === 'multiple_choice' && (
                                    <div className="space-y-2">
                                        {question.answers.map((option: AnswerOptionType) => {
                                            const isSelected = String(option.id) === studentResponse;
                                            const isCorrect = option.is_correct;
                                            let mcqStyle = "border-gray-300 dark:border-gray-600";
                                            if (isSelected) {
                                                mcqStyle = isCorrect ? "bg-green-100 border-green-500 ring-2 ring-green-400 dark:bg-green-900 dark:border-green-600"
                                                                   : "bg-red-100 border-red-500 ring-2 ring-red-400 dark:bg-red-900 dark:border-red-600";
                                            } else if (isCorrect) {
                                                mcqStyle = "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700";
                                            }
                                            return (
                                                <div key={option.id} className={`flex items-center p-3 rounded-md border ${mcqStyle}`}>
                                                    <span className={`mr-3 font-medium ${isSelected ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {option.text}
                                                    </span>
                                                    {isSelected && isCorrect && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                                                    {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 ml-auto" />}
                                                    {!isSelected && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 ml-auto opacity-70" title="Correct Answer"/>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {question.question_type === 'short_answer' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">Student's Answer:</Label>
                                            <Textarea
                                                value={studentResponse || "No answer provided."}
                                                readOnly
                                                className="mt-1 min-h-[80px] bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 border-gray-300 dark:border-gray-600"
                                            />
                                        </div>
                                        {question.model_answer && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">Model Answer:</Label>
                                                <div className="mt-1 p-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
                                                    {question.model_answer}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <Label htmlFor={`score-${question.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-400">
                                                Score for this question (0 - {question.weight || 0}):
                                            </Label>
                                            <Input
                                                id={`score-${question.id}`}
                                                type="number"
                                                min="0"
                                                max={question.weight || 0}
                                                value={manualScores[question.id] === null || manualScores[question.id] === undefined ? '' : manualScores[question.id]}
                                                onChange={(e) => handleManualScoreChange(question.id, e.target.value, question.weight || 0)}
                                                className="mt-1 w-24 p-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                disabled={isGrading}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleSaveGrades} disabled={isGrading}>
                    {isGrading ? <><Spinner size="sm" className="mr-2"/> Saving...</> : <><Save className="mr-2 h-5 w-5"/> Save Grades</>}
                </Button>
            </div>
        </div>
    );
};

export default ReviewStudentSubmissionPage;