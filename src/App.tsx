import React from 'react';
import './App.css'

interface Jogador {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  codinome?: string;
  grupo: "A Liga da Justiça" | "Os Vingadores";
}

const url = "http://localhost:5191/jogadores";

const getJogadores = async () => {
  const req = await fetch(url);
  const json = await req.json();
  return json;
}


function App() {

  const [fields, setFields] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    grupo: "A Liga da Justiça",
  });
  const [openModal, setOpenModal] = React.useState(false);

  const [jogadores, setJogadores] = React.useState([] as Jogador[]);



  const [edicao, setEdicao] = React.useState(false);

  React.useEffect(() => {
    getJogadores().then(value => setJogadores(value));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      fields[e.target.name as keyof typeof fields] = e.target.value;
      setFields({...fields});
  };

  const cadastrar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const req = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields) });
      const json = await req.json();
      if (!req.ok) {
        window.alert(json?.mensagem)
      } else {
        setFields({ email: '', grupo: "A Liga da Justiça", nome: '', telefone: '' });
      }
    } catch (error: any) {
      console.log(error.mensagem);
    }
    getJogadores().then(value => setJogadores(value));
  }

  const editarJogador = async () => {
    try {
      const req = await fetch(`${url}/${(fields as any).id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields) });
      const json = await req.json();
      if (!req.ok) {
        window.alert(json?.mensagem)
      } else {
        setFields({ email: '', grupo: "A Liga da Justiça", nome: '', telefone: '' });
        setEdicao(false);
      }
    } catch (error: any) {
      console.log(error.mensagem);
    }
    getJogadores().then(value => setJogadores(value));
  }

  const remover = async (id: number) => {
    const req = await fetch(`${url}/${id}`, { method: 'DELETE'});
    const json = await req.json();
    if (!req.ok) {
      window.alert(json?.mensagem)
    } 
    getJogadores().then(value => setJogadores(value));
  }

  const editar =  (jogador: Jogador) => {
    setFields(() => ({...jogador} as any));
    setEdicao(true);
  };
  
  return (
    <div className="app">
        <form className="form">
          <h1>Cadastro do jogador UOL</h1>
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" name="nome" placeholder="Nome" value={fields.nome} onChange={onChange}/>

          <label htmlFor="email">E-mail</label>
          <input type="text" name="email" placeholder="E-mail" value={fields.email} onChange={onChange}/>

          <label htmlFor="telefone">Telefone</label>
          <input type="text" name="telefone" placeholder="Telefone" value={fields.telefone} onChange={onChange}/>
          <p>Quero ser do grupo: </p>
          <div className="radioGroup">
            <div>
              <input type="radio" name="grupo"  checked={fields.grupo === "A Liga da Justiça"} value="A Liga da Justiça" onChange={onChange}/> Liga da Justiça
            </div>
            <div>
              <input type="radio" name="grupo" checked={fields.grupo === "Os Vingadores"}  value="Os Vingadores" onChange={onChange}/> Os Vingadores
            </div>
          </div>
          <div className="actions">
            <button type="submit" onClick={edicao ? (e) => { 
              e.preventDefault();
              editarJogador();
            } : cadastrar }>{ edicao ? 'Edição' : 'Cadastrar'}</button>
            <button type="button" onClick={() => setOpenModal(true)}>Listar jogadores</button>
          </div>  
        </form>
        <div className="div">
        <table style={{ display: openModal ? 'table' : 'none' }}>
              <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Codinome</th>
                    <th>Grupo</th>
                    <th></th>
                  </tr>
              </thead>
               <tbody>
                { jogadores.map(j => {
                    return (
                      <tr key={j.id}>
                        <td>{j.nome}</td>
                        <td>{j.email}</td>
                        <td>{j.telefone}</td>
                        <td>{j.codinome}</td>
                        <td>{j.grupo}</td>
                        <td>
                          <div className="table-action">
                            <button onClick={() => editar(j)}>Editar</button>
                            <button onClick={() => remover(j.id as number)}>Remover</button>
                          </div>
                        </td>
                      </tr>
                    );
                })}
       
               </tbody>
          </table>
        </div>
    </div>
  );
}

export default App
