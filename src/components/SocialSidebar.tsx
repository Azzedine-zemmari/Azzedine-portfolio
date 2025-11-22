import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

function SocialSidebar() {
    return (
        <div className="hidden lg:fixed left-2 md:left-8 top-1/2 -translate-y-1/2 lg:flex flex-col gap-3 md:gap-4 z-50">
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Github className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-700 rounded text-white text-xs flex items-center justify-center font-bold">
                    dev
                </div>
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Twitter className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
        </div>
    );
}

export default SocialSidebar;