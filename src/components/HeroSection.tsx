import { useState, useEffect } from 'react';

function HeroSection() {
    const words = [
        'Designer',
        'Concepteur',
        'Clean Coder',
        'API Builder',
        'Debugger',
        'Problem Solver',
        'Tech Explorer'
    ];
    const [currentWord, setCurrentWord] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentWord((prev) => (prev + 1) % words.length);
                setIsVisible(true);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden px-4">
            <div className="text-center px-4 md:px-8 relative z-10 max-w-5xl">
                <p className="text-gray-600 text-sm md:text-lg mb-3 md:mb-4 tracking-widest">ZEMMARI AZZEDINE</p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                    Full-Stack Developer
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8 md:mb-12">
                    <span className="text-orange-400 text-4xl sm:text-5xl md:text-6xl font-bold">+</span>
                    <h2
                        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {words[currentWord]}
                    </h2>
                </div>

                <button className="group relative inline-flex h-[calc(44px+8px)] md:h-[calc(48px+8px)] items-center justify-center rounded-full bg-neutral-950 py-1 pl-5 md:pl-6 pr-12 md:pr-14 font-medium text-neutral-50 text-sm md:text-base">
                    <span className="z-10 pr-2">Say Hello</span>
                    <div className="absolute right-1 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-end rounded-full bg-neutral-700 transition-[width] group-hover:w-[calc(100%-8px)]">
                        <div className="mr-3 md:mr-3.5 flex items-center justify-center">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-neutral-50">
                                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>

            {/* Decorative image - hidden on mobile */}
            <div className="hidden lg:block absolute right-16 xl:right-32 top-1/3 h-24 w-24 xl:h-32 xl:w-32">
                <img src='/src/assets/biker-svgrepo-com.svg' />
            </div>
        </div>
    );
}


export default HeroSection; 