import { useState } from 'react'
import './Login.css'

type LoginProps = {
  onLogin: (name: string, password: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (name && password) {
      onLogin(name, password)
    }
  }

  return (
    <div data-testid="login-form-id" className="login-form">
      <h2>Login</h2>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="button"
        id="log-in-button"
        onClick={handleSubmit}
      >
        Log In
      </button>
    </div>
  )
}
