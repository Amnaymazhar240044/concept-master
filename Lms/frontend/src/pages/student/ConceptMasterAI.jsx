import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Bot, User, Sparkles, Loader2, Crown, Lock, 
  Brain, Zap, Target, Rocket, Star, Award, BrainCircuit,
  MessageSquare, Lightbulb, BookOpen, GraduationCap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '../../context/AuthContext'

export default function ConceptMasterAI() {
    const { user } = useAuth()
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your Concept Master AI. I can explain any topic you're studying. What would you like to learn about today?"
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [featureSettings, setFeatureSettings] = useState([])
    const [checkingFeature, setCheckingFeature] = useState(true)

    // Fetch Feature Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/feature-control')
                setFeatureSettings(res.data.data || [])
            } catch (error) {
                console.error('Failed to fetch feature settings', error)
            } finally {
                setCheckingFeature(false)
            }
        }
        fetchSettings()
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        console.log("USER:", user);
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const { data } = await api.post('/ai/generate', {
                prompt: `Act as an AI teacher here is the user message and be friendly: ${userMessage}`
            })

            setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
        } catch (error) {
            console.error('AI Error:', error)
            const errorMessage = error.response?.status === 403
                ? "This feature is available for Premium users only. Please upgrade your plan to continue learning with AI."
                : "I'm sorry, I encountered an error while trying to explain that. Please try again."

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage
            }])
        } finally {
            setLoading(false)
        }
    }

    // Check Feature Access
    const aiFeature = featureSettings.find(f => f.featureName === 'conceptMasterAi')
    const isPremiumOnly = aiFeature ? aiFeature.isPremium : true
    const isLocked = !checkingFeature && isPremiumOnly && !user?.isPremium

    if (checkingFeature) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800 shadow-lg"
                >
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6">
                            <BrainCircuit className="w-8 h-8 text-amber-400 animate-spin" />
                        </div>
                        <span className="text-amber-600/70 dark:text-amber-400/70">Loading AI assistant...</span>
                    </div>
                </motion.div>
            </div>
        )
    }

    // Premium Access Gate
    if (isLocked) {
        return (
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800 shadow-2xl"
                >
                    <div className="text-center max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full shadow-lg">
                            <Crown className="w-10 h-10 text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent mb-3">
                                Unlock Concept Master AI
                            </h1>
                            <p className="text-lg text-amber-600/70 dark:text-amber-400/70">
                                Get unlimited access to your personal AI assistant available 24/7
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg space-y-4">
                            <div className="flex items-start gap-3 text-left">
                                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-50 mb-1">AI-Powered Explanations</h3>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Get detailed explanations on any topic, customized to your learning needs</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-left">
                                <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-50 mb-1">24/7 Availability</h3>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Study anytime, anywhere with instant AI responses</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-left">
                                <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-50 mb-1">Personalized Learning</h3>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Adaptive responses that match your learning style and pace</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                to="/pricing"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Crown className="w-5 h-5" />
                                Upgrade to Premium
                            </Link>
                            <Link
                                to="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 text-amber-700 dark:text-amber-300 font-semibold rounded-xl transition-all border border-amber-200 dark:border-amber-800"
                            >
                                Back to Dashboard
                            </Link>
                        </div>

                        <p className="text-xs text-amber-600/60 dark:text-amber-400/60">
                            Join thousands of students accelerating their learning with AI
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Concept Master AI
                        </h1>
                        <p className="text-amber-600/70 dark:text-amber-400/70">Your personal AI assistant available 24/7</p>
                    </div>
                </div>
            </motion.div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 shadow-xl backdrop-blur-xl">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'assistant'
                                ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400'
                                : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white'
                                }`}>
                                {msg.role === 'assistant' ? <Brain className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 shadow-sm border border-amber-200 dark:border-amber-800'
                                    : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/10'
                                    }`}
                            >
                                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                return !inline ? (
                                                    <div className="bg-amber-900 dark:bg-gray-900 rounded-lg p-4 my-2 overflow-x-auto border border-amber-800 dark:border-gray-800">
                                                        <code className="text-amber-100 dark:text-gray-100 font-mono text-sm" {...props}>
                                                            {children}
                                                        </code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-amber-200 dark:bg-amber-900/30 rounded px-1.5 py-0.5 font-mono text-xs font-medium" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-amber-900 dark:text-amber-50 border-b border-amber-200 dark:border-amber-800 pb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-4 text-amber-900 dark:text-amber-50">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3 text-amber-900 dark:text-amber-50">{children}</h3>,
                                            ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1 text-amber-700 dark:text-amber-300">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1 text-amber-700 dark:text-amber-300">{children}</ol>,
                                            li: ({ children }) => <li className="my-1">{children}</li>,
                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <span className="font-bold text-amber-700 dark:text-amber-400">{children}</span>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 pl-4 my-2 italic text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20 py-2 rounded-r">{children}</blockquote>,
                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">{children}</a>,
                                            table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-amber-200 dark:border-amber-700"><table className="min-w-full divide-y divide-amber-200 dark:divide-amber-700">{children}</table></div>,
                                            thead: ({ children }) => <thead className="bg-amber-50 dark:bg-amber-900/30">{children}</thead>,
                                            tbody: ({ children }) => <tbody className="divide-y divide-amber-200 dark:divide-amber-700 bg-white/50 dark:bg-gray-900/50">{children}</tbody>,
                                            tr: ({ children }) => <tr>{children}</tr>,
                                            th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">{children}</th>,
                                            td: ({ children }) => <td className="px-3 py-2 whitespace-nowrap text-sm text-amber-700 dark:text-amber-300">{children}</td>,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                            <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-4 shadow-sm border border-amber-200 dark:border-amber-800">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-t border-amber-200 dark:border-amber-800 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me to explain any topic..."
                            className="flex-1 bg-white dark:bg-gray-900 border-2 border-amber-300 dark:border-amber-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-amber-500/60 dark:placeholder:text-amber-400/40 text-amber-900 dark:text-amber-100"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Quick Prompts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Quick Prompts</h3>
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Try these sample questions to get started</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={() => setInput("Explain the concept of photosynthesis in simple terms")}
                        className="p-3 text-left rounded-xl border border-amber-300 dark:border-amber-700 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Science</span>
                        </div>
                        <p className="text-amber-900 dark:text-amber-100 font-medium">Explain photosynthesis in simple terms</p>
                    </button>
                    
                    <button
                        onClick={() => setInput("How does the Pythagorean theorem work?")}
                        className="p-3 text-left rounded-xl border border-amber-300 dark:border-amber-700 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>Math</span>
                        </div>
                        <p className="text-amber-900 dark:text-amber-100 font-medium">Explain the Pythagorean theorem</p>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}