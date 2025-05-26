import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function TelaCheckin({ usuario, checkIns, onCheckin, onLogout }) {
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errorLocal, setErrorLocal] = useState('');
  const [errorDescricao, setErrorDescricao] = useState('');
  const [errorData, setErrorData] = useState('');
  const [errorHorario, setErrorHorario] = useState('');

  const [isFormValid, setIsFormValid] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    setErrorLocal(!local.trim() ? 'O local é obrigatório' : '');
    setErrorDescricao(!descricao.trim() ? 'A descrição é obrigatória' : '');
    setErrorData(!data ? 'A data é obrigatória' : '');
    setErrorHorario(!horario ? 'O horário é obrigatório' : '');

    setIsFormValid(
      local.trim() &&
      descricao.trim() &&
      data !== null &&
      horario !== null
    );
  }, [local, descricao, data, horario]);

  const limparCampos = () => {
    setLocal('');
    setDescricao('');
    setData(null);
    setHorario(null);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    onCheckin(local.trim(), descricao.trim(), formatDate(data), formatTime(horario));
    limparCampos();
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setData(selectedDate);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setHorario(selectedTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo(a), {usuario.nome}!</Text>

      <Text style={styles.label}>Escolha o local:</Text>
      <View style={styles.locationButtons}>
        <TouchableOpacity
          style={[styles.locationButton, local === 'Compensa-AM' && styles.selectedButton]}
          onPress={() => {
            setLocal('Compensa-AM');
            setDescricao('Visita nas exposições');
          }}
        >
          <MaterialIcons name="location-on" size={24} color="#fff" />
          <Text style={styles.locationText}>Compensa-AM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.locationButton, local === 'Alvorada-AM' && styles.selectedButton]}
          onPress={() => {
            setLocal('Alvorada-AM');
            setDescricao('Visita nas exposições');
          }}
        >
          <MaterialIcons name="location-on" size={24} color="#fff" />
          <Text style={styles.locationText}>Alvorada-AM</Text>
        </TouchableOpacity>
      </View>
      {!!errorLocal && <Text style={styles.errorText}>{errorLocal}</Text>}

      <TouchableOpacity
        style={[styles.input, errorData ? styles.inputError : null, styles.datePickerButton]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: data ? '#000' : '#888' }}>
          {data ? formatDate(data) : 'Escolha a data'}
        </Text>
      </TouchableOpacity>
      {!!errorData && <Text style={styles.errorText}>{errorData}</Text>}

      <TouchableOpacity
        style={[styles.input, errorHorario ? styles.inputError : null, styles.datePickerButton]}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={{ color: horario ? '#000' : '#888' }}>
          {horario ? formatTime(horario) : 'Escolha o horário'}
        </Text>
      </TouchableOpacity>
      {!!errorHorario && <Text style={styles.errorText}>{errorHorario}</Text>}

      {showDatePicker && (
        <DateTimePicker
          value={data || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={horario || new Date()}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <TouchableOpacity
        style={[styles.buttonCheckin, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Fazer Check-in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLogout} onPress={onLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>

      <Text style={styles.titleCheckins}>Check-ins realizados:</Text>

      <FlatList
        data={checkIns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.checkinItem}>
            <Text style={styles.checkinText}>
              {item.data} às {item.horario} - {item.local}
            </Text>
            <Text style={styles.checkinDesc}>{item.descricao}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>
            Nenhum check-in feito ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6900',
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  locationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#f97316',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#fb923c',
  },
  locationText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 10,
    marginLeft: 5,
  },
  datePickerButton: {
    justifyContent: 'center',
  },
  buttonCheckin: {
    backgroundColor: '#00d084',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#82d9b7',
  },
  buttonLogout: {
    backgroundColor: '#9b51e0',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  titleCheckins: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 10,
  },
  checkinItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  checkinText: {
    fontWeight: '600',
  },
  checkinDesc: {
    fontSize: 14,
    color: '#555',
  },
});
