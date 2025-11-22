function Projects() {
    const projects = [
        {
            title: "Healthcare Tele-Expertise Workflow System",
            description: "A complete medical tele-expertise system enabling collaboration between nurses, general practitioners, and specialists.The project manages the entire patient journey: onboarding, consultations, expertise requests, specialist scheduling, and delivery of medical opinions.It includes secure authentication and advanced business logic.",
            tech: ["Jakarta EE", "Tomcat", "PostgreSQL", "Hibernate","Maven"],
            year: "2025",
            link: "https://github.com/Azzedine-zemmari/tele-expertise-medicale.git"
        },
        {
            title: "Inventory & Supplier Orders Management System",
            description:"Application for managing supplier orders, products, stock movements, and inventory valuation (CUMP)",
            tech: ["Spring Boot", "Spring Data JPA", "MapStruct", "Liquibase","Swagger","MySql"],
            link: "https://github.com/Azzedine-zemmari/Tricol.git"
        },
        {
            title: "Online Store & Inventory Management Platform",
            description: "This project is a full-stack e-commerce platform built with Vue.js on the frontend, Laravel on the backend, and PostgreSQL as the database. It provides all essential features required for a modern online store, including user authentication, shopping cart management, order processing, invoicing, and role-based access control for administrators, sales staff, and product managers.The platform includes secure authentication using Laravel Sanctum, a structured MVC architecture, component-based frontend design, and advanced features such as Excel product import and PDF invoice generation.",
            tech: ["Vue.js", "Laravel", "PostgreSQL", "Laravel Sanctum"],
            link: "https://github.com/Azzedine-zemmari/Power_Eco"
        },
        {
            title: "Event Management Web Application",
            description: "comprehensive web platform designed to simplify and streamline music event management. It connects organizers, artists, attendees, and administrators within a modern, intuitive interface, making it easy to create, manage, and participate in concerts, festivals, and private events.",
            tech: ["Laravel", "tailwindcss", "Postgres", "Javascript"],
            link: "https://github.com/Azzedine-zemmari/THE_Beatwave"
        },
    ];

    return (
        <div className="lg:mx-24 py-16">
            <div className="flex flex-col justify-start mx-auto pl-10 mb-16">
                {/* Section Label */}
                <p className="text-amber-400 flex items-center text-xl gap-3 mb-8">
                    <svg className="bg-amber-100 rounded-full p-1.5" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V7h16l.001 12H4z"/>
                        <path d="M9.293 9.293 5.586 13l3.707 3.707 1.414-1.414L8.414 13l2.293-2.293zm5.414 0-1.414 1.414L15.586 13l-2.293 2.293 1.414 1.414L18.414 13z"/>
                    </svg>
                    <span className="tracking-widest font-semibold">PROJECTS</span>
                </p>

                {/* Title */}
                <h2 className="font-syne text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Things I've Built
                </h2>
                <p className="text-gray-600 text-lg">
                    A collection of projects I'm proud of
                </p>
            </div>

            {/* Projects Grid */}
            <div className="px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="group relative bg-white border-2 border-gray-900 rounded-2xl p-8 hover:bg-gray-900 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:-translate-x-1 hover:-translate-y-1"
                        >
                            {/* Year Badge */}
                            {/* <div className="absolute -top-3 -right-3 bg-amber-400 text-gray-900 font-bold px-4 py-2 rounded-full border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                {project.year}
                            </div> */}

                            {/* Project Number */}
                            <div className="text-6xl font-bold text-gray-200 group-hover:text-gray-800 transition-colors duration-300 mb-4">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Project Title */}
                            <h3 className="font-syne text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-4">
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 mb-6 leading-relaxed">
                                {project.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tech.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-3 py-1 bg-gray-100 group-hover:bg-gray-800 text-gray-800 group-hover:text-gray-100 text-sm font-medium rounded-md border border-gray-300 group-hover:border-gray-600 transition-colors duration-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* View Project Link */}
                            <a
                                href={project.link}
                                className="inline-flex items-center gap-2 text-gray-900 group-hover:text-amber-400 font-semibold transition-colors duration-300"
                            >
                                View Project
                                <svg 
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                    />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Projects;