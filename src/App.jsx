import './css/app.css';
import { useState, useEffect } from 'react';

import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Signup from './components/Signup';
import Login from './components/Login';

import TaskInput from './components/TaskInput';
import DroppableArea from './components/DroppableArea';


function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || '');
          setTasks(data.tasks || []);
          setInProgressTasks(data.inProgressTasks || []);
          setCompletedTasks(data.completedTasks || []);
          setIsLight(data.isLight || false);
        }
      };
      fetchData();
    }
  }, [user])

  const saveUserData = async () => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        username,
        tasks,
        inProgressTasks,
        completedTasks,
        isLight
      });
    }
  };

  useEffect(() => {
    if (user) saveUserData();

  }, [tasks, inProgressTasks, completedTasks, isLight, username])

  const handleLogin = (user, newUsername = null) => {
    setUser(user);
    if (newUsername) setUsername(newUsername);
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUsername('');
      setTasks([]);
      setInProgressTasks([]);
      setCompletedTasks([]);
      setIsLight(false);

      document.body.style.backgroundColor = 'white';
      console.log('user logged out')
    } catch (error) {
      console.error('logout error', error.message);
    }
  }

  const addToTasks = (task) => {
    if (tasks.includes(task) || task.trim() === "") return;
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const moveTask = (task, updateList) => {
    setTasks((prev) => prev.filter((t) => t !== task));
    setInProgressTasks((prev) => prev.filter((t) => t !== task));
    setCompletedTasks((prev) => prev.filter((t) => t !== task));

    updateList((prev) => [...prev, task]);
  };

  const deleteTask = (task) => {
    setTasks((prev) => prev.filter((t) => t !== task));
    setInProgressTasks((prev) => prev.filter((t) => t !== task));
    setCompletedTasks((prev) => prev.filter((t) => t !== task));
  }

  const toggleTheme = () => {
    if (isLight) {
      document.body.style.backgroundColor = "rgb(236, 236, 236)";
    } else {
      document.body.style.backgroundColor = "black";
    }
    setIsLight(!isLight);
  };

  return !user ? (
      <>
      <div className='authentication-container'>
      <p className='signup-message'>Create an account to save data and access from anywhere!</p>
      <Signup onLogin={handleLogin} />
      <Login onLogin={handleLogin} />
      </div>
    
      <div className='droppable-areas-container'>
      <TaskInput 
        addToTasks={addToTasks} 
        setIsLight={toggleTheme}
        isLight={isLight}
        />
        <DroppableArea
          title='To Do'
          tasks={tasks}
          updateList={setTasks}  
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
        <DroppableArea
          title='In Progress'
          tasks={inProgressTasks}
          updateList={setInProgressTasks}  
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
        <DroppableArea
          title='Completed'
          tasks={completedTasks}
          updateList={setCompletedTasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
      </div>
      
    </>
  ) : (
    <>
      <button onClick={handleLogout} className='logout-button'>Logout</button>
      <div className='droppable-areas-container'>
      <TaskInput 
        addToTasks={addToTasks} 
        setIsLight={toggleTheme}
        isLight={isLight}
        />
        <DroppableArea
          title='To Do'
          tasks={tasks}
          updateList={setTasks}  
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
        <DroppableArea
          title='In Progress'
          tasks={inProgressTasks}
          updateList={setInProgressTasks}  
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
        <DroppableArea
          title='Completed'
          tasks={completedTasks}
          updateList={setCompletedTasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
          isLight={isLight}
        />
      </div>
    </>
  )
}

export default App;
