import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'react-native';


export default function TelaLogin({ onLogin, irParaCadastro }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://scontent.fpll2-1.fna.fbcdn.net/v/t39.30808-6/473423894_1000803965435293_1977731774725976703_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeE0ytsZ3iJrlyebrABL0hEt8VkBG7KEJbLxWQEbsoQlstAnmPu_NneB8rQAOhQruUiZ1baPxpk3X2VDa0Xca3Lw&_nc_ohc=ZBYjJFxYfUAQ7kNvwFPyvDn&_nc_oc=AdlDkhL3Uv5pwoYIlcZut9zh3yoDHC-YRLvjka18FWvFu55FodLwsSvoJyPZxwqEGDY&_nc_zt=23&_nc_ht=scontent.fpll2-1.fna&_nc_gid=KnT-tlHxE4nCGkjCuFNAAA&oh=00_AfKSTxH0OGVssCNz5fl79niChmJXixxpuaGDoT1gizgABg&oe=6835C4B0' }}
        style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 30 }}
        
      />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Acesse sua conta para realizar o check-in</Text>

      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        maxLength={14}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => onLogin(cpf, senha)}>
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
    backgroundColor: '#ff6900',
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
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
  Image: {
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
  }
});


