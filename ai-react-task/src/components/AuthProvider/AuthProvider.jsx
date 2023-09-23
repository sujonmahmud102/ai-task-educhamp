import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../../firebase/firebase.config';


const auth = getAuth(app);

export const Authcontext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('null');
    const [loading, setLoading] = useState(true);


    // user create by email & password
    const createdByEmailPass = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // user signIn by email & password
    const signInByEmailPass = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    // user created by google
    const provider = new GoogleAuthProvider;
    const createdByGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, provider)
    }

    // currently signed-in user observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
            // console.log('logged user', loggedUser);
            setUser(loggedUser);
            setLoading(false);
        })
        return () => {
            unsubscribe();
        }

    }, [])

    // update profile
    const updateUserInfo = (name) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
        });
    }

    // sign out
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const authInfo = {
        user,
        createdByEmailPass,
        createdByGoogle,
        updateUserInfo,
        signInByEmailPass,
        logOut,
        loading
    };

    return (
        <Authcontext.Provider value={authInfo}>
            {children}
        </Authcontext.Provider>
    );
};

export default AuthProvider;