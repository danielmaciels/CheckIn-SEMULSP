import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';

registerLocale('pt-BR', ptBR);

export default function TelaCheckin({ usuario, checkIns, onCheckin }) {
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date());
  const [horario, setHorario] = useState('09:00');

  // Opções de horário das 9h às 15h, de hora em hora
  const horariosDisponiveis = [
    '09:00', '15:00',
  ];

  // Opções locais exemplo
  const locaisDisponiveis = [
    'SEMULSP - Compensa'
  ];

  // Função para desabilitar sábados e domingos no calendário
  const isWeekday = date => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {usuario?.nome} 👋</Text>
      <Text style={styles.subtitle}>Realize seu check-in abaixo</Text>

      <Text style={styles.label}>Local</Text>
      <select
        style={styles.select}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      >
        <option value="">Selecione um local</option>
        {locaisDisponiveis.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <Text style={styles.label}>Descrição</Text>
      <select
        style={styles.select}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      >
        <option value="">Selecione uma descrição</option>
        <option value="Visita educativa">Visita educativa</option>
      </select>

      <Text style={styles.label}>Data (Segunda a Sexta)</Text>
      <DatePicker
        locale="pt-BR"
        selected={data}
        onChange={(date) => setData(date)}
        filterDate={isWeekday}
        dateFormat="dd/MM/yyyy"
        className="react-datepicker"
      />

      <Text style={styles.label}>Horário</Text>
      <select
        style={styles.select}
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
      >
        {horariosDisponiveis.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!local || !descricao || !data || !horario) {
            alert('Preencha todos os campos do check-in.');
            return;
          }

          onCheckin(local, descricao, data.toLocaleString(), horario);
          setLocal('');
          setDescricao('');
          setData(new Date());
          setHorario('09:00');
        }}
      >
        <Text style={styles.buttonText}>Fazer Check-in</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Meus check-ins</Text>

      <FlatList
        data={checkIns.filter(c => c.usuario === usuario?.nome)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 {item.local}</Text>
            <Text style={styles.cardText}>📝 {item.descricao}</Text>
            <Text style={styles.cardText}>📅 {item.data}</Text>
            <Text style={styles.cardText}>⏰ {item.horario}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum check-in ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  select: {
    height: 50,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  button: {
    backgroundColor: '#00d084',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
    color: '#444',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});
