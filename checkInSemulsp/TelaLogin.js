import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ImageBackground,
} from 'react-native';
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
    <ImageBackground
      source={{ uri: 'https://i.ibb.co/gMj2NhCN/semulsp.png' }}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={{ uri: 'https://scontent.fpll10-1.fna.fbcdn.net/v/t39.30808-6/327159019_1210562372904485_3985593037879299833_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGR3lO58xVJK4Zb662urSnFNvw_JCQEpmk2_D8kJASmab79dwru1P5vmoL9C44X76tl3kjy2lF3RzoZCiQcd6nd&_nc_ohc=hY5RUcWTFi8Q7kNvwGZm9s4&_nc_oc=Adn7UwirK4MZYM9MasMAg0LvDB1sf_qMUdgZrg5JszAkueWOiOjgdtbcWhBI7NP2XL4anzpLGWBA-3ShSkan5dUi&_nc_zt=23&_nc_ht=scontent.fpll10-1.fna&_nc_gid=Qqb9KqpJr6uzusLts4qdWQ&oh=00_AfO3fz_24vYXREbrrz7PwH7mgtkEg1CXTTJMDPauyqiT_g&oe=685E2A03' }}
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // mais escuro para imagem clara
    justifyContent: 'center',
    padding: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
    color: 'white',
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
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
