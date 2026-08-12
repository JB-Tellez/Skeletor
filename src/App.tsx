import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (name: string, password: string) => {
    console.log('User logged in:', name)
    console.log('Password is not null:', !!password)
    setIsLoggedIn(true)
  }

  return (
    <>
      <section id="center">
        {isLoggedIn ?
          <span id="login-status">Logged In</span>
          : <Login onLogin={handleLogin} />
        }
      </section>
    </>
  )
}

export default App
