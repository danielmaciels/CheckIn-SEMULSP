import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function TelaLogin({ onLogin, irParaCadastro }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const [erros, setErros] = useState({});
  const [formValido, setFormValido] = useState(false);

  const [cpfTouched, setCpfTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

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

  useEffect(() => {
    validarCampos();
  }, [cpf, senha]);

  const validarCampos = () => {
    const novosErros = {};
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');

    if (!validarCPF(cpfLimpo)) novosErros.cpf = 'CPF inválido.';
    if (senha.length < 4) novosErros.senha = 'Senha deve ter no mínimo 4 caracteres.';

    setErros(novosErros);
    setFormValido(Object.keys(novosErros).length === 0);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://th.bing.com/th/id/OIP.OtQ4c5DzNsxGoLOCCkA2DAHaHa?rs=1&pid=ImgDetMain' }}
        style={styles.image}
      />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Acesse sua conta para realizar o check-in</Text>

      <View style={styles.inputWrapper}>
        <TextInputMask
          style={styles.input}
          placeholder="CPF"
          type={'cpf'}
          placeholderTextColor="#999"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
          onBlur={() => setCpfTouched(true)}
        />
      </View>
      {cpfTouched && erros.cpf && <Text style={styles.erro}>{erros.cpf}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          onBlur={() => setSenhaTouched(true)}
        />
      </View>
      {senhaTouched && erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}

      <TouchableOpacity
        style={[styles.buttonPrimary, { opacity: formValido ? 1 : 0.6 }]}
        onPress={() => onLogin(cpf, senha)}
        disabled={!formValido}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={irParaCadastro}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fe5f2f',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 30,
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
    color: 'black',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonPrimary: {
    backgroundColor: '#00d084',
    paddingVertical: 15,
    borderRadius: 10,
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
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    marginBottom: 30,
  },
});
