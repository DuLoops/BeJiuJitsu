import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';
import { TextInput } from 'react-native';

interface ResultFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (result: { outcome: string; rank: number | null; notes: string | null }) => void;
    initialResult?: { outcome: string; rank: number | null; notes: string | null };
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

    useEffect(() => {
        if (visible) {
            setOutcome(initialResult?.outcome || 'Gold');
            setRank(initialResult?.rank?.toString() || '');
            setNotes(initialResult?.notes || '');
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

    const outcomeOptions = [
        { label: 'Gold', value: 'Gold' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Bronze', value: 'Bronze' },
        { label: 'Participant', value: 'Participant' },
        { label: 'Other', value: 'Other' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <ThemedCard style={styles.modalOverlay}>
                <ThemedCard style={[styles.modalContent, { backgroundColor }]}>
                    <ThemedCard style={styles.header}>
                        <ThemedText type="subtitle">Result for {divisionName}</ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </ThemedCard>

                    <ThemedCard style={styles.formGroup}>
                        <ThemedText style={styles.label}>Outcome</ThemedText>
                        <DropdownPicker
                            options={outcomeOptions}
                            selectedValue={outcome}
                            onValueChange={(val) => setOutcome(val as string)}
                            placeholder="Select outcome"
                        />
                    </ThemedCard>

                    <ThemedCard style={styles.formGroup}>
                        <ThemedText style={styles.label}>Rank (Optional)</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={rank}
                            onChangeText={setRank}
                            placeholder="e.g. 1, 2, 3"
                            keyboardType="numeric"
                        />
                    </ThemedCard>

                    <ThemedCard style={styles.formGroup}>
                        <ThemedText style={styles.label}>Notes (Optional)</ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add notes..."
                            multiline
                        />
                    </ThemedCard>

                    <ThemedButton title="Save Result" onPress={handleSave} variant="primary" />
                </ThemedCard>
            </ThemedCard>
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
});

export default ResultFormModal;
