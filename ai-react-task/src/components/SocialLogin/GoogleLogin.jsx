import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaGoogle } from 'react-icons/fa';
import { Authcontext } from '../AuthProvider/AuthProvider';



const GoogleLogin = () => {
    const { createdByGoogle } = useContext(Authcontext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    console.log(location)

    // Function to handle Google registration
    const registerByGoogle = () => {
        createdByGoogle()
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);

                // Create an object to save in database
                createdByGoogle()
                    .then(result => {
                        const loggedUser = result.user;
                        console.log(loggedUser);
                        const saveUser = { name: loggedUser.displayName, email: loggedUser.email, image: loggedUser.photoURL };

                        fetch('https://server-khaki-one.vercel.app/api/register', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(saveUser)

                        })
                            .then(res => res.json())
                            .then(data => {
                                // console.log(data);

                            })
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'User Login Successful.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        // Navigate to the desired location
                        navigate(from, { replace: true });

                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div onClick={registerByGoogle} className='flex justify-center items-center btn btn-outline btn-light'>
            <div>
                <FaGoogle></FaGoogle>
            </div>
            <button className='ml-4'>
                Continue With Google
            </button>
        </div>
    );
};

export default GoogleLogin;
