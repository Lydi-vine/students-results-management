import react, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:1234/register', {username, password,});
            if(res.data.success){
                alert("Registration successfull! You can now login");
                navigate('/');
            } else {
                alert(res.data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            alert('Username already taken');
        }
    };

    return(
        <div>
            <h2>Register here</h2>
            <form onSubmit={handleRegister}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Username'/>
                <button type='submit'>Register</button>
                <p> Already have an account?{" "} <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/")}> Login </span> </p>

            </form>
        </div>
    )


}
export default Register;