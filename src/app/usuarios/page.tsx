"use client";
import { ChangeEventHandler, useEffect, useState } from "react";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  user: Usuario;
  handleExcluir: (id: number) => void;
}

const UserList = ({ user, handleExcluir }: UserListProps) => {
  return (
    <>
      <p key={user.id}>
        {user.name} - {user.email}
      </p>
      <button onClick={() => handleExcluir(user.id)}> Remover </button>
    </>
  );
};

interface UserFormProps {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (name: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const UserForm = ({
  name,
  email,
  setName,
  setEmail,
  handleSubmit,
}: UserFormProps) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="email"
          placeholder="Digite o email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <button type="submit"> Adicionar </button>
      </form>
    </>
  );
};

const URL = "https://jsonplaceholder.typicode.com/users";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetch(URL);
      if (data.status !== 200) {
        console.log("Erro ao fazer a requisição");
        return;
      }
      const parsedData = await data.json();
      setUsuarios(parsedData);
      setUsuariosFiltrados(parsedData);
    };

    fetchUserData();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    let maior = usuarios.reduce((max, produtoAtual) => {
      return max.id > produtoAtual.id ? max : produtoAtual;
    }, usuarios[0]);

    console.log(maior);

    const usuario: Usuario = {
      id: maior.id + 1,
      name: name,
      email: email,
    };

    setUsuarios([...usuarios, usuario]);
    setUsuariosFiltrados([...usuarios, usuario]);

    setName("");
    setEmail("");
  };

  const handleFiltrar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("nameFilter") as string;

    if (name.trim() === "") {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const usuariosFiltrados = usuarios.filter((u) =>
      u.name.toLowerCase().includes(name.toLowerCase())
    );
    setUsuariosFiltrados(usuariosFiltrados);
  };

  const handleExcluir = (id: number) => {
    const novaListaUsuarios = usuarios.filter((u) => u.id !== id);
    setUsuarios(novaListaUsuarios);
    setUsuariosFiltrados(novaListaUsuarios);
  };

  return (
    <div>
      <h1>Usuários Page</h1>
      {usuariosFiltrados.map((user) => {
        return (
          <UserList
            key={user.id}
            user={user}
            handleExcluir={handleExcluir}
          ></UserList>
        );
      })}

      <UserForm
        name={name}
        email={email}
        setName={setName}
        setEmail={setEmail}
        handleSubmit={handleSubmit}
      ></UserForm>

      <hr></hr>

      <form onSubmit={handleFiltrar}>
        <input
          type="text"
          placeholder="Digite um nome para buscar"
          name="nameFilter"
        ></input>
        <button type="submit"> Filtrar </button>
      </form>
    </div>
  );
};

export default UsuariosPage;
