import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TelaLogin from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaCheckin from './TelaCheckin';
import Toast from 'react-native-toast-message';

// Função utilitária para formatar Date em 'dd/mm/yyyy'
const formatarData = (date) => {
  const d = new Date(date);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Função para verificar se a data é dia útil (segunda a sexta)
const isDiaUtil = (date) => {
  const d = new Date(date);
  const diaSemana = d.getDay(); // 0 = domingo, 6 = sábado
  return diaSemana !== 0 && diaSemana !== 6;
};

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [telaAtual, setTelaAtual] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@usuario_logado');
        const usuariosSalvos = await AsyncStorage.getItem('@usuarios');
        const checkinsSalvos = await AsyncStorage.getItem('@checkins');

        if (usuariosSalvos) setUsuarios(JSON.parse(usuariosSalvos));
        if (checkinsSalvos) setCheckIns(JSON.parse(checkinsSalvos));
        if (usuarioSalvo) {
          setUsuarioLogado(JSON.parse(usuarioSalvo));
          setTelaAtual('checkin');
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  // Salvar usuário logado no AsyncStorage
  const salvarUsuario = async (usuario) => {
    try {
      await AsyncStorage.setItem('@usuario_logado', JSON.stringify(usuario));
    } catch (error) {
      console.log('Erro ao salvar usuário:', error);
    }
  };

  // Salvar lista de check-ins no AsyncStorage
  const salvarCheckIns = async (novosCheckIns) => {
    try {
      await AsyncStorage.setItem('@checkins', JSON.stringify(novosCheckIns));
    } catch (error) {
      console.log('Erro ao salvar check-ins:', error);
    }
  };

  // Limpar usuário logado
  const limparUsuario = async () => {
    try {
      await AsyncStorage.removeItem('@usuario_logado');
      setUsuarioLogado(null);
      setTelaAtual('login');
    } catch (error) {
      console.log('Erro ao limpar usuário:', error);
    }
  };

  // Verifica vagas para uma dada data e horário (exclui o check-in que está sendo editado)
  const verificarVagasPorDataHorario = (data, horario, idExcluir = null) => {
    const count = checkIns.filter(
      (c) => c.data === data && c.horario === horario && c.id !== idExcluir
    ).length;
    return count < 10; // máximo 10 vagas
  };

  // Cadastro de usuário
  const handleCadastro = async (nome, email, cpf, senha) => {
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
        const novaLista = [...usuarios, novoUsuario];
        setUsuarios(novaLista);
        await AsyncStorage.setItem('@usuarios', JSON.stringify(novaLista));
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

  // Login de usuário
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

  // Logout
  const handleLogout = () => {
    limparUsuario();
  };

  // Novo check-in
  const handleCheckin = (local, descricao, data, horario) => {
    if (local && descricao && data && horario) {
      if (!isDiaUtil(new Date(data))) {
        Toast.show({
          type: 'error',
          text1: 'Data inválida',
          text2: 'Escolha um dia útil (segunda a sexta).',
        });
        return;
      }
      if (!verificarVagasPorDataHorario(data, horario)) {
        Toast.show({
          type: 'error',
          text1: 'Vagas esgotadas',
          text2: `Não há vagas disponíveis para ${data} às ${horario}.`,
        });
        return;
      }
      const novoCheckin = {
        id: Date.now().toString(),
        usuario: usuarioLogado.nome,
        local,
        descricao,
        data,
        horario,
      };
      const novosCheckIns = [novoCheckin, ...checkIns];
      setCheckIns(novosCheckIns);
      salvarCheckIns(novosCheckIns);

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

  // Remover check-in
  const handleDelete = (id) => {
    const novosCheckIns = checkIns.filter((item) => item.id !== id);
    setCheckIns(novosCheckIns);
    salvarCheckIns(novosCheckIns);

    Toast.show({
      type: 'success',
      text1: 'Check-in removido',
    });
  };

  // Editar data e horário do check-in (só 09:00 ou 15:00 como horários válidos)
  const handleEdit = (id, novaData, novoHorario) => {
    if (!novaData || !novoHorario) {
      Toast.show({
        type: 'error',
        text1: 'Dados incompletos',
        text2: 'Data e horário são obrigatórios.',
      });
      return;
    }

    if (!isDiaUtil(new Date(novaData))) {
      Toast.show({
        type: 'error',
        text1: 'Data inválida',
        text2: 'Escolha um dia útil (segunda a sexta).',
      });
      return;
    }

    if (novoHorario !== '09:00' && novoHorario !== '15:00') {
      Toast.show({
        type: 'error',
        text1: 'Horário inválido',
        text2: 'Escolha entre 09:00 ou 15:00.',
      });
      return;
    }

    if (!verificarVagasPorDataHorario(novaData, novoHorario, id)) {
      Toast.show({
        type: 'error',
        text1: 'Vagas esgotadas',
        text2: `Não há vagas para ${novaData} às ${novoHorario}.`,
      });
      return;
    }

    const novosCheckIns = checkIns.map((item) =>
      item.id === id ? { ...item, data: novaData, horario: novoHorario } : item
    );
    setCheckIns(novosCheckIns);
    salvarCheckIns(novosCheckIns);

    Toast.show({
      type: 'success',
      text1: 'Check-in atualizado',
      text2: `Data e horário alterados para ${novaData} às ${novoHorario}.`,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {telaAtual === 'login' ? (
        <TelaLogin
          onLogin={handleLogin}
          irParaCadastro={() => setTelaAtual('cadastro')}
        />
      ) : telaAtual === 'cadastro' ? (
        <TelaCadastro
          onCadastro={handleCadastro}
          irParaLogin={() => setTelaAtual('login')}
        />
      ) : (
        <TelaCheckin
          usuario={usuarioLogado}
          checkIns={checkIns}
          onCheckin={handleCheckin}
          onLogout={handleLogout}
          onDelete={handleDelete}
          onEdit={handleEdit} // Passa a função com edição completa
        />
      )}
      <Toast />
    </View>
  );
}
