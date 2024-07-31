import { useEffect, useState, useRef } from 'react';
import './style.css';
import Trash from '../../assets/trash.svg';
import api from '../../services/api';

function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  const clearFields = () => {
    if (inputName.current) inputName.current.value = '';
    if (inputAge.current) inputAge.current.value = '';
    if (inputEmail.current) inputEmail.current.value = '';
  };

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios');
    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    const name = inputName.current.value;
    const age = inputAge.current.value;
    const email = inputEmail.current.value;

    
    if (!email) {
      setError('O e-mail é obrigatório.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Insira um endereço de e-mail válido.');
      return;
    }

    await api.post('/usuarios', {
      name: name,
      age: age,
      email: email
    });

    getUsers();
    clearFields();
    setError('');
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`);
    getUsers();
    clearFields();
    setError('');
  }

  useEffect(() => {
    getUsers();
  }, []);

  const isValidEmail = (email) => {
    // Simples regex para validar formato de e-mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuários</h1>
        <input type='text' name='nome' placeholder='Nome' ref={inputName} />
        <input type='number' name='idade' placeholder='Idade' ref={inputAge} />
        <input type='email' name='email' placeholder='E-mail' ref={inputEmail} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} alt="Delete"/>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
