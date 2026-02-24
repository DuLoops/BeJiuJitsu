import ThemedButton from '@/src/components/ui/atoms/ThemedButton';
import ThemedText from '@/src/components/ui/atoms/ThemedText';
import ThemedCard from '@/src/components/ui/atoms/ThemedCard';
import ConfirmAlert from '@/src/components/ui/molecules/Alert';
import AutocompleteDropdownWithFilter, { AutocompleteWithFilterItem, CategoryTagItem } from '@/src/components/ui/molecules/AutocompleteDropdownWithFilter';
import DropdownPicker from '@/src/components/ui/molecules/DropdownPicker';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/stores/authStore';
import { Database, Tables } from '@/src/supabase/types';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { addUserSkillWithNotesAndVideos, fetchAllSkills, fetchUserSkillNotes, fetchUserSkills, fetchUserSkillVideos, replaceUserSkillNotesAndVideos } from '../services/skillService';

interface SkillFormModalProps {
  visible: boolean;
  onClose: () => void;
  source: 'TRAINING' | 'COMPETITION' | 'POST';
  trainingActivityId?: string;
  matchId?: string;
  postId?: string;
}

const SkillFormModal: React.FC<SkillFormModalProps> = ({ visible, onClose, source, trainingActivityId, matchId, postId }) => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const backgroundColor = useThemeColor({}, 'background');

  // Categories now come from enum, not table
  const categoryEnumValues: Database['public']['Enums']['Category'][] = useMemo(
    () => ['Submission', 'Takedown', 'Pass', 'Control', 'Escape', 'Guard', 'Sweep', 'System'],
    []
  );

  const { data: allSkills = [], isLoading: loadingSkills } = useQuery({
    queryKey: ['allSkills', userId],
    queryFn: () => fetchAllSkills(userId),
    enabled: !!userId,
  });

  const { data: myUserSkills = [] } = useQuery({
    queryKey: ['userSkills', userId],
    queryFn: () => fetchUserSkills(userId as string),
    enabled: !!userId,
  });

  const categoryOptions = useMemo(() => categoryEnumValues.map((c) => ({ label: c, value: c })), [categoryEnumValues]);
  const categoryChips: CategoryTagItem[] = useMemo(() => categoryEnumValues.map((c) => ({ id: c, name: c })), [categoryEnumValues]);
  const mySkillIdSet = useMemo(() => new Set((myUserSkills as Tables<'user_skills'>[]).map((us) => us.skill_id)), [myUserSkills]);
  const skillIdToUserSkillId = useMemo(() => {
    const map = new Map<string, string>();
    (myUserSkills as Tables<'user_skills'>[]).forEach((us) => map.set(us.skill_id, us.id));
    return map;
  }, [myUserSkills]);
  const skillItems: AutocompleteWithFilterItem[] = useMemo(
    () =>
      (allSkills as Tables<'skills'>[]).map((s) => ({
        id: s.id,
        title: s.name,
        categoryId: s.category as string,
        categoryName: s.category as string,
        isMine: mySkillIdSet.has(s.id),
      })),
    [allSkills, mySkillIdSet]
  );

  const [skillName, setSkillName] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<AutocompleteWithFilterItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<Database['public']['Enums']['Category'] | null>(null);
  const [notes, setNotes] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingNoteIndex, setPendingNoteIndex] = useState<number | null>(null);
  const [loadingUserSkillData, setLoadingUserSkillData] = useState(false);
  const [savedSkillInfo, setSavedSkillInfo] = useState<{ name: string; category: string; isNew: boolean } | null>(null);
  const [loadedNotesData, setLoadedNotesData] = useState<Tables<'user_skill_notes'>[]>([]);
  const [loadedVideosData, setLoadedVideosData] = useState<Tables<'user_skill_videos'>[]>([]);

  useEffect(() => {
    if (selectedSkill?.categoryId) {
      setSelectedCategoryId(selectedSkill.categoryId as Database['public']['Enums']['Category']);
    }
  }, [selectedSkill]);

  useEffect(() => {
    if (!visible) {
      // reset
      setSkillName('');
      setSelectedSkill(null);
      setSelectedCategoryId(null);
      setNotes(['']);
      setVideos([]);
      setSavedSkillInfo(null);
    } else {
      // ensure at least one note when opening
      setNotes((prev) => (prev.length === 0 ? [''] : prev));
    }
  }, [visible]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not logged in');
      if (!skillName.trim()) throw new Error('Please enter a skill name');
      const categoryToUse = (selectedCategoryId || (selectedSkill?.categoryId as Database['public']['Enums']['Category'] | undefined)) || null;
      if (!categoryToUse) throw new Error('Please select a category');

      // If the selected skill is already in user's list, replace notes/videos instead of re-inserting
      const existingUserSkillId = selectedSkill ? skillIdToUserSkillId.get(selectedSkill.id) : undefined;
      if (existingUserSkillId) {
        await replaceUserSkillNotesAndVideos({
          userSkillId: existingUserSkillId,
          notes,
          videoUrls: videos,
          source,
          trainingActivityId,
          matchId,
          postId,
        });
        return { id: existingUserSkillId } as Tables<'user_skills'>;
      }

      return addUserSkillWithNotesAndVideos({
        userId,
        skillName: skillName.trim(),
        category: categoryToUse,
        source,
        trainingActivityId,
        matchId,
        postId,
        notes,
        videoUrls: videos,
      });
    },
    onSuccess: (result) => {
      const categoryToUse = (selectedCategoryId || (selectedSkill?.categoryId as Database['public']['Enums']['Category'] | undefined)) || 'Unknown';
      const existingUserSkillId = selectedSkill ? skillIdToUserSkillId.get(selectedSkill.id) : undefined;
      const isNew = !existingUserSkillId;

      setSavedSkillInfo({
        name: skillName.trim(),
        category: categoryToUse as string,
        isNew,
      });

      queryClient.invalidateQueries({ queryKey: ['userSkillsWithDetails', userId] });
      queryClient.invalidateQueries({ queryKey: ['userSkills', userId] });

      // Don't close immediately - show success state
    },
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed to add skill'),
  });

  const addNote = () => setNotes((prev) => [...prev, '']);
  const updateNote = (idx: number, text: string) => setNotes((prev) => prev.map((n, i) => (i === idx ? text : n)));
  const performRemoveNote = (idx: number) => {
    setNotes((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length === 0 ? [''] : next;
    });
  };
  const requestRemoveNote = (idx: number) => {
    const hasContent = (notes[idx] || '').trim().length > 0;
    if (hasContent) {
      setPendingNoteIndex(idx);
      setConfirmVisible(true);
    } else {
      performRemoveNote(idx);
    }
  };

  const addVideo = () => setVideos((prev) => [...prev, '']);
  const updateVideo = (idx: number, url: string) => setVideos((prev) => prev.map((v, i) => (i === idx ? url : v)));
  const removeVideo = (idx: number) => setVideos((prev) => prev.filter((_, i) => i !== idx));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <ConfirmAlert
        visible={confirmVisible}
        title="Delete note?"
        message="This note has content. Do you really want to delete it?"
        actions={[
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => { if (pendingNoteIndex !== null) { performRemoveNote(pendingNoteIndex); } } },
        ]}
        onDismiss={() => { setConfirmVisible(false); setPendingNoteIndex(null); }}
      />
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.centered} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <ThemedCard style={[styles.card, { backgroundColor }]}>
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.title}>{savedSkillInfo ? 'Success!' : 'Skill'}</ThemedText>

              {savedSkillInfo && (
                <View style={styles.successCard}>
                  <View style={styles.successHeader}>
                    <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                    <ThemedText style={styles.successTitle}>
                      {savedSkillInfo.isNew ? 'Skill Created!' : 'Skill Updated!'}
                    </ThemedText>
                  </View>
                  <View style={styles.successDetails}>
                    <View style={styles.successRow}>
                      <ThemedText style={styles.successLabel}>Name:</ThemedText>
                      <ThemedText style={styles.successValue}>{savedSkillInfo.name}</ThemedText>
                    </View>
                    <View style={styles.successRow}>
                      <ThemedText style={styles.successLabel}>Category:</ThemedText>
                      <ThemedText style={styles.successValue}>{savedSkillInfo.category}</ThemedText>
                    </View>
                    <View style={styles.successRow}>
                      <ThemedText style={styles.successLabel}>Notes:</ThemedText>
                      <ThemedText style={styles.successValue}>{notes.filter(n => n.trim()).length}</ThemedText>
                    </View>
                    <View style={styles.successRow}>
                      <ThemedText style={styles.successLabel}>Videos:</ThemedText>
                      <ThemedText style={styles.successValue}>{videos.filter(v => v.trim()).length}</ThemedText>
                    </View>
                  </View>
                  <ThemedButton
                    title="Done"
                    onPress={onClose}
                    style={styles.doneButton}
                  />
                </View>
              )}

              {!savedSkillInfo && (
                <>
                  <AutocompleteDropdownWithFilter
                    data={skillItems}
                    categories={categoryChips}
                    value={skillName}
                    onChangeText={(t) => { setSkillName(t); setSelectedSkill(null); }}
                    onSelectItem={(item) => {
                      setSelectedSkill(item);
                      setSkillName(item?.title || '');
                      // If item is one of user's skills, load existing notes/videos
                      if (item && mySkillIdSet.has(item.id)) {
                        const userSkillId = skillIdToUserSkillId.get(item.id);
                        if (userSkillId) {
                          setLoadingUserSkillData(true);
                          Promise.all([
                            fetchUserSkillNotes(userSkillId),
                            fetchUserSkillVideos(userSkillId),
                          ])
                            .then(([existingNotes, existingVideos]) => {
                              const sortedNotes = existingNotes.sort((a, b) => (a.note_order || 0) - (b.note_order || 0));
                              const sortedVideos = existingVideos.sort((a, b) => (a.video_order || 0) - (b.video_order || 0));
                              setLoadedNotesData(sortedNotes);
                              setLoadedVideosData(sortedVideos);
                              setNotes(sortedNotes.length > 0 ? sortedNotes.map(n => n.note) : ['']);
                              setVideos(sortedVideos.length > 0 ? sortedVideos.map(v => v.video_url) : []);
                            })
                            .catch(() => {
                              setNotes(['']);
                              setVideos([]);
                            })
                            .finally(() => setLoadingUserSkillData(false));
                        }
                      } else {
                        setNotes((prev) => prev.length ? prev : ['']);
                        setVideos([]);
                      }
                    }}
                    placeholder="Search skills or type to add new"
                    showCategoryChips={true}
                    showMineChip={true}
                  />

                  {loadingUserSkillData && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" />
                      <ThemedText style={styles.loadingText}>Loading skill data...</ThemedText>
                    </View>
                  )}

                  {selectedSkill && mySkillIdSet.has(selectedSkill.id) && !loadingUserSkillData && (
                    <View style={styles.infoContainer}>
                      <Ionicons name="information-circle" size={16} color="#007AFF" />
                      <ThemedText style={styles.infoText}>
                        Loaded {notes.filter(n => n.trim()).length} note(s) and {videos.filter(v => v.trim()).length} video(s) from your saved skill
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.spacer} />
                  <ThemedText style={styles.label}>Category</ThemedText>
                  <DropdownPicker
                    options={categoryOptions}
                    selectedValue={(selectedCategoryId as string) || ''}
                    onValueChange={(v) => setSelectedCategoryId(v as Database['public']['Enums']['Category'])}
                    placeholder="Select category"
                  />

                  <View style={styles.section}>
                    <ThemedText style={styles.label}>Notes</ThemedText>
                    {notes.map((n, idx) => {
                      const noteData = loadedNotesData[idx];
                      const lastEdited = noteData?.updated_at || noteData?.created_at;
                      return (
                        <View key={`note_${idx}`} style={styles.noteContainer}>
                          {lastEdited && (
                            <ThemedText style={styles.timestampText}>
                              Last edited: {formatDate(lastEdited)}
                            </ThemedText>
                          )}
                          <TextInput
                            style={styles.textArea}
                            value={n}
                            onChangeText={(t) => updateNote(idx, t)}
                            placeholder={`Note ${idx + 1}`}
                            multiline
                          />
                          <TouchableWithoutFeedback onPress={() => requestRemoveNote(idx)}>
                            <View style={styles.noteTrashIcon}>
                              <Ionicons name="trash" size={18} color="#dc3545" />
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}
                    <ThemedButton title="Add Note" onPress={addNote} />
                  </View>

                  <View style={styles.section}>
                    <ThemedText style={styles.label}>Videos</ThemedText>
                    {videos.map((v, idx) => {
                      const videoData = loadedVideosData[idx];
                      const lastEdited = videoData?.updated_at || videoData?.created_at;
                      return (
                        <View key={`vid_${idx}`}>
                          {lastEdited && (
                            <ThemedText style={styles.timestampText}>
                              Last edited: {formatDate(lastEdited)}
                            </ThemedText>
                          )}
                          <View style={styles.row}>
                            <TextInput
                              style={styles.textInput}
                              value={v}
                              onChangeText={(t) => updateVideo(idx, t)}
                              placeholder="Video URL"
                              autoCapitalize="none"
                            />
                            <ThemedButton title="Remove" onPress={() => removeVideo(idx)} style={styles.removeBtn} />
                          </View>
                        </View>
                      );
                    })}
                    <ThemedButton title="Add Video" onPress={addVideo} />
                  </View>

                </>
              )}
            </ScrollView>
            {!savedSkillInfo && (
              <View style={styles.actions}>
                <ThemedButton title="Cancel" variant="secondary" onPress={onClose} />
                <ThemedButton title="Save" onPress={() => mutation.mutate()} disabled={mutation.isPending || loadingSkills} />
              </View>
            )}
          </ThemedCard>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    height: '80%',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  spacer: { height: 12 },
  section: { marginTop: 16, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteContainer: { position: 'relative' },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteTrashIcon: { position: 'absolute', right: 8, bottom: 8 },
  removeBtn: { minWidth: 90 },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 12 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  loadingText: { fontSize: 14, color: '#666' },
  infoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#E3F2FD', borderRadius: 8, marginTop: 8 },
  infoText: { fontSize: 13, color: '#1976D2', flex: 1 },
  successCard: { backgroundColor: '#F1F8F4', borderRadius: 12, padding: 20, marginBottom: 16 },
  successHeader: { alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: '600', color: '#4CAF50', marginTop: 8 },
  successDetails: { gap: 12, marginBottom: 20 },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  successLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  successValue: { fontSize: 14, color: '#333', fontWeight: '600' },
  doneButton: { marginTop: 8 },
  timestampText: { fontSize: 11, color: '#888', marginBottom: 4, fontStyle: 'italic' },
});

export default SkillFormModal;



