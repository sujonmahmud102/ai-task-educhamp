import { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Messages from './components/Messages/Messages';
import { Authcontext } from './components/AuthProvider/AuthProvider';

const App = () => {
  const [prompts, setprompts] = useState([]);
  const { user } = useContext(Authcontext);


  useEffect(() => {
    const url = `https://server-khaki-one.vercel.app/api/prompts?creatorEmail=${user?.email}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setprompts(data)
      })
  }, [prompts]);


  return (
    <div className="h-screen">
      <div className="">
        <Navbar />
      </div>
      <main className="mx-auto">
        <div className="bg-gray-300 p-8 rounded-lg ">
          <div className="h-[500px] overflow-y-auto ">
            <Messages prompts={prompts} />
          </div>
          <Home />
        </div>
      </main>
    </div>
  );
};

export default App;

