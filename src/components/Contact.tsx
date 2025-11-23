import { useState, ChangeEvent, FormEvent } from 'react';
import '../Contact.css'
import emailjs from "@emailjs/browser";
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    else if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Enter a valid email address.";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    else if (formData.subject.length < 3) newErrors.subject = "Subject is too short.";

    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
        newErrors.message = "Your message must be at least 10 characters.";
    else if(formData.message.length > 1000){
        alert("Too Long");
        return;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};

const sanitize = (value: string): string => {
    return value
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/`/g, "&#96;");
};

const sanitizedData = {
    name: sanitize(formData.name),
    email: sanitize(formData.email),
    subject: sanitize(formData.subject),
    message: sanitize(formData.message),
};



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const honeypot = document.getElementById("company") as HTMLInputElement;

        if (honeypot?.value.trim() !== "") {
            return; // bot detected
        }   
        if (!validate()) return;
        setIsLoading(true);

        try {
            const response = await emailjs.send(
                serviceId,
                templateId,
                sanitizedData,
                publicKey
            );

            setIsLoading(false);
            setShowSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="lg:mx-24 py-16 relative">
            {/* Success Alert */}
            {showSuccess && (
                <div className="fixed top-8 right-8 z-50 animate-slide-in">
                    <div className="bg-white border-2 border-gray-900 rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] max-w-md">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-amber-400 border-2 border-gray-900 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-gray-900"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-syne text-xl font-bold text-gray-900 mb-1">
                                    Message Sent!
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Thanks for reaching out! I'll get back to you soon.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="flex-shrink-0 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 animate-progress"
                                style={{ animation: 'progress 5s linear' }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col justify-start mx-auto pl-10 mb-16">
                {/* Section Label */}
                <p className="text-amber-400 flex items-center text-xl gap-3 mb-8">
                    <svg
                        className="bg-amber-100 rounded-full p-1.5"
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1.5em"
                        width="1.5em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
                    </svg>
                    <span className="tracking-widest font-semibold">CONTACT</span>
                </p>

                <h2 className="font-syne text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Let's Work Together
                </h2>
                <p className="text-gray-600 text-lg">
                    Have a project in mind? Drop me a message
                </p>
            </div>

            {/* Contact Form */}
            <div className="px-6 lg:px-10">
                <form onSubmit={handleSubmit} className="max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 border-2 ${errors.name ? "border-red-300" : "border-gray-900"}  rounded-lg focus:outline-none focus:border-amber-400 transition-colors duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <input type="text"  name="company" 
  id="company"
  autocomplete="off"
  tabindex="-1"
  class="honeypot" />

                        <div>
                            <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="john@example.com"
                                className={`w-full px-4 py-3 border-2 ${errors.email ? "border-red-300" : "border-gray-900"}  rounded-lg focus:outline-none focus:border-amber-400 transition-colors duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="subject" className="block text-gray-900 font-semibold mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Project Discussion"
                                className={`w-full px-4 py-3 border-2 ${errors.subject ? "border-red-300" : "border-gray-900"}  rounded-lg focus:outline-none focus:border-amber-400 transition-colors duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        {errors.subject && (
                                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                            )}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="message" className="block text-gray-900 font-semibold mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isLoading}
                            rows={6}
                            placeholder="Tell me about your project..."
                                className={`w-full px-4 py-3 border-2 ${errors.message ? "border-red-300" : "border-gray-900"}  rounded-lg focus:outline-none focus:border-amber-400 transition-colors duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] disabled:opacity-50 disabled:cursor-not-allowed`}
                        ></textarea>
                        {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                            )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] hover:-translate-y-0.5 border-2 border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:hover:text-white disabled:hover:translate-y-0"
                    >
                        {isLoading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>

        
        </div>
    );
}

export default Contact;
