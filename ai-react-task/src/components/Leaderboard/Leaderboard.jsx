import { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Authcontext } from '../AuthProvider/AuthProvider';
import clipboardCopy from 'clipboard-copy';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillHeart, AiOutlineShareAlt } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const { user } = useContext(Authcontext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (leaderboard.length === 0) {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    }, []);

    useEffect(() => {
        fetch("https://server-khaki-one.vercel.app/api/prompts")
            .then(res => res.json())
            .then(data => {
                setLeaderboard(data
                    .filter(p => p.upvoted)
                    .sort((a, b) => b.upvoted.length - a.upvoted.length));
            })
            .catch(error => {
                setIsLoading(false);
                console.error(error);
            });

    }, [leaderboard]);


    const handleUpvotes = (p) => {
        // check user logged in or not
        if (!user) {
            return Swal.fire({
                title: 'You have to login first to vote',
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


        const url = `https://server-khaki-one.vercel.app/api/upvoted/${p._id}`
        fetch(url, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ uid: user.uid })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })


    }

    const handleCopy = (textToCopy) => {
        clipboardCopy(textToCopy)
            .then(() => {
                toast.success('text copied, you can share now!')

            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    };



    return (
        <div className=''>
            <Navbar />
            {
                isLoading && <div className='text-center'>
                    <span className="loading loading-bars loading-lg mt-10"></span>
                </div>
            }
            {
                leaderboard.length === 0 && <h3 className='mt-12 text-center'>empty</h3>
            }

            {
                leaderboard.map((p, index) => (
                    <div key={index} className='border bg-blue-100 md:my-12 m-4 md:mx-16 p-4 shadow-xl rounded-2xl'>
                        <div className="text-xl font-bold flex gap-2">
                            <p>Text: </p>
                            <h3 className=''>  {p.prompt} </h3>
                        </div>
                        <div className="text-justify text-lg mt-2 flex gap-2 ">
                            <p>Reply: </p>
                            <h3 className='whitespace-pre-wrap'>{p.story.trimStart()} </h3>
                        </div>

                        <div className='flex items-center gap-5 my-2'>
                            <button
                                className="p-2 flex items-center gap-3"
                                title='save'
                                onClick={() => handleUpvotes(p)}>
                                Upvoted: {p.upvoted.length} <span className={`${p.upvoted && p.upvoted.includes(user?.uid)
                                    ? 'text-blue-500'
                                    : ''
                                    }`}> <AiFillHeart /></span>
                            </button>
                            <button
                                className='p-2'
                                title='share'
                                onClick={() => handleCopy(p.story)} > <AiOutlineShareAlt /> </button>
                            <Toaster />
                            <p>Creator: {p.creatorName} </p>
                        </div>
                    </div>

                ))
            }
        </div >
    );
};

export default Leaderboard;