import clipboardCopy from 'clipboard-copy';
import { AiFillDelete, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { Authcontext } from '../AuthProvider/AuthProvider';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Messages = ({ prompts }) => {
    const { user } = useContext(Authcontext);
    const navigate = useNavigate();


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
                toast.success('Text copied, you can share now!')

            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    };


    // handle delete chat
    const handleDelete = (id) => {
        const url = `https://server-khaki-one.vercel.app/api/delete/${id}`
        // console.log(id)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(url, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log(data);
                        if (data.deletedCount === 1) {
                            toast.success('Message deleted!')
                        }
                    })
            }
        })
    }

    return (
        <div>
            {!user && <h3 className="text-xl font-bold flex justify-center items-center mt-16">
                You have to login first to type
            </h3>}
            {
                prompts.map((p, index) => (
                    <div key={index} className='my-2'>
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className=" bg-black text-white px-2 py-1 rounded-full text-sm">
                                    <p className=''>
                                        {p.creatorName?.slice(0, 1) || "U"}:
                                    </p>
                                </div>
                            </div>
                            <div className="chat-bubble text-justify">
                                {p.prompt}
                            </div>
                        </div>

                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className=" bg-secondary text-white px-2 py-1 rounded-full text-sm">
                                    <p className=''> AI:
                                    </p>
                                </div>
                            </div>
                            <div className="chat-bubble chat-bubble-secondary text-justify">
                                {p.story}
                            </div>
                        </div>

                        <div>
                            <button
                                className={`p-2 hover:bg-base-200 rounded-lg ${p.upvoted && p.upvoted.includes(user?.uid)
                                    ? 'text-blue-500'
                                    : ''
                                    }`}
                                title='save'
                                onClick={() => handleUpvotes(p)}> <AiFillHeart /> </button>
                            <button
                                className='p-2 hover:bg-base-200 rounded-lg'
                                title='share'
                                onClick={() => handleCopy(p.story)} > <AiOutlineShareAlt /> </button>
                            <Toaster />
                            <button
                                className="p-2 hover:bg-red-200 rounded-lg"
                                title='delete'
                                onClick={() => handleDelete(p._id)}> <AiFillDelete /> </button>
                        </div>
                    </div>

                ))
            }
        </div>
    );
};

export default Messages;