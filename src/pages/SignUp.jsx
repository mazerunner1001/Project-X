import React, { useState, useEffect } from 'react';
import Designer from '../assets/Designer (4).png';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import { useSignupMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import styles from '../PageBackground.module.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger'; // Import ScrollTrigger separately if needed
gsap.registerPlugin(ScrollTrigger);



function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signUp, { isLoading }] = useSignupMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const InfoCard = [
        {
            title: 'Be part of the conversation',
            description: 'Discuss your favorite films, theories, and reviews with fellow movie enthusiasts. Get movie information like never before, from box office hits to hidden gems'
        },
        {
            title: 'Connect with movie buffs',
            description: 'Join a vibrant community of movie enthusiasts to discuss your favorite films, theories, and reviews. Explore a world of cinematic wonders, from blockbusters to indie treasures'
        },
        {
            title: 'Dive into the world of cinema',
            description: 'Find all the information you need about your favorite movies, TV shows, and actors. Discover new films and explore the world of cinema like never before'
        }
    ];

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                const res = await signUp({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate('/');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const handleSubscribe = () => {
        alert(`Subscribed with: ${email}`);
        setEmail("");
    };

    useEffect(() => {
        // Your ScrollTrigger animations setup here
        const cards = document.querySelectorAll('.info-card');

        cards.forEach((card) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%', // Adjust as needed
                    end: '+=300', // Adjust as needed
                    toggleActions: 'play none none reverse',
                },
            });
        });
    }, []);

    return (
        <>
            <div className={styles['page-background']}>
                <div className="absolute bg-black bg-opacity-30 inset-0 m-0"></div>
                <div className="relative flex bg-transparent items-center">
                    <img src={logo} loading="lazy" className="w-12 m-4 hover:animate-spin" alt="tailus logo" />
                    <h2 className="text-3xl text-white font-bold ">Nova</h2>
                </div>
                <div className="absolute right-12 top-4 flex justify-center space-x-8">
                    <a href="https://x.com/praneethswarna" className="cursor-pointer ">
                        <span>
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </span>
                    </a>
                    <a href="https://www.facebook.com/praneethchandra123/" className="cursor-pointer">
                        <span>
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </span>
                    </a>
                    <a href="https://www.instagram.com/praneethchandra123/" className="cursor-pointer">
                        <span>
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </span>
                    </a>
                    <a href="https://github.com/mazerunner1001" className="cursor-pointer translate-y-[-4px]">
                        <span>
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 28 28">
                                <path
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                />
                            </svg>
                        </span>
                    </a>
                </div>
                <div className="relative w-full items-center justify-center text-center styles.black-area z-0 mt-24">
                    <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-[80px] tracking-tight text-center text-white">Welcome to Nova</h1>
                    <p className="mt-6 text-3xl text-center max-w-3xl lg:block hidden mx-auto text-white ">Embark on a cinematic journey like never before. Join our vibrant community of movie enthusiasts where every frame sparks discussions, memories, and inspiration. Sign up today to explore the world of cinema with fellow aficionados and dive into a realm where every movie holds a story worth sharing.</p>
                    <div className="relative flex items-center justify-center mt-12">
                        <Link to="/">
                            <button className="bg-black text-white text-2xl px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-300">Explore</button>
                        </Link>
                        <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-full ml-8 divide-x divide-black">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="rounded-l-lg px-4 py-2 outline-none text-black text-lg w-full"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="rounded-r-lg bg-black px-4 py-2 flex items-center text-lg justify-center text-white hover:text-black hover:bg-white"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div className=" items-stretch bg-white h-[200px] w-[2px] mx-auto mt-8"></div>
                </div>


                <div className="relative container pb-16 m-auto text-black md:px-12 mb-20">
                    <div className="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12  bg-transparent shadow-3xl relative ">
                        <div className="p-6 sm:p-16 bg-black rounded-3xl border bg-opacity-35">
                            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl text-center">Create an account</h1>
                            <div className="2xl:flex my-12 items-center justify-center space-y-4 2xl:space-x-6 2xl:space-y-0">
                                <button className="sm:ml-12 md:ml-3 lg:ml-5 xl:ml-16 2xl:ml-0 h-12 pl-6 pr-10 2xl:px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-sky-400 active:bg-sky-300">
                                    <div className="relative flex items-center space-x-8 justify-center">
                                        <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" className="absolute left-0 w-5" alt="google logo" />
                                        <span className="block w-max font-semibold tracking-wide text-white text-sm transition duration-300 group-hover:text-sky-600 sm:text-base">Continue with Google</span>
                                    </div>
                                </button>
                                <button className="sm:ml-12 md:ml-3 lg:ml-5 xl:ml-16 group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-sky-400 active:bg-sky-300">
                                    <div className="relative flex items-center space-x-8 justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" className="absolute left-0 w-5" alt="Facebook logo" />
                                        <span className="block w-max font-semibold tracking-wide text-white text-sm transition duration-300 group-hover:text-sky-600 sm:text-base">Continue with Facebook</span>
                                    </div>
                                </button>
                            </div>

                            <form onSubmit={submitHandler} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                                    >
                                        Your name
                                    </label>
                                    <input
                                        type="name"
                                        className="bg-gray-900 placeholder-gray-600 border-secondary text-white sm:text-md rounded-xl block w-full p-2.5"
                                        placeholder="Praneeth Chandra"
                                        id='name'
                                        onChange={(e) => setName(e.target.value)}
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        className="bg-gray-900 placeholder-gray-600 border-secondary text-white sm:text-md rounded-xl block w-full p-2.5"
                                        placeholder="name@company.com"
                                        id='email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-gray-900 placeholder-gray-600 border-secondary text-white sm:text-md rounded-xl block w-full p-2.5 "
                                        id='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block mb-2 text-sm font-medium text-white dark:text-white"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-gray-900  placeholder-gray-600  text-white sm:text-md rounded-xl block w-full p-2.5"
                                        id='confirm-password'
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required=""
                                    />
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            aria-describedby="terms"
                                            type="checkbox"
                                            className="w-4 h-4 border border-sky-500 rounded bg-sky-500 focus:ring-3 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            required=""
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="terms"
                                            className="font-light text-gray-500 dark:text-gray-300"
                                        >
                                            I accept the{" "}
                                            <a
                                                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                                href="#"
                                            >
                                                Terms and Conditions
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center mt-4 mb-4 justify-center">
                                    <div className="group relative">
                                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 to-sky-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
                                        <button className="relative rounded-full bg-black px-24 py-3 text-lg text-white">
                                            Create an account
                                        </button>
                                    </div>
                                </div>
                                <p className="text-md font-light text-gray-500 dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-md text-gray-500 hover:underline dark:text-primary-500"
                                    >
                                        Login here
                                    </Link>
                                </p>
                            </form>

                            <div className="mt-10 space-y-4 text-gray-600 text-center ">
                                <p className="text-s">This site is protected by reCAPTCHA and the <a href="https://policies.google.com/privacy?hl=en-US" className="underline">Google Privacy Policy</a> and <a href="https://policies.google.com/terms?hl=en-US" className="underline">Terms of Service</a> apply.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </div >


        </>
    );
}

export default SignUp;
