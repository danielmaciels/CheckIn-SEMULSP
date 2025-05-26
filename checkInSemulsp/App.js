import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TelaLogin from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaCheckin from './TelaCheckin';
import Toast from 'react-native-toast-message';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [telaAtual, setTelaAtual] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('@usuario_logado');
      if (usuarioSalvo) {
        setUsuarioLogado(JSON.parse(usuarioSalvo));
        setTelaAtual('checkin');
      }
    } catch (error) {
      console.log('Erro ao carregar usuário:', error);
    }
  };

  const salvarUsuario = async (usuario) => {
    try {
      await AsyncStorage.setItem('@usuario_logado', JSON.stringify(usuario));
    } catch (error) {
      console.log('Erro ao salvar usuário:', error);
    }
  };

  const limparUsuario = async () => {
    try {
      await AsyncStorage.removeItem('@usuario_logado');
      setUsuarioLogado(null);
      setTelaAtual('login');
    } catch (error) {
      console.log('Erro ao limpar usuário:', error);
    }
  };

  const handleCadastro = (nome, email, cpf, senha) => {
    if (nome && email && cpf && senha) {
      const usuarioExiste = usuarios.find((u) => u.cpf === cpf);
      if (usuarioExiste) {
        Toast.show({
          type: 'error',
          text1: 'CPF já cadastrado',
          text2: 'Tente novamente com outro CPF.',
        });
      } else {
        const novoUsuario = { nome, email, cpf, senha };
        setUsuarios([...usuarios, novoUsuario]);
        Toast.show({
          type: 'success',
          text1: 'Cadastro realizado!',
          text2: `Bem-vindo(a), ${nome}!`,
        });
        setTelaAtual('login');
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor, preencha todos os campos.',
      });
    }
  };

  const handleLogin = (cpf, senha) => {
    const usuario = usuarios.find((u) => u.cpf === cpf && u.senha === senha);
    if (usuario) {
      setUsuarioLogado(usuario);
      salvarUsuario(usuario);
      setTelaAtual('checkin');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login falhou',
        text2: 'CPF ou senha inválidos.',
      });
    }
  };

  const handleLogout = () => {
    limparUsuario();
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
      Toast.show({
        type: 'success',
        text1: 'Check-in registrado!',
        text2: `Local: ${local}`,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os dados do check-in.',
      });
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
          onLogout={handleLogout} // lembre de usar o botão de logout na TelaCheckin
        />
      )}
      <Toast />
    </View>
  );
}
