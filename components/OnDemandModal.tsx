import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type OnDemandModalProps = {
  visible: boolean;
  onClose: () => void;
  onNotifyForSilence: () => void;
  onNotifyForVisitors: () => void;
  onCustomNotification: (message: string) => void;
  customMessage: string;
  onCustomMessageChange: (text: string) => void;
};

const OnDemandModal = ({
  visible,
  onClose,
  onNotifyForSilence,
  onNotifyForVisitors,
  onCustomNotification,
  customMessage,
  onCustomMessageChange,
}: OnDemandModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="#666" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.modalTitle}>SEND ON DEMAND NOTIFICATIONS</Text>

          {/* Buttons */}
          <TouchableOpacity style={styles.actionButton} onPress={onNotifyForSilence}>
            <Text style={styles.actionButtonText}>SEND TO NOTIFY FOR SILENCE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onNotifyForVisitors}>
            <Text style={styles.actionButtonText}>SEND TO NOTIFY FOR VISITING GUESTS</Text>
          </TouchableOpacity>

          {/* Text Input for Custom Notification */}
          <TextInput
            style={styles.input}
            placeholder="Type your custom message here..."
            value={customMessage}
            onChangeText={onCustomMessageChange}
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onCustomNotification(customMessage)}
          >
            <Text style={styles.actionButtonText}>CUSTOM A NOTIFICATION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OnDemandModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    // You can add a custom shadow for iOS/Android:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#d3d3d3', // Adjust to desired color
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
  },
  actionButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
});
