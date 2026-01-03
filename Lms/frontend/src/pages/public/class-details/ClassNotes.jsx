import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Clock, Eye, Search, Book, ChevronLeft, ChevronRight, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';

export default function ClassNotes() {
    const { classId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notesLoading, setNotesLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch subjects on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get('/subjects');
                // Filter subjects if backend returns all (optional, depending on API)
                // For now assuming we show all available subjects
                setSubjects(res.data || []);
            } catch (err) {
                console.error('Failed to fetch subjects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    // Fetch notes when subject is selected
    useEffect(() => {
        const fetchNotes = async () => {
            if (!selectedSubject) return;

            setNotesLoading(true);
            try {
                const res = await api.get('/notes', {
                    params: {
                        class_id: classId,
                        subject_id: selectedSubject._id
                    }
                });
                setNotes(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
            } finally {
                setNotesLoading(false);
            }
        };

        fetchNotes();
    }, [selectedSubject, classId]);

    // Group notes by chapter
    const groupedNotes = notes.reduce((acc, note) => {
        const chapterName = note.chapter_id?.title || 'General Resources';
        if (!acc[chapterName]) {
            acc[chapterName] = [];
        }
        acc[chapterName].push(note);
        return acc;
    }, {});

    const filteredSubjects = subjects.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    {selectedSubject ? (
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-1 group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Subjects</span>
                        </button>
                    ) : null}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedSubject ? `${selectedSubject.name} Notes` : 'Select Subject'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedSubject ? 'Browse notes by chapter' : 'Choose a subject to view notes'}
                    </p>
                </div>

                {!selectedSubject && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                        />
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    /* Subjects Grid */
                    <motion.div
                        key="subjects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredSubjects.map((subject, index) => (
                            <motion.div
                                key={subject._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedSubject(subject)}
                                className="group cursor-pointer"
                            >
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center">
                                    <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{subject.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>View Notes</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Notes List (Grouped by Chapter) */
                    <motion.div
                        key="notes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {notesLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : Object.keys(groupedNotes).length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No notes found for this subject.</p>
                            </div>
                        ) : (
                            Object.entries(groupedNotes).map(([chapter, chapterNotes]) => (
                                <div key={chapter} className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <Folder className="w-5 h-5 text-gray-400" />
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{chapter}</h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                            {chapterNotes.length}
                                        </span>
                                    </div>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {chapterNotes.map((note) => (
                                            <div key={note._id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-md overflow-hidden">
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {note.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                        {note.description}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <a
                                                       href={`${import.meta.env.VITE_API_BASE_URL}${note.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
