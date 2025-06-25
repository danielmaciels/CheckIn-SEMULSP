import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Alert,
  Modal, Platform, ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaCheckin({ usuario, checkIns, onCheckin, onDelete, onEdit, onLogout }) {
  // Estados principais do formulário
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(null);
  const [horario, setHorario] = useState(null);

  // Estados de erro
  const [errorLocal, setErrorLocal] = useState('');
  const [errorDescricao, setErrorDescricao] = useState('');
  const [errorData, setErrorData] = useState('');
  const [errorHorario, setErrorHorario] = useState('');

  const [isFormValid, setIsFormValid] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal de edição completo (data + horário)
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editHorario, setEditHorario] = useState(null);
  const [errorEditData, setErrorEditData] = useState('');
  const [errorEditHorario, setErrorEditHorario] = useState('');
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  // Estado do tooltip/dica
  const [mostrarDica, setMostrarDica] = useState(false);

  // NOVO estado para o modal de ajuda
  const [showHelp, setShowHelp] = useState(false);

  const MAX_VAGAS_POR_DIA = 10;

  // Verificar no AsyncStorage se já viu a dica
  useEffect(() => {
    const verificarTooltip = async () => {
      const visto = await AsyncStorage.getItem('@dica_checkin_vista');
      if (!visto) {
        setMostrarDica(true);
      }
    };
    verificarTooltip();
  }, []);

  const fecharDica = async () => {
    setMostrarDica(false);
    await AsyncStorage.setItem('@dica_checkin_vista', 'sim');
  };

  // Formatação para exibição
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

  // Verifica se há vagas disponíveis para a data e horário selecionados (ignora o check-in que está sendo editado)
  const verificarVagasPorHorario = (dataSelecionada, horarioSelecionado, idExcluir = null) => {
    if (!dataSelecionada || !horarioSelecionado) return false;

    const dataFormatada = formatDate(dataSelecionada);
    const horarioFormatado = formatTime(horarioSelecionado);

    const checkinsNoHorario = checkIns.filter(
      item => item.data === dataFormatada && item.horario === horarioFormatado
    );

    const countExcluindoAtual = idExcluir
      ? checkinsNoHorario.filter(item => item.id !== idExcluir).length
      : checkinsNoHorario.length;

    return countExcluindoAtual < MAX_VAGAS_POR_DIA;
  };

  // Validação para dia da semana (seg-sex)
  const isDiaUtil = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  // Handler para mudança da data no formulário principal
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      if (!isDiaUtil(selectedDate)) {
        setErrorData('Permitido apenas de segunda a sexta-feira');
        setData(null);
        setHorario(null);
        setErrorHorario('');
        return;
      }
      setErrorData('');
      setData(selectedDate);
      setHorario(null);
      setErrorHorario('');
    }
  };

  // Handler para mudança da data no modal de edição
  const onChangeEditDate = (event, selectedDate) => {
    setShowEditDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      if (!isDiaUtil(selectedDate)) {
        setErrorEditData('Permitido apenas de segunda a sexta-feira');
        setEditData(null);
        setErrorEditHorario('');
        return;
      }
      setErrorEditData('');
      setEditData(selectedDate);
      setErrorEditHorario('');
    }
  };

  // Validação do formulário principal
  useEffect(() => {
    setErrorLocal(!local.trim() ? 'O local é obrigatório' : '');
    setErrorDescricao(!descricao.trim() ? 'A descrição é obrigatória' : '');
    setErrorData(!data ? 'A data é obrigatória' : '');
    setErrorHorario(!horario ? 'O horário é obrigatório' : '');

    setIsFormValid(
      local.trim() &&
      descricao.trim() &&
      data !== null &&
      horario !== null &&
      !errorData &&
      !errorHorario
    );
  }, [local, descricao, data, horario, errorData, errorHorario]);

  // Limpar campos após envio
  const limparCampos = () => {
    setLocal('');
    setDescricao('');
    setData(null);
    setHorario(null);
    setErrorLocal('');
    setErrorDescricao('');
    setErrorData('');
    setErrorHorario('');
  };

  // Enviar check-in
  const handleSubmit = () => {
    if (!isFormValid) return;

    onCheckin(local.trim(), descricao.trim(), formatDate(data), formatTime(horario));
    limparCampos();
    Alert.alert('Sucesso', 'Check-in realizado com sucesso!');
  };

  // Confirmar exclusão
  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente deletar este check-in?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: () => onDelete(id) },
      ]
    );
  };

  // Abrir modal de edição com data e horário preenchidos
  const openEditModal = (item) => {
    setEditId(item.id);

    // Converter data do check-in para objeto Date
    const [day, month, year] = item.data.split('/');
    const dataCheckin = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Converter horário para objeto Date baseado na data
    const [hour, minute] = item.horario.split(':').map(Number);
    dataCheckin.setHours(hour, minute, 0, 0);

    setEditData(dataCheckin);
    setEditHorario(dataCheckin);
    setErrorEditData('');
    setErrorEditHorario('');
    setModalVisible(true);
  };

  // Salvar edição do modal (data + horário)
  const saveEdit = () => {
    if (!editData) {
      setErrorEditData('Selecione uma data');
      return;
    }
    if (!editHorario) {
      setErrorEditHorario('Selecione um horário');
      return;
    }

    if (!verificarVagasPorHorario(editData, editHorario, editId)) {
      setErrorEditHorario('Não há mais vagas neste horário');
      return;
    }

    onEdit(editId, formatDate(editData), formatTime(editHorario));
    setModalVisible(false);
    setEditId(null);
    setEditData(null);
    setEditHorario(null);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.ibb.co/gMj2NhCN/semulsp.png' }}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Cabeçalho com boas-vindas e botão de ajuda */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo(a), {usuario.nome}!</Text>
        <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.helpButton}>
          <MaterialIcons name="help-outline" size={28} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Modal de ajuda */}
      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.helpOverlay}>
          <View style={styles.helpBox}>
            <Text style={styles.helpTitle}>Como usar a tela de Check-in</Text>
            <Text style={styles.helpText}>
              Nesta tela você deve selecionar o local, a data (apenas dias úteis) e o horário para
              fazer o check-in. Cada horário aceita até 10 pessoas. Após preencher, toque em "Fazer Check-in".
            </Text>
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.helpCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tooltip / Dica */}
      {mostrarDica && (
        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color="#2563eb" style={{ marginRight: 6 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoText}>
              Selecione o local, data e horário para realizar o check-in. Apenas dias úteis e até 10 pessoas por horário são permitidos.
            </Text>
          </View>
          <TouchableOpacity onPress={fecharDica}>
            <MaterialIcons name="close" size={18} color="#1e3a8a" />
          </TouchableOpacity>
        </View>
      )}

      {/* Local */}
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
      </View>
      {!!errorLocal && <Text style={styles.errorText}>{errorLocal}</Text>}

      {/* Data */}
      <TouchableOpacity
        style={[styles.input, errorData && styles.inputError]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: data ? '#000' : '#888' }}>
          {data ? formatDate(data) : 'Escolha a data'}
        </Text>
      </TouchableOpacity>
      {!!errorData && <Text style={styles.errorText}>{errorData}</Text>}

      {showDatePicker && (
        <DateTimePicker
          value={data || new Date()}
          mode="date"
          display="calendar"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}

      {/* Horários */}
      <Text style={styles.label}>Escolha o horário:</Text>
      <View style={styles.timeButtons}>
        {['09:00', '15:00'].map((timeStr) => {
          const [hour, minute] = timeStr.split(':').map(Number);
          const selected = new Date();
          selected.setHours(hour, minute, 0, 0);
          const isSelected = horario && formatTime(horario) === timeStr;

          return (
            <TouchableOpacity
              key={timeStr}
              style={[styles.timeButton, isSelected && styles.selectedButton]}
              onPress={() => {
                if (!data) {
                  setErrorHorario('Escolha a data primeiro');
                  return;
                }

                if (!verificarVagasPorHorario(data, selected)) {
                  setErrorHorario('Não há mais vagas neste horário');
                  setHorario(null);
                } else {
                  setErrorHorario('');
                  setHorario(selected);
                }
              }}
            >
              <Text style={styles.locationText}>{timeStr}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!errorHorario && <Text style={styles.errorText}>{errorHorario}</Text>}

      {/* Botões */}
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

      {/* Lista de Check-ins */}
      <FlatList
        style={{ marginTop: 20 }}
        data={checkIns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.checkinItem}>
            <View>
              <Text>{item.local}</Text>
              <Text>{item.descricao}</Text>
              <Text>{item.data} - {item.horario}</Text>
            </View>
            <View style={styles.checkinButtons}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="#a00" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para editar data e horário */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Check-in</Text>

            <TouchableOpacity
              style={[styles.input, errorEditData && styles.inputError]}
              onPress={() => setShowEditDatePicker(true)}
            >
              <Text style={{ color: editData ? '#000' : '#888' }}>
                {editData ? formatDate(editData) : 'Escolha a data'}
              </Text>
            </TouchableOpacity>
            {!!errorEditData && <Text style={styles.errorText}>{errorEditData}</Text>}

            {showEditDatePicker && (
              <DateTimePicker
                value={editData || new Date()}
                mode="date"
                display="calendar"
                onChange={onChangeEditDate}
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Horário:</Text>
            <View style={styles.timeButtons}>
              {['09:00', '15:00'].map((timeStr) => {
                const [hour, minute] = timeStr.split(':').map(Number);
                const selected = new Date(editData || new Date());
                selected.setHours(hour, minute, 0, 0);
                const isSelected = editHorario && formatTime(editHorario) === timeStr;

                return (
                  <TouchableOpacity
                    key={timeStr}
                    style={[styles.timeButton, isSelected && styles.selectedButton]}
                    onPress={() => {
                      if (!editData) {
                        setErrorEditHorario('Escolha a data primeiro');
                        return;
                      }
                      if (!verificarVagasPorHorario(editData, selected, editId)) {
                        setErrorEditHorario('Não há mais vagas neste horário');
                        setEditHorario(null);
                      } else {
                        setErrorEditHorario('');
                        setEditHorario(selected);
                      }
                    }}
                  >
                    <Text style={styles.locationText}>{timeStr}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {!!errorEditHorario && <Text style={styles.errorText}>{errorEditHorario}</Text>}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.buttonSave} onPress={saveEdit}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpButton: {
    padding: 5,
  },
  helpOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#333',
  },
  helpCloseButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  helpCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  locationButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#1e40af',
  },
  locationText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  timeButtons: {
    flexDirection: 'row',
    marginTop: 6,
  },
  timeButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonCheckin: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#bbb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonLogout: {
    backgroundColor: '#a00',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  checkinItem: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkinButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  infoText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buttonSave: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonCancel: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 5,
    flex: 1,
  },
});
