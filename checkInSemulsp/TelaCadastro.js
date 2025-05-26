import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

export default function TelaCadastro({ onCadastro, irParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const [erros, setErros] = useState({});
  const [formValido, setFormValido] = useState(false);

  const valores = { nome, email, cpf, senha };

  useEffect(() => {
    validarCampos();
  }, [nome, email, cpf, senha]);

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = 11 - (soma % 11);
    let dig1 = resto > 9 ? 0 : resto;
    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = 11 - (soma % 11);
    let dig2 = resto > 9 ? 0 : resto;

    return dig2 === parseInt(cpf.charAt(10));
  };

  const validarCampos = () => {
    const novosErros = {};

    if (nome.trim().length < 3) novosErros.nome = 'Mínimo 3 letras.';
    if (!email.includes('@') || !email.includes('.')) novosErros.email = 'E-mail inválido.';
    if (!validarCPF(cpf)) novosErros.cpf = 'CPF inválido.';
    if (senha.length < 4) novosErros.senha = 'Mínimo 4 caracteres.';

    setErros(novosErros);
    setFormValido(Object.keys(novosErros).length === 0);
  };

  const renderIcon = (campo) => {
    if (erros[campo]) return <Icon name="x-circle" size={20} color="red" />;
    if (!erros[campo] && valores[campo].length > 0)
      return <Icon name="check-circle" size={20} color="green" />;
    return null;
  };

  const handleCadastro = () => {
    if (formValido) {
      onCadastro(nome, email, cpf, senha);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Cadastro realizado!',
        text2: 'Sua conta foi criada com sucesso.',
        visibilityTime: 3000,
        topOffset: 50,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />
        {renderIcon('nome')}
      </View>
      {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {renderIcon('email')}
      </View>
      {erros.email && <Text style={styles.erro}>{erros.email}</Text>}

      <View style={styles.inputWrapper}>
        <TextInputMask
          style={styles.input}
          type={'cpf'}
          placeholder="CPF"
          placeholderTextColor="#999"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
        {renderIcon('cpf')}
      </View>
      {erros.cpf && <Text style={styles.erro}>{erros.cpf}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {renderIcon('senha')}
      </View>
      {erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}

      <TouchableOpacity
        style={[styles.buttonPrimary, { opacity: formValido ? 1 : 0.6 }]}
        onPress={handleCadastro}
        disabled={!formValido}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={irParaLogin}>
        <Text style={styles.buttonText}>Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6900',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  erro: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonPrimary: {
    backgroundColor: '#00d084',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#9b51e0',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
});
