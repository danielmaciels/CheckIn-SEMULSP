import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import TelaLogin from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaCheckin from './TelaCheckin';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [telaAtual, setTelaAtual] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const handleCadastro = (nome, email, cpf, senha) => {
    if (nome && email && cpf && senha) {
      const usuarioExiste = usuarios.find((u) => u.cpf === cpf);
      if (usuarioExiste) {
        alert('Este CPF já está cadastrado.');
      } else {
        const novoUsuario = { nome, email, cpf, senha };
        setUsuarios([...usuarios, novoUsuario]);
        alert(`Cadastro realizado! Bem-vindo(a), ${nome}!`);
        setTelaAtual('login');
      }
    } else {
      alert('Preencha todos os campos.');
    }
  };

  const handleLogin = (cpf, senha) => {
    const usuario = usuarios.find((u) => u.cpf === cpf && u.senha === senha);
    if (usuario) {
      setUsuarioLogado(usuario);
      setTelaAtual('checkin');
    } else {
      alert('CPF ou senha inválidos.');
    }
  };

  const handleCheckin = (local, descricao, data, horario) => {
  if (local && descricao && data && horario) {
    const novoCheckin = {
      id: Date.now().toString(),
      usuario: usuarioLogado.nome,
      local,
      descricao,
      data,
      horario,
    };
    setCheckIns([novoCheckin, ...checkIns]);
  } else {
    alert('Preencha todos os campos do check-in.');
  }
};

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {telaAtual === 'login' ? (
        <TelaLogin onLogin={handleLogin} irParaCadastro={() => setTelaAtual('cadastro')} />
      ) : telaAtual === 'cadastro' ? (
        <TelaCadastro onCadastro={handleCadastro} irParaLogin={() => setTelaAtual('login')} />
      ) : (
        <TelaCheckin
          usuario={usuarioLogado}
          checkIns={checkIns}
          onCheckin={handleCheckin}
        />
      )}
    </View>
  );
}
