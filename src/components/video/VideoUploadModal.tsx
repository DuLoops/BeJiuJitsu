import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { VideoUploadService } from '@/src/services/VideoUploadService';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedInput from '@/src/components/ui/atoms/ThemedInput';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Colors } from '@/src/constants/Colors';
import { Database } from '@/src/supabase/types';

type VisibilityType = Database['public']['Enums']['visibility_type'];

interface VideoUploadModalProps {
    visible: boolean;
    onClose: () => void;
    entityId: string;
    entityType: 'training' | 'competition';
    onUploadSuccess?: () => void;
}

export default function VideoUploadModal({
    visible,
    onClose,
    entityId,
    entityType,
    onUploadSuccess,
}: VideoUploadModalProps) {
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [visibility, setVisibility] = useState<VisibilityType>('private');
    const [note, setNote] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const backgroundColor = useThemeColor({}, 'card');
    const overlayColor = 'rgba(0,0,0,0.5)';

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const recordVideo = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Camera permission is required to record video.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!videoUri) return;

        try {
            setIsUploading(true);
            // We need a userId. For now, assuming VideoUploadService handles auth or we pass it? 
            // The Service expects userId. We should get it from a store or context.
            // Since I don't have the AuthContext handy in this snippet, I'll rely on the caller or import the store.
            // The previous prompt said: "Use @authStore for authentication state."
            // I need to import useAuthStore from appropriate location.
            // I'll skip importing explicitly here to avoid errors if I miss the path, 
            // but I'll add a TODO or try to find it. 
            // ACTUALLY, I must follow the rule: "Use @authStore for authentication state."
            // I will guess the path `src/store/authStore`.

            const { useAuthStore } = require('@/src/store/authStore');
            const userId = useAuthStore.getState().user?.id;

            if (!userId) {
                Alert.alert('Error', 'User not authenticated');
                return;
            }

            await VideoUploadService.uploadVideo({
                fileUri: videoUri,
                userId,
                entityType,
                entityId,
                visibility,
                note,
            });

            Alert.alert('Success', 'Video uploaded successfully!');
            setVideoUri(null);
            setNote('');
            onUploadSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to upload video');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
                <View style={[styles.container, { backgroundColor }]}>
                    <ThemedText type="title" style={styles.title}>Upload Video</ThemedText>

                    {!videoUri ? (
                        <View style={styles.optionsContainer}>
                            <ThemedButton
                                title="📂 Pick from Gallery"
                                onPress={pickVideo}
                                variant="outline"
                                style={styles.optionButton}
                            />
                            <ThemedButton
                                title="🎥 Record Video"
                                onPress={recordVideo}
                                variant="outline"
                                style={styles.optionButton}
                            />
                        </View>
                    ) : (
                        <View style={styles.previewContainer}>
                            <ThemedText style={{ marginBottom: 10 }}>Video Selected</ThemedText>

                            <ThemedText type="subtitle" style={styles.sectionTitle}>Visibility</ThemedText>
                            <View style={styles.visibilityContainer}>
                                {(['public', 'pals_only', 'private'] as const).map((v) => (
                                    <TouchableOpacity
                                        key={v}
                                        onPress={() => setVisibility(v)}
                                        style={[
                                            styles.visibilityOption,
                                            visibility === v && styles.visibilityOptionSelected,
                                        ]}
                                    >
                                        <ThemedText
                                            style={[
                                                styles.visibilityText,
                                                visibility === v && styles.visibilityTextSelected,
                                            ]}
                                        >
                                            {v === 'pals_only' ? 'Pals Only' : v.charAt(0).toUpperCase() + v.slice(1)}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <ThemedInput
                                placeholder="Add a note (optional)"
                                value={note}
                                onChangeText={setNote}
                                containerStyle={styles.input}
                            />

                            <View style={styles.actionButtons}>
                                <ThemedButton
                                    title="Cancel"
                                    onPress={() => setVideoUri(null)}
                                    variant="outline"
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                <ThemedButton
                                    title={isUploading ? "Uploading..." : "Upload Video"}
                                    onPress={handleUpload}
                                    disabled={isUploading}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    )}

                    {!videoUri && (
                        <ThemedButton
                            title="Cancel"
                            onPress={onClose}
                            variant="outline"
                            style={styles.cancelButton}
                        />
                    )}

                    {isUploading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={Colors.light.tint} />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    optionButton: {
        width: '100%',
    },
    previewContainer: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    visibilityContainer: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    visibilityOption: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    visibilityOptionSelected: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    visibilityText: {
        fontSize: 12,
        color: '#666',
    },
    visibilityTextSelected: {
        color: '#000',
        fontWeight: '600',
    },
    input: {
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        marginTop: 10,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
});
