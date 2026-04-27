'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X, Plus, Trash2, CheckCircle2, Circle, Save, Loader2, HelpCircle, Video, FileUp } from 'lucide-react';
import Button from '@/components/Button';

interface Answer {
  id?: number;
  answer: string;
  is_right: boolean;
}

interface Question {
  id: number;
  question: string;
  type: string;
  answers: Answer[];
}

interface QuizEditorProps {
  lessonId: number;
  courseId: number;
  onClose: () => void;
}

export default function QuizEditor({ lessonId, courseId, onClose }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/instructor/quiz/${lessonId}/question`);
      // Map API response to our local state structure if needed
      const mapped = res.data.map((q: any) => ({
        id: q.id,
        question: q.question,
        type: q.questionType?.name || 'multiple_choice',
        answers: q.answers.map((a: any) => ({
          id: a.id,
          answer: a.answer,
          is_right: !!a.correct
        }))
      }));
      setQuestions(mapped);
    } catch (err) {
      console.error("Failed to fetch quiz questions", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const res = await api.post(`/instructor/quiz/${lessonId}/add-new-question`, { lesson_id: lessonId });
      const newQ: Question = {
        id: res.data.id,
        question: res.data.question,
        type: 'multiple_choice',
        answers: [
          { answer: 'Option 1', is_right: true },
          { answer: 'Option 2', is_right: false }
        ]
      };
      setQuestions([...questions, newQ]);
    } catch (err) {
      console.error("Failed to add question", err);
    }
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleUpdateAnswer = (qIndex: number, aIndex: number, field: string, value: any) => {
    const updated = [...questions];
    const updatedAnswers = [...updated[qIndex].answers];
    
    if (field === 'is_right' && value === true) {
      // For multiple choice, ensure only one is correct
      updatedAnswers.forEach((a, i) => a.is_right = i === aIndex);
    } else {
      updatedAnswers[aIndex] = { ...updatedAnswers[aIndex], [field]: value };
    }
    
    updated[qIndex] = { ...updated[qIndex], answers: updatedAnswers };
    setQuestions(updated);
  };

  const handleAddAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ answer: 'New Option', is_right: false });
    setQuestions(updated);
  };

  const handleRemoveAnswer = async (qIndex: number, aIndex: number) => {
    const answer = questions[qIndex].answers[aIndex];
    if (answer.id) {
       try {
         await api.delete(`/instructor/quiz/answer/${answer.id}`);
       } catch (err) {
         console.error("Failed to delete answer", err);
       }
    }
    const updated = [...questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setQuestions(updated);
  };

  const handleSaveQuestion = async (qIndex: number) => {
    setIsSaving(true);
    try {
      const question = questions[qIndex];
      await api.post(`/instructor/quiz/${lessonId}/save-question`, {
        question: {
          id: question.id,
          question: question.question,
          type: question.type,
          answers: question.answers
        }
      });
      // Optionally re-fetch to get new IDs for created answers
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to save question", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/instructor/quiz/question/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900  tracking-tight">Quiz Editor</h2>
              <p className="text-sm font-medium text-gray-400 ">Lesson #{lessonId} • Manage interactive questions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8 bg-gray-50/30">
          {isLoading ? (
             <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
             </div>
          ) : questions.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <HelpCircle className="mx-auto mb-4 text-gray-200" size={64} />
               <h3 className="text-xl font-black text-gray-800  mb-2">No questions yet</h3>
               <p className="text-gray-400 font-medium mb-8">Create a challenging quiz for your students.</p>
               <Button onClick={handleAddQuestion} className="px-8 py-4">Add Your First Question</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex-grow max-w-2xl">
                        <label className="block text-[10px] font-black text-gray-400  tracking-widest mb-2">Question {qIndex + 1}</label>
                        <input 
                          type="text" 
                          value={q.question} 
                          onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none transition-colors"
                        />
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <label className="block text-[10px] font-black text-gray-400  tracking-widest mb-2">Answers</label>
                    {q.answers.map((a, aIndex) => (
                      <div key={aIndex} className="flex items-center gap-3 group/answer">
                        <button 
                          onClick={() => handleUpdateAnswer(qIndex, aIndex, 'is_right', !a.is_right)}
                          className={`flex-shrink-0 transition-colors ${a.is_right ? 'text-green-500' : 'text-gray-200 hover:text-gray-400'}`}
                        >
                          {a.is_right ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        <div className={`flex-grow flex items-center p-3 rounded-2xl border transition-all ${a.is_right ? 'bg-green-50/50 border-green-100' : 'bg-gray-50/50 border-gray-100 focus-within:border-blue-200 focus-within:bg-white'}`}>
                          <input 
                            type="text" 
                            value={a.answer} 
                            onChange={(e) => handleUpdateAnswer(qIndex, aIndex, 'answer', e.target.value)}
                            className="w-full bg-transparent outline-none text-sm font-bold text-gray-800"
                          />
                          <button onClick={() => handleRemoveAnswer(qIndex, aIndex)} className="opacity-0 group-hover/answer:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                       onClick={() => handleAddAnswer(qIndex)}
                       className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 ml-9 transition-colors"
                    >
                       <Plus size={14} /> Add Option
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                     <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-[10px] font-black  text-gray-400 hover:text-blue-600 transition-colors">
                           <Video size={14} /> Add Hint Video
                        </button>
                        <button className="flex items-center gap-2 text-[10px] font-black  text-gray-400 hover:text-blue-600 transition-colors">
                           <FileUp size={14} /> Upload Doc
                        </button>
                     </div>
                     <Button 
                        onClick={() => handleSaveQuestion(qIndex)} 
                        disabled={isSaving}
                        className="flex items-center gap-2 h-10 px-4 text-xs tracking-widest "
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save Question
                     </Button>
                  </div>
                </div>
              ))}
              
              <button 
                 onClick={handleAddQuestion}
                 className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-black  tracking-widest text-sm hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 group"
              >
                 <Plus size={24} className="group-hover:rotate-90 transition-transform" /> Add New Question
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
          <Button onClick={onClose} className="px-8 border-none text-gray-400 bg-transparent hover:bg-gray-100">Close Editor</Button>
          <Button onClick={onClose} className="px-10">Done</Button>
        </div>
      </div>
    </div>
  );
}
