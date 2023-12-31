import { useContext, useState } from "react";
import { Authcontext } from "../AuthProvider/AuthProvider";
import { AiOutlineSend } from "react-icons/ai";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


const Home = () => {
    const { user } = useContext(Authcontext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);


    // handle submit
    const handleSubmitPrompt = (e, promptValue) => {
        e.preventDefault();

        // check user logged in or not
        if (!user) {
            return Swal.fire({
                title: 'You have to login first to type',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            })
        }

        setLoading(true);
        const prompt = promptValue || e.target.prompt.value;

        fetch('https://server-khaki-one.vercel.app/api/prompts', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptValue || prompt,
                creatorName: user.displayName,
                creatorEmail: user.email
            })

        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setLoading(false);
                formRef.current.reset();

            })

        // console.log(prompt)
    }

    const handleTextareaKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // console.log(e)
            const promptValue = e.target.value;
            handleSubmitPrompt(e, promptValue);
        }
    };

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmitPrompt} className="">
                <div className="mb-4 flex items-center justify-center">
                    <div className="w-full">
                        <textarea
                            type="text"
                            name="prompt"
                            placeholder='Enter a Prompt'
                            disabled={loading || !user}
                            className="px-2 flex items-center justify-center w-full border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                            required
                            onKeyPress={handleTextareaKeyPress}
                        >
                        </textarea>

                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-4 btn "
                        disabled={loading}
                    >
                        {
                            loading ? <span className="loading loading-infinity loading-md text-white"></span> : <AiOutlineSend />
                        }

                    </button>

                </div>
            </form>
        </div>
    );
};

export default Home;