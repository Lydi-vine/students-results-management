import react, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('https://localhost:1234/login', {username, password});
            if(res.data.message === "Login successful"){
                onLogin(res.data.userId);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials')
            }
        } catch (err) {
            console.error(err);
            setError('Incorect username or password');
        };
    };

    return(
        <div> 
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input value={username} placeholder='username' onChange={(e) => setUsername(e.target.value)} />
                <input value={password} placeholder='password' type='password' onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
                <p>Don't have an account? <span style={{color:'blue', cursor: 'pointer'}} onClick={() => navigate('/register')}>Register</span></p>
            </form>
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    )
}