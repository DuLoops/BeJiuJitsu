import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

interface ResultFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (result: { outcome: string; rank: number | null; notes: string | null }) => void;
    initialResult?: { outcome: string; rank: number | null; notes: string | null; divisionTempId?: string };
    divisionName: string;
}

const ResultFormModal: React.FC<ResultFormModalProps> = ({
    visible,
    onClose,
    onSave,
    initialResult,
    divisionName,
}) => {
    const backgroundColor = useThemeColor({}, 'background');
    const [outcome, setOutcome] = useState(initialResult?.outcome || 'Gold');
    const [rank, setRank] = useState<string>(initialResult?.rank?.toString() || '');
    const [notes, setNotes] = useState(initialResult?.notes || '');

    const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(initialResult?.divisionTempId || null);

    useEffect(() => {
        if (visible) {
            setOutcome(initialResult?.outcome || 'Gold');
            setRank(initialResult?.rank?.toString() || '1');
            setNotes(initialResult?.notes || '');
            // For now, if editing, we stick to that division. If adding new, we might allow selection if implemented. 
            // But the current parent passes specific divisionName. 
            // The user request says "I should be able to add result without adding division". 
            // This implies the modal might need to allow picking a division or 'None'.
        }
    }, [visible, initialResult]);

    const handleSave = () => {
        onSave({
            outcome,
            rank: rank ? parseInt(rank) : null,
            notes: notes || null,
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <ThemedCard variant="plain" style={[styles.modalContent, { backgroundColor: '#fff' }]}>
                    {/* User requested white background explicitly */}
                    <View style={styles.header}>
                        <ThemedText type="subtitle">Result</ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ThemedText style={{ marginBottom: 10 }}>{divisionName || "Overall Result"}</ThemedText>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Rank</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={rank}
                                onValueChange={(itemValue) => {
                                    setRank(itemValue);
                                    const rankNum = parseInt(itemValue);
                                    if (rankNum === 1) setOutcome('Gold');
                                    else if (rankNum === 2) setOutcome('Silver');
                                    else if (rankNum === 3) setOutcome('Bronze');
                                    else setOutcome('Participant');
                                }}
                                style={{ height: 150 }}
                            >
                                {Array.from({ length: 10 }, (_, i) => (
                                    <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Outcome</ThemedText>
                        <ThemedText style={[styles.outcomeDisplay, { color: outcome === 'Gold' ? '#FFD700' : outcome === 'Silver' ? '#C0C0C0' : outcome === 'Bronze' ? '#CD7F32' : '#666' }]}>
                            {outcome}
                        </ThemedText>
                    </View>

                    <View style={styles.formGroup}>
                        <ThemedText style={styles.label}>Notes (Optional)</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add notes..."
                            multiline
                        />
                    </View>

                    <ThemedButton title="Save Result" onPress={handleSave} variant="primary" />
                </ThemedCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    outcomeDisplay: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    pickerContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default ResultFormModal;
