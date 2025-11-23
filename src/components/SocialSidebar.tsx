import { Github, Linkedin, Twitter, Instagram, Discord } from 'lucide-react';

function SocialSidebar() {
    return (
        <div className="hidden lg:fixed le  ft-2 md:left-8 top-1/2 -translate-y-1/2 lg:flex flex-col gap-3 md:gap-4 z-50">
            <a href="https://github.com/Azzedine-zemmari" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Github className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://www.linkedin.com/in/zemmari-azzedine-039a23210/" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://www.instagram.com/" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://discord.com/users/azzedine2263" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Discord className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://wa.me/YOUR_NUMBER" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                {/* WhatsApp icon as inline SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 003.48 8.52l-1.8 6.6 6.63-1.74A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.19-3.48-8.52zm-8.52 18c-2.02 0-3.91-.61-5.47-1.65l-.39-.24-3.94 1.03 1.05-3.84-.25-.39A9.914 9.914 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.54-7.17c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.28.3-.47.1-.17.05-.32-.02-.47-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.47.07-.72.32c-.25.25-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.12.17 1.9 2.91 4.6 4.08.64.28 1.14.45 1.53.58.64.21 1.22.18 1.68.11.51-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.27-.2-.57-.35z"/>
                </svg>
            </a>
        </div>
    );
}

export default SocialSidebar;
