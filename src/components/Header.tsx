import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 border mx-2 md:mx-3 rounded-2xl shadow-lg">
            <div className="text-orange-400 font-bold text-xl md:text-2xl">Azem</div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
                <ul className="flex gap-4 xl:gap-8 text-gray-700 font-medium text-sm xl:text-base">
                    <li className="cursor-pointer hover:border-b-2 hover:border-orange-400 transition-colors"> <a href="#about">About</a></li>
                    <li className="cursor-pointer hover:border-b-2 hover:border-orange-400 transition-colors">    <a href="#journey">Journey</a></li>
                    <li className="cursor-pointer hover:border-b-2 hover:border-orange-400 transition-colors">    <a href="#technologies">Technologies</a>
                    </li>
                    <li className="cursor-pointer hover:border-b-2 hover:border-orange-400 transition-colors">    <a href="#projects">Projects</a>
                    </li>
                    <li className="cursor-pointer hover:border-b-2 hover:border-orange-400 transition-colors">    <a href="#contact">Contact</a>
                    </li>
                </ul>
            </nav>

            {/* Desktop Email */}
            <div className="hidden md:block text-gray-700 text-sm lg:text-base">
                <a href="mailto:azzedinezemmari@gmail.com" className="hover:text-orange-400 transition-colors">
                    azzedinezemmari@gmail.com
                </a>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="lg:hidden text-gray-700 hover:text-orange-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-2 right-2 bg-white border rounded-2xl shadow-lg z-50 lg:hidden">
                    <nav className="p-6">
                        <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                            <li className="cursor-pointer hover:text-orange-400 transition-colors py-2 border-b">
                                <a href="#about">About</a>
                            </li>
                            <li className="cursor-pointer hover:text-orange-400 transition-colors py-2 border-b">
                                <a href="#journey">Journey</a>
                            </li>
                            <li className="cursor-pointer hover:text-orange-400 transition-colors py-2 border-b">
                                <a href="#technologies">Technologies</a>
                            </li>
                            <li className="cursor-pointer hover:text-orange-400 transition-colors py-2 border-b">
                                <a href="#projects">Projects</a>
                            </li>
                            <li className="cursor-pointer hover:text-orange-400 transition-colors py-2 border-b">
                                <a href="#contact">Contact</a>
                            </li>
                        </ul>

                        <div className="mt-4 pt-4 border-t">
                            <a
                                href="mailto:azzedinezemmari@gmail.com"
                                className="text-gray-700 hover:text-orange-400 transition-colors text-sm"
                            >
                                azzedinezemmari@gmail.com
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
export default Header;