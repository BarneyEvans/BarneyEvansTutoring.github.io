import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Button from './Button';
import { CONTACT_EMAIL, GOOGLE_FORM_URL, LINKEDIN_URL } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleContactClick = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            // Add shake animation to buttons
            const buttons = document.querySelectorAll('.contact-btn');
            buttons.forEach(btn => {
                btn.classList.add('animate-wiggle');
                setTimeout(() => btn.classList.remove('animate-wiggle'), 1000);
            });
        }
    };

    const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
        <Link 
            to={to} 
            className={`font-heading font-semibold text-lg hover:text-hot-pink transition-colors ${location.pathname === to ? 'text-hot-pink' : 'text-black'}`}
        >
            {children}
        </Link>
    );

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm py-4 border-b-3 border-black' : 'bg-transparent py-6'}`}>
                <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                    <Link to="/" className="font-heading font-bold text-xl md:text-2xl tracking-tight border-b-4 border-hot-pink pb-1">
                        Barney Evans Tutoring
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/private-tutoring">Private Tutoring</NavLink>
                        <NavLink to="/python-course">Python Course</NavLink>
                        <NavLink to="/about">About Me</NavLink>
                        <button onClick={handleContactClick} className="font-heading font-bold text-lg bg-black text-white px-6 py-2 rounded-full hover:bg-hot-pink transition-colors">
                            Contact
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center space-y-8 animate-fade-in">
                    <Link to="/" className="text-2xl font-heading font-bold">Home</Link>
                    <Link to="/private-tutoring" className="text-2xl font-heading font-bold">Private Tutoring</Link>
                    <Link to="/python-course" className="text-2xl font-heading font-bold">Python Course</Link>
                    <Link to="/about" className="text-2xl font-heading font-bold">About Me</Link>
                    <button onClick={() => { setIsMenuOpen(false); handleContactClick(); }} className="text-2xl font-heading font-bold text-hot-pink">Contact</button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow pt-24">
                {children}
            </main>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white border-t-3 border-black">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-700">
                        Book a free 20-minute discovery call to discuss your goals, or explore the Python course with a free taster session.
                    </p>
                    
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="contact-btn">
                            <Button>Book Discovery Call</Button>
                        </a>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="contact-btn">
                            <Button variant="secondary">
                                <span className="flex items-center gap-2"><Mail size={20}/> Email Me</span>
                            </Button>
                        </a>
                        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="contact-btn">
                            <Button variant="secondary">
                                <span className="flex items-center gap-2"><Linkedin size={20}/> LinkedIn</span>
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            <footer className="bg-black text-white py-8 text-center">
                <p className="font-sans text-sm opacity-80">© {new Date().getFullYear()} Barney Evans Tutoring. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;