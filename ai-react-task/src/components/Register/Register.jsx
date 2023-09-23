import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import img from '../../assets/loginReg.jpg'
import Swal from 'sweetalert2';
import { Authcontext } from '../AuthProvider/AuthProvider';
import GoogleLogin from '../SocialLogin/GoogleLogin';




const Register = () => {
    const { createdByEmailPass, updateUserInfo } = useContext(Authcontext);
    const [passwordType, setPasswordType] = useState('password');
    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    // handle password type change
    const handlePassType = () => {
        if (passwordType === 'password') {
            setPasswordType('text')
        }
        else {
            setPasswordType('password')
        }
    }

    // handle submit
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        setLoading(true);

        createdByEmailPass(email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);

                // user create to database
                const saveUser = { name, email };

                fetch('https://server-khaki-one.vercel.app/api/register', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(saveUser)

                }).then(res => res.json())
                    .then(data => {
                        if (data.insertedId) {

                            Swal.fire({
                                position: 'top-center',
                                icon: 'success',
                                title: 'User created successfully.',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                        console.log(data)
                    })

                // update profile
                updateUserInfo(name)
                    .then()
                    .catch(error => {
                        console.log(error)
                    });
                navigate('/login');
            })
            .catch(error => {
                console.log(error);
                if (error.message === 'Firebase: Error (auth/invalid-email).') {
                    setLoading(false);
                    setPassError('');
                    setEmailError('Please provide valid email format')
                }
                else if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                    setLoading(false);
                    setPassError('');
                    setEmailError('Already account created for this email')
                }
                else if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                    setLoading(false);
                    setEmailError('');
                    setPassError('Password should be at least 6 characters')
                }
                else {
                    setPassError('');
                    setLoading(false);
                }

            })

        // console.log(name, email, password, photo)
    }



    return (
        <section className='p-4 md:py-12 md:px-16'>
            <div className=" mt-5">
                <div className="w-full mx-auto lg:w-3/4 lg:flex items-center justify-center bg-base-100">
                    <div>
                        <img className='w-[600px] hidden lg:block' src={img} alt="" />
                    </div>
                    <div className=" md:w-1/2 shadow-2xl">
                        <div>
                            <div className="card-body  border-solid border-2 rounded-lg">
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold mb-3">Register</h1>
                                    <p>Already have an account?  <Link className='text-primary' to='/login'>Login</Link></p>
                                </div>
                                {/* form start */}
                                <form onSubmit={handleSubmit} >
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Name</span>
                                        </label>
                                        <input type="text" name='name' placeholder="Name" required className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="text" name='email' placeholder="Email" required className="input input-bordered" />
                                        <p className='text-red-500 text-sm'>
                                            <small>{emailError}</small>
                                        </p>
                                    </div>
                                    <div className="form-control relative">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input type={passwordType} name='password' placeholder="Password" required className="input input-bordered pr-10" />
                                        <p className='text-red-500 text-sm'>
                                            <small>{passError}</small>
                                        </p>
                                        <div className="absolute right-1 top-11 p-2 rounded-md" onClick={handlePassType}>
                                            {
                                                passwordType === 'password' ?
                                                    <span>  < FaEye ></FaEye></span>
                                                    :
                                                    <span> <FaEyeSlash></FaEyeSlash></span>
                                            }
                                        </div>
                                    </div>

                                    <div className="form-control mt-6">
                                        <button type='submit' className="py-2 btn-primary rounded-lg">Register</button>
                                    </div>
                                </form>
                                {/* form end */}
                                <div>
                                    <div className="divider">OR</div>
                                    <GoogleLogin />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;