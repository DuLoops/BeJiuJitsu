import { SkillType } from '@/src/constants/Skills'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from 'react-native'

// Define the async function to fetch skills from Supabase
// This is a placeholder. You'll need to adjust it based on your actual Supabase table structure.
// async function fetchSkills(): Promise<SkillType[]> {
//   const { data, error } = await supabase
//     .from('skills') // Assuming your table is named 'skills'
//     .select('*'); // Adjust columns as needed
//
//   if (error) {
//     throw new Error(error.message);
//   }
//   return data as SkillType[]; // Cast to SkillType[] or your specific type
// }

// Placeholder for fetching skills - replace with actual Supabase call later
async function fetchSkillsPlaceholder(): Promise<SkillType[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'skill-1', title: 'Example Skill 1', category: { id: 'cat-1', name: 'Example Category' } },
        { id: 'skill-2', title: 'Example Skill 2', category: { id: 'cat-2', name: 'Another Category' } },
      ]);
    }, 1000);
  });
}

const IndexPage = () => {
  // Use the useQuery hook
  const { data: skills, isLoading, error, isError } = useQuery<SkillType[], Error>({
    queryKey: ['skills'], // Unique key for this query
    queryFn: fetchSkillsPlaceholder, // Using placeholder
  })

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading skills...</Text>
      </SafeAreaView>
    )
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error fetching skills: {error?.message}</Text>
      </SafeAreaView>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Available Skills</Text>
        {skills && skills.length > 0 ? (
          <FlatList
            data={skills}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text style={{ fontSize: 16 }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>Category: {item.category.name}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No skills found.</Text>
        )}
      </View>
      <Link href="/create-profile">Create Profile</Link>
    </SafeAreaView>
  )
}

export default IndexPage