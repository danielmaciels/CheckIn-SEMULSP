import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ImageBackground, Animated,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

// Componente DicaCampo com tooltip clicável e animação
const DicaCampo = ({ texto }) => {
  const [mostrar, setMostrar] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mostrar) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [mostrar, fadeAnim]);

  return (
    <View style={styles.dicaWrapper}>
      <TouchableOpacity
        style={styles.bolinha}
        onPress={() => setMostrar(true)}
        activeOpacity={0.7}
      />

      {mostrar && (
        <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
          <Text style={styles.tooltipText}>{texto}</Text>
          <TouchableOpacity onPress={() => setMostrar(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default function TelaCadastro({ onCadastro, irParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const [erros, setErros] = useState({});
  const [formValido, setFormValido] = useState(false);
  const [clicou, setClicou] = useState(false);

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

  const validarSenha = (senha) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const tamanhoOk = senha.length >= 4;
    return temMaiuscula && temMinuscula && temNumero && tamanhoOk;
  };

  const validarCampos = () => {
    const novosErros = {};

    if (nome.trim().length < 3) novosErros.nome = 'Mínimo 3 letras.';
    if (!email.includes('@') || !email.includes('.')) novosErros.email = 'E-mail inválido.';
    if (!validarCPF(cpf)) novosErros.cpf = 'CPF inválido.';
    if (!validarSenha(senha)) novosErros.senha = 'Senha deve ter ao menos 4 caracteres, com letra maiúscula, minúscula e número.';

    setErros(novosErros);
    setFormValido(Object.keys(novosErros).length === 0);
  };

  const handleCadastro = () => {
    setClicou(true);

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

          <Text style={styles.title}>Criar conta</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>
          {clicou && erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

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
          </View>
          {clicou && erros.email && <Text style={styles.erro}>{erros.email}</Text>}

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
          </View>
          {clicou && erros.cpf && <Text style={styles.erro}>{erros.cpf}</Text>}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>
          <DicaCampo texto="Senha deve conter ao menos 4 caracteres, incluindo letra maiúscula, minúscula e número." />
          {clicou && erros.senha && <Text style={styles.erro}>{erros.senha}</Text>}

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
    backgroundColor: 'rgba(0,0,0,0.5)', // escurece para contraste
    justifyContent: 'center',
    padding: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
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
    color: 'white',
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
  dicaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },
  bolinha: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffffcc',
  },
  tooltip: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    maxWidth: '75%',
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
  },
  closeBtn: {
    marginLeft: 8,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },
});
