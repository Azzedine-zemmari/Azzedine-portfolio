import { useState } from 'react';

function About(){
    const [showModal, setShowModal] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/AzzedineJavaCv.pdf'; 
        link.download = 'ZEMMARI_AZZEDINE_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowModal(false);
    };

    return (
        <div id="about" className="lg:mx-24 py-12">
            <div className="flex flex-col justify-start mx-auto pt-5 pl-10">
                <p className="text-amber-400 flex items-center text-xl gap-3 animate-fade-in">
                    <svg className="bg-amber-100 rounded-full p-1.5 hover:scale-110 transition-transform duration-300" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                        <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
                    </svg>
                    <span className="tracking-widest font-semibold">ABOUT ME</span>
                </p>
                
                <h1 className="font-syne text-3xl pt-6 lg:text-5xl font-bold text-gray-900 leading-tight">
                    The Mind Behind the Magic:<br/> 
                    <span className="relative inline-block">
                        ZEMMARI AZZEDINE
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-amber-400 opacity-50"></span>
                    </span>
                </h1>
            </div>
            
            <div className="flex flex-col justify-start pl-10 lg:flex-row lg:justify-evenly lg:items-start lg:mx-10 lg:pt-8">
                <button 
                    onClick={() => setShowModal(true)}
                    className="group relative inline-flex h-12 w-60 items-center justify-center gap-2 my-5 overflow-hidden rounded-md border-2 border-neutral-900 bg-white px-4 font-semibold text-neutral-900 transition-all duration-200 [box-shadow:5px_5px_0px_0px_rgb(82_82_82)] hover:[box-shadow:7px_7px_0px_0px_rgb(82_82_82)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
                    <span className="relative z-10">Download Resume</span>
                    <svg className="relative z-10 group-hover:translate-y-0.5 transition-transform duration-200" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-md"></div>
                </button>
                
                <p className="text-lg md:text-xl leading-relaxed lg:w-[500px] text-gray-700 relative">
                    <span className="inline-block hover:text-gray-900 transition-colors duration-300">
                        Transforming ideas into robust, scalable web applications.
                        With expertise in <span className="font-semibold text-amber-600">Spring Boot</span>, <span className="font-semibold text-amber-600">Angular</span>, and modern backend and frontend technologies.
                    </span>
                    <span className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-amber-400 via-orange-300 to-transparent opacity-40 rounded-full"></span>
                </p>
            </div>

            {/* Modal de confirmation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg border-2 border-neutral-900 [box-shadow:8px_8px_0px_0px_rgb(82_82_82)] max-w-md w-full mx-4 transform transition-all">
                        {/* Header */}
                        <div className="border-b-2 border-neutral-900 p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                            <div className="flex items-center gap-3">
                                <svg className="bg-amber-400 rounded-full p-2 text-white" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1.8em" width="1.8em" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-xl font-bold text-neutral-900">Download Resume</h3>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Voulez-vous télécharger le CV de <span className="font-semibold text-amber-600">ZEMMARI AZZEDINE</span> ?
                            </p>
                            <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <svg className="flex-shrink-0 mt-0.5" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                        <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
                                    </svg>
                                    Le téléchargement démarrera automatiquement après confirmation.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t-2 border-neutral-900 p-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-neutral-900 bg-white px-6 font-semibold text-neutral-900 transition-all duration-200 [box-shadow:4px_4px_0px_0px_rgb(82_82_82)] hover:[box-shadow:6px_6px_0px_0px_rgb(82_82_82)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_rgb(82_82_82)] w-full sm:w-auto"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDownload}
                                className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-neutral-900 bg-amber-400 px-6 font-semibold text-neutral-900 transition-all duration-200 [box-shadow:4px_4px_0px_0px_rgb(82_82_82)] hover:[box-shadow:6px_6px_0px_0px_rgb(82_82_82)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_rgb(82_82_82)] w-full sm:w-auto"
                            >
                                <span>Confirmer</span>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default About;