import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail, BookOpen, Users, Video, Award, HelpCircle, Shield, Cookie, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/30 border-t border-amber-200 dark:border-amber-900/30 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-amber-900 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">Concept Master</span>
                             
                            </div>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 max-w-md">
                            Empowering students worldwide with AI-driven learning, interactive content, and personalized educational guidance.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                                { icon: Github, href: "https://github.com", label: "GitHub" },
                                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                                { icon: Mail, href: "mailto:support@conceptmaster.com", label: "Email" }
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 hover:bg-gradient-to-br hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all duration-300 hover:scale-110"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Platform
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { text: 'Browse Books', to: '/books' },
                                { text: 'Study Notes', to: '/notes' },
                                { text: 'Live Classes', to: '/classes' },
                                { text: 'Pricing', to: '/pricing' },
                                { text: 'For Teachers', to: '/teachers' }
                            ].map((item) => (
                                <li key={item.text}>
                                    <Link 
                                        to={item.to} 
                                        className="text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 hover:underline transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Support
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { text: 'Help Center', to: '/help' },
                                { text: 'Terms of Service', to: '/terms' },
                                { text: 'Privacy Policy', to: '/privacy' },
                                { text: 'Cookie Policy', to: '/cookies' },
                                { text: 'Contact Us', to: '/contact' }
                            ].map((item) => (
                                <li key={item.text}>
                                    <Link 
                                        to={item.to} 
                                        className="text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 hover:underline transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { text: 'Blog', to: '/blog' },
                                { text: 'Success Stories', to: '/reviews' },
                                { text: 'Study Tips', to: '/tips' },
                                { text: 'FAQ', to: '/faq' },
                                { text: 'Download App', to: '/download' }
                            ].map((item) => (
                                <li key={item.text}>
                                    <Link 
                                        to={item.to} 
                                        className="text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 hover:underline transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-amber-200 dark:border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Concept Master. Empowering learners worldwide.
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                            Made with ❤️ for education
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                            <Link 
                                to="/privacy" 
                                className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1"
                            >
                                <Shield className="w-3 h-3" />
                                Privacy
                            </Link>
                            <Link 
                                to="/terms" 
                                className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1"
                            >
                                <BookOpen className="w-3 h-3" />
                                Terms
                            </Link>
                            <Link 
                                to="/cookies" 
                                className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1"
                            >
                                <Cookie className="w-3 h-3" />
                                Cookies
                            </Link>
                        </div>
                        
                        <a 
                            href="mailto:support@conceptmaster.com" 
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/30 dark:hover:to-orange-800/30 transition-all"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Need Help?</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Add this ArrowRight component if not imported
const ArrowRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);