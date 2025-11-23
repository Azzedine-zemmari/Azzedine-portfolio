import { Github, Linkedin } from 'lucide-react';

function SocialSidebar() {
    return (
        <div className="hidden lg:fixed le  ft-2 md:left-8 top-1/2 -translate-y-1/2 lg:flex flex-col gap-3 md:gap-4 z-50">
            <a href="https://github.com/Azzedine-zemmari" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Github className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://www.linkedin.com/in/zemmari-azzedine-039a23210/" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </a>
            <a href="https://discord.gg/azzedine2263" target="_blank" rel="noopener noreferrer"  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240" className="w-4 h-4 md:w-5 md:h-5 text-gray-700 fill-current">
                    <path d="M104.4 104.5c0 5.7-4.8 10.3-10.7 10.3-5.8 0-10.7-4.6-10.7-10.3 0-5.7 4.7-10.3 10.7-10.3 5.9 0 10.7 4.6 10.7 10.3zm51.9 0c0 5.7-4.8 10.3-10.7 10.3-5.9 0-10.7-4.6-10.7-10.3 0-5.7 4.8-10.3 10.7-10.3 5.9 0 10.7 4.6 10.7 10.3z" />
                    <path d="M189.5 20H55.5C38.2 20 24 34.2 24 51.5v137c0 17.3 14.2 31.5 31.5 31.5h99.6l-4.7-16.3 11 10.1 10.4 9.5 18.5 16.7V51.5c0-17.3-14.2-31.5-31.5-31.5zM165.8 147s-5.1-6.1-9.3-11.5c18.3-5.1 25.3-16.3 25.3-16.3-5.7 3.8-11.1 6.5-16 8.3-7 3-13.7 5-20.3 6-13.8 2.5-26.3 1.9-36.9-0.1-8.1-1.6-15-3.8-21-6-3.6-1.2-7.5-2.6-11.3-4.4-0.5-0.2-1-0.3-1.5-0.5-0.3-0.1-0.4-0.2-0.5-0.2-0.2-0.1-0.2-0.1-0.3-0.2-0.3-0.1-0.2-0.1-0.3-0.2 0 0 6.6 11.1 24 16.3-4.2 5.4-9.4 11.8-9.4 11.8-30.8-0.9-42.5-21.2-42.5-21.2 0-44.9 20.1-81.5 20.1-81.5 20.1-15 39.2-14.6 39.2-14.6l1.4 1.6c-25.1 7.3-36.6 18.2-36.6 18.2s3.1-1.7 8.3-4c15.1-6.4 27.1-8.3 32-8.8 0.8-0.1 1.5-0.2 2.3-0.3 5-0.7 12-1 19.1-0.1 14 1.7 28.9 6.1 42.1 14.6 0 0-11.3-10.7-36.1-18.3l2-2.2s19.2-0.4 39.2 14.6c0 0 20.1 36.5 20.1 81.5 0 0-11.9 20.4-42.7 21.3z" />
                </svg>
            </a>

            <a href="https://wa.me/212767228591" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 003.48 8.52l-1.8 6.6 6.63-1.74A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.19-3.48-8.52zm-8.52 18c-2.02 0-3.91-.61-5.47-1.65l-.39-.24-3.94 1.03 1.05-3.84-.25-.39A9.914 9.914 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.54-7.17c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.28.3-.47.1-.17.05-.32-.02-.47-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.47.07-.72.32c-.25.25-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.12.17 1.9 2.91 4.6 4.08.64.28 1.14.45 1.53.58.64.21 1.22.18 1.68.11.51-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.27-.2-.57-.35z" />
                </svg>
            </a>
        </div>
    );
}

export default SocialSidebar;
