function Education() {
const educationData = [
    {
        year: "2020 - 2021",
        degree: "Baccalaureate (Life and Earth Sciences)",
        institution: "Ibn Khaldoun High School",
        description: "Specialized in Life and Earth Sciences. Graduated with honors.",
        skills: []
    },
    {
        year: "2021 - 2023",
        degree: "Specialized Technician Diploma",
        institution: "NTIC Training Center",
        description: "Focused on programming fundamentals, web development, and database management.",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "TailwindCSS",
            "Bootstrap",
            "PHP",
            "Laravel",
            "React",
            "Node.js",
            "Express.js",
            "MySQL",
            "REST API",
            "Git & GitHub",
            "Version Control",
            "Responsive Design",
            "Debugging",
            "Problem Solving",
            "Agile Basics",
        ]
        },
    {
        year: "2023 - 2024",
        degree: "Freelance Developer",
        institution: "Self-Learning / Freelance Projects",
        description: "Worked on real-world projects to strengthen web development and programming skills.",
        skills: [
            "Vue.js",
            "React.js",
            "TypeScript",
            "Node.js",
            "Express.js",
            "PostgreSQL",
            "MongoDB",
            "REST API",
            "TailwindCSS",
            "Bootstrap",
            "Responsive Web Design",
            "Git & GitHub",
            "Docker Basics",
            "Testing & Debugging",
            "Problem Solving",
            "Communication",
            "Project Planning",
            "Agile Workflow",
            "Time Management",
        ]
        },
    {
        year: "2024 - 2026",
        degree: "Full Stack Developer",
        institution: "Youcode",
        description: "Comprehensive training in web development, frontend and backend technologies, and problem-solving.",
        skills: [
            "Java",
            "Spring",
            "Spring Boot",
            "Spring Security",
            "Hibernate",
            "SQL & NoSQL Databases",
            "Angular",
            "React",
            "TypeScript",
            "JavaScript",
            "HTML5 & CSS3",
            "TailwindCSS",
            "REST API",
            "Microservices Architecture",
            "Unit Testing & TDD",
            "Agile Methodologies",
            "Jira",
            "Version Control (Git/GitHub)",
            "Problem Solving",
            "Critical Thinking",
            "Team Collaboration",
            "Time Management",
            "Communication Skills",
            "Project Planning",
            "Continuous Integration / Continuous Deployment (CI/CD)",
            "Cloud Basics (AWS, Heroku)"
        ]
        }
];



    return (
        <div id="journey" className="lg:mx-24 py-16">
            <div className="flex flex-col justify-start mx-auto pl-10">
                {/* Section Label */}
                <p className="text-amber-400 flex items-center text-xl gap-3 animate-fade-in mb-8">
                    <svg className="bg-amber-100 rounded-full p-1.5 hover:scale-110 transition-transform duration-300" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 7v1l11 4 9-4V7L11 4z" />
                        <path d="M4 11v4.267c0 1.621 4.001 3.893 9 3.734 4-.126 6.586-1.972 7-3.467.024-.089.037-.178.037-.268V11L13 14l-5-1.667v3.213l-1-.364V12l-3-1z" />
                    </svg>
                    <span className="tracking-widest font-semibold">EDUCATION</span>
                </p>

                {/* Title */}
                <h2 className="font-syne text-3xl lg:text-5xl font-bold text-gray-900 mb-12 leading-tight">
                    My Academic Journey
                </h2>
            </div>

            {/* Timeline */}
            <div className="relative pl-10 pr-6 lg:pl-20 lg:pr-12">
                {/* Vertical Line */}
                <div className="absolute left-[4.5rem] lg:left-[6.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-orange-300 to-amber-200"></div>

                {/* Timeline Items */}
                <div className="space-y-12">
                    {educationData.map((edu, index) => (
                        <div key={index} className="relative group">
                            {/* Timeline Dot - positioned at top left corner of card */}
                            <div className="absolute left-[25px] lg:left-[17px] top-0 w-4 h-4 bg-amber-400 rounded-full border-4 border-white shadow-lg group-hover:scale-125 group-hover:bg-orange-500 transition-all duration-300 z-10"></div>

                            {/* Content Card */}
                            <div className="ml-12 lg:ml-20 bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-400 hover:shadow-[8px_8px_0px_0px_rgba(251,191,36,0.3)] transition-all duration-300 hover:-translate-y-1 relative">
                                {/* Year Badge */}
                                <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-semibold mb-3 border border-amber-300">
                                    {edu.year}
                                </span>

                                {/* Degree */}
                                <h3 className="font-syne text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                    {edu.degree}
                                </h3>

                                {/* Institution */}
                                <p className="text-amber-600 font-semibold text-lg mb-3 flex items-center gap-2">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 16H4V5h16v14z" />
                                        <path d="M8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z" />
                                    </svg>
                                    {edu.institution}
                                </p>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {edu.description}
                                </p>

                                {/* Skills Tags */}
                                {/* <div className="flex flex-wrap gap-2">
                                    {edu.skills.map((skill, skillIndex) => (
                                        <span 
                                            key={skillIndex} 
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 transition-colors duration-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom decoration - perfectly centered with line */}
                <div className="absolute left-[4.5rem] lg:left-[6.6rem] bottom-0 w-8 h-8 border-4 border-amber-400 rounded-full bg-white shadow-lg -translate-x-1/2"></div>
            </div>
        </div>
    );
}

export default Education;